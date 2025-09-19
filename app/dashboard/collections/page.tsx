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

      const md: string = await data.text();
      const blob = new Blob([md], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Markdown download failed:", err);
      alert("Failed to download Markdown");
    } finally {
      setBusy(null);
    }
  };

  if (loading) return <p className="p-6">Loading…</p>;
  if (!userId)
    return <p className="p-6 text-center text-red-500">Please log in to see your collection.</p>;

  return (
    <main className="min-h-screen w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-primary mt-16">
        Your Collection
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      <div ref={containerRef} className="hidden" />
    </main>
  );
}
