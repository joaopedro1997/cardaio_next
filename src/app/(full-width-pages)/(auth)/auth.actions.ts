'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Ensure user exists in local db (sync)
  if (data.user) {
    try {
        // Check if user exists by authId
        const existingUser = await db.query.users.findFirst({
            where: eq(users.authId, data.user.id)
        })

        if (!existingUser) {
             await db.insert(users).values({
                authId: data.user.id,
                email: data.user.email!,
                name: data.user.user_metadata.full_name || 'User',
            })
        }
    } catch (e) {
        console.error("Failed to sync user to db", e)
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('fname') as string
  const lastName = formData.get('lname') as string

  const data = {
    first_name: firstName,
    last_name: lastName,
    full_name: `${firstName} ${lastName}`,
  }

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (authData.user) {
      try {
          await db.insert(users).values({
              authId: authData.user.id,
              email: authData.user.email!,
              name: `${firstName} ${lastName}`,
          }).onConflictDoNothing()
      } catch (e) {
          console.error("Failed to create user in db", e)
      }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
