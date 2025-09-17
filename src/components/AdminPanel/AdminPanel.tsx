import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
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
  Mail
} from 'lucide-react';
import { ProjectSubmission, ProjectStatus } from '../../types';
import { 
  getFromLocalStorage, 
  saveToLocalStorage, 
  formatDate, 
  getStatusColor, 
  createNotification 
} from '../../utils/helpers';
import { mockProjects, projectStatuses } from '../../data/mockData';
import usePageTitle from '../../hooks/usePageTitle';
import { AdminStatsSkeleton, ProjectListSkeleton } from '../UI/Skeleton';

const AdminPanel: React.FC = () => {
  // Set dynamic page title
  usePageTitle('Admin Dashboard', 'Manage Client Projects & Communications');
  
  const [projects, setProjects] = useState<ProjectSubmission[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectSubmission | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStatus, setEditingStatus] = useState<ProjectStatus>('Submitted');
  const [adminNotes, setAdminNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      // Simulate loading delay for better UX demo
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Load projects from localStorage and combine with mock data
      const savedProjects = getFromLocalStorage<ProjectSubmission[]>('projectSubmissions') || [];
      const allProjects = [...mockProjects, ...savedProjects];
      setProjects(allProjects);
      setFilteredProjects(allProjects);
      setIsLoading(false);
    };

    loadProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.projectType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter]);

  const updateProjectStatus = (projectId: string, newStatus: ProjectStatus, notes?: string) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        const updatedProject = {
          ...project,
          status: newStatus,
          lastUpdated: new Date(),
          adminNotes: notes || project.adminNotes
        };

        // Create notification
        const notification = createNotification(
          'status_change',
          projectId,
          `Project status updated to ${newStatus} for ${project.companyName}`
        );

        // Log notification
        console.log('📧 Email notification sent to:', project.contactEmail);
        console.log('📧 Status change notification:', notification.message);
        
        toast.success(`Project status updated to ${newStatus}`);
        
        return updatedProject;
      }
      return project;
    });

    setProjects(updatedProjects);
    
    // Save to localStorage
    const savedProjects = updatedProjects.filter(p => !mockProjects.some(mp => mp.id === p.id));
    saveToLocalStorage('projectSubmissions', savedProjects);
  };

  const handleStatusUpdate = () => {
    if (selectedProject) {
      updateProjectStatus(selectedProject.id, editingStatus, adminNotes);
      setSelectedProject({
        ...selectedProject,
        status: editingStatus,
        adminNotes: adminNotes,
        lastUpdated: new Date()
      });
      setIsEditing(false);
    }
  };

  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-primary-600" />;
      case 'In Progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'Pending Client Feedback':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusStats = () => {
    const stats = projectStatuses.map(status => ({
      status,
      count: projects.filter(p => p.status === status).length
    }));
    
    return stats;
  };

  const sendTestNotification = (project: ProjectSubmission) => {
    console.log('📧 Test email sent to:', project.contactEmail);
    console.log('📧 Subject: Project Update - ' + project.companyName);
    console.log('📧 Content: Thank you for your project submission. We will review and get back to you soon.');
    toast.success('Test notification sent successfully');
  };

  if (selectedProject) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedProject(null);
              setIsEditing(false);
            }}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Dashboard
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => sendTestNotification(selectedProject)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span>Send Notification</span>
            </button>
            
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                setEditingStatus(selectedProject.status);
                setAdminNotes(selectedProject.adminNotes || '');
              }}
              className="btn-primary flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Project'}</span>
            </button>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedProject.companyName}</h1>
              <p className="text-gray-600">ID: {selectedProject.id}</p>
            </div>
            
            {isEditing ? (
              <div className="flex items-center space-x-3">
                <select
                  value={editingStatus}
                  onChange={(e) => setEditingStatus(e.target.value as ProjectStatus)}
                  className="input-field w-48"
                >
                  {projectStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <button onClick={handleStatusUpdate} className="btn-primary">
                  Update
                </button>
              </div>
            ) : (
              <div className={`status-badge ${getStatusColor(selectedProject.status)} text-base px-4 py-2`}>
                {getStatusIcon(selectedProject.status)}
                <span className="ml-2">{selectedProject.status}</span>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-500">Email:</span> {selectedProject.contactEmail}</p>
                  {selectedProject.contactPhone && (
                    <p><span className="text-gray-500">Phone:</span> {selectedProject.contactPhone}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Project Details</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-500">Type:</span> {selectedProject.projectType}</p>
                  <p><span className="text-gray-500">Timeline:</span> {selectedProject.timeline}</p>
                  <p><span className="text-gray-500">Budget:</span> {selectedProject.budgetRange}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Timeline</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-500">Submitted:</span> {formatDate(selectedProject.submittedAt)}</p>
                  <p><span className="text-gray-500">Last Updated:</span> {formatDate(selectedProject.lastUpdated)}</p>
                </div>
              </div>

              {selectedProject.files.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Files ({selectedProject.files.length})</h3>
                  <div className="space-y-1">
                    {selectedProject.files.map(file => (
                      <div key={file.id} className="text-sm text-gray-600 flex items-center space-x-2">
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
            <h3 className="font-semibold text-gray-900 mb-3">Project Description</h3>
            <p className="text-gray-700 leading-relaxed">{selectedProject.description}</p>
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
                <p className="text-gray-700">
                  {selectedProject.adminNotes || 'No admin notes yet.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage client project submissions and track progress</p>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <AdminStatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <Users className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{projects.length}</div>
            <div className="text-sm text-gray-600">Total Projects</div>
          </div>
          
          {getStatusStats().slice(0, 3).map(({ status, count }) => (
            <div key={status} className="card text-center">
              {getStatusIcon(status)}
              <div className="text-2xl font-bold text-gray-900 mt-2">{count}</div>
              <div className="text-sm text-gray-600">{status}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
              className="input-field w-48"
            >
              <option value="all">All Statuses</option>
              {projectStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="card p-0">
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Company</th>
                <th className="table-header-cell">Project Type</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Submitted</th>
                <th className="table-header-cell">Budget</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-0">
                    <ProjectListSkeleton count={4} />
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                <tr key={project.id} className="table-row">
                  <td className="table-cell max-w-sm">
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 line-clamp-2 leading-tight" title={project.companyName}>
                        {project.companyName}
                      </div>
                      <div className="text-sm text-gray-500 truncate mt-1" title={project.contactEmail}>
                        {project.contactEmail}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell whitespace-nowrap">
                    <span className="text-sm text-gray-900">{project.projectType}</span>
                  </td>
                  <td className="table-cell whitespace-nowrap">
                    <span className={`status-badge ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="table-cell whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {formatDate(project.submittedAt).split(',')[0]}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className="text-sm text-gray-900">{project.budgetRange}</span>
                  </td>
                  <td className="table-cell">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="text-primary-600 hover:text-primary-700 p-1"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'No projects match your current filters.' 
                : 'No projects have been submitted yet.'}
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