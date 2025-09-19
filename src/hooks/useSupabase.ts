import { useCallback, useState } from 'react';
import { supabase } from '../lib/supabase';

// Simple type definitions for our database operations
interface DphProject {
  id: string;
  company_name: string;
  contact_email: string;
  contact_phone: string | null;
  project_type: string;
  description: string;
  timeline: string;
  budget_range: string;
  status: string;
  client_id: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface DphProjectInsert {
  company_name: string;
  contact_email: string;
  contact_phone?: string | null;
  project_type: string;
  description: string;
  timeline: string;
  budget_range: string;
  status?: string;
  client_id?: string | null;
}

interface DphProjectUpdate {
  company_name?: string;
  contact_email?: string;
  contact_phone?: string | null;
  project_type?: string;
  description?: string;
  timeline?: string;
  budget_range?: string;
  status?: string;
  client_id?: string | null;
  admin_notes?: string | null;
}

interface DphProjectFile {
  id: string;
  project_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_url: string | null;
  uploaded_at: string;
}

interface DphProjectFileInsert {
  project_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_url?: string | null;
}

export const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error helper
  const clearError = useCallback(() => setError(null), []);

  // Projects CRUD Operations
  const projects = {
    // Create new project
    create: useCallback(async (projectData: DphProjectInsert): Promise<DphProject | null> => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error: dbError } = await supabase
          .from('dph_projects')
          .insert([projectData])
          .select()
          .single();

        if (dbError) {
          setError(dbError.message);
          return null;
        }

        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        return null;
      } finally {
        setLoading(false);
      }
    }, []),

    // Get all projects
    getAll: useCallback(async (): Promise<DphProject[]> => {
      console.log('useSupabase.getAll: Starting to fetch projects...');
      setLoading(true);
      setError(null);
      
      try {
        console.log('useSupabase.getAll: Making Supabase query to dph_projects...');
        const { data, error: dbError } = await supabase
          .from('dph_projects')
          .select('*')
          .order('created_at', { ascending: false });

        console.log('useSupabase.getAll: Query result - data:', data);
        console.log('useSupabase.getAll: Query result - error:', dbError);

        if (dbError) {
          console.error('useSupabase.getAll: Database error:', dbError);
          setError(dbError.message);
          return [];
        }

        console.log('useSupabase.getAll: Successfully fetched', data?.length || 0, 'projects');
        return data || [];
      } catch (err) {
        console.error('useSupabase.getAll: Caught exception:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        return [];
      } finally {
        setLoading(false);
        console.log('useSupabase.getAll: Finished, loading set to false');
      }
    }, []),

    // Get project by ID
    getById: useCallback(async (id: string): Promise<DphProject | null> => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error: dbError } = await supabase
          .from('dph_projects')
          .select('*')
          .eq('id', id)
          .single();

        if (dbError) {
          setError(dbError.message);
          return null;
        }

        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        return null;
      } finally {
        setLoading(false);
      }
    }, []),

    // Update project
    update: useCallback(async (id: string, updates: DphProjectUpdate): Promise<DphProject | null> => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error: dbError } = await supabase
          .from('dph_projects')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (dbError) {
          setError(dbError.message);
          return null;
        }

        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        return null;
      } finally {
        setLoading(false);
      }
    }, []),

    // Delete project
    delete: useCallback(async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      
      try {
        const { error: dbError } = await supabase
          .from('dph_projects')
          .delete()
          .eq('id', id);

        if (dbError) {
          setError(dbError.message);
          return false;
        }

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        return false;
      } finally {
        setLoading(false);
      }
    }, []),
  };

  // Project Files Operations
  const projectFiles = {
    // Add file to project
    create: useCallback(async (fileData: DphProjectFileInsert): Promise<DphProjectFile | null> => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error: dbError } = await supabase
          .from('dph_project_files')
          .insert([fileData])
          .select()
          .single();

        if (dbError) {
          setError(dbError.message);
          return null;
        }

        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        return null;
      } finally {
        setLoading(false);
      }
    }, []),

    // Get files for project
    getByProjectId: useCallback(async (projectId: string): Promise<DphProjectFile[]> => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error: dbError } = await supabase
          .from('dph_project_files')
          .select('*')
          .eq('project_id', projectId)
          .order('uploaded_at', { ascending: false });

        if (dbError) {
          setError(dbError.message);
          return [];
        }

        return data || [];
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        return [];
      } finally {
        setLoading(false);
      }
    }, []),

    // Delete file
    delete: useCallback(async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      
      try {
        const { error: dbError } = await supabase
          .from('dph_project_files')
          .delete()
          .eq('id', id);

        if (dbError) {
          setError(dbError.message);
          return false;
        }

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        return false;
      } finally {
        setLoading(false);
      }
    }, []),
  };

  // Statistics and Analytics
  const analytics = {
    // Get project statistics
    getStats: useCallback(async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error: dbError } = await supabase
          .from('dph_projects')
          .select('status, created_at');

        if (dbError) {
          setError(dbError.message);
          return null;
        }

        const stats = {
          total: data?.length || 0,
          submitted: data?.filter(p => p.status === 'Submitted').length || 0,
          inProgress: data?.filter(p => p.status === 'In Progress').length || 0,
          completed: data?.filter(p => p.status === 'Completed').length || 0,
          thisMonth: data?.filter(p => {
            const projectDate = new Date(p.created_at);
            const now = new Date();
            return projectDate.getMonth() === now.getMonth() && 
                   projectDate.getFullYear() === now.getFullYear();
          }).length || 0,
        };

        return stats;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        return null;
      } finally {
        setLoading(false);
      }
    }, []),
  };

  return {
    loading,
    error,
    clearError,
    projects,
    projectFiles,
    analytics,
  };
};

export default useSupabase;