"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, FileText, Building } from "lucide-react";

interface Resume {
  id: string;
  filename?: string;
  content: string;
  createdAt: string;
  job?: {
    id: string;
    title: string;
    company: string;
  };
}

interface ViewResumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId: string | null;
}

export function ViewResumeModal({ open, onOpenChange, resumeId }: ViewResumeModalProps) {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && resumeId) {
      fetchResume();
    } else {
      setResume(null);
      setError(null);
    }
  }, [open, resumeId]);

  const fetchResume = async () => {
    if (!resumeId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/resumes/${resumeId}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to fetch resume details");
        return;
      }

      setResume(data);
    } catch (error) {
      setError("Failed to fetch resume details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-header text-xl">
            {loading ? "Loading..." : resume ? (resume.filename || "Resume") : "Resume Details"}
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-brand-light dark:text-brand-dark" />
          </div>
        )}

        {error && (
          <div className="p-4 text-red-600 border border-red-400 rounded bg-red-50 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        {resume && !loading && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-lg font-semibold">
                    {resume.filename || "Untitled Resume"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Uploaded {formatDate(resume.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Associated Job */}
            {resume.job && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-blue-900 dark:text-blue-100">
                    Tailored for Job
                  </span>
                </div>
                <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {resume.job.title} @ {resume.job.company}
                </Badge>
              </div>
            )}

            {/* Resume Content */}
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Extracted Text Content</span>
              </h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-h-96 overflow-y-auto font-mono leading-relaxed">
                  {resume.content}
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Character count: {resume.content.length.toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}