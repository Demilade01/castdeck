import { supabase } from './supabase'
import type { Database } from './database.types'

type Draft = Database['public']['Tables']['drafts']['Row']
type DraftInsert = Database['public']['Tables']['drafts']['Insert']
type DraftUpdate = Database['public']['Tables']['drafts']['Update']

type ScheduledPost = Database['public']['Tables']['scheduled_posts']['Row']
type ScheduledPostInsert = Database['public']['Tables']['scheduled_posts']['Insert']
type ScheduledPostUpdate = Database['public']['Tables']['scheduled_posts']['Update']

type User = Database['public']['Tables']['users']['Row']
type UserInsert = Database['public']['Tables']['users']['Insert']
type UserUpdate = Database['public']['Tables']['users']['Update']

// User operations
export const userService = {
  // Get or create user from Farcaster data
  async getOrCreateUser(farcasterId: number, username: string, displayName?: string, avatarUrl?: string): Promise<User> {
    // First try to get existing user
    const { data: existingUser, error: getError } = await supabase
      .from('users')
      .select('*')
      .eq('farcaster_id', farcasterId)
      .single()

    if (existingUser) {
      // Update user info if needed
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          username,
          display_name: displayName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingUser.id)
        .select()
        .single()

      if (updateError) throw updateError
      return updatedUser
    }

    // Create new user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        farcaster_id: farcasterId,
        username,
        display_name: displayName,
        avatar_url: avatarUrl
      })
      .select()
      .single()

    if (createError) throw createError
    return newUser
  },

  // Get user by Farcaster ID
  async getUserByFarcasterId(farcasterId: number): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('farcaster_id', farcasterId)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
    return data
  }
}

// Draft operations
export const draftService = {
  // Get all drafts for a user
  async getDrafts(userId: string): Promise<Draft[]> {
    const { data, error } = await supabase
      .from('drafts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get a single draft by ID
  async getDraft(id: string, userId: string): Promise<Draft | null> {
    const { data, error } = await supabase
      .from('drafts')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // Create a new draft
  async createDraft(draft: DraftInsert): Promise<Draft> {
    const { data, error } = await supabase
      .from('drafts')
      .insert(draft)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update a draft
  async updateDraft(id: string, updates: DraftUpdate): Promise<Draft> {
    const { data, error } = await supabase
      .from('drafts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete a draft
  async deleteDraft(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('drafts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
  },

  // Get draft count for a user
  async getDraftCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('drafts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (error) throw error
    return count || 0
  }
}

// Scheduled post operations
export const scheduledPostService = {
  // Get all scheduled posts for a user
  async getScheduledPosts(userId: string): Promise<ScheduledPost[]> {
    const { data, error } = await supabase
      .from('scheduled_posts')
      .select(`
        *,
        drafts (
          id,
          content,
          status
        )
      `)
      .eq('user_id', userId)
      .order('scheduled_time', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Get a single scheduled post by ID
  async getScheduledPost(id: string, userId: string): Promise<ScheduledPost | null> {
    const { data, error } = await supabase
      .from('scheduled_posts')
      .select(`
        *,
        drafts (
          id,
          content,
          status
        )
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // Create a new scheduled post
  async createScheduledPost(scheduledPost: ScheduledPostInsert): Promise<ScheduledPost> {
    const { data, error } = await supabase
      .from('scheduled_posts')
      .insert(scheduledPost)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update a scheduled post
  async updateScheduledPost(id: string, updates: ScheduledPostUpdate): Promise<ScheduledPost> {
    const { data, error } = await supabase
      .from('scheduled_posts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete a scheduled post
  async deleteScheduledPost(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('scheduled_posts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
  },

  // Get scheduled post count for a user
  async getScheduledPostCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('scheduled_posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'pending')

    if (error) throw error
    return count || 0
  },

  // Get pending scheduled posts (for background job)
  async getPendingScheduledPosts(): Promise<ScheduledPost[]> {
    const { data, error } = await supabase
      .from('scheduled_posts')
      .select(`
        *,
        drafts (
          id,
          content,
          status
        ),
        users (
          id,
          farcaster_id,
          username
        )
      `)
      .eq('status', 'pending')
      .lte('scheduled_time', new Date().toISOString())
      .order('scheduled_time', { ascending: true })

    if (error) throw error
    return data || []
  }
}

// Combined service for common operations
export const castdeckService = {
  // Get user stats (draft count, scheduled count)
  async getUserStats(userId: string) {
    const [draftCount, scheduledCount] = await Promise.all([
      draftService.getDraftCount(userId),
      scheduledPostService.getScheduledPostCount(userId)
    ])

    return { draftCount, scheduledCount }
  },

  // Create a draft and optionally schedule it
  async createDraftWithScheduling(
    userId: string,
    content: string,
    scheduledTime?: Date
  ) {
    // Create the draft first
    const draft = await draftService.createDraft({
      user_id: userId,
      content,
      status: scheduledTime ? 'scheduled' : 'draft'
    })

    // If scheduled, create the scheduled post
    if (scheduledTime) {
      await scheduledPostService.createScheduledPost({
        draft_id: draft.id,
        user_id: userId,
        scheduled_time: scheduledTime.toISOString(),
        status: 'pending'
      })
    }

    return draft
  }
}
