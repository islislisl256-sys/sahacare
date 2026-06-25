export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: string
          phone: string | null
          address: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          role?: string
          phone?: string | null
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: string
          phone?: string | null
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      provider_profiles: {
        Row: {
          user_id: string
          specialty: string
          bio: string | null
          work_area: string | null
          default_travel_cost: number | null
          day_off: string | null
          subscription_plan: string | null
          university_degree_url: string | null
          license_url: string | null
          is_verified: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          specialty: string
          bio?: string | null
          work_area?: string | null
          default_travel_cost?: number | null
          day_off?: string | null
          subscription_plan?: string | null
          university_degree_url?: string | null
          license_url?: string | null
          is_verified?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          specialty?: string
          bio?: string | null
          work_area?: string | null
          default_travel_cost?: number | null
          day_off?: string | null
          subscription_plan?: string | null
          university_degree_url?: string | null
          license_url?: string | null
          is_verified?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      service_requests: {
        Row: {
          id: string
          patient_id: string
          service_type: string
          description: string | null
          budget: number | null
          location_lat: number | null
          location_lng: number | null
          address_text: string | null
          prescription_url: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          service_type: string
          description?: string | null
          budget?: number | null
          location_lat?: number | null
          location_lng?: number | null
          address_text?: string | null
          prescription_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          service_type?: string
          description?: string | null
          budget?: number | null
          location_lat?: number | null
          location_lng?: number | null
          address_text?: string | null
          prescription_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      offers: {
        Row: {
          id: string
          request_id: string
          provider_id: string
          price: number
          message: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          request_id: string
          provider_id: string
          price: number
          message?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          provider_id?: string
          price?: number
          message?: string | null
          status?: string
          created_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          request_id: string
          patient_id: string
          provider_id: string
          offer_id: string | null
          scheduled_date: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          request_id: string
          patient_id: string
          provider_id: string
          offer_id?: string | null
          scheduled_date?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          patient_id?: string
          provider_id?: string
          offer_id?: string | null
          scheduled_date?: string | null
          status?: string
          created_at?: string
        }
      }
      medical_records: {
        Row: {
          id: string
          appointment_id: string
          patient_id: string
          provider_id: string
          notes: string | null
          file_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          appointment_id: string
          patient_id: string
          provider_id: string
          notes?: string | null
          file_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          appointment_id?: string
          patient_id?: string
          provider_id?: string
          notes?: string | null
          file_url?: string | null
          created_at?: string
        }
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
