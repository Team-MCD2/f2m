"use client";

import { useCallback, useState } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentDropzoneProps {
  onUpload: (files: FileList | File[]) => Promise<void>;
  disabled?: boolean;
  label?: string;
}

export function DocumentDropzone({
  onUpload,
  disabled,
  label = "Glissez-déposez vos fichiers ici, ou cliquez pour parcourir",
}: DocumentDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      if (disabled || uploading || files.length === 0) return;
      setUploading(true);
      try {
        await onUpload(files);
      } finally {
        setUploading(false);
      }
    },
    [disabled, onUpload, uploading]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files.length) void handleFiles(e.dataTransfer.files);
      }}
      className={cn(
        "relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
        dragging
          ? "border-f2m-navy bg-f2m-cream/50"
          : "border-slate-300 bg-slate-50/80 hover:border-f2m-blue hover:bg-white",
        (disabled || uploading) && "pointer-events-none opacity-60"
      )}
    >
      <input
        type="file"
        multiple
        className="absolute inset-0 cursor-pointer opacity-0"
        disabled={disabled || uploading}
        onChange={(e) => {
          if (e.target.files?.length) void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <Upload className="mb-3 h-10 w-10 text-slate-400" />
      <p className="text-sm font-medium text-slate-700">
        {uploading ? "Envoi en cours…" : label}
      </p>
      <p className="mt-1 text-xs text-slate-500">PDF, images, Word — max. 20 Mo</p>
    </div>
  );
}
