export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      "Collaborative Poems": {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          title: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string
          id?: string
          title?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Collaborative Poems_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      "Collaborative Verses": {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          poem_id: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          poem_id?: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          poem_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Collaborative Verses_poem_id_fkey"
            columns: ["poem_id"]
            isOneToOne: false
            referencedRelation: "Collaborative Poems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Collaborative Verses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string | null
          created_id: string | null
          id: string
          poem_id: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_id?: string | null
          id?: string
          poem_id?: string | null
          user_id?: string
        }
        Update: {
          content?: string | null
          created_id?: string | null
          id?: string
          poem_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_poem_id_fkey"
            columns: ["poem_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string | null
          followers_id: string
          following_id: string
        }
        Insert: {
          created_at?: string | null
          followers_id?: string
          following_id?: string
        }
        Update: {
          created_at?: string | null
          followers_id?: string
          following_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_followers_id_fkey"
            columns: ["followers_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      "interaction metadata": {
        Row: {
          applause: string | null
          bookmark: string | null
          highlight: string | null
          interaction_type: string
          like: string
          repost: string | null
        }
        Insert: {
          applause?: string | null
          bookmark?: string | null
          highlight?: string | null
          interaction_type: string
          like: string
          repost?: string | null
        }
        Update: {
          applause?: string | null
          bookmark?: string | null
          highlight?: string | null
          interaction_type?: string
          like?: string
          repost?: string | null
        }
        Relationships: []
      }
      "interactions table": {
        Row: {
          id: string
          poem_id: string | null
          user_id: string
        }
        Insert: {
          id?: string
          poem_id?: string | null
          user_id?: string
        }
        Update: {
          id?: string
          poem_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interactions table_poem_id_fkey"
            columns: ["poem_id"]
            isOneToOne: false
            referencedRelation: "poems table"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions table_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          poem_snippet_id: string | null
          reciever_id: string | null
          sender_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          poem_snippet_id?: string | null
          reciever_id?: string | null
          sender_id?: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          poem_snippet_id?: string | null
          reciever_id?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_poem_snippet_id_fkey"
            columns: ["poem_snippet_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reciever_id_fkey"
            columns: ["reciever_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          comment: string | null
          comment_id: string | null
          created_at: string | null
          follow: string | null
          id: string
          is_read: boolean | null
          like: string | null
          poem_id: string | null
          source_user_id: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          comment_id?: string | null
          created_at?: string | null
          follow?: string | null
          id?: string
          is_read?: boolean | null
          like?: string | null
          poem_id?: string | null
          source_user_id?: string | null
          user_id?: string
        }
        Update: {
          comment?: string | null
          comment_id?: string | null
          created_at?: string | null
          follow?: string | null
          id?: string
          is_read?: boolean | null
          like?: string | null
          poem_id?: string | null
          source_user_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_poem_id_fkey"
            columns: ["poem_id"]
            isOneToOne: false
            referencedRelation: "poems table"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_source_user_id_fkey"
            columns: ["source_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      "poems table": {
        Row: {
          background_image_url: string | null
          content: string | null
          created_at: string | null
          form_tags: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          background_image_url?: string | null
          content?: string | null
          created_at?: string | null
          form_tags?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          background_image_url?: string | null
          content?: string | null
          created_at?: string | null
          form_tags?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poems table_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          bio: string | null
          created_at: string | null
          "full name": string | null
          id: string
          profile_image_url: string | null
          username: string
          writing_style_tags: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          "full name"?: string | null
          id?: string
          profile_image_url?: string | null
          username: string
          writing_style_tags?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          "full name"?: string | null
          id?: string
          profile_image_url?: string | null
          username?: string
          writing_style_tags?: string | null
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
