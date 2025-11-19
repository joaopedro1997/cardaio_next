import { getUser } from "@/lib/auth";
import { db } from "@/db";
import { dishes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

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
                    <tr key={dish.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="p-4 text-gray-800 dark:text-gray-200">
                            <div>
                                <div className="font-medium">{dish.name}</div>
                                <div className="text-xs text-gray-500 line-clamp-1">{dish.description}</div>
                            </div>
                        </td>
                        <td className="p-4 text-gray-800 dark:text-gray-200">
                            {dish.price ? `R$ ${Number(dish.price).toFixed(2)}` : '-'}
                        </td>
                        <td className="p-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${dish.active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                {dish.active ? 'Sim' : 'Não'}
                            </span>
                        </td>
                         <td className="p-4">
                            <Link href={`/dishes/${dish.id}/edit`} className="text-sm font-medium text-brand-500 hover:text-brand-600">
                                Editar
                            </Link>
                        </td>
                    </tr>
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

