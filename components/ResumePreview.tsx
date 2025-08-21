// components/ResumePreview.tsx
"use client";

import React from "react";
import { useRef } from "react";
import html2pdf from "html2pdf.js";

interface ResumeData {
  name: string;
  location: string;
  phone: string;
  linkedin: string;
  objective: string;
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
  skills: { name: string; level: string; years: string }[];
  projects: {
    title: string;
    date: string;
    description: string;
    technologies: string;
  }[];
  certifications: {
    title: string;
    issuer: string;
    date: string;
  }[];
}

export default function ResumePreview() {
  const resumeRef = useRef<HTMLDivElement>(null);

  // Example mock data (later you can fetch from Supabase or API)
  const data: ResumeData = {
    name: "Mohammed Awaiz",
    location: "Delhi",
    phone: "7291963142",
    linkedin: "linkedin.com",
    objective:
      "Highly motivated and aspiring Full Stack Developer seeking to leverage a strong foundation in Next.js to contribute to a challenging and growth-oriented team.",
    education: [
      {
        institution: "Jamia Millia Islamia",
        degree: "Bachelor of Engineering, Electrical and Computer Engineering",
        year: "2027",
      },
    ],
    skills: [{ name: "Next.js", level: "Expert", years: "0 years" }],
    projects: [
      {
        title: "next js",
        date: "August 2025",
        description: "next js",
        technologies: "next js",
      },
    ],
    certifications: [
      { title: "Developer", issuer: "Microsoft", date: "August 2024" },
    ],
  };

  const handleDownload = () => {
    if (resumeRef.current) {
      html2pdf()
        .from(resumeRef.current)
        .set({
          margin: 0.5,
          filename: "resume.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        })
        .save();
    }
  };

  return (

//     <div className="font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; border: 1px solid #ddd; box-shadow: 0 0 10px rgba(0,0,0,0.1);">

// <h1 className="text-align: center; color: #333; margin-bottom: 5px;">Mohammed Awaiz</h1>
// <p className="text-align: center; color: #555; font-size: 0.9em; margin-top: 0;">
//     Delhi | 7291963142 | <a href="https://www.linkedin.com/in/-mohammed-awaiz/" className="color: #155dfc; text-decoration: none;">linkedin.com/in/-mohammed-awaiz/</a>
// </p>

// <h2 className="color: #155dfc; border-bottom: 2px solid #155dfc; padding-bottom: 5px; margin-top: 20px;">Professional Summary</h2>
// <p className="margin-bottom: 10px; line-height: 1.5;">
//     <strong className="color: #333;">Web Developer | React & Next.js Expert | I Build Custom, Responsive Websites for Startups & Businesses</strong>
// </p>
// <p className="line-height: 1.5;">
//     Passionate about crafting engaging digital experiences through beautiful and functional user interfaces. I am a Front-End Web Developer with a flair for transforming ideas into interactive, live applications. Specializing in HTML5, CSS, JavaScript, Tailwind CSS, and React.js, I bring modern web design to life. I leverage the power of popular frameworks like React.js and Next.js to build scalable, high-performance applications, and utilize Tailwind CSS for rapid, responsive, and meticulously designed sites. With a constant drive to grow, I continuously explore the latest trends in web development, focusing on creating user-centric web solutions that are not just appealing but also accessible and efficient. My goal is to create digital experiences that users love and remember.
// </p>

// <h2 className="color: #155dfc; border-bottom: 2px solid #155dfc; padding-bottom: 5px; margin-top: 20px;">Skills</h2>
// <ul className="list-className-type: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap;">
//     <li className="flex: 1 1 48%; margin-bottom: 8px;"><strong className="color: #333;">Frameworks & Libraries:</strong> Next.js (Expert, 2 years), React.js (Expert, 1 year), React Three Fiber, GSAP, Framer Motion, Flowbite React</li>
//     <li className="flex: 1 1 48%; margin-bottom: 8px;"><strong className="color: #333;">Languages:</strong> JavaScript, HTML5, CSS</li>
//     <li className="flex: 1 1 48%; margin-bottom: 8px;"><strong className="color: #333;">Styling:</strong> Tailwind CSS</li>
//     <li className="flex: 1 1 48%; margin-bottom: 8px;"><strong className="color: #333;">Tools & Concepts:</strong> Responsive Design, UI/UX Principles, Git/GitHub</li>
// </ul>

// <h2 className="color: #155dfc; border-bottom: 2px solid #155dfc; padding-bottom: 5px; margin-top: 20px;">Projects</h2>

// <div className="margin-bottom: 15px;">
//     <h3 className="color: #333; margin-bottom: 5px; font-size: 1.1em;">Portfolio Website</h3>
//     <p className="margin-bottom: 5px; font-size: 0.9em; color: #666;">
//         <strong>Technologies:</strong> React Three Fiber (R3F), GSAP, Next.js, Tailwind CSS, Framer Motion, Flowbite React<br>
//         <strong>Completion Date:</strong> July 2025 (Expected)
//     </p>
//     <ul className="margin: 0; padding-left: 20px; line-height: 1.5;">
//         <li>Developed a cutting-edge 3D interactive portfolio website showcasing modern web development and creative UI/UX expertise.</li>
//         <li>Implemented smooth, interactive 3D models and animations using **React Three Fiber (@react-three/fiber)** for immersive experiences.</li>
//         <li>Utilized **GSAP (gsap)** for high-performance scroll-triggered transitions, hover effects, and entrance animations to enhance user interaction.</li>
//         <li>classNamed the UI rapidly and consistently across all screen sizes with **Tailwind CSS (@tailwindcss/vite)**, ensuring responsiveness.</li>
//         <li>Integrated **Framer Motion (motion)** for fluid, declarative animations and page transitions, making UI elements feel alive and intuitive.</li>
//         <li>Leveraged **Flowbite React (flowbite-react)** for pre-built components, streamlining UI consistency with minimal setup.</li>
//         <li>Incorporated additional libraries such as `typewriter-effect`, `react-scroll`, `react-icons`, and `react-simple-typewriter` to polish interactions and visual storytelling.</li>
//         <li><a href="https://lnkd.in/dXb9qMiR" className="color: #155dfc; text-decoration: none;">Live Demo</a> | <a href="https://lnkd.in/dmQ8_Gri" className="color: #155dfc; text-decoration: none;">GitHub Repository</a></li>
//     </ul>
// </div>

// <h2 className="color: #155dfc; border-bottom: 2px solid #155dfc; padding-bottom: 5px; margin-top: 20px;">Education</h2>
// <div className="margin-bottom: 10px;">
//     <h3 className="color: #333; margin-bottom: 5px; font-size: 1.1em;">Bachelor of Technology in Electrical and Computer Engineering</h3>
//     <p className="margin-bottom: 0; font-size: 0.9em; color: #666;">Jamia Millia Islamia (JMI) - Delhi | Expected Graduation: 2025</p>
// </div>

// <h2 className="color: #155dfc; border-bottom: 2px solid #155dfc; padding-bottom: 5px; margin-top: 20px;">Certifications</h2>
// <div className="margin-bottom: 10px;">
//     <h3 className="color: #333; margin-bottom: 5px; font-size: 1.1em;">Full Stack Developer</h3>
//     <p className="margin-bottom: 0; font-size: 0.9em; color: #666;">Issued by Microsoft | June 2024</p>
// </div>

// </div>

    <>
      <div
        ref={resumeRef}
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 my-6"
      >
        {/* Personal Info */}
        <header className="text-center pb-6 border-b-2 border-gray-200">
          <h1 className="text-4xl font-bold text-blue-600">{data.name}</h1>
          <div className="mt-2 text-sm text-gray-600">
            <span className="mr-4">
              <strong>Location:</strong> {data.location}
            </span>
            |
            <span className="ml-4 mr-4">
              <strong>Phone:</strong> {data.phone}
            </span>
            |
            <a
              href={`https://${data.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              <strong>LinkedIn:</strong> {data.linkedin}
            </a>
          </div>
        </header>

        {/* Objective */}
        <section className="py-6 border-b-2 border-gray-200">
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">
            Objective
          </h2>
          <p className="text-gray-700">{data.objective}</p>
        </section>

        {/* Education */}
        <section className="py-6 border-b-2 border-gray-200">
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">
            Education
          </h2>
          {data.education.map((edu, i) => (
            <div key={i} className="mb-2">
              <h3 className="text-lg font-medium text-gray-800">
                {edu.institution}
              </h3>
              <p className="text-sm text-gray-600">
                {edu.degree}, {edu.year}
              </p>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="py-6 border-b-2 border-gray-200">
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">Skills</h2>
          <ul className="list-disc list-inside text-gray-700">
            {data.skills.map((skill, i) => (
              <li key={i}>
                <strong>{skill.name}:</strong> {skill.level} ({skill.years})
              </li>
            ))}
          </ul>
        </section>

        {/* Projects */}
        <section className="py-6 border-b-2 border-gray-200">
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">
            Projects
          </h2>
          {data.projects.map((proj, i) => (
            <div key={i} className="mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                {proj.title}
              </h3>
              <p className="text-sm text-gray-600">
                <strong>Date:</strong> {proj.date}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Description:</strong> {proj.description}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Technologies:</strong> {proj.technologies}
              </p>
            </div>
          ))}
        </section>

        {/* Certifications */}
        <section className="pt-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">
            Certifications
          </h2>
          {data.certifications.map((cert, i) => (
            <div key={i} className="mb-2">
              <h3 className="text-lg font-medium text-gray-800">
                {cert.title}
              </h3>
              <p className="text-sm text-gray-600">
                <strong>Issuer:</strong> {cert.issuer}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Date:</strong> {cert.date}
              </p>
            </div>
          ))}
        </section>
      </div>

      <button
        onClick={handleDownload}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Download PDF
      </button>
   </>

  );
}
