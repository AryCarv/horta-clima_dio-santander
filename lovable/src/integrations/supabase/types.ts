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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      garden_plants: {
        Row: {
          container_size_liters: number | null
          container_type: string | null
          created_at: string
          expected_harvest_end: string | null
          expected_harvest_start: string | null
          garden_id: string
          id: string
          notes: string | null
          plant_id: string
          planted_at: string
          quantity: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          container_size_liters?: number | null
          container_type?: string | null
          created_at?: string
          expected_harvest_end?: string | null
          expected_harvest_start?: string | null
          garden_id: string
          id?: string
          notes?: string | null
          plant_id: string
          planted_at?: string
          quantity?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          container_size_liters?: number | null
          container_type?: string | null
          created_at?: string
          expected_harvest_end?: string | null
          expected_harvest_start?: string | null
          garden_id?: string
          id?: string
          notes?: string | null
          plant_id?: string
          planted_at?: string
          quantity?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "garden_plants_garden_id_fkey"
            columns: ["garden_id"]
            isOneToOne: false
            referencedRelation: "gardens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "garden_plants_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
        ]
      }
      gardens: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          objectives: string[]
          size_category: string | null
          size_m2: number | null
          space_types: string[]
          state: string | null
          sunlight_level: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          objectives?: string[]
          size_category?: string | null
          size_m2?: number | null
          space_types?: string[]
          state?: string | null
          sunlight_level?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          objectives?: string[]
          size_category?: string | null
          size_m2?: number | null
          space_types?: string[]
          state?: string | null
          sunlight_level?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      harvests: {
        Row: {
          created_at: string
          garden_id: string
          garden_plant_id: string
          harvest_date: string
          id: string
          notes: string | null
          quantity: number | null
          unit: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          garden_id: string
          garden_plant_id: string
          harvest_date?: string
          id?: string
          notes?: string | null
          quantity?: number | null
          unit?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          garden_id?: string
          garden_plant_id?: string
          harvest_date?: string
          id?: string
          notes?: string | null
          quantity?: number | null
          unit?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "harvests_garden_id_fkey"
            columns: ["garden_id"]
            isOneToOne: false
            referencedRelation: "gardens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "harvests_garden_plant_id_fkey"
            columns: ["garden_plant_id"]
            isOneToOne: false
            referencedRelation: "garden_plants"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          content: string | null
          created_at: string
          entry_date: string
          entry_type: string
          garden_id: string
          garden_plant_id: string | null
          id: string
          image_path: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          entry_date?: string
          entry_type?: string
          garden_id: string
          garden_plant_id?: string | null
          id?: string
          image_path?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          entry_date?: string
          entry_type?: string
          garden_id?: string
          garden_plant_id?: string | null
          id?: string
          image_path?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_garden_id_fkey"
            columns: ["garden_id"]
            isOneToOne: false
            referencedRelation: "gardens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_entries_garden_plant_id_fkey"
            columns: ["garden_plant_id"]
            isOneToOne: false
            referencedRelation: "garden_plants"
            referencedColumns: ["id"]
          },
        ]
      }
      plants: {
        Row: {
          active: boolean
          category: string
          created_at: string
          description: string
          difficulty: string
          general_care: string
          harvest_days_max: number
          harvest_days_min: number
          harvest_guidance: string
          id: string
          ideal_temperature_max: number | null
          ideal_temperature_min: number | null
          image_url: string | null
          minimum_container_liters: number | null
          name: string
          planting_guidance: string
          planting_months: number[]
          slug: string
          source_reference: string | null
          suitable_for_small_spaces: boolean
          sunlight_requirement: string
          updated_at: string
          water_need: string
        }
        Insert: {
          active?: boolean
          category: string
          created_at?: string
          description: string
          difficulty: string
          general_care: string
          harvest_days_max: number
          harvest_days_min: number
          harvest_guidance: string
          id?: string
          ideal_temperature_max?: number | null
          ideal_temperature_min?: number | null
          image_url?: string | null
          minimum_container_liters?: number | null
          name: string
          planting_guidance: string
          planting_months?: number[]
          slug: string
          source_reference?: string | null
          suitable_for_small_spaces?: boolean
          sunlight_requirement: string
          updated_at?: string
          water_need: string
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          description?: string
          difficulty?: string
          general_care?: string
          harvest_days_max?: number
          harvest_days_min?: number
          harvest_guidance?: string
          id?: string
          ideal_temperature_max?: number | null
          ideal_temperature_min?: number | null
          image_url?: string | null
          minimum_container_liters?: number | null
          name?: string
          planting_guidance?: string
          planting_months?: number[]
          slug?: string
          source_reference?: string | null
          suitable_for_small_spaces?: boolean
          sunlight_requirement?: string
          updated_at?: string
          water_need?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          experience_level: string | null
          full_name: string | null
          id: string
          onboarding_completed: boolean
          temperature_unit: string
          updated_at: string
          user_id: string
          week_start: string
        }
        Insert: {
          created_at?: string
          experience_level?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean
          temperature_unit?: string
          updated_at?: string
          user_id: string
          week_start?: string
        }
        Update: {
          created_at?: string
          experience_level?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean
          temperature_unit?: string
          updated_at?: string
          user_id?: string
          week_start?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string
          garden_id: string
          garden_plant_id: string | null
          id: string
          source: string
          status: string
          task_type: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date: string
          garden_id: string
          garden_plant_id?: string | null
          id?: string
          source?: string
          status?: string
          task_type?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string
          garden_id?: string
          garden_plant_id?: string | null
          id?: string
          source?: string
          status?: string
          task_type?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_garden_id_fkey"
            columns: ["garden_id"]
            isOneToOne: false
            referencedRelation: "gardens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_garden_plant_id_fkey"
            columns: ["garden_plant_id"]
            isOneToOne: false
            referencedRelation: "garden_plants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
