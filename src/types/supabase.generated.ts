export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          company_name: string;
          contact_email: string;
          project_type: string;
          description: string;
          timeline: string;
          budget_range: string;
          status: string;
          created_at: string;
          updated_at: string;
          user_id?: string;
          files?: string[];
          admin_notes?: string;
        };
        Insert: {
          id?: string;
          company_name: string;
          contact_email: string;
          project_type: string;
          description: string;
          timeline: string;
          budget_range: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          files?: string[];
          admin_notes?: string;
        };
        Update: {
          id?: string;
          company_name?: string;
          contact_email?: string;
          project_type?: string;
          description?: string;
          timeline?: string;
          budget_range?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          files?: string[];
          admin_notes?: string;
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
