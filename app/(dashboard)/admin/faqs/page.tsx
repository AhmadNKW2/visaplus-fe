/**
 * Admin FAQs Page
 * Manage FAQ items with add, edit, delete, and drag-to-reorder functionality
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  Save,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ArrowUp,
} from "lucide-react";
import { Button } from "../../../src/components/ui/button";
import { Input } from "../../../src/components/ui/input";
import { RichTextEditor } from "../../../src/components/ui/rich-text-editor";
import { useFaqs, useUpdateFaqs } from "../../../src/services/faqs/hooks/use-faqs";
import { FaqItem } from "../../../src/services/faqs/types/faq.types";

// We store items with a local id for drag-and-drop key tracking
type FaqItemWithId = FaqItem & { _id: string };

function generateId() {
  return Math.random().toString(36).slice(2);
}

/** Strip HTML tags and return trimmed plain text */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/** Error key format: `${_id}_${fieldName}` */
function errKey(id: string, field: keyof FaqItem): string {
  return `${id}_${field}`;
}

const REQUIRED_MSG = "This field is required";

/** Validate a single FAQ item. Returns a map of error keys → message. */
function validateItem(item: FaqItemWithId): Record<string, string> {
  const errs: Record<string, string> = {};
  const fields: (keyof FaqItem)[] = ["questionEn", "questionAr", "answerEn", "answerAr"];
  for (const field of fields) {
    const raw = item[field] ?? "";
    const empty = field.startsWith("answer") ? stripHtml(raw) === "" : raw.trim() === "";
    if (empty) errs[errKey(item._id, field)] = REQUIRED_MSG;
  }
  return errs;
}

/** Scroll the main overflow container to the element that matches the first error key */
function scrollToFirstError(errs: Record<string, string>) {
  const firstKey = Object.keys(errs)[0];
  if (!firstKey) return;
  const id = firstKey.split("_")[0]; // _id is base-36 alphanumeric — no underscores
  setTimeout(() => {
    const card = document.getElementById(`faq-card-${id}`);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 50);
}

// Sortable FAQ card component
function SortableFaqCard({
  item,
  index,
  errors,
  onUpdate,
  onDelete,
}: {
  item: FaqItemWithId;
  index: number;
  errors: Record<string, string>;
  onUpdate: (id: string, field: keyof FaqItem, value: string) => void;
  onDelete: (id: string) => void;
}) {
  const hasErrors = Object.keys(errors).some((k) => k.startsWith(item._id));

  // Auto-expand if there are validation errors for this card
  const [expanded, setExpanded] = useState(true);
  useEffect(() => {
    if (hasErrors) setExpanded(true);
  }, [hasErrors]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      id={`faq-card-${item._id}`}
      ref={setNodeRef}
      style={style}
      className={`bg-secondary rounded-rounded1 border-2 overflow-hidden transition-shadow ${
        isDragging ? "shadow-xl border-fourth/50" : "border-primary hover:shadow-md"
      }`}
    >
      {/* Card Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-primary/60 border-b-2 border-primary">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-fourth/30 hover:text-fourth cursor-grab active:cursor-grabbing transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* FAQ Number */}
        <span className="w-7 h-7 rounded-full bg-fourth/10 text-fourth text-sm font-semibold flex items-center justify-center shrink-0">
          {index + 1}
        </span>

        {/* Preview */}
        <p className="flex-1 text-sm font-medium text-third truncate">
          {item.questionEn || <span className="text-fourth/40 italic">New FAQ</span>}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 rounded-rounded1 text-fourth/40 hover:text-fourth hover:bg-fourth/10 transition-colors"
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="p-1.5 rounded-rounded1 text-fourth/40 hover:text-danger hover:bg-danger/10 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      {expanded && (
        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* English */}
          <div className="space-y-4">
            <Input
              value={item.questionEn}
              dir="ltr"
              onChange={(e) => onUpdate(item._id, "questionEn", e.target.value)}
              placeholder="What is...?"
              label="Question_EN"
              error={errors[errKey(item._id, "questionEn")]}
            />
            <RichTextEditor
              value={item.answerEn}
              onChange={(html) => onUpdate(item._id, "answerEn", html)}
              dir="ltr"
              label="Answer_EN"
              placeholder="The answer is..."
              error={errors[errKey(item._id, "answerEn")]}
            />
          </div>

          {/* Arabic */}
          <div className="space-y-4">
            <Input
              value={item.questionAr}
              dir="rtl"
              onChange={(e) => onUpdate(item._id, "questionAr", e.target.value)}
              placeholder="ما هو...؟"
              label="Question_AR"
              isRtl
              error={errors[errKey(item._id, "questionAr")]}
            />
            <RichTextEditor
              value={item.answerAr}
              onChange={(html) => onUpdate(item._id, "answerAr", html)}
              dir="rtl"
              label="Answer_AR"
              placeholder="الإجابة هي..."
              error={errors[errKey(item._id, "answerAr")]}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function FaqsPage() {
  const { data: faqsData, isLoading } = useFaqs();
  const { mutate: updateFaqs, isPending: isSaving } = useUpdateFaqs();

  const [items, setItems] = useState<FaqItemWithId[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate items when data loads
  useEffect(() => {
    if (faqsData?.items) {
      setItems(
        faqsData.items.map((item) => ({ ...item, _id: generateId() }))
      );
    }
  }, [faqsData]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((i) => i._id === active.id);
        const newIndex = prev.findIndex((i) => i._id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  /** Scroll the overflow-auto <main> to the bottom */
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      const main = document.querySelector("main");
      if (main) main.scrollTo({ top: main.scrollHeight, behavior: "smooth" });
    }, 50);
  }, []);

  const handleAddItem = () => {
    // Validate last item before allowing a new one
    if (items.length > 0) {
      const last = items[items.length - 1];
      const itemErrors = validateItem(last);
      if (Object.keys(itemErrors).length > 0) {
        setErrors(itemErrors);
        scrollToFirstError(itemErrors);
        return;
      }
    }

    const newId = generateId();
    setErrors({});
    setItems((prev) => [
      ...prev,
      { _id: newId, questionEn: "", questionAr: "", answerEn: "", answerAr: "" },
    ]);
    scrollToBottom();
  };

  const handleUpdate = (id: string, field: keyof FaqItem, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, [field]: value } : item))
    );
    // Clear error for this specific field as user types
    setErrors((prev) => {
      const next = { ...prev };
      delete next[errKey(id, field)];
      return next;
    });
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
    // Clear errors belonging to this item
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => { if (k.startsWith(id)) delete next[k]; });
      return next;
    });
  };

  const handleSave = () => {
    // Validate all items
    const allErrors: Record<string, string> = {};
    items.forEach((item) => Object.assign(allErrors, validateItem(item)));

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      scrollToFirstError(allErrors);
      return;
    }

    setErrors({});
    const payload = items.map(({ _id: _ignored, ...rest }) => rest);
    updateFaqs(payload);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-fourth border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-fourth/60">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">FAQs</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleAddItem}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add FAQ
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            color="#6d4bdd"
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save All
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="bg-secondary rounded-rounded1 border-2 border-primary p-16 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-fourth/10 flex items-center justify-center">
            <HelpCircle className="w-8 h-8 text-fourth" />
          </div>
          <div>
            <p className="text-third font-semibold text-lg">No FAQs yet</p>
            <p className="text-fourth/60 text-sm mt-1">
              Click &quot;Add FAQ&quot; to create your first frequently asked question.
            </p>
          </div>
          <Button
            onClick={handleAddItem}
            color="#6d4bdd"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add First FAQ
          </Button>
        </div>
      )}

      {/* FAQ List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {items.map((item, index) => (
              <SortableFaqCard
                key={item._id}
                item={item}
                index={index}
                errors={errors}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Floating action buttons */}
      <div className="fixed bottom-8 end-8 flex flex-col items-center gap-3 z-50">
        {/* Go to top */}
        <button
          onClick={() => {
            const main = document.querySelector("main");
            if (main) main.scrollTo({ top: 0, behavior: "smooth" });
            else window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="w-11 h-11 rounded-full bg-secondary border-2 border-primary shadow-lg flex items-center justify-center text-fourth hover:bg-primary hover:border-fourth transition-all hover:scale-105 active:scale-95"
          title="Go to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>

        {/* Add FAQ */}
        <button
          onClick={handleAddItem}
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: "#6d4bdd" }}
          title="Add FAQ"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
