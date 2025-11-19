import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { cache } from 'react'

export const getUser = cache(async () => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
    const dbUser = await db.query.users.findFirst({
        where: eq(users.authId, user.id)
    })
    return dbUser
})

