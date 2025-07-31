// app/dashboard/upload-resume/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Upload, FileText, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Job {
  id: string;
  title: string;
  company: string;
}

export default function UploadResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Fetch user's jobs for selection
  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/jobs");
        if (res.ok) {
          const jobsData = await res.json();
          setJobs(jobsData);
        }
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    }
    fetchJobs();
  }, []);

  const handleFileChange = (selectedFile: File | null) => {
    setError(null);
    setSuccess(null);
    
    if (selectedFile) {
      if (!selectedFile.type.includes("pdf")) {
        setError("Please select a PDF file.");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        setError("File size must be less than 10MB.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (selectedJobId) {
        formData.append("jobId", selectedJobId);
      }

      const res = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed.");
        return;
      }

      setSuccess(`Resume uploaded successfully! Extracted ${data.extractedLength} characters of text.`);
      setFile(null);
      setSelectedJobId("");
    } catch (err) {
      setError("Unexpected error during upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl px-4">
      <h2 className="text-2xl font-semibold font-header mb-6">Upload Resume</h2>
      
      <Card className="bg-surface-light dark:bg-surface-dark">
        <CardHeader>
          <CardTitle className="font-header">Add Your Resume</CardTitle>
          <CardDescription className="font-body">
            Upload a PDF resume to analyze and tailor for specific jobs
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Job Selection */}
          <div className="space-y-2">
            <Label htmlFor="job-select" className="font-body">
              Associate with Job (Optional)
            </Label>
            <Select value={selectedJobId} onValueChange={setSelectedJobId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a job to tailor this resume for" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No specific job</SelectItem>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title} @ {job.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${dragActive 
                ? 'border-brand-light dark:border-brand-dark bg-brand-light/10 dark:bg-brand-dark/10' 
                : 'border-gray-300 dark:border-gray-600 hover:border-brand-light dark:hover:border-brand-dark'
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              {file ? (
                <>
                  <FileText className="w-12 h-12 mx-auto text-brand-light dark:text-brand-dark" />
                  <div>
                    <p className="font-medium font-body">{file.name}</p>
                    <p className="text-sm text-gray-500 font-body">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 mx-auto text-gray-400" />
                  <div>
                    <p className="font-medium font-body">Drop your PDF here, or click to browse</p>
                    <p className="text-sm text-gray-500 font-body">PDF files only, up to 10MB</p>
                  </div>
                </>
              )}
              
              <Input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                className="hidden"
                id="file-input"
              />
              <Label
                htmlFor="file-input"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer"
              >
                Choose File
              </Label>
            </div>
          </div>

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={loading || !file}
            className="w-full bg-brand-light dark:bg-brand-dark text-white hover:bg-brand-light/75 dark:hover:bg-brand-dark/75"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Resume
              </>
            )}
          </Button>

          {/* Status Messages */}
          {error && (
            <div className="p-4 text-red-600 border border-red-400 rounded bg-red-50 dark:bg-red-950 dark:text-red-400 font-body">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 text-green-600 border border-green-400 rounded bg-green-50 dark:bg-green-950 dark:text-green-400 font-body">
              <CheckCircle className="w-5 h-5 inline mr-2" />
              {success}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}