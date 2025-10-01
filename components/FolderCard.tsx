"use client";

import React from "react";
import FolderIcon from "./FolderIcon";

export default function FolderCard({
  name,
  userId,
  onPdf,
  busy,
}: {
  name: string;
  userId: string;
  onPdf: () => void;
  busy: boolean;
}) {
  return (
    <div className="rounded-2xl border border-secondary shadow-sm p-4 flex items-center justify-between bg-white">
      <div className="flex items-center gap-3 overflow-hidden">
        <FolderIcon />
        <div className="text-black">
          <p className="font-medium truncate">{name}</p>
          <p className="text-xs text-gray-500 truncate">
            markdown/{userId}/{name}
          </p>
        </div>
      </div>
      <button
        onClick={onPdf}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 m-1"
        aria-label={`Download ${name} as PDF`}
      >
        {"View"}
      </button>
    </div>
  );
}
