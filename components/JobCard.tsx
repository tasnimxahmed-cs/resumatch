"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Calendar, 
  ExternalLink, 
  MoreHorizontal,
  Eye,
  Trash2 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    summary?: string;
    url?: string;
    createdAt: string;
  };
  onDelete?: (jobId: string) => void;
  onView?: (jobId: string) => void;
}

export default function JobCard({ job, onDelete, onView }: JobCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(job.id);
    } catch (error) {
      console.error("Failed to delete job:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="bg-surface-light dark:bg-surface-dark hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold font-header text-text-light dark:text-text-dark mb-1">
              {job.title}
            </CardTitle>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 font-body">
              <Building2 className="w-4 h-4 mr-1" />
              {job.company}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(job.id)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
              )}
              {job.url && (
                <DropdownMenuItem asChild>
                  <a href={job.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Original Posting
                  </a>
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={handleDelete} 
                  disabled={isDeleting}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {job.summary && (
          <p className="text-sm text-gray-600 dark:text-gray-400 font-body mb-3 line-clamp-2">
            {job.summary}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-500 font-body">
            <Calendar className="w-3 h-3 mr-1" />
            Added {formatDate(job.createdAt)}
          </div>
          
          <Badge variant="secondary" className="text-xs">
            Active
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}