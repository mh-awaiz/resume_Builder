"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "../../../lib/supabase/browser";
import FolderCard from "../../../components/FolderCard";

type FileEntry = { name: string };

export default function CollectionPage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  // Preview state
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Keywords to check for ATS score
  const atsKeywords = [
    "React",
    "Next.js",
    "Tailwind",
    "JavaScript",
    "TypeScript",
    "Full-Stack",
    "Node.js",
    "HTML",
    "CSS",
    "API",
    "Git",
    "Database",
  ];

  // Fetch files
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
      } else {
        setFiles(list ?? []);
      }
      setLoading(false);
    })();
  }, [supabase]);

  // Calculate ATS score
  const calculateAtsScore = (html: string) => {
    const text = html.replace(/<[^>]+>/g, " ").toLowerCase();
    const matched = atsKeywords.filter((k) => text.includes(k.toLowerCase()));
    const score = Math.round((matched.length / atsKeywords.length) * 100);
    setAtsScore(score);
  };

  // View / preview a file
  const handleView = async (fileName: string) => {
    if (!userId) return;
    setBusy(fileName);

    try {
      const { data, error } = await supabase.storage
        .from("markdown")
        .download(`${userId}/${fileName}`);
      if (error || !data) throw error;

      const html = await data.text();

      // Extract <style> and <body>
      const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
        .map((m) => m[1])
        .join("\n");
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      const bodyContent = bodyMatch ? bodyMatch[1] : html;

      const finalHtml = `<style>${styles}</style>${bodyContent}`;
      setPreviewHtml(finalHtml);
      setPreviewFile(fileName);

      // Calculate ATS score
      calculateAtsScore(finalHtml);
    } catch (err) {
      console.error("Preview failed:", err);
      alert("Failed to load preview");
    } finally {
      setBusy(null);
    }
  };

  // Download PDF
  const handleDownload = async () => {
    if (!previewHtml || !previewFile) return;
    setDownloading(true);

    try {
      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: previewHtml,
          fileName: previewFile.replace(".html", ""),
        }),
      });

      if (!response.ok) {
        // Try to read error details from the API
        let errorMsg = "PDF generation failed";
        try {
          const data = await response.json();
          if (data?.error) errorMsg = data.error;
          if (data?.details) errorMsg += `: ${data.details}`;
        } catch (jsonErr) {
          console.error("Failed to parse error JSON", jsonErr);
        }
        throw new Error(errorMsg);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = previewFile.replace(".html", ".pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("PDF download error:", err);
      alert(`Failed to download PDF.\n${err.message}`);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <p className="p-6 text-center">Loading…</p>;
  if (!userId)
    return (
      <p className="p-6 text-center text-red-500">
        Please log in to see your collection.
      </p>
    );

  return (
    <main className="min-h-screen w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary mt-16">
        Your Collection
      </h1>

      {files.length === 0 ? (
        <p className="text-center text-gray-500">
          You have no files in your collection.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((f) => (
            <FolderCard
              key={f.name}
              name={f.name}
              userId={userId}
              onPdf={() => handleView(f.name)}
              busy={busy === f.name}
            />
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{previewFile}</h2>
              <div className="space-x-2 flex items-center">
                <button
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => {
                    setPreviewFile(null);
                    setPreviewHtml("");
                    setAtsScore(null);
                  }}
                >
                  Close
                </button>
                <button
                  className={`px-3 py-1 rounded text-white ${
                    downloading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  {downloading ? "Generating..." : "Download PDF"}
                </button>
              </div>
            </div>

            {/* ATS Score */}
            {atsScore !== null && (
              <p className="mb-2 font-medium text-green-700">
                ATS Score: {atsScore}%
              </p>
            )}

            <div
              ref={previewRef}
              className="prose max-w-none bg-white p-4 overflow-auto"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>
        </div>
      )}
    </main>
  );
}
