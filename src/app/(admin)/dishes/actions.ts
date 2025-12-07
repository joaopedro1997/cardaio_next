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

    // New Boolean Fields
    const isVegan = formData.get('isVegan') === 'on';
    const isVegetarian = formData.get('isVegetarian') === 'on';

    // New Text/Number Fields
    const ingredients = formData.get('ingredients') as string;
    const allergens = formData.get('allergens') as string;
    const portionSize = formData.get('portionSize') as string;
    const chefNotes = formData.get('chefNotes') as string;

    const caloriesRaw = formData.get('calories');
    const calories = caloriesRaw ? parseInt(caloriesRaw as string) : null;

    const imagesRaw = formData.get('images');
    let images: string[] = [];
    try {
        if (imagesRaw && typeof imagesRaw === 'string') {
            images = JSON.parse(imagesRaw);
        }
    } catch (e) { console.error("Failed to parse images", e) }

    const spiceLevelRaw = formData.get('spiceLevel');
    const spiceLevel = spiceLevelRaw ? parseInt(spiceLevelRaw as string) : null;

    const orderRaw = formData.get('order');
    const order = orderRaw ? parseInt(orderRaw as string) : 0;

    const categoryIds = formData.getAll('categories').map(id => parseInt(id as string));

    if (!name) return { error: "Name is required" };

    try {
        const [newDish] = await db.insert(dishes).values({
            name,
            description,
            price: price ? price.toString() : null,
            active,
            organizationId: user.organizationId,
            isVegan,
            isVegetarian,
            ingredients,
            calories,
            allergens,
            portionSize,
            images,
            spiceLevel,
            chefNotes,
            order,
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

    // New Boolean Fields
    const isVegan = formData.get('isVegan') === 'on';
    const isVegetarian = formData.get('isVegetarian') === 'on';

    // New Text/Number Fields
    const ingredients = formData.get('ingredients') as string;
    const allergens = formData.get('allergens') as string;
    const portionSize = formData.get('portionSize') as string;
    const chefNotes = formData.get('chefNotes') as string;

    const caloriesRaw = formData.get('calories');
    const calories = caloriesRaw ? parseInt(caloriesRaw as string) : null;

    const imagesRaw = formData.get('images');
    let images: string[] = [];
    try {
        if (imagesRaw && typeof imagesRaw === 'string') {
            images = JSON.parse(imagesRaw);
        }
    } catch (e) { console.error("Failed to parse images", e) }

    const spiceLevelRaw = formData.get('spiceLevel');
    const spiceLevel = spiceLevelRaw ? parseInt(spiceLevelRaw as string) : null;

    const orderRaw = formData.get('order');
    const order = orderRaw ? parseInt(orderRaw as string) : 0;

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
                isVegan,
                isVegetarian,
                ingredients,
                calories,
                allergens,
                portionSize,
                spiceLevel,
                chefNotes,
                images,
                order,
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
