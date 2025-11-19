'use server'

import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { organizations, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createOrganization(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const dbUser = await db.query.users.findFirst({
      where: eq(users.authId, user.id)
  })
  
  if (!dbUser) {
      return { error: "User not found in database" }
  }

  const name = formData.get("name") as string
  
  if (!name || name.length < 3) {
    return { error: "Organization name must be at least 3 characters" }
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000)

  try {
    const [newOrg] = await db.insert(organizations).values({
        name,
        slug,
        userId: dbUser.id,
        active: true,
    }).returning()

    await db.update(users)
        .set({ organizationId: newOrg.id })
        .where(eq(users.authId, user.id))

  } catch (e: any) {
      console.error(e)
      return { error: e.message || "Failed to create organization" }
  }

  revalidatePath('/', 'layout')
  revalidatePath('/onboarding')
  redirect('/')
}
