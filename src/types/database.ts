/**
 * Typed mirror of the public Supabase schema through migration 009.
 * Regenerate and review this file against the linked project after every applied migration.
 * Dates and timestamps are serialized strings at the client boundary.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          created_at: string;
          display_name: string;
          role: "admin";
          user_id: string;
        };
        Insert: {
          created_at?: string;
          display_name: string;
          role?: "admin";
          user_id: string;
        };
        Update: {
          created_at?: string;
          display_name?: string;
          role?: "admin";
          user_id?: string;
        };
        Relationships: [];
      };
      contact_inquiries: {
        Row: {
          consent: boolean;
          created_at: string;
          email: string | null;
          id: string;
          message: string;
          name: string;
          number_of_guests: number | null;
          phone: string | null;
          preferred_check_in: string | null;
          preferred_check_out: string | null;
          privacy_notice_version: string;
          status: "closed" | "contacted" | "new" | "reviewed" | "spam";
          submission_id: string;
        };
        Insert: {
          consent: boolean;
          created_at?: string;
          email?: string | null;
          id?: string;
          message: string;
          name: string;
          number_of_guests?: number | null;
          phone?: string | null;
          preferred_check_in?: string | null;
          preferred_check_out?: string | null;
          privacy_notice_version: string;
          status?: "closed" | "contacted" | "new" | "reviewed" | "spam";
          submission_id: string;
        };
        Update: {
          consent?: boolean;
          created_at?: string;
          email?: string | null;
          id?: string;
          message?: string;
          name?: string;
          number_of_guests?: number | null;
          phone?: string | null;
          preferred_check_in?: string | null;
          preferred_check_out?: string | null;
          privacy_notice_version?: string;
          status?: "closed" | "contacted" | "new" | "reviewed" | "spam";
          submission_id?: string;
        };
        Relationships: [];
      };
      link_clicks: {
        Row: {
          anonymous_visitor_id: string;
          created_at: string;
          destination_url: string | null;
          id: string;
          link_type: "airbnb" | "email" | "facebook" | "google_maps" | "messenger" | "other" | "phone" | "waze" | "whatsapp";
          session_id: string;
          source_page: string | null;
        };
        Insert: {
          anonymous_visitor_id: string;
          created_at?: string;
          destination_url?: string | null;
          id?: string;
          link_type: "airbnb" | "email" | "facebook" | "google_maps" | "messenger" | "other" | "phone" | "waze" | "whatsapp";
          session_id: string;
          source_page?: string | null;
        };
        Update: {
          anonymous_visitor_id?: string;
          created_at?: string;
          destination_url?: string | null;
          id?: string;
          link_type?: "airbnb" | "email" | "facebook" | "google_maps" | "messenger" | "other" | "phone" | "waze" | "whatsapp";
          session_id?: string;
          source_page?: string | null;
        };
        Relationships: [];
      };
      page_views: {
        Row: {
          anonymous_visitor_id: string;
          browser_type: "chrome" | "edge" | "firefox" | "other" | "safari" | "unknown" | null;
          created_at: string;
          device_type: "desktop" | "mobile" | "tablet" | "unknown" | null;
          id: string;
          path: string;
          referrer: string | null;
          session_id: string;
        };
        Insert: {
          anonymous_visitor_id: string;
          browser_type?: "chrome" | "edge" | "firefox" | "other" | "safari" | "unknown" | null;
          created_at?: string;
          device_type?: "desktop" | "mobile" | "tablet" | "unknown" | null;
          id?: string;
          path: string;
          referrer?: string | null;
          session_id: string;
        };
        Update: {
          anonymous_visitor_id?: string;
          browser_type?: "chrome" | "edge" | "firefox" | "other" | "safari" | "unknown" | null;
          created_at?: string;
          device_type?: "desktop" | "mobile" | "tablet" | "unknown" | null;
          id?: string;
          path?: string;
          referrer?: string | null;
          session_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      analytics_daily_devices: {
        Row: {
          activity_date: string | null;
          device_type: string | null;
          total_page_views: number | null;
        };
        Relationships: [];
      };
      analytics_daily_link_clicks: {
        Row: {
          activity_date: string | null;
          estimated_unique_visitors: number | null;
          link_type: string | null;
          total_clicks: number | null;
        };
        Relationships: [];
      };
      analytics_daily_overview: {
        Row: {
          activity_date: string | null;
          estimated_unique_visitors: number | null;
          sessions: number | null;
          total_page_views: number | null;
        };
        Relationships: [];
      };
      analytics_daily_pages: {
        Row: {
          activity_date: string | null;
          estimated_unique_visitors: number | null;
          path: string | null;
          total_page_views: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      analytics_dashboard_daily: {
        Args: {
          p_end_exclusive: string;
          p_start: string;
        };
        Returns: {
          activity_date: string;
          estimated_unique_visitors: number;
          total_page_views: number;
        }[];
      };
      analytics_dashboard_device_totals: {
        Args: {
          p_end_exclusive: string;
          p_start: string;
        };
        Returns: {
          device_type: string;
          total_page_views: number;
        }[];
      };
      analytics_dashboard_link_totals: {
        Args: {
          p_end_exclusive: string;
          p_start: string;
        };
        Returns: {
          link_type: string;
          total_clicks: number;
        }[];
      };
      analytics_dashboard_summary: {
        Args: {
          p_end_exclusive: string;
          p_start: string;
        };
        Returns: {
          airbnb_clicks: number;
          estimated_unique_visitors: number;
          facebook_clicks: number;
          google_maps_clicks: number;
          has_demonstration_data: boolean;
          new_inquiries: number;
          sessions: number;
          total_external_link_clicks: number;
          total_page_views: number;
          unique_clicking_visitors: number;
          whatsapp_clicks: number;
        }[];
      };
      analytics_dashboard_top_pages: {
        Args: {
          p_end_exclusive: string;
          p_start: string;
        };
        Returns: {
          path: string;
          total_page_views: number;
        }[];
      };
      delete_contact_inquiry: {
        Args: {
          p_inquiry_id: string;
        };
        Returns: boolean;
      };
      store_contact_inquiry: {
        Args: {
          p_email: string | null;
          p_message: string;
          p_name: string;
          p_number_of_guests: number | null;
          p_phone: string | null;
          p_preferred_check_in: string | null;
          p_preferred_check_out: string | null;
          p_privacy_notice_version: string;
          p_submission_id: string;
        };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type PublicTableName = keyof Database["public"]["Tables"];
export type PublicViewName = keyof Database["public"]["Views"];
