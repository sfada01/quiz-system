"use client";

import { useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, X } from "lucide-react";

interface Props { onFile: (file: File) => void; }

const ACCEPTED = [
  "image/png", "image/jpeg", "image/webp",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function UploadZone({ onFile }: Props) {
  const [dragging, setDragging] = useState(false);
  const [file,     setFile]     = useState<File | null>(null);
  const [error,    setError]    = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = (f: File) => {
    if (!ACCEPTED.includes(f.type)) {
      setError("Unsupported format. Upload PDF, DOCX, or an image."); return false;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File exceeds 10 MB."); return false;
    }
    return true;
  };

  const accept = useCallback((f: File) => {
    setError(null);
    if (!validate(f)) return;
    setFile(f); onFile(f);
  }, [onFile]); // eslint-disable-line

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0]; if (f) accept(f);
  };

  const clear = () => {
    setFile(null); setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef} id="file-upload" type="file"
        accept=".pdf,.docx,image/*"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) accept(f); }}
        className="sr-only" aria-label="Upload file"
      />

      <AnimatePresence mode="wait">
        {!file ? (
          <motion.label
            key="zone"
            htmlFor="file-upload"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3
                        rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors
                        ${dragging
                          ? "border-accent bg-accent/5 text-accent"
                          : "border-white/15 bg-surface-2 text-ink-muted hover:border-accent/40"}`}
          >
            <UploadCloud size={36} className={dragging ? "scale-110" : ""} />
            <div>
              <p className="font-semibold text-ink">Drag & drop your file here</p>
              <p className="mt-1 text-sm">or click to browse</p>
              <p className="mt-2 text-xs text-ink-faint">PDF, DOCX, PNG, JPG — max 10 MB</p>
            </div>
          </motion.label>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 rounded-2xl border border-emerald-500/30
                       bg-emerald-500/8 px-5 py-4"
          >
            <FileText size={24} className="shrink-0 text-emerald-400" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{file.name}</p>
              <p className="text-xs text-ink-muted">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button onClick={clear} aria-label="Remove file"
              className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-3 hover:text-ink">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="mt-2 text-sm text-red-400" role="alert">{error}</p>}
    </div>
  );
}