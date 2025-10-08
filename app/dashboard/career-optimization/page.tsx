// "use client";

// import { useState } from "react";
// import axios from "axios";

// interface ChatMessage {
//   type: "user" | "ai";
//   text: string;
// }

// const CareerOptimization = () => {
//   const [pdfFile, setPdfFile] = useState<File | null>(null);
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [loading, setLoading] = useState(false);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setPdfFile(e.target.files[0]);
//     }
//   };

//   const handleUpload = async () => {
//     if (!pdfFile) return;

//     setLoading(true);
//     setMessages((prev) => [...prev, { type: "user", text: `Uploaded file: ${pdfFile.name}` }]);

//     try {
//       const formData = new FormData();
//       formData.append("resume", pdfFile);

//       const response = await axios.post("/api/optimize-resume-pdf", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       const suggestions: string[] = response.data.suggestions || [];
//       suggestions.forEach((sugg) => {
//         setMessages((prev) => [...prev, { type: "ai", text: sugg }]);
//       });
//     } catch (error) {
//       console.error("Error uploading PDF:", error);
//       setMessages((prev) => [...prev, { type: "ai", text: "Failed to analyze PDF. Please try again." }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 min-h-screen flex flex-col items-center">
//       <h1 className="text-2xl font-bold mb-4">AI Career Optimization</h1>
//       <p className="mb-6 text-center">
//         Upload your resume PDF and get AI-driven suggestions to improve it.
//       </p>

//       <input
//         type="file"
//         accept="application/pdf"
//         onChange={handleFileChange}
//         className="border p-2 rounded mb-4"
//       />

//       <button
//         onClick={handleUpload}
//         disabled={!pdfFile || loading}
//         className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-md hover:scale-105 transition-transform mb-6"
//       >
//         {loading ? "Analyzing..." : "Get Suggestions"}
//       </button>

//       <div className="w-full max-w-xl border rounded p-4 bg-gray-50 shadow space-y-2">
//         {messages.length === 0 && <p className="text-gray-400">Chat messages will appear here...</p>}

//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`p-2 rounded ${
//               msg.type === "user" ? "bg-blue-100 text-blue-800 self-end" : "bg-green-100 text-green-800"
//             }`}
//           >
//             {msg.text}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CareerOptimization;
