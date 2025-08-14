"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Calendar, Building, FileText, Target, GraduationCap } from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  summary?: string;
  expectations?: string;
  qualifications?: string;
  fullJD?: string;
  url?: string;
  createdAt: string;
}

interface ViewJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string | null;
}

export function ViewJobModal({ open, onOpenChange, jobId }: ViewJobModalProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to fetch job details");
          return;
        }

        setJob(data);
      } catch (error: unknown) {
        console.log(error);
        setError("Failed to fetch job details");
      } finally {
        setLoading(false);
      }
    };

    if (open && jobId) {
      fetchJob();
    } else {
      setJob(null);
      setError(null);
    }
  }, [open, jobId]); // Now all dependencies are included

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
            {loading ? "Loading..." : job ? `${job.title} @ ${job.company}` : "Job Details"}
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

        {job && !loading && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="text-lg font-semibold">{job.company}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Added {formatDate(job.createdAt)}
                  </span>
                </div>
              </div>
              {job.url && (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-light dark:text-brand-dark hover:underline text-sm"
                >
                  View Original Posting
                </a>
              )}
            </div>

            {/* Summary Section */}
            {job.summary && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <h3 className="font-semibold">Summary</h3>
                </div>
                <div className="pl-6 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {job.summary}
                </div>
              </div>
            )}

            {/* Expectations Section */}
            {job.expectations && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-gray-500" />
                  <h3 className="font-semibold">Key Responsibilities</h3>
                </div>
                <div className="pl-6 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {job.expectations}
                </div>
              </div>
            )}

            {/* Qualifications Section */}
            {job.qualifications && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-gray-500" />
                  <h3 className="font-semibold">Required Qualifications</h3>
                </div>
                <div className="pl-6 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {job.qualifications}
                </div>
              </div>
            )}

            {/* Full Job Description */}
            {job.fullJD && (
              <div className="space-y-2">
                <h3 className="font-semibold">Full Job Description</h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {job.fullJD}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}