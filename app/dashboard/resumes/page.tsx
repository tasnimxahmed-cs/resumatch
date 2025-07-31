"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload, 
  FileText, 
  Loader2, 
  Search, 
  CheckCircle,
  Plus
} from "lucide-react";
import ResumeCard from "@/components/ResumeCard";
import { useRouter } from "next/navigation";

interface Job {
  id: string;
  title: string;
  company: string;
}

interface Resume {
  id: string;
  filename?: string;
  createdAt: string;
  job?: {
    id: string;
    title: string;
    company: string;
  };
}

export default function ResumesDashboard() {
  const router = useRouter();
  
  // State for resume upload
  const [file, setFile] = useState<File | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // State for resumes display
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resumesRes, jobsRes] = await Promise.all([
        fetch("/api/resumes"),
        fetch("/api/jobs")
      ]);

      if (resumesRes.ok) {
        const resumesData = await resumesRes.json();
        setResumes(resumesData);
      }

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  // File handling
  const handleFileChange = (selectedFile: File | null) => {
    setUploadError(null);
    setUploadSuccess(null);
    
    if (selectedFile) {
      if (!selectedFile.type.includes("pdf")) {
        setUploadError("Please select a PDF file.");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        setUploadError("File size must be less than 10MB.");
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
      setUploadError("Please select a file first.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

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
        setUploadError(data.error || "Upload failed.");
        return;
      }

      setUploadSuccess(`Resume uploaded successfully! Extracted ${data.extractedLength} characters of text.`);
      setFile(null);
      setSelectedJobId("");
      fetchData(); // Refresh the resumes list
    } catch (err) {
      setUploadError("Unexpected error during upload.");
    } finally {
      setUploading(false);
    }
  };

  // Resume actions
  const handleAnalyzeResume = (resumeId: string, jobId?: string) => {
    // Navigate to matches page with pre-selected resume and job
    const params = new URLSearchParams();
    params.set('resume', resumeId);
    if (jobId) params.set('job', jobId);
    
    router.push(`/dashboard/matches?${params.toString()}`);
  };

  // Filter resumes based on search
  const filteredResumes = resumes.filter(resume => 
    (resume.filename || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (resume.job?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (resume.job?.company || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-header text-text-light dark:text-text-dark mb-2">
          Resumes Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 font-body">
          Upload and manage your resume versions
        </p>
      </div>

      {/* Upload Resume Section */}
      <Card className="mb-8 bg-surface-light dark:bg-surface-dark">
        <CardHeader>
          <CardTitle className="font-header flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Upload New Resume</span>
          </CardTitle>
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
            disabled={uploading || !file}
            className="w-full bg-brand-light dark:bg-brand-dark text-white hover:bg-brand-light/75 dark:hover:bg-brand-dark/75"
          >
            {uploading ? (
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
          {uploadError && (
            <div className="p-4 text-red-600 border border-red-400 rounded bg-red-50 dark:bg-red-950 dark:text-red-400 font-body">
              {uploadError}
            </div>
          )}

          {uploadSuccess && (
            <div className="p-4 text-green-600 border border-green-400 rounded bg-green-50 dark:bg-green-950 dark:text-green-400 font-body">
              <CheckCircle className="w-5 h-5 inline mr-2" />
              {uploadSuccess}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumes List Section */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search resumes..."
            className="pl-9 dark:bg-surface-dark bg-surface-light"
          />
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 font-body">
          {filteredResumes.length} of {resumes.length} resumes
        </div>
      </div>

      {/* Resumes Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-brand-light dark:text-brand-dark" />
        </div>
      ) : filteredResumes.length === 0 ? (
        <Card className="bg-surface-light dark:bg-surface-dark">
          <CardContent className="py-12 text-center">
            <div className="text-gray-500 dark:text-gray-400 font-body">
              {resumes.length === 0 ? (
                <>
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No resumes yet</p>
                  <p>Upload your first resume using the form above</p>
                </>
              ) : (
                <>
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No resumes found</p>
                  <p>Try adjusting your search terms</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume) => (
            <ResumeCard 
              key={resume.id} 
              resume={resume}
              onDelete={(resumeId) => {
                // TODO: Implement delete functionality
                console.log("Delete resume:", resumeId);
              }}
              onView={(resumeId) => {
                // TODO: Implement view content functionality
                console.log("View resume:", resumeId);
              }}
              onAnalyze={handleAnalyzeResume}
            />
          ))}
        </div>
      )}
    </div>
  );
}