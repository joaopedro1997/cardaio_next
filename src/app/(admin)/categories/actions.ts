'use server'

import { getUser } from "@/lib/auth";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";

export async function createCategory(prevState: any, formData: FormData) {
    const user = await getUser();
    if (!user || !user.organizationId) return { error: "Unauthorized" };

    const name = formData.get('name') as string;
    const active = formData.get('active') === 'on';

    if (!name) return { error: "Name is required" };

    try {
        await db.insert(categories).values({
            name,
            active,
            organizationId: user.organizationId
        });
    } catch (e: any) {
        return { error: "Failed to create category" };
    }

    revalidatePath('/categories');
    redirect('/categories');
}

export async function updateCategory(prevState: any, formData: FormData) {
    const user = await getUser();
    if (!user || !user.organizationId) return { error: "Unauthorized" };

    const id = parseInt(formData.get('id') as string);
    const name = formData.get('name') as string;
    const active = formData.get('active') === 'on';

    if (!id) return { error: "ID is required" };
    if (!name) return { error: "Name is required" };

    try {
        await db.update(categories)
            .set({ name, active })
            .where(and(
                eq(categories.id, id),
                eq(categories.organizationId, user.organizationId)
            ));
    } catch (e: any) {
        return { error: "Failed to update category" };
    }

    revalidatePath('/categories');
    redirect('/categories');
}
