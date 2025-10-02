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
  const [atsScore, setAtsScore] = useState<{
    keywordScore: number;
    formatScore: number;
    finalScore: number;
  } | null>(null);
  const [keywordsInput, setKeywordsInput] = useState<string>(""); // dynamic input
  const previewRef = useRef<HTMLDivElement>(null);

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

  // Calculate ATS score using dynamic keywords + format check
  const calculateAtsScore = (html: string, keywords: string[]) => {
    if (!keywords.length) {
      setAtsScore(null);
      return;
    }

    const text = html.replace(/<[^>]+>/g, " ").toLowerCase();

    // --- Keyword Score ---
    const matched = keywords.filter((k) =>
      text.includes(k.trim().toLowerCase())
    );
    const keywordScore = Math.round((matched.length / keywords.length) * 100);

    // --- Format Score ---
    let formatPoints = 0;
    const totalPoints = 6;

    // 1. Contact info (email or phone)
    if (/\b\d{10}\b/.test(text) || /@\w+\.\w+/.test(text)) formatPoints++;

    // 2. Summary section
    if (/summary|objective/i.test(html)) formatPoints++;

    // 3. Skills section
    if (/skills/i.test(html)) formatPoints++;

    // 4. Experience section with dates
    if (/experience/i.test(html) && /\b(20\d{2}|19\d{2})\b/.test(text)) formatPoints++;

    // 5. Education section
    if (/education/i.test(html)) formatPoints++;

    // 6. Bullet points
    if (/<li>/.test(html)) formatPoints++;

    const formatScore = Math.round((formatPoints / totalPoints) * 100);

    // --- Final Score (weighted 50/50) ---
    const finalScore = Math.round(keywordScore * 0.5 + formatScore * 0.5);

    setAtsScore({ keywordScore, formatScore, finalScore });
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

      // Reset score when opening new preview
      setAtsScore(null);
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

            {/* Dynamic keyword input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Enter Keywords (comma separated)
              </label>
              <input
                type="text"
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                placeholder="e.g. React, Next.js, Tailwind"
                className="w-full px-3 py-2 border rounded bg-gray-50 focus:outline-none focus:ring focus:border-blue-300"
              />
              <button
                onClick={() =>
                  calculateAtsScore(
                    previewHtml,
                    keywordsInput
                      .split(",")
                      .map((k) => k.trim())
                      .filter(Boolean)
                  )
                }
                className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Calculate ATS Score
              </button>
            </div>

            {/* ATS Score */}
            {atsScore && (
              <div className="mb-2 font-medium text-green-700">
                <p>ATS Score: {atsScore.finalScore}%</p>
                <p className="text-sm text-gray-600">
                  Keywords: {atsScore.keywordScore}% | Format: {atsScore.formatScore}%
                </p>
              </div>
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
