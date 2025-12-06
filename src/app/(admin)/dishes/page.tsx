import { getUser } from "@/lib/auth";
import { db } from "@/db";
import { dishes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import DishTableRow from "./_components/DishTableRow";

export default async function DishesPage() {
    const user = await getUser();

    if (!user || !user.organizationId) {
        redirect('/onboarding');
    }

    const data = await db.select()
        .from(dishes)
        .where(eq(dishes.organizationId, user.organizationId))
        .orderBy(desc(dishes.createdAt));

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Pratos</h1>
                <Link href="/dishes/new/edit" className="px-4 py-2 text-white bg-brand-500 rounded-lg hover:bg-brand-600">
                    Novo Prato
                </Link>
            </div>

            <div className="overflow-hidden bg-white rounded-xl shadow-sm dark:bg-gray-800">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-sm text-gray-500 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                            <th className="p-4 font-medium">Nome</th>
                            <th className="p-4 font-medium">Preço</th>
                            <th className="p-4 font-medium">Ativo</th>
                            <th className="p-4 font-medium">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(dish => (
                            <DishTableRow key={dish.id} dish={dish} />
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">Nenhum prato encontrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

