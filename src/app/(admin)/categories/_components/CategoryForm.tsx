"use client";

import React, { useActionState, useState } from "react";
import { createCategory } from "../actions";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Checkbox from "@/components/form/input/Checkbox";

type CategoryData = {
    id?: number;
    name: string;
    active: boolean | null;
};

type Props = {
    initialData?: CategoryData;
    action?: (prevState: any, formData: FormData) => Promise<any>;
};

export default function CategoryForm({ initialData, action = createCategory }: Props) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [isActive, setIsActive] = useState(initialData?.active ?? true);

  return (
    <form action={formAction} className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800 max-w-lg mx-auto">
       {state?.error && (
          <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
            {state.error}
          </div>
        )}
      
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

      <div className="mb-4">
        <Label>Nome da Categoria</Label>
        <Input 
            name="name" 
            placeholder="Ex: Bebidas" 
            defaultValue={initialData?.name} 
            required 
        />
      </div>
      <div className="mb-6 flex items-center gap-3">
        <Checkbox checked={isActive} onChange={setIsActive} />
        <Label className="mb-0">Ativo</Label>
        <input type="hidden" name="active" value={isActive ? "on" : "off"} />
      </div>
      <div className="flex gap-3">
        <Button className="w-full" disabled={isPending}>
            {isPending ? "Salvando..." : initialData ? "Atualizar Categoria" : "Salvar Categoria"}
        </Button>
      </div>
    </form>
  );
}

