export default function ServicePage() {
  return (
    <main className="min-h-[90vh] px-6 text-background font-semibold w-full flex justify-center items-center flex-col">
      <h1 className="text-4xl font-bold mb-6 text-primary ">Our Services</h1>

        <p className="mb-4 text-black">
          At <strong>MakeResume</strong>, we offer:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-black">
          <li>AI-powered Resume Generation</li>
          <li>Custom Resume Templates</li>
          <li>Export to PDF & Word Format</li>
          <li>LinkedIn Integration</li>
          <li>Live Resume Preview & Tips</li>
        </ul>
 
    </main>
  );
}
