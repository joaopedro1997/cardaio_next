import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import AdminLayoutClient from "@/layout/AdminLayoutClient";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
console.log({user});
  if (!user) {
    redirect("/signin");
  }

  // Fetch user from DB to check organization
  const dbUser = await db.query.users.findFirst({
    where: eq(users.authId, user.id),
  });
console.log(dbUser);
  // If user doesn't exist in DB (should have been created on auth) or has no organization
  if (!dbUser || !dbUser.organizationId) {
    redirect("/onboarding");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
