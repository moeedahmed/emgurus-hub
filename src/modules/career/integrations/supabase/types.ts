export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_alerts: {
        Row: {
          alert_type: string
          created_at: string
          email_sent: boolean | null
          function_name: string | null
          id: string
          message: string
          meta: Json | null
          severity: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string
          email_sent?: boolean | null
          function_name?: string | null
          id?: string
          message: string
          meta?: Json | null
          severity?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string
          email_sent?: boolean | null
          function_name?: string | null
          id?: string
          message?: string
          meta?: Json | null
          severity?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      admin_broadcasts: {
        Row: {
          body: string
          id: string
          recipient_count: number | null
          recipient_filter: Json | null
          sent_at: string | null
          sent_by: string | null
          subject: string
        }
        Insert: {
          body: string
          id?: string
          recipient_count?: number | null
          recipient_filter?: Json | null
          sent_at?: string | null
          sent_by?: string | null
          subject: string
        }
        Update: {
          body?: string
          id?: string
          recipient_count?: number | null
          recipient_filter?: Json | null
          sent_at?: string | null
          sent_by?: string | null
          subject?: string
        }
        Relationships: []
      }
      admin_notification_settings: {
        Row: {
          created_at: string | null
          email_frequency: string | null
          id: string
          notify_edge_function_errors: boolean | null
          notify_usage_limit_reached: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_frequency?: string | null
          id?: string
          notify_edge_function_errors?: boolean | null
          notify_usage_limit_reached?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_frequency?: string | null
          id?: string
          notify_edge_function_errors?: boolean | null
          notify_usage_limit_reached?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_chat_messages: {
        Row: {
          content: string
          context_label: string | null
          created_at: string
          id: string
          roadmap_id: string | null
          role: string
          user_id: string
        }
        Insert: {
          content: string
          context_label?: string | null
          created_at?: string
          id?: string
          roadmap_id?: string | null
          role: string
          user_id?: string
        }
        Update: {
          content?: string
          context_label?: string | null
          created_at?: string
          id?: string
          roadmap_id?: string | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_prompts: {
        Row: {
          created_at: string | null
          description: string | null
          display_name: string
          frontend_location: string | null
          function_name: string
          id: string
          is_active: boolean | null
          max_tokens: number | null
          model: string | null
          system_prompt: string
          temperature: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_name: string
          frontend_location?: string | null
          function_name: string
          id?: string
          is_active?: boolean | null
          max_tokens?: number | null
          model?: string | null
          system_prompt: string
          temperature?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_name?: string
          frontend_location?: string | null
          function_name?: string
          id?: string
          is_active?: boolean | null
          max_tokens?: number | null
          model?: string | null
          system_prompt?: string
          temperature?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      audiences: {
        Row: {
          code: string
          id: string
          label: string
        }
        Insert: {
          code: string
          id?: string
          label: string
        }
        Update: {
          code?: string
          id?: string
          label?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          subject?: string
        }
        Relationships: []
      }
      countries: {
        Row: {
          code: string
          id: string
          name: string
          region_id: string | null
        }
        Insert: {
          code: string
          id?: string
          name: string
          region_id?: string | null
        }
        Update: {
          code?: string
          id?: string
          name?: string
          region_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "countries_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_milestones: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          display_order: number
          id: string
          name: string
          pathway_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name: string
          pathway_id: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name?: string
          pathway_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_milestones_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "milestone_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_milestones_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "pathways"
            referencedColumns: ["id"]
          },
        ]
      }
      disciplines: {
        Row: {
          code: string
          id: string
          name: string
          parent_id: string | null
        }
        Insert: {
          code: string
          id?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          code?: string
          id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disciplines_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "disciplines"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string
          id: string
          message: string
          metadata: Json | null
          screenshot_path: string | null
          status: Database["public"]["Enums"]["feedback_status"]
          type: Database["public"]["Enums"]["feedback_type"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          screenshot_path?: string | null
          status?: Database["public"]["Enums"]["feedback_status"]
          type?: Database["public"]["Enums"]["feedback_type"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          screenshot_path?: string | null
          status?: Database["public"]["Enums"]["feedback_status"]
          type?: Database["public"]["Enums"]["feedback_type"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      goals: {
        Row: {
          constraints: Json | null
          created_at: string | null
          id: string
          last_activity_at: string | null
          narrative: string | null
          status: string
          target_country: string | null
          target_role: string | null
          timeline: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          constraints?: Json | null
          created_at?: string | null
          id?: string
          last_activity_at?: string | null
          narrative?: string | null
          status?: string
          target_country?: string | null
          target_role?: string | null
          timeline?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          constraints?: Json | null
          created_at?: string | null
          id?: string
          last_activity_at?: string | null
          narrative?: string | null
          status?: string
          target_country?: string | null
          target_role?: string | null
          timeline?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      milestone_categories: {
        Row: {
          code: string
          display_order: number
          id: string
          label: string
        }
        Insert: {
          code: string
          display_order?: number
          id?: string
          label: string
        }
        Update: {
          code?: string
          display_order?: number
          id?: string
          label?: string
        }
        Relationships: []
      }
      milestone_sources: {
        Row: {
          milestone_id: string
          source_id: string
        }
        Insert: {
          milestone_id: string
          source_id: string
        }
        Update: {
          milestone_id?: string
          source_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestone_sources_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "milestone_sources_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          alternatives: string[] | null
          category_id: string | null
          code: string | null
          created_at: string
          description: string | null
          display_order: number
          evidence_types: string[] | null
          id: string
          is_required: boolean
          name: string
          pathway_id: string
          resource_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          alternatives?: string[] | null
          category_id?: string | null
          code?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          evidence_types?: string[] | null
          id?: string
          is_required?: boolean
          name: string
          pathway_id: string
          resource_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          alternatives?: string[] | null
          category_id?: string | null
          code?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          evidence_types?: string[] | null
          id?: string
          is_required?: boolean
          name?: string
          pathway_id?: string
          resource_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "milestone_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "milestones_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "pathways"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string
          deadline_reminders_enabled: boolean
          id: string
          last_reminder_email_at: string | null
          last_weekly_email_at: string | null
          updated_at: string
          user_id: string
          weekly_summary_enabled: boolean
        }
        Insert: {
          created_at?: string
          deadline_reminders_enabled?: boolean
          id?: string
          last_reminder_email_at?: string | null
          last_weekly_email_at?: string | null
          updated_at?: string
          user_id: string
          weekly_summary_enabled?: boolean
        }
        Update: {
          created_at?: string
          deadline_reminders_enabled?: boolean
          id?: string
          last_reminder_email_at?: string | null
          last_weekly_email_at?: string | null
          updated_at?: string
          user_id?: string
          weekly_summary_enabled?: boolean
        }
        Relationships: []
      }
      pathway_aliases: {
        Row: {
          alias: string
          id: string
          pathway_id: string
        }
        Insert: {
          alias: string
          id?: string
          pathway_id: string
        }
        Update: {
          alias?: string
          id?: string
          pathway_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pathway_aliases_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "pathways"
            referencedColumns: ["id"]
          },
        ]
      }
      pathway_disciplines: {
        Row: {
          discipline_id: string
          pathway_id: string
        }
        Insert: {
          discipline_id: string
          pathway_id: string
        }
        Update: {
          discipline_id?: string
          pathway_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pathway_disciplines_discipline_id_fkey"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "disciplines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathway_disciplines_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "pathways"
            referencedColumns: ["id"]
          },
        ]
      }
      pathway_sources: {
        Row: {
          pathway_id: string
          source_id: string
        }
        Insert: {
          pathway_id: string
          source_id: string
        }
        Update: {
          pathway_id?: string
          source_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pathway_sources_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "pathways"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathway_sources_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      pathway_types: {
        Row: {
          code: string
          id: string
          label: string
        }
        Insert: {
          code: string
          id?: string
          label: string
        }
        Update: {
          code?: string
          id?: string
          label?: string
        }
        Relationships: []
      }
      pathways: {
        Row: {
          audience_id: string | null
          code: string
          country_id: string
          created_at: string
          description: string | null
          estimated_duration: string | null
          id: string
          last_verified_at: string | null
          name: string
          pathway_type_id: string | null
          status: string
          target_role: string | null
          updated_at: string
        }
        Insert: {
          audience_id?: string | null
          code: string
          country_id: string
          created_at?: string
          description?: string | null
          estimated_duration?: string | null
          id?: string
          last_verified_at?: string | null
          name: string
          pathway_type_id?: string | null
          status?: string
          target_role?: string | null
          updated_at?: string
        }
        Update: {
          audience_id?: string | null
          code?: string
          country_id?: string
          created_at?: string
          description?: string | null
          estimated_duration?: string | null
          id?: string
          last_verified_at?: string | null
          name?: string
          pathway_type_id?: string | null
          status?: string
          target_role?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pathways_audience_id_fkey"
            columns: ["audience_id"]
            isOneToOne: false
            referencedRelation: "audiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathways_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathways_pathway_type_id_fkey"
            columns: ["pathway_type_id"]
            isOneToOne: false
            referencedRelation: "pathway_types"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          additional_context: string | null
          career_stage: string | null
          created_at: string | null
          current_country: string | null
          custom_milestones: Json | null
          display_name: string | null
          graduation_year: string | null
          id: string
          language_proficiency: Json | null
          milestones_achieved: string[] | null
          milestones_in_progress: string[] | null
          onboarding_completed: boolean | null
          pathway_configs: Json | null
          pathway_id: string | null
          pathway_ids: string[] | null
          preferred_countries: string[] | null
          primary_career_goal: string | null
          specialties: string[] | null
          specialty: string | null
          timeline: string | null
          training_paths: string[] | null
          updated_at: string | null
          work_rhythm: string | null
          years_experience: string | null
        }
        Insert: {
          additional_context?: string | null
          career_stage?: string | null
          created_at?: string | null
          current_country?: string | null
          custom_milestones?: Json | null
          display_name?: string | null
          graduation_year?: string | null
          id: string
          language_proficiency?: Json | null
          milestones_achieved?: string[] | null
          milestones_in_progress?: string[] | null
          onboarding_completed?: boolean | null
          pathway_configs?: Json | null
          pathway_id?: string | null
          pathway_ids?: string[] | null
          preferred_countries?: string[] | null
          primary_career_goal?: string | null
          specialties?: string[] | null
          specialty?: string | null
          timeline?: string | null
          training_paths?: string[] | null
          updated_at?: string | null
          work_rhythm?: string | null
          years_experience?: string | null
        }
        Update: {
          additional_context?: string | null
          career_stage?: string | null
          created_at?: string | null
          current_country?: string | null
          custom_milestones?: Json | null
          display_name?: string | null
          graduation_year?: string | null
          id?: string
          language_proficiency?: Json | null
          milestones_achieved?: string[] | null
          milestones_in_progress?: string[] | null
          onboarding_completed?: boolean | null
          pathway_configs?: Json | null
          pathway_id?: string | null
          pathway_ids?: string[] | null
          preferred_countries?: string[] | null
          primary_career_goal?: string | null
          specialties?: string[] | null
          specialty?: string | null
          timeline?: string | null
          training_paths?: string[] | null
          updated_at?: string | null
          work_rhythm?: string | null
          years_experience?: string | null
        }
        Relationships: []
      }
      regions: {
        Row: {
          code: string
          id: string
          name: string
        }
        Insert: {
          code: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      roadmap_nodes: {
        Row: {
          completed_at: string | null
          confidence: string | null
          cost_estimate: Json | null
          created_at: string | null
          dependencies: string[] | null
          description: string | null
          examples: string[] | null
          how: string[] | null
          id: string
          order_index: number
          position: Json | null
          roadmap_id: string
          sources: Json | null
          status: string
          timeframe: string | null
          title: string
          why: string | null
        }
        Insert: {
          completed_at?: string | null
          confidence?: string | null
          cost_estimate?: Json | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          examples?: string[] | null
          how?: string[] | null
          id?: string
          order_index?: number
          position?: Json | null
          roadmap_id: string
          sources?: Json | null
          status?: string
          timeframe?: string | null
          title: string
          why?: string | null
        }
        Update: {
          completed_at?: string | null
          confidence?: string | null
          cost_estimate?: Json | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          examples?: string[] | null
          how?: string[] | null
          id?: string
          order_index?: number
          position?: Json | null
          roadmap_id?: string
          sources?: Json | null
          status?: string
          timeframe?: string | null
          title?: string
          why?: string | null
        }
        Relationships: []
      }
      roadmaps: {
        Row: {
          created_at: string | null
          goal_id: string
          id: string
          pathway: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          goal_id: string
          id?: string
          pathway?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          goal_id?: string
          id?: string
          pathway?: string | null
          title?: string
        }
        Relationships: []
      }
      sources: {
        Row: {
          id: string
          last_verified_at: string | null
          org: string | null
          title: string
          url: string | null
        }
        Insert: {
          id?: string
          last_verified_at?: string | null
          org?: string | null
          title: string
          url?: string | null
        }
        Update: {
          id?: string
          last_verified_at?: string | null
          org?: string | null
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      user_documents: {
        Row: {
          analysis_status: string
          analyzed_at: string | null
          created_at: string | null
          document_type: string | null
          extracted_data: Json | null
          extracted_text: string | null
          file_name: string
          file_path: string
          file_size: number
          id: string
          mime_type: string | null
          user_id: string
        }
        Insert: {
          analysis_status?: string
          analyzed_at?: string | null
          created_at?: string | null
          document_type?: string | null
          extracted_data?: Json | null
          extracted_text?: string | null
          file_name: string
          file_path: string
          file_size: number
          id?: string
          mime_type?: string | null
          user_id: string
        }
        Update: {
          analysis_status?: string
          analyzed_at?: string | null
          created_at?: string | null
          document_type?: string | null
          extracted_data?: Json | null
          extracted_text?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          mime_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_milestones: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          milestone_id: string
          notes: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          milestone_id: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          milestone_id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_milestones_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      user_pathways: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean
          pathway_id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean
          pathway_id: string
          status?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean
          pathway_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_pathways_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "pathways"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_usage: {
        Row: {
          ai_messages_sent: number
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          documents_analyzed: number
          id: string
          roadmaps_generated: number
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_tier: string
          updated_at: string | null
          user_id: string
          voice_minutes_used: number
        }
        Insert: {
          ai_messages_sent?: number
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          documents_analyzed?: number
          id?: string
          roadmaps_generated?: number
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_tier?: string
          updated_at?: string | null
          user_id: string
          voice_minutes_used?: number
        }
        Update: {
          ai_messages_sent?: number
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          documents_analyzed?: number
          id?: string
          roadmaps_generated?: number
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_tier?: string
          updated_at?: string | null
          user_id?: string
          voice_minutes_used?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "tester" | "user"
      feedback_status: "new" | "viewed" | "resolved" | "ignored"
      feedback_type: "bug" | "feature" | "praise" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["admin", "tester", "user"],
      feedback_status: ["new", "viewed", "resolved", "ignored"],
      feedback_type: ["bug", "feature", "praise", "other"],
    },
  },
} as const
