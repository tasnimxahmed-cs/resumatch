"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  FileText, 
  Building2, 
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Brain,
  Loader2
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  summary?: string;
}

interface Resume {
  id: string;
  filename?: string;
  createdAt: string;
}

interface MatchAnalysis {
  matchScore: number;
  analysis: {
    score: number;
    strengths: string[];
    gaps: string[];
    suggestions: string[];
    keywordMatches: {
      matched: string[];
      missing: string[];
    };
  };
  resumeFilename?: string;
  jobTitle: string;
}

export default function MatchesPage() {
  const searchParams = useSearchParams();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [selectedResume, setSelectedResume] = useState<string>("");
  const [matchResult, setMatchResult] = useState<MatchAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch jobs and resumes on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [jobsRes, resumesRes] = await Promise.all([
          fetch("/api/jobs"),
          fetch("/api/resumes")
        ]);

        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          setJobs(jobsData);
        }

        if (resumesRes.ok) {
          const resumesData = await resumesRes.json();
          setResumes(resumesData);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    }
    fetchData();
  }, []);

  // Handle URL parameters for pre-selection
  useEffect(() => {
    const resumeParam = searchParams.get('resume');
    const jobParam = searchParams.get('job');
    
    if (resumeParam) setSelectedResume(resumeParam);
    if (jobParam) setSelectedJob(jobParam);
  }, [searchParams]);

  const analyzeMatch = async () => {
    if (!selectedJob || !selectedResume) {
      setError("Please select both a job and a resume.");
      return;
    }

    setLoading(true);
    setError(null);
    setMatchResult(null);

    try {
      const res = await fetch("/api/analyze-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: selectedJob,
          resumeId: selectedResume
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Analysis failed.");
        return;
      }

      setMatchResult(data);
    } catch (err) {
      setError("Unexpected error during analysis.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent Match";
    if (score >= 80) return "Good Match";
    if (score >= 70) return "Decent Match";
    if (score >= 60) return "Fair Match";
    return "Poor Match";
  };

  return (
    <div className="max-w-6xl px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-header text-text-light dark:text-text-dark mb-2">
          Resume-Job Matching
        </h1>
        <p className="text-gray-600 dark:text-gray-400 font-body">
          Analyze how well your resumes match specific job requirements
        </p>
      </div>
      
      {/* Selection Section */}
      <Card className="mb-6 bg-surface-light dark:bg-surface-dark">
        <CardHeader>
          <CardTitle className="font-header">Analyze Match</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium font-body">Select Job</label>
              <Select value={selectedJob} onValueChange={setSelectedJob}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a job posting" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4" />
                        <span>{job.title} @ {job.company}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium font-body">Select Resume</label>
              <Select value={selectedResume} onValueChange={setSelectedResume}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a resume version" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map((resume) => (
                    <SelectItem key={resume.id} value={resume.id}>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>{resume.filename || `Resume ${resume.id.slice(-8)}`}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={analyzeMatch}
            disabled={loading || !selectedJob || !selectedResume}
            className="w-full bg-brand-light dark:bg-brand-dark text-white hover:bg-brand-light/75 dark:hover:bg-brand-dark/75"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Match...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Analyze Match
              </>
            )}
          </Button>

          {error && (
            <div className="mt-4 p-4 text-red-600 border border-red-400 rounded bg-red-50 dark:bg-red-950 dark:text-red-400 font-body">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {matchResult && (
        <div className="space-y-6">
          {/* Score Overview */}
          <Card className="bg-surface-light dark:bg-surface-dark">
            <CardHeader>
              <CardTitle className="font-header flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Match Score</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className={`text-3xl font-bold font-header ${getScoreColor(matchResult.matchScore)}`}>
                    {matchResult.matchScore}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-body">
                    {getScoreLabel(matchResult.matchScore)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium font-body mb-1">
                    {matchResult.resumeFilename || "Resume"} → {matchResult.jobTitle}
                  </div>
                  <Progress value={matchResult.matchScore} className="w-32" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger className="cursor-pointer" value="overview">Overview</TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="strengths">Strengths</TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="gaps">Gaps</TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="keywords">Keywords</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card className="bg-surface-light dark:bg-surface-dark">
                <CardHeader>
                  <CardTitle className="font-header flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5" />
                    <span>AI Suggestions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {matchResult.analysis.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                            {index + 1}
                          </span>
                        </div>
                        <p className="text-sm font-body text-gray-700 dark:text-gray-300">
                          {suggestion}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="strengths" className="space-y-4">
              <Card className="bg-surface-light dark:bg-surface-dark">
                <CardHeader>
                  <CardTitle className="font-header flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Your Strengths</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {matchResult.analysis.strengths.map((strength, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
                        <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-body text-gray-700 dark:text-gray-300">
                          {strength}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gaps" className="space-y-4">
              <Card className="bg-surface-light dark:bg-surface-dark">
                <CardHeader>
                  <CardTitle className="font-header flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <span>Areas to Improve</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {matchResult.analysis.gaps.map((gap, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30">
                        <TrendingDown className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-body text-gray-700 dark:text-gray-300">
                          {gap}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="keywords" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-surface-light dark:bg-surface-dark">
                  <CardHeader>
                    <CardTitle className="font-header flex items-center space-x-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span>Matched Keywords</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {matchResult.analysis.keywordMatches.matched.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-surface-light dark:bg-surface-dark">
                  <CardHeader>
                    <CardTitle className="font-header flex items-center space-x-2 text-red-600 dark:text-red-400">
                      <AlertCircle className="w-5 h-5" />
                      <span>Missing Keywords</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {matchResult.analysis.keywordMatches.missing.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="border-red-300 dark:border-red-700 text-red-700 dark:text-red-300">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}