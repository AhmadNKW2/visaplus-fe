"use client";

/**
 * RichTextEditor — Tiptap-powered rich text field
 * Toolbar: Bold · Italic · Bullet List · Ordered List
 * Styled to match the project's existing field design system.
 */

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  dir?: "ltr" | "rtl";
  label?: string;
  error?: string;
  minHeight?: string;
}

// Toolbar button helper
function ToolbarBtn({
  active,
  disabled,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault(); // Keep editor focus
        onClick();
      }}
      disabled={disabled}
      title={title}
      className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-semibold transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed
        ${
          active
            ? "bg-fourth text-white shadow-sm"
            : "text-gray-500 hover:bg-primary hover:text-fourth"
        }`}
    >
      {children}
    </button>
  );
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Type here...",
  dir = "ltr",
  label,
  error,
  minHeight = "140px",
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `outline-none min-h-[${minHeight}] px-4 py-3 text-sm text-third leading-relaxed ${
          dir === "rtl" ? "text-right font-[Almarai,sans-serif]" : "font-[Lato,sans-serif]"
        }`,
        dir,
        "data-placeholder": placeholder,
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      // Treat an empty paragraph as empty string
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  // Sync external value changes (e.g. when data loads from API)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const incoming = value || "";
    if (current !== incoming) {
      editor.commands.setContent(incoming, { emitUpdate: false });
      // force a re-render so placeholder visibility updates after programmatic setContent
      // (we avoid emitting an update event to prevent onChange loops)
      setTick((s) => s + 1);
    }
  }, [value, editor]);

  // local state used solely to trigger re-renders after programmatic content set
  const [, setTick] = useState(0);

  const borderColor = error ? "border-danger" : "border-primary";
  const focusRingColor = "focus-within:border-fifth";

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-third mb-1.5 px-1">
          {label}
        </label>
      )}

      <div
        className={`border-2 rounded-rounded1 bg-secondary transition-[border-color] ${borderColor} ${focusRingColor} overflow-hidden`}
      >
        {/* Toolbar */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-primary bg-primary/40">
          <ToolbarBtn
            title="Bold"
            active={editor?.isActive("bold") ?? false}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            disabled={!editor?.can().toggleBold()}
          >
            <Bold className="w-3.5 h-3.5" />
          </ToolbarBtn>

          <ToolbarBtn
            title="Italic"
            active={editor?.isActive("italic") ?? false}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            disabled={!editor?.can().toggleItalic()}
          >
            <Italic className="w-3.5 h-3.5" />
          </ToolbarBtn>

          <div className="w-px h-5 bg-gray-200 mx-1" />

          <ToolbarBtn
            title="Bullet List"
            active={editor?.isActive("bulletList") ?? false}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            <List className="w-3.5 h-3.5" />
          </ToolbarBtn>

          <ToolbarBtn
            title="Ordered List"
            active={editor?.isActive("orderedList") ?? false}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </ToolbarBtn>
        </div>

        {/* Editor area */}
        <div className="relative">
          <EditorContent editor={editor} />
          {/* Placeholder — shown when editor text is actually empty */}
          {editor && editor.getText && editor.getText().trim() === "" && (
            <p
              className={`absolute top-3 pointer-events-none text-sm text-fourth/50 select-none ${
                dir === "rtl" ? "right-4 font-[Almarai,sans-serif]" : "left-4"
              }`}
            >
              {placeholder}
            </p>
          )}
        </div>
      </div>

      {/* Prose styles injected locally */}
      <style>{`
        .ProseMirror ul {
          list-style-type: disc;
          padding-${dir === "rtl" ? "right" : "left"}: 1.25rem;
          margin: 0.25rem 0;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-${dir === "rtl" ? "right" : "left"}: 1.25rem;
          margin: 0.25rem 0;
        }
        .ProseMirror li { margin: 0.1rem 0; }
        .ProseMirror p { margin: 0; }
        .ProseMirror strong { font-weight: 700; }
        .ProseMirror em { font-style: italic; }
      `}</style>

      {error && (
        <span className="text-xs text-danger mt-1 block">{error}</span>
      )}
    </div>
  );
};
