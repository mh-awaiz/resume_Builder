"use client";
import React from "react";
import ResumePreview from "../../../components/ResumePreview";

export default function Collections() {
  return (
    <main className="p-6 h-auto text-primary bg-background">
      <h2 className="text-xl font-bold mt-10 text-primary">
        Your Generated Resumes
      </h2>

      <ResumePreview />
    </main>
  );
}
