import { getUser } from "@/lib/auth";
import { db } from "@/db";
import { categories, dishes, dishCategories } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import DishForm from "../../_components/DishForm";
import { createDish, updateDish } from "../../actions";

type Props = {
    params: Promise<{ id: string }>
}

export default async function DishPage({ params }: Props) {
    const user = await getUser();
    if (!user || !user.organizationId) {
        redirect('/onboarding');
    }

    const { id } = await params;
    const isNew = id === 'new';

    // Fetch all categories for selection (needed for both create and edit)
    const categoriesList = await db.select().from(categories).where(eq(categories.organizationId, user.organizationId));

    if (isNew) {
        return (
            <div>
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Novo Prato</h1>
                </div>
                <DishForm categories={categoriesList} action={createDish} />
            </div>
        );
    }

    // Edit Mode logic
    const dishId = parseInt(id);
    if (isNaN(dishId)) {
        notFound();
    }

    const dish = await db.query.dishes.findFirst({
        where: and(
            eq(dishes.id, dishId),
            eq(dishes.organizationId, user.organizationId)
        )
    });

    if (!dish) {
        notFound();
    }

    const existingCategories = await db.select({ categoryId: dishCategories.categoryId })
        .from(dishCategories)
        .where(eq(dishCategories.dishId, dishId));

    const categoryIds = existingCategories.map(c => c.categoryId);

    const initialData = {
        ...dish,
        categories: categoryIds,
        images: dish.images as string[] | null | undefined
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Editar Prato</h1>
            </div>
            <DishForm categories={categoriesList} initialData={initialData} action={updateDish} />
        </div>
    );
}
