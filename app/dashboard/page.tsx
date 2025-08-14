"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Search } from "lucide-react";
import JobCard from "@/components/JobCard";
import { EditJobModal } from "@/components/EditJobModal";
import { ViewJobModal } from "@/components/ViewJobModal";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";

interface Job {
  id: string;
  title: string;
  company: string;
  summary?: string;
  url?: string;
  createdAt: string;
}

export default function JobsDashboard() {
  // State for job import
  const [jobLink, setJobLink] = useState("");
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editableFields, setEditableFields] = useState({
    title: "",
    company: "",
    summary: "",
    expectations: "",
    qualifications: "",
    fullJD: "",
  });

  // State for jobs display
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // State for view modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // State for delete operation
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, name: string} | null>(null);

  // Fetch jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      if (res.ok) {
        const jobsData = await res.json();
        setJobs(jobsData);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Import job functionality
  const handleExtractJob = async () => {
    if (!jobLink.trim() || !jobLink.startsWith("http")) {
      setImportError("Please enter a valid job posting URL.");
      return;
    }

    setImporting(true);
    setImportError(null);

    try {
      const res = await fetch("/api/extract-job", {
        method: "POST",
        body: JSON.stringify({ jobLink }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        setImportError(data.error || "Failed to extract job information.");
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
    } catch (error) {
      setImportError("Unexpected error during job extraction.");
    } finally {
      setImporting(false);
    }
  };

  const handleSaveJob = async () => {
    setImporting(true);
    setImportError(null);
    
    try {
      const res = await fetch("/api/save-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editableFields,
          url: jobLink, // Save original URL
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setImportError(data.error || "Failed to save job.");
      } else {
        // Reset form and refresh jobs
        setJobLink("");
        setModalOpen(false);
        setEditableFields({
          title: "",
          company: "",
          summary: "",
          expectations: "",
          qualifications: "",
          fullJD: "",
        });
        fetchJobs(); // Refresh the jobs list
      }
    } catch (error) {
      setImportError("Unexpected error while saving job.");
    } finally {
      setImporting(false);
    }
  };

  const handleDiscardJob = () => {
    setModalOpen(false);
    setJobLink("");
    setEditableFields({
      title: "",
      company: "",
      summary: "",
      expectations: "",
      qualifications: "",
      fullJD: "",
    });
    setImportError(null);
  };

  // Delete job functionality with modal
  const handleDeleteClick = (jobId: string, jobName: string) => {
    setItemToDelete({ id: jobId, name: jobName });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    setDeletingJobId(itemToDelete.id);
    
    try {
      const res = await fetch(`/api/jobs/${itemToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete job.");
      }

      // Remove job from local state
      setJobs(jobs.filter(job => job.id !== itemToDelete.id));
      setItemToDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
      throw error; // Re-throw to keep modal open
    } finally {
      setDeletingJobId(null);
    }
  };

  // View job functionality
  const handleViewJob = (jobId: string) => {
    setSelectedJobId(jobId);
    setViewModalOpen(true);
  };

  // Filter jobs based on search
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-header text-text-light dark:text-text-dark mb-2">
          Jobs Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 font-body">
          Import new job postings and manage your job applications
        </p>
      </div>

      {/* Import Job Section */}
      <Card className="mb-8 bg-surface-light dark:bg-surface-dark">
        <CardHeader>
          <CardTitle className="font-header flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Import New Job</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              value={jobLink}
              onChange={(e) => setJobLink(e.target.value)}
              placeholder="Paste job posting URL (LinkedIn, Indeed, etc.)"
              className="flex-1 dark:bg-surface-dark bg-surface-light text-text-light dark:text-text-dark"
            />
            <Button
              onClick={handleExtractJob}
              disabled={importing || !jobLink.trim()}
              className="bg-brand-light dark:bg-brand-dark text-text-dark hover:bg-brand-light/75 dark:hover:bg-brand-dark/75"
            >
              {importing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Import Job"
              )}
            </Button>
          </div>

          {importError && (
            <div className="mt-4 p-4 text-red-600 border border-red-400 rounded bg-red-50 dark:bg-red-950 dark:text-red-400 font-body">
              {importError}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Jobs List Section */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search jobs..."
            className="pl-9 dark:bg-surface-dark bg-surface-light"
          />
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 font-body">
          {filteredJobs.length} of {jobs.length} jobs
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-brand-light dark:text-brand-dark" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card className="bg-surface-light dark:bg-surface-dark">
          <CardContent className="py-12 text-center">
            <div className="text-gray-500 dark:text-gray-400 font-body">
              {jobs.length === 0 ? (
                <>
                  <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No jobs yet</p>
                  <p>Import your first job posting using the form above</p>
                </>
              ) : (
                <>
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No jobs found</p>
                  <p>Try adjusting your search terms</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job}
              onDeleteClick={handleDeleteClick}
              onView={handleViewJob}
              deleting={deletingJobId === job.id}
            />
          ))}
        </div>
      )}

      {/* Edit Job Modal */}
      <EditJobModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editableFields={editableFields}
        onChange={setEditableFields}
        onSave={handleSaveJob}
        onDiscard={handleDiscardJob}
        loading={importing}
      />

      {/* View Job Modal */}
      <ViewJobModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        jobId={selectedJobId}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Job"
        description="Are you sure you want to delete this job? This action cannot be undone and will also remove any associated resumes and feedback."
        itemName={itemToDelete?.name || ""}
        onConfirm={handleDeleteConfirm}
        loading={deletingJobId === itemToDelete?.id}
      />
    </div>
  );
}