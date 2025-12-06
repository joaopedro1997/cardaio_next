"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";

interface DishTableRowProps {
    dish: {
        id: number;
        name: string;
        description: string | null;
        price: string | null;
        active: boolean | null;
    };
}

export default function DishTableRow({ dish }: DishTableRowProps) {
    const router = useRouter();

    const handleRowClick = (e: React.MouseEvent) => {
        // Prevent navigation if clicking directly on an anchor tag
        if ((e.target as HTMLElement).closest("a")) {
            return;
        }
        router.push(`/dishes/${dish.id}/edit`);
    };

    return (
        <tr
            onClick={handleRowClick}
            className="border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
        >
            <td className="p-4 text-gray-800 dark:text-gray-200">
                <div>
                    <div className="font-medium">{dish.name}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">
                        {dish.description}
                    </div>
                </div>
            </td>
            <td className="p-4 text-gray-800 dark:text-gray-200">
                {dish.price ? `R$ ${Number(dish.price).toFixed(2)}` : "-"}
            </td>
            <td className="p-4">
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${dish.active
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                >
                    {dish.active ? "Sim" : "Não"}
                </span>
            </td>
            <td className="p-4">
                <Link
                    href={`/dishes/${dish.id}/edit`}
                    className="text-sm font-medium text-brand-500 hover:text-brand-600"
                >
                    Editar
                </Link>
            </td>
        </tr>
    );
}
