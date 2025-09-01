"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "../../../lib/supabase/browser";
import FolderCard from "../../../components/FolderCard";
import React from "react";

type FileEntry = { name: string };

export default function CollectionPage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  // ✅ hidden container for HTML → PDF rendering
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setUserId(user.id);

      // list files inside this user's folder
      const { data: list, error } = await supabase.storage
        .from("markdown")
        .list(user.id, {
          limit: 100,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) {
        console.error("List error:", error.message);
        setLoading(false);
        return;
      }

      setFiles(list ?? []);
      setLoading(false);
    })();
  }, [supabase]);

  const handleDownloadMd = async (fileName: string) => {
    if (!userId) return;
    setBusy(fileName);

    try {
      const { data, error } = await supabase.storage
        .from("markdown")
        .download(`${userId}/${fileName}`);

      if (error || !data) throw error;

      const md = await data.text();
      const { marked } = await import("marked");
      const html = marked.parse(md);

      if (containerRef.current) {
        // render inside hidden container
        containerRef.current.innerHTML = `<div class="prose">${html}</div>`;

        // 🚑 Sanitize unsupported CSS color functions
        const elements = containerRef.current.querySelectorAll("*");
        elements.forEach((el) => {
          const style = window.getComputedStyle(el as HTMLElement);

          if (style.color.includes("lab") || style.color.includes("oklab")) {
            (el as HTMLElement).style.color = "#000";
          }

          if (
            style.backgroundColor.includes("lab") ||
            style.backgroundColor.includes("oklab")
          ) {
            (el as HTMLElement).style.backgroundColor = "#fff";
          }
        });

        const html2pdf = (await import("html2pdf.js")).default;

        await html2pdf()
          .from(containerRef.current)
          .set({
            margin: 10,
            filename: fileName.replace(/\.md$/, ".pdf"),
            html2canvas: { scale: 2, backgroundColor: "#fff" },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          })
          .save();

        // cleanup
        containerRef.current.innerHTML = "";
      }
    } catch (err) {
      console.error("Markdown → PDF failed:", err);
      alert("Failed to generate PDF");
    } finally {
      setBusy(null);
    }
  };

  if (loading) return <p className="p-6">Loading…</p>;
  if (!userId)
    return <p className="p-6">Please log in to see your collection.</p>;

  return (
    <main className="max-w-5xl mx-auto p-6 h-screen">
      <h1 className="text-2xl font-semibold mb-6">Your collection</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((f) => (
          <FolderCard
            key={f.name}
            name={f.name}
            userId={userId}
            onPdf={() => handleDownloadMd(f.name)}
            busy={busy === f.name}
          />
        ))}
      </div>

      {/* hidden container for PDF rendering */}
      <div ref={containerRef} className="hidden" />
    </main>
  );
}
