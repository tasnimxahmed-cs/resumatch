// components/ResumeCard.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Calendar, 
  Building2,
  MoreHorizontal,
  Download,
  Trash2,
  Eye,
  Target,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Resume } from "@/types/resume"

interface ResumeCardProps {
  resume: Resume;
  onDelete?: (resumeId: string) => void; // Made optional
  onView?: (resumeId: string) => void; // Made optional
  onAnalyze?: (resumeId: string, jobId?: string) => void; // Made optional
  onDeleteClick?: (resumeId: string, resumeName: string) => void; // For modal trigger
  deleting?: boolean; // Optional prop to show loading state
}

export default function ResumeCard({ 
  resume, 
  onDelete, 
  onView, 
  onAnalyze,
  onDeleteClick, 
  deleting = false 
}: ResumeCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(resume.id);
    } catch (error) {
      console.error("Failed to delete resume:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/resumes/${resume.id}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = resume.filename || `resume-${resume.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDisplayName = () => {
    return resume.filename || `Resume ${resume.id.slice(-8)}`;
  };

  // Use the deleting prop from parent or local state
  const showDeleting = deleting || isDeleting;

  return (
    <Card className="bg-surface-light dark:bg-surface-dark hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold font-header text-text-light dark:text-text-dark mb-1 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-brand-light dark:text-brand-dark" />
              {getDisplayName()}
            </CardTitle>
            
            {resume.job && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 font-body">
                <Building2 className="w-4 h-4 mr-1" />
                {resume.job.title} @ {resume.job.company}
              </div>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={showDeleting}>
                {showDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MoreHorizontal className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(resume.id)} disabled={showDeleting}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Content
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleDownload} disabled={showDeleting}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </DropdownMenuItem>
              {onAnalyze && (
                <DropdownMenuItem 
                  onClick={() => onAnalyze(resume.id, resume.job?.id)} 
                  disabled={showDeleting}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Analyze Match
                </DropdownMenuItem>
              )}
              {(onDelete || onDeleteClick) && (
                <DropdownMenuItem 
                  onClick={() => {
                    if (onDeleteClick) {
                      onDeleteClick(resume.id, getDisplayName());
                    } else if (onDelete) {
                      handleDelete();
                    }
                  }}
                  disabled={showDeleting}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {showDeleting ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-500 font-body">
              <Calendar className="w-3 h-3 mr-1" />
              Uploaded {formatDate(resume.createdAt)}
            </div>
            
            <div className="flex gap-2">
              {resume.job ? (
                <Badge variant="secondary" className="text-xs bg-brand-light/10 dark:bg-brand-dark/10 text-brand-light dark:text-brand-dark">
                  Job-Specific
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  General
                </Badge>
              )}
            </div>
          </div>

          {onAnalyze && (
            <Button
              onClick={() => onAnalyze(resume.id, resume.job?.id)}
              variant="outline"
              size="sm"
              className="w-full text-xs"
              disabled={showDeleting}
            >
              <Target className="w-3 h-3 mr-1" />
              Quick Analyze
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}