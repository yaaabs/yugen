// DrinkPH Database Types
// These types correspond to our dph_* tables and won't interfere with your Lover App

export interface Database {
  public: {
    Tables: {
      // DrinkPH Projects Table
      dph_projects: {
        Row: {
          id: string;
          company_name: string;
          contact_email: string;
          contact_phone: string | null;
          project_type: string;
          description: string;
          timeline: string;
          budget_range: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_name: string;
          contact_email: string;
          contact_phone?: string | null;
          project_type: string;
          description: string;
          timeline: string;
          budget_range: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_name?: string;
          contact_email?: string;
          contact_phone?: string | null;
          project_type?: string;
          description?: string;
          timeline?: string;
          budget_range?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      // DrinkPH Project Files Table
      dph_project_files: {
        Row: {
          id: string;
          project_id: string;
          file_name: string;
          file_size: number;
          file_type: string;
          file_url: string | null;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          file_name: string;
          file_size: number;
          file_type: string;
          file_url?: string | null;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          file_name?: string;
          file_size?: number;
          file_type?: string;
          file_url?: string | null;
          uploaded_at?: string;
        };
      };
      // DrinkPH Admin Users Table
      dph_admin_users: {
        Row: {
          id: string;
          email: string;
          username: string;
          password_hash: string;
          role: string;
          created_at: string;
          last_login: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          username: string;
          password_hash: string;
          role?: string;
          created_at?: string;
          last_login?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          password_hash?: string;
          role?: string;
          created_at?: string;
          last_login?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper types for easier usage
export type DphProject = Database['public']['Tables']['dph_projects']['Row'];
export type DphProjectInsert = Database['public']['Tables']['dph_projects']['Insert'];
export type DphProjectUpdate = Database['public']['Tables']['dph_projects']['Update'];

export type DphProjectFile = Database['public']['Tables']['dph_project_files']['Row'];
export type DphProjectFileInsert = Database['public']['Tables']['dph_project_files']['Insert'];

export type DphAdminUser = Database['public']['Tables']['dph_admin_users']['Row'];
export type DphAdminUserInsert = Database['public']['Tables']['dph_admin_users']['Insert'];