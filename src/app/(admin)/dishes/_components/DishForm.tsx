"use client";

import React, { useActionState, useState } from "react";
import { createDish } from "../actions";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Checkbox from "@/components/form/input/Checkbox";

type DishData = {
    id?: number;
    name: string;
    description: string | null;
    price: string | null; 
    active: boolean | null;
    categories?: number[]; 
};

type Props = {
    categories: any[]; 
    initialData?: DishData;
    action?: (prevState: any, formData: FormData) => Promise<any>;
};

export default function DishForm({ categories, initialData, action = createDish }: Props) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [isActive, setIsActive] = useState(initialData?.active ?? true);
  
  const isCategorySelected = (catId: number) => {
      return initialData?.categories?.includes(catId);
  };

  return (
    <form action={formAction} className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800 max-w-2xl mx-auto">
       {state?.error && (
          <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
            {state.error}
          </div>
        )}
      
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

      <div className="grid grid-cols-1 gap-6">
        <div>
            <Label>Nome do Prato</Label>
            <Input name="name" placeholder="Ex: Pizza Calabresa" defaultValue={initialData?.name} required />
        </div>
        
        <div>
            <Label>Descrição</Label>
            <Input name="description" placeholder="Ingredientes, detalhes..." defaultValue={initialData?.description || ''} />
        </div>

        <div>
            <Label>Preço (R$)</Label>
            <Input name="price" type="number" step="0.01" placeholder="0.00" defaultValue={initialData?.price || ''} />
        </div>

        <div>
            <Label>Categorias</Label>
            <div className="flex flex-wrap gap-3 mt-2 border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                {categories.map(cat => (
                    <label key={cat.id} className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input 
                            type="checkbox" 
                            name="categories" 
                            value={cat.id} 
                            defaultChecked={isCategorySelected(cat.id)}
                            className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{cat.name}</span>
                    </label>
                ))}
                 {categories.length === 0 && <span className="text-sm text-gray-500">Nenhuma categoria cadastrada. Crie categorias primeiro.</span>}
            </div>
        </div>

        <div className="flex items-center gap-3">
            <Checkbox checked={isActive} onChange={setIsActive} />
            <Label className="mb-0">Ativo</Label>
            <input type="hidden" name="active" value={isActive ? "on" : "off"} />
        </div>

        <Button className="w-full" disabled={isPending}>
            {isPending ? "Salvando..." : initialData ? "Atualizar Prato" : "Salvar Prato"}
        </Button>
      </div>
    </form>
  );
}

