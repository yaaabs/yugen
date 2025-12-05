import React, { useState, useEffect } from "react";
import {
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import { ProjectSubmission } from "../../types";
import {
  formatDate,
  getStatusColor,
  getStatusProgress,
} from "../../utils/helpers";
import { ProjectListSkeleton } from "../UI/Skeleton";
import { useClientAuth } from "../../contexts/ClientAuthContext";
import { supabase } from "../../lib/supabase";

export const StatusTracker: React.FC = () => {
  const { user } = useClientAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<ProjectSubmission[]>([]);
  const [selectedProject, setSelectedProject] =
    useState<ProjectSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper: produce long ("September 20") and short ("Sep 20") date strings.
  // Return a simple placeholder '-' when the date is missing to avoid showing current date.
  const toDateObj = (d: Date | string | undefined): Date | null => {
    if (!d) return null;
    return d instanceof Date ? d : new Date(d);
  };
  const formatDateLongMonth = (d: Date | string | undefined) => {
    const dt = toDateObj(d);
    if (!dt || Number.isNaN(dt.getTime())) return "-";
    return dt.toLocaleDateString(undefined, { month: "long", day: "numeric" });
  };
  const formatDateShortMonth = (d: Date | string | undefined) => {
    const dt = toDateObj(d);
    if (!dt || Number.isNaN(dt.getTime())) return "-";
    return dt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        if (!user || !user.id) {
          setProjects([]);
          setIsLoading(false);
          return;
        }
        // supabase is now imported at the top
        const { data, error } = await supabase
          .from("dph_projects")
          .select("*")
          .eq("client_id", user.id)
          .order("created_at", { ascending: false });
        if (error) {
          setProjects([]);
          setIsLoading(false);
          return;
        }
        const convertedProjects: ProjectSubmission[] = (data || []).map(
          (dbProject: any) => ({
            id: dbProject.id,
            companyName: dbProject.company_name,
            contactEmail: dbProject.contact_email,
            contactPhone: dbProject.contact_phone || undefined,
            projectType: dbProject.project_type as any,
            description: dbProject.description,
            timeline: dbProject.timeline,
            budgetRange: dbProject.budget_range as any,
            files: [], // TODO: Handle files properly
            status: dbProject.status as any,
            adminNotes: dbProject.admin_notes || undefined,
            submittedAt: new Date(dbProject.created_at),
            lastUpdated: new Date(dbProject.updated_at),
          }),
        );
        setProjects(convertedProjects);
      } catch (error) {
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadProjects();
  }, [user]);

  const filteredProjects = projects.filter(
    (project) =>
      project.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.id.toString().includes(searchTerm),
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="inline-block w-4 h-4 text-yellow-500" />;
      case "Completed":
        return <CheckCircle className="inline-block w-4 h-4 text-green-500" />;
      case "Error":
        return <AlertCircle className="inline-block w-4 h-4 text-red-500" />;
      default:
        return <Clock className="inline-block w-4 h-4 text-gray-400" />;
    }
  };

  const renderProjectCard = (project: ProjectSubmission) => (
    <div
      key={project.id}
      className="card cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => setSelectedProject(project)}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
          <div
            className={`status-badge ${getStatusColor(project.status)} text-xs px-2 py-1 rounded flex items-center w-fit max-w-full`}
          >
            {getStatusIcon(project.status)}
            <span className="ml-1 break-words">{project.status}</span>
          </div>
          <span className="text-xs text-gray-500 mt-1 sm:ml-4 sm:mt-0 break-all">
            ID: {project.id}
          </span>
        </div>
      </div>
      <h2 className="font-semibold text-lg text-gray-900 mb-1">
        {project.companyName}
      </h2>
      <p className="text-sm text-gray-600 mb-2">{project.contactEmail}</p>
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-gray-700">Project Type</p>
          <p className="text-sm text-gray-600">{project.projectType}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Timeline</p>
          <p className="text-sm text-gray-600">{project.timeline}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Progress</p>
          <div className="progress-bar h-2">
            <div
              className="progress-fill"
              style={{ width: `${getStatusProgress(project.status)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {getStatusProgress(project.status)}% Complete
          </p>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>
            Submitted:{" "}
            <span className="hidden sm:inline">
              {formatDateLongMonth(project.submittedAt)}
            </span>
            <span className="inline sm:hidden">
              {formatDateShortMonth(project.submittedAt)}
            </span>
          </span>
          <span>
            Updated:{" "}
            <span className="hidden sm:inline">
              {formatDateLongMonth(project.lastUpdated)}
            </span>
            <span className="inline sm:hidden">
              {formatDateShortMonth(project.lastUpdated)}
            </span>
          </span>
        </div>
      </div>
    </div>
  );

  const renderProjectDetails = (project: ProjectSubmission) => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={() => setSelectedProject(null)}
          className="text-primary-600 hover:text-primary-700 font-medium text-sm sm:text-base self-start"
        >
          ← Back to Projects
        </button>
        <div
          className={`status-badge ${getStatusColor(project.status)} text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2 self-start sm:self-center`}
        >
          {getStatusIcon(project.status)}
          <span className="ml-2">{project.status}</span>
        </div>
      </div>
      <div className="card">
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {project.companyName}
          </h1>
          <p className="text-gray-600">Project ID: {project.id}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Contact Information
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-gray-500">Email:</span>{" "}
                  {project.contactEmail}
                </p>
                {project.contactPhone && (
                  <p>
                    <span className="text-gray-500">Phone:</span>{" "}
                    {project.contactPhone}
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Project Details
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-gray-500">Type:</span>{" "}
                  {project.projectType}
                </p>
                <p>
                  <span className="text-gray-500">Timeline:</span>{" "}
                  {project.timeline}
                </p>
                <p>
                  <span className="text-gray-500">Budget:</span>{" "}
                  {project.budgetRange}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Timeline</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-gray-500">Submitted:</span>{" "}
                  {formatDate(project.submittedAt)}
                </p>
                <p>
                  <span className="text-gray-500">Last Updated:</span>{" "}
                  {formatDate(project.lastUpdated)}
                </p>
                {project.estimatedCompletion && (
                  <p>
                    <span className="text-gray-500">Estimated Completion:</span>{" "}
                    {formatDate(project.estimatedCompletion)}
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Progress</h3>
              <div className="progress-bar h-3 mb-2">
                <div
                  className="progress-fill"
                  style={{ width: `${getStatusProgress(project.status)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {getStatusProgress(project.status)}% Complete
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">
            Project Description
          </h3>
          <p className="text-gray-700 leading-relaxed">{project.description}</p>
        </div>
        {project.files.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Attached Files</h3>
            <div className="space-y-2">
              {project.files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • Uploaded{" "}
                      {formatDate(file.uploadedAt).split(",")[0]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {project.adminNotes && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Project Notes</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">{project.adminNotes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (selectedProject) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderProjectDetails(selectedProject)}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Track Your Project
        </h1>
        <p className="text-gray-600">
          Monitor the progress of your sustainability projects
        </p>
      </div>
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by company name, email, or project ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {isLoading ? (
          <div className="col-span-full">
            <ProjectListSkeleton count={6} />
          </div>
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map(renderProjectCard)
        ) : (
          <div className="col-span-full text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Projects Found
            </h3>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
