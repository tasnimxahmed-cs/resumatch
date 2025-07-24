"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EditJobModal } from "@/components/EditJobModal";

export default function UploadJobPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [editableFields, setEditableFields] = useState({
    title: "",
    company: "",
    summary: "",
    expectations: "",
    qualifications: "",
    fullJD: "",
  });

  const handleExtract = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/extract-job", {
        method: "POST",
        body: JSON.stringify({ jobLink: input }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to extract job.");
        return;
      }

      setEditableFields({
        title: data.title || "",
        company: data.company || "",
        summary: data.summary || "",
        expectations: data.expectations || "",
        qualifications: data.qualifications || "",
        fullJD: data.fullJD || "",
      });

      setModalOpen(true);
    } catch (err) {
      setError("Unexpected error during extraction.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/save-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editableFields),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Save failed.");
      } else {
        setInput("");
        setModalOpen(false);
        setEditableFields({
          title: "",
          company: "",
          summary: "",
          expectations: "",
          qualifications: "",
          fullJD: "",
        });
      }
    } catch (err) {
      setError("Unexpected save error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    setModalOpen(false);
    setEditableFields({
      title: "",
      company: "",
      summary: "",
      expectations: "",
      qualifications: "",
      fullJD: "",
    });
  };

  return (
    <div className="max-w-2xl px-4">
      <h2 className="text-2xl font-semibold [font-family:var(--font-poppins)] mb-4">Import Job</h2>

      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste the job listing link here..."
        className="dark:bg-surface-dark bg-surface-light text-text-light dark:text-text-dark"
      />

      <Button
        onClick={handleExtract}
        disabled={loading || !input.trim()}
        className="mt-4 bg-brand-light dark:bg-brand-dark text-text-dark hover:bg-brand-light/75 dark:hover:bg-brand-dark/75 cursor-pointer shadow"
      >
        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Extract Info"}
      </Button>

      {error && (
        <div className="mt-4 p-4 text-red-600 border border-red-400 rounded bg-red-50 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      <EditJobModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editableFields={editableFields}
        onChange={setEditableFields}
        onSave={handleSave}
        onDiscard={handleDiscard}
        loading={loading}
      />
    </div>
  );
}
