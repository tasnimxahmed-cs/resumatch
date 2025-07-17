"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function UploadJobPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleExtract = async () => {
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/extract-job", {
      method: "POST",
      body: JSON.stringify({ jobDescription: input }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 [font-family:var(--font-poppins)]">Upload a Job Description</h2>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste the job description here..."
        className="w-full min-h-[200px] p-4 border rounded-md dark:bg-surface-dark bg-surface-light dark:text-white"
      />
      <button
        onClick={handleExtract}
        disabled={loading || !input.trim()}
        className="mt-4 px-4 py-2 bg-brand-light dark:bg-brand-dark text-text-dark rounded disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Extract Info"}
      </button>

      {result && (
        <div className="mt-6 p-4 border rounded-md dark:bg-surface-dark bg-white">
          <h3 className="text-lg font-semibold mb-2">Preview:</h3>
          <p><strong>Title:</strong> {result.title}</p>
          <p><strong>Company:</strong> {result.company}</p>
          <p><strong>Summary:</strong> {result.summary}</p>
          <p><strong>Expectations:</strong> {result.expectations}</p>
          <p><strong>Qualifications:</strong> {result.qualifications}</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
            <strong>Full Description:</strong><br />
            {result.fullJD}
          </p>
        </div>
      )}
    </div>
  );
}
