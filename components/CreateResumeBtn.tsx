"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function CreateResumeBtn() {
  const router = useRouter();

  const handleCreateResume = () => {
    // Navigate to the resume creation page
    router.push("/dashboard/resume");
  };

  return (
    <button
      onClick={handleCreateResume}
      className="flex flex-col justify-center items-center p-32 bg-background cursor-pointer rounded-xl hover:bg-primary hover:text-background transition-all duration-200 shadow-lg m-2"
    >
      <p className="text-5xl font-bold text-text">+</p>
      <p className="text-xl text-text font-bold ">Create Your Resume</p>
    </button>
  );
}
