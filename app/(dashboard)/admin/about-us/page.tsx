/**
 * Admin About Us Page
 * Allows the admin to edit the About Us content and image
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import { Upload, X, UserCircle, Save, Globe } from "lucide-react";
import { Button } from "../../../src/components/ui/button";
import { RichTextEditor } from "../../../src/components/ui/rich-text-editor";
import { useAboutUs, useUpdateAboutUs } from "../../../src/services/about-us/hooks/use-about-us";
import { API_CONFIG } from "../../../src/lib/constants";

export default function AboutUsPage() {
  const { data: aboutUs, isLoading } = useAboutUs();
  const { mutate: updateAboutUs, isPending: isSaving } = useUpdateAboutUs();

  const [contentEn, setContentEn] = useState("");
  const [contentAr, setContentAr] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (aboutUs) {
      setContentEn(aboutUs.contentEn || "");
      setContentAr(aboutUs.contentAr || "");
      if (aboutUs.image) {
        setImagePreview(`${API_CONFIG.baseUrl.replace("/api", "")}/${aboutUs.image}`);
      }
    }
  }, [aboutUs]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = () => {
    updateAboutUs({
      contentEn,
      contentAr,
      ...(imageFile ? { image: imageFile } : {}),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-fourth border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-fourth/60">Loading About Us...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col gap-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">About Us</h1>
        </div>
        <Button onClick={handleSave} disabled={isSaving} color="#6d4bdd" className="flex items-center gap-2">
          {isSaving ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
          ) : (
            <><Save className="w-4 h-4" />Save Changes</>
          )}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Profile Image */}
        <div className="bg-secondary rounded-rounded1 border-2 border-primary p-6 space-y-4">
          <h2 className="text-sm font-semibold text-third flex items-center gap-2">
            <UserCircle className="w-4 h-4 text-fourth" />
            Profile Image
          </h2>

          <div className="flex items-center gap-6">
            {imagePreview ? (
              <div className="relative group w-32 h-32 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="About Us" className="w-32 h-32 rounded-full object-cover border-4 border-primary" />
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="p-2 bg-secondary rounded-full hover:bg-primary transition-colors" title="Replace image">
                    <Upload className="w-3.5 h-3.5 text-third" />
                  </button>
                  <button type="button" onClick={handleRemoveImage}
                    className="p-2 bg-secondary rounded-full hover:bg-danger/10 transition-colors" title="Remove image">
                    <X className="w-3.5 h-3.5 text-danger" />
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 shrink-0 rounded-full border-2 border-dashed border-primary hover:border-fourth hover:bg-primary/60 transition-colors flex flex-col items-center justify-center gap-1.5 text-fourth/50 hover:text-fourth">
                <Upload className="w-6 h-6" />
                <span className="text-xs font-medium text-center leading-tight">Upload<br/>Photo</span>
              </button>
            )}
            <div className="space-y-1">
              <p className="text-sm font-medium text-third">Profile Photo</p>
              <p className="text-xs text-fourth/50">JPEG, PNG, GIF, WebP accepted</p>
              <p className="text-xs text-fourth/40">Leave empty to keep the existing image</p>
            </div>
          </div>

          <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            className="hidden" onChange={handleFileChange} />
        </div>

        {/* Content — English */}
        <div className="bg-secondary rounded-rounded1 border-2 border-primary p-6 space-y-4">
          <h2 className="text-sm font-semibold text-third flex items-center gap-2">
            <Globe className="w-4 h-4 text-fourth" />
            Content — English
          </h2>
          <RichTextEditor value={contentEn} onChange={setContentEn} dir="ltr"
            placeholder="Write your About Us content in English..." minHeight="200px" />
        </div>

        {/* Content — Arabic */}
        <div className="bg-secondary rounded-rounded1 border-2 border-primary p-6 space-y-4">
          <h2 className="text-sm font-semibold text-third flex items-center gap-2">
            <Globe className="w-4 h-4 text-fourth" />
            Content — Arabic
          </h2>
          <RichTextEditor value={contentAr} onChange={setContentAr} dir="rtl"
            placeholder="اكتب محتوى صفحة من نحن باللغة العربية..." minHeight="200px" />
        </div>
      </div>

    </div>
  );
}
