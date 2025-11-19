import { getUser } from "@/lib/auth";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import DishForm from "../_components/DishForm";
import { redirect } from "next/navigation";

export default async function CreateDishPage() {
    const user = await getUser();
    if (!user || !user.organizationId) {
        redirect('/onboarding');
    }

    const categoriesList = await db.select().from(categories).where(eq(categories.organizationId, user.organizationId));

    return (
         <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Novo Prato</h1>
            <DishForm categories={categoriesList} />
         </div>
    )
}
