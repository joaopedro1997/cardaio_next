import { getUser } from "@/lib/auth";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import CategoryForm from "../../_components/CategoryForm";
import { createCategory, updateCategory } from "../../actions";

type Props = {
    params: Promise<{ id: string }>
}

export default async function CategoryPage({ params }: Props) {
    const user = await getUser();
    if (!user || !user.organizationId) {
        redirect('/onboarding');
    }
    
    const { id } = await params;

    // Create Mode
    if (id === 'new') {
        return (
            <div>
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Nova Categoria</h1>
                </div>
                <CategoryForm action={createCategory} />
            </div>
        );
    }
    
    // Edit Mode
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
        notFound();
    }

    const category = await db.query.categories.findFirst({
        where: and(
            eq(categories.id, categoryId),
            eq(categories.organizationId, user.organizationId)
        )
    });

    if (!category) {
        notFound();
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Editar Categoria</h1>
            </div>
            <CategoryForm initialData={category} action={updateCategory} />
        </div>
    );
}
