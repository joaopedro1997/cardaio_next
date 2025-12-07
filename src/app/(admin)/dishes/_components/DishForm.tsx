"use client";

import React, { useActionState, useState, useEffect } from "react";
import { createDish } from "../actions";
import Link from "next/link";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Switch from "@/components/ui/switch/Switch";

type DishData = {
    id?: number;
    name: string;
    description: string | null;
    price: string | null;
    active: boolean | null;
    categories?: number[];
    isVegan: boolean | null;
    isVegetarian: boolean | null;
    ingredients: string | null;
    calories: number | null;
    allergens: string | null;
    portionSize: string | null;
    spiceLevel: number | null;
    chefNotes: string | null;
    order: number | null;
};

type Props = {
    categories: any[];
    initialData?: DishData;
    action?: (prevState: any, formData: FormData) => Promise<any>;
};

export default function DishForm({ categories, initialData, action = createDish }: Props) {
    const [state, formAction, isPending] = useActionState(action, null);

    // Boolean states
    const [isActive, setIsActive] = useState(initialData?.active ?? true);
    const [isVegan, setIsVegan] = useState(initialData?.isVegan ?? false);
    const [isVegetarian, setIsVegetarian] = useState(initialData?.isVegetarian ?? false);

    // Price state management
    const [displayPrice, setDisplayPrice] = useState("");
    const [price, setPrice] = useState("");

    const isCategorySelected = (catId: number) => {
        return initialData?.categories?.includes(catId);
    };

    useEffect(() => {
        if (initialData?.price) {
            const val = parseFloat(initialData.price);
            if (!isNaN(val)) {
                setPrice(val.toFixed(2));
                setDisplayPrice(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val));
            }
        }
    }, [initialData?.price]);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        value = value.replace(/\D/g, "");

        if (!value) {
            setDisplayPrice("");
            setPrice("");
            return;
        }

        const floatValue = parseFloat(value) / 100;
        const formatted = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(floatValue);

        setDisplayPrice(formatted);
        setPrice(floatValue.toFixed(2));
    };

    const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700 first:border-0 first:pt-0">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {children}
            </div>
        </div>
    );

    const BooleanField = ({ label, name, checked, onChange }: { label: string, name: string, checked: boolean, onChange: (val: boolean) => void }) => (
        <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <Label className="mb-0 cursor-pointer flex-1" onClick={() => onChange(!checked)}>{label}</Label>
            <Switch checked={checked} onChange={onChange} />
            <input type="hidden" name={name} value={checked ? "on" : "off"} />
        </div>
    );

    return (
        <form action={formAction} className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800 mx-auto flex flex-col gap-6">
            {state?.error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
                    {state.error}
                </div>
            )}

            {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

            <Section title="Informações Básicas">
                <div className="col-span-1 md:col-span-2">
                    <Label>Nome do Prato*</Label>
                    <Input name="name" placeholder="Ex: Pizza Calabresa" defaultValue={initialData?.name} required />
                </div>

                <div>
                    <Label>Preço</Label>
                    <Input
                        value={displayPrice}
                        onChange={handlePriceChange}
                        placeholder="R$ 0,00"
                    />
                    <input type="hidden" name="price" value={price} />
                </div>

                <div>
                    <Label>Ordem de Exibição</Label>
                    <Input name="order" type="number" placeholder="0" defaultValue={initialData?.order?.toString() ?? "0"} />
                </div>

                <div className="col-span-1 md:col-span-2">
                    <Label>Descrição</Label>
                    <Input name="description" placeholder="Uma breve descrição..." defaultValue={initialData?.description || ''} />
                </div>
            </Section>

            <Section title="Categorias">
                <div className="col-span-1 md:col-span-2">
                    <div className="flex flex-wrap gap-3 border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
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
                        {categories.length === 0 && <span className="text-sm text-gray-500">Nenhuma categoria cadastrada.</span>}
                    </div>
                </div>
            </Section>

            <Section title="Dietas e Restrições">
                <BooleanField label="Vegano" name="isVegan" checked={isVegan} onChange={setIsVegan} />
                <BooleanField label="Vegetariano" name="isVegetarian" checked={isVegetarian} onChange={setIsVegetarian} />
            </Section>

            <Section title="Detalhes do Prato">
                <div>
                    <Label>Ingredientes</Label>
                    <Input name="ingredients" placeholder="Lista de ingredientes" defaultValue={initialData?.ingredients || ''} />
                </div>

                <div>
                    <Label>Calorias</Label>
                    <Input name="calories" type="number" placeholder="Ex: 350" defaultValue={initialData?.calories?.toString() || ''} />
                </div>

                <div>
                    <Label>Alergenos</Label>
                    <Input name="allergens" placeholder="Ex: Glúten, Lactose" defaultValue={initialData?.allergens || ''} />
                </div>

                <div>
                    <Label>Tamanho da Porção</Label>
                    <Input name="portionSize" placeholder="Ex: 300g, 2 Pessoas" defaultValue={initialData?.portionSize || ''} />
                </div>

                <div>
                    <Label>Nível de Pimenta (0-5)</Label>
                    <Input name="spiceLevel" type="number" min="0" max="5" placeholder="0" defaultValue={initialData?.spiceLevel?.toString() || ''} />
                </div>

                <div>
                    <Label>Notas do Chef</Label>
                    <Input name="chefNotes" placeholder="Dicas ou observações especiais" defaultValue={initialData?.chefNotes || ''} />
                </div>
            </Section>

            <Section title="Status">
                <BooleanField label="Prato Ativo (Visível no cardápio)" name="active" checked={isActive} onChange={setIsActive} />
            </Section>

            <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
                <Link
                    href="/dishes"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                    Cancelar
                </Link>
                <Button disabled={isPending}>
                    {isPending ? "Salvando..." : initialData ? "Salvar Alterações" : "Criar Prato"}
                </Button>
            </div>
        </form>
    );
}