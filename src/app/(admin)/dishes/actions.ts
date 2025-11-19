'use server'

import { getUser } from "@/lib/auth";
import { db } from "@/db";
import { dishes, dishCategories } from "@/db/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";

export async function createDish(prevState: any, formData: FormData) {
    const user = await getUser();
    if (!user || !user.organizationId) return { error: "Unauthorized" };

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const active = formData.get('active') === 'on';
    
    const categoryIds = formData.getAll('categories').map(id => parseInt(id as string));

    if (!name) return { error: "Name is required" };

    try {
        const [newDish] = await db.insert(dishes).values({
            name,
            description,
            price: price ? price.toString() : null,
            active,
            organizationId: user.organizationId
        }).returning();

        if (categoryIds.length > 0) {
            await db.insert(dishCategories).values(
                categoryIds.map(catId => ({
                    dishId: newDish.id,
                    categoryId: catId
                }))
            );
        }
    } catch (e: any) {
        console.error(e);
        return { error: "Failed to create dish" };
    }

    revalidatePath('/dishes');
    redirect('/dishes');
}

export async function updateDish(prevState: any, formData: FormData) {
    const user = await getUser();
    if (!user || !user.organizationId) return { error: "Unauthorized" };

    const id = parseInt(formData.get('id') as string);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const active = formData.get('active') === 'on';
    
    const categoryIds = formData.getAll('categories').map(id => parseInt(id as string));

    if (!id) return { error: "ID is required" };
    if (!name) return { error: "Name is required" };

    try {
        await db.update(dishes)
            .set({
                name,
                description,
                price: price ? price.toString() : null,
                active,
            })
            .where(and(
                eq(dishes.id, id),
                eq(dishes.organizationId, user.organizationId)
            ));

        // Update categories relation
        await db.delete(dishCategories).where(eq(dishCategories.dishId, id));

        if (categoryIds.length > 0) {
            await db.insert(dishCategories).values(
                categoryIds.map(catId => ({
                    dishId: id,
                    categoryId: catId
                }))
            );
        }

    } catch (e: any) {
        console.error(e);
        return { error: "Failed to update dish" };
    }

    revalidatePath('/dishes');
    redirect('/dishes');
}
