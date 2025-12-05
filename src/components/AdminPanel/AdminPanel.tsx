import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Search,
  Filter,
  Edit,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Users,
  BarChart3,
  Mail,
  LogOut,
  Shield,
} from "lucide-react";
import { ProjectSubmission, ProjectStatus } from "../../types";
import {
  getFromLocalStorage,
  formatDate,
  getStatusColor,
} from "../../utils/helpers";
import { mockProjects, projectStatuses } from "../../data/mockData";
import usePageTitle from "../../hooks/usePageTitle";
import { AdminStatsSkeleton, ProjectListSkeleton } from "../UI/Skeleton";
import useSupabase from "../../hooks/useSupabase";
import { useAuth } from "../../contexts/AuthContext";

const AdminPanel: React.FC = () => {
  // Set dynamic page title
  usePageTitle("Admin Dashboard", "Manage Client Projects & Communications");

  // Authentication
  const { user, logout } = useAuth();

  // Database hook
  const { projects: projectsHook } = useSupabase();

  const [projects, setProjects] = useState<ProjectSubmission[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectSubmission[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">(
    "all",
  );
  const [selectedProject, setSelectedProject] =
    useState<ProjectSubmission | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStatus, setEditingStatus] =
    useState<ProjectStatus>("Submitted");
  const [adminNotes, setAdminNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      console.log("👨‍💼 AdminPanel: Loading projects from database...");
      setIsLoading(true);

      try {
        // Load projects from database
        const dbProjects = await projectsHook.getAll();
        console.log(
          "👨‍💼 AdminPanel: Loaded",
          dbProjects?.length || 0,
          "projects from database",
        );

        if (Array.isArray(dbProjects)) {
          // Convert database format to UI format
          const convertedProjects: ProjectSubmission[] = dbProjects.map(
            (dbProject) => ({
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

          // Also load from localStorage for backward compatibility
          const savedProjects =
            getFromLocalStorage<ProjectSubmission[]>("projectSubmissions") ||
            [];

          // Combine database projects with localStorage projects (avoiding duplicates)
          const allProjects = [...convertedProjects];
          savedProjects.forEach((savedProject) => {
            if (!allProjects.find((p) => p.id === savedProject.id)) {
              allProjects.push(savedProject);
            }
          });

          console.log("👨‍💼 AdminPanel: Total projects:", allProjects.length);
          setProjects(allProjects);
          setFilteredProjects(allProjects);
        } else {
          console.error(
            "👨‍💼 AdminPanel: Expected array but got:",
            typeof dbProjects,
          );
          // Fallback to localStorage and mock data
          const savedProjects =
            getFromLocalStorage<ProjectSubmission[]>("projectSubmissions") ||
            [];
          const fallbackProjects = [...mockProjects, ...savedProjects];
          setProjects(fallbackProjects);
          setFilteredProjects(fallbackProjects);
        }
      } catch (error) {
        console.error("👨‍💼 AdminPanel: Error loading projects:", error);
        toast.error("Failed to load projects from database. Using local data.");
        // Fallback to localStorage and mock data
        const savedProjects =
          getFromLocalStorage<ProjectSubmission[]>("projectSubmissions") || [];
        const fallbackProjects = [...mockProjects, ...savedProjects];
        setProjects(fallbackProjects);
        setFilteredProjects(fallbackProjects);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []); // Remove the problematic dependencies that cause infinite loop

  useEffect(() => {
    let filtered = projects;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.companyName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          project.contactEmail
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          project.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.projectType.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter]);

  const handleStatusUpdate = async () => {
    if (selectedProject) {
      try {
        console.log("🔄 Updating project status and notes in Supabase...");
        // Only send status and admin_notes fields
        const updateFields: any = { status: editingStatus };
        if (typeof adminNotes !== "undefined") {
          updateFields.admin_notes = adminNotes;
        }
        let updatedProject = await projectsHook.update(
          selectedProject.id,
          updateFields,
        );
        if (updatedProject) {
          setSelectedProject({
            ...selectedProject,
            status: editingStatus as any,
            adminNotes: adminNotes,
            lastUpdated: new Date(),
          });
          setProjects((prevProjects) =>
            prevProjects.map((p) =>
              p.id === selectedProject.id
                ? {
                    ...p,
                    status: editingStatus,
                    adminNotes: adminNotes,
                    lastUpdated: new Date(),
                  }
                : p,
            ),
          );
          toast.success(`Project status updated to \"${editingStatus}\"`);
          console.log("✅ Project status updated in Supabase and UI.");
        } else {
          throw new Error("Failed to update project in database");
        }
        setIsEditing(false);
      } catch (error) {
        console.error("❌ Error updating project:", error);
        toast.error("Failed to update project. Please try again.");
        setIsEditing(false);
      }
    }
  };

  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-primary-600" />;
      case "In Progress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "Pending Client Feedback":
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusStats = () => {
    const stats = projectStatuses.map((status) => ({
      status,
      count: projects.filter((p) => p.status === status).length,
    }));

    return stats;
  };

  const sendTestNotification = (project: ProjectSubmission) => {
    console.log("📧 Test email sent to:", project.contactEmail);
    console.log("📧 Subject: Project Update - " + project.companyName);
    console.log(
      "📧 Content: Thank you for your project submission. We will review and get back to you soon.",
    );
    toast.success("Test notification sent successfully");
  };

  if (selectedProject) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Navigation - Fully Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Back Button */}
          <button
            onClick={() => {
              setSelectedProject(null);
              setIsEditing(false);
            }}
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1 text-sm sm:text-base"
          >
            <span>← Back to Dashboard</span>
          </button>

          {/* Action Buttons - Stack on mobile, inline on tablet+ */}
          <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
            <button
              onClick={() => sendTestNotification(selectedProject)}
              className="btn-secondary flex items-center justify-center space-x-2 w-full xs:w-auto text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden xs:inline">Send Notification</span>
              <span className="xs:hidden">Notify</span>
            </button>

            <button
              onClick={() => {
                setIsEditing(!isEditing);
                setEditingStatus(selectedProject.status);
                setAdminNotes(selectedProject.adminNotes || "");
              }}
              className="btn-primary flex items-center justify-center space-x-2 w-full xs:w-auto text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden xs:inline">
                {isEditing ? "Cancel Edit" : "Edit Project"}
              </span>
              <span className="xs:hidden">{isEditing ? "Cancel" : "Edit"}</span>
            </button>
          </div>
        </div>

        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4 mb-6">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {selectedProject.companyName}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 truncate">
                ID: {selectedProject.id}
              </p>
            </div>

            {isEditing ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <select
                  value={editingStatus}
                  onChange={(e) =>
                    setEditingStatus(e.target.value as ProjectStatus)
                  }
                  className="input-field min-w-[220px] whitespace-normal"
                  style={{ minWidth: "220px", whiteSpace: "normal" }}
                >
                  {projectStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleStatusUpdate}
                  className="btn-primary w-full sm:w-auto px-4 py-2 text-sm sm:text-base whitespace-nowrap"
                >
                  Update Project
                </button>
              </div>
            ) : (
              <div
                className={`status-badge ${getStatusColor(selectedProject.status)} text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 w-full sm:w-auto justify-center sm:justify-start`}
              >
                {getStatusIcon(selectedProject.status)}
                <span className="ml-2">{selectedProject.status}</span>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Contact Information
                </h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-gray-500">Email:</span>{" "}
                    {selectedProject.contactEmail}
                  </p>
                  {selectedProject.contactPhone && (
                    <p>
                      <span className="text-gray-500">Phone:</span>{" "}
                      {selectedProject.contactPhone}
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
                    {selectedProject.projectType}
                  </p>
                  <p>
                    <span className="text-gray-500">Timeline:</span>{" "}
                    {selectedProject.timeline}
                  </p>
                  <p>
                    <span className="text-gray-500">Budget:</span>{" "}
                    {selectedProject.budgetRange}
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
                    {formatDate(selectedProject.submittedAt)}
                  </p>
                  <p>
                    <span className="text-gray-500">Last Updated:</span>{" "}
                    {formatDate(selectedProject.lastUpdated)}
                  </p>
                </div>
              </div>

              {selectedProject.files.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Files ({selectedProject.files.length})
                  </h3>
                  <div className="space-y-1">
                    {selectedProject.files.map((file) => (
                      <div
                        key={file.id}
                        className="text-sm text-gray-600 flex items-center space-x-2"
                      >
                        <FileText className="w-3 h-3" />
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">
              Project Description
            </h3>
            <div className="bg-gray-50 border rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed break-words hyphens-auto whitespace-pre-wrap text-content">
                {selectedProject.description || "No description provided."}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Admin Notes</h3>
            {isEditing ? (
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="input-field"
                rows={4}
                placeholder="Add internal notes about this project..."
              />
            ) : (
              <div className="bg-gray-50 border rounded-lg p-4">
                <p className="text-gray-700 break-words hyphens-auto whitespace-pre-wrap text-content">
                  {selectedProject.adminNotes || "No admin notes yet."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    toast.success("Logged out successfully");
    logout();
  };

  const handleEditProject = (project: ProjectSubmission) => {
    // Open the project in the detail view and enable edit mode immediately
    setSelectedProject(project);
    setIsEditing(true);
    setEditingStatus(project.status);
    setAdminNotes(project.adminNotes || "");
  };

  return (
    <div className="space-y-6">
      {/* Modern Admin Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Top Section - Admin Info Bar */}
        <div className="bg-gradient-to-r from-primary-600 to-blue-600 px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Admin Badge */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="text-white">
                <div className="text-sm font-medium">
                  {user?.username || "Admin"}
                </div>
                <div className="text-xs text-white/80">{user?.email}</div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Logout from admin dashboard"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Header Content */}
        <div className="px-4 sm:px-6 py-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage client project submissions and track progress
            </p>
          </div>
        </div>
      </div>

      {/* Modern Stats Cards */}
      {isLoading ? (
        <AdminStatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Total Projects Card */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {projects.length}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium">
                  Total
                </div>
              </div>
            </div>
            <div className="text-sm sm:text-base font-medium text-gray-700">
              Total Projects
            </div>
          </div>

          {getStatusStats()
            .slice(0, 3)
            .map(({ status, count }, index) => {
              const colors = [
                {
                  bg: "bg-blue-100",
                  text: "text-blue-600",
                  icon: "text-blue-600",
                },
                {
                  bg: "bg-amber-100",
                  text: "text-amber-600",
                  icon: "text-amber-600",
                },
                {
                  bg: "bg-green-100",
                  text: "text-green-600",
                  icon: "text-green-600",
                },
              ];
              const colorScheme = colors[index] || colors[0];

              return (
                <div
                  key={status}
                  className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 ${colorScheme.bg} rounded-lg flex items-center justify-center`}
                    >
                      <div
                        className={`${colorScheme.icon} [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6`}
                      >
                        {getStatusIcon(status)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {count}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 font-medium">
                        Projects
                      </div>
                    </div>
                  </div>
                  <div className="text-sm sm:text-base font-medium text-gray-700">
                    {status}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Modern Search and Filter Section */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by company, email, or project ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all duration-200"
              />
            </div>
          </div>

          {/* Filter Dropdown */}
          <div className="sm:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as ProjectStatus | "all")
                }
                className="w-full pl-12 pr-10 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                {projectStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Showing{" "}
              <span className="font-medium text-gray-900">
                {filteredProjects.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-900">
                {projects.length}
              </span>{" "}
              projects
            </span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modern Projects Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <ProjectListSkeleton count={4} />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Project Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Budget
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProjects.map((project) => (
                      <tr
                        key={project.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="min-w-0">
                            <div
                              className="font-medium text-gray-900 truncate"
                              title={project.companyName}
                            >
                              {project.companyName}
                            </div>
                            <div
                              className="text-sm text-gray-500 truncate mt-1"
                              title={project.contactEmail}
                            >
                              {project.contactEmail}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {project.projectType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}
                          >
                            {project.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {formatDate(project.submittedAt).split(",")[0]}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {project.budgetRange}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => setSelectedProject(project)}
                              className="inline-flex items-center p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditProject(project)}
                              className="inline-flex items-center p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg transition-colors"
                              title="Edit Project"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View - Optimized for Touch */}
            <div className="lg:hidden divide-y divide-gray-100">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="space-y-4">
                    {/* Header with company name and action button */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                          {project.companyName}
                        </h3>
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {project.contactEmail}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedProject(project)}
                        className="ml-4 p-3 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-colors flex-shrink-0 touch-manipulation"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Project details in a more readable layout */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="space-y-1">
                        <span className="text-gray-500 text-xs uppercase tracking-wide">
                          Project Type
                        </span>
                        <div className="font-medium text-gray-900">
                          {project.projectType}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-gray-500 text-xs uppercase tracking-wide">
                          Budget
                        </span>
                        <div className="font-medium text-gray-900">
                          {project.budgetRange}
                        </div>
                      </div>
                    </div>

                    {/* Status and date in bottom row */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}
                      >
                        {project.status}
                      </span>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                          Submitted
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(project.submittedAt).split(",")[0]}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Projects Found
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "No projects match your current filters."
                : "No projects have been submitted yet."}
            </p>
          </div>
        )}
      </div>

      {filteredProjects.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
