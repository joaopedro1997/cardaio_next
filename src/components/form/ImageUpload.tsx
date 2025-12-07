"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { createClient } from "@/lib/supabase/client";
import { TrashBinIcon, PlusIcon, CloseIcon } from "@/icons";
import Image from "next/image";

interface ImageUploadProps {
    value: string[];
    onChange: (value: string[]) => void;
    bucketName?: string;
    folderPath?: string;
}

export default function ImageUpload({
    value = [],
    onChange,
    bucketName = "dishes",
    folderPath = "public",
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const supabase = createClient();

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            setIsUploading(true);
            const newUrls: string[] = [];

            try {
                for (const file of acceptedFiles) {
                    const fileExt = file.name.split(".").pop();
                    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
                    const filePath = `${folderPath}/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from(bucketName)
                        .upload(filePath, file);

                    if (uploadError) {
                        console.error("Error uploading file:", uploadError);
                        alert(`Error uploading ${file.name}: ${uploadError.message}`);
                        continue;
                    }

                    const { data } = supabase.storage
                        .from(bucketName)
                        .getPublicUrl(filePath);

                    if (data?.publicUrl) {
                        newUrls.push(data.publicUrl);
                    }
                }

                if (newUrls.length > 0) {
                    onChange([...value, ...newUrls]);
                }
            } catch (error) {
                console.error("Upload error:", error);
            } finally {
                setIsUploading(false);
            }
        },
        [value, onChange, supabase, bucketName, folderPath]
    );

    const removeImage = (urlToRemove: string) => {
        onChange(value.filter((url) => url !== urlToRemove));
        // Optional: Delete from storage? Usually better to keep or handle via cleanup job to avoid accidental data loss if form isn't saved.
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [],
            "image/png": [],
            "image/webp": [],
            "image/heic": [],
        },
        disabled: isUploading,
    });

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {value.map((url) => (
                    <div
                        key={url}
                        className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                    >
                        <Image
                            src={url}
                            alt="Dish image"
                            fill
                            className="object-cover"
                        />
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                removeImage(url);
                            }}
                            type="button"
                            className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white shadow-sm hover:bg-red-600 focus:outline-none"
                        >
                            <TrashBinIcon className="h-4 w-4" />
                        </button>
                    </div>
                ))}

                <div
                    {...getRootProps()}
                    className={`flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${isDragActive
                            ? "border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-900/20"
                            : "border-gray-300 hover:border-brand-400 dark:border-gray-600 dark:hover:border-brand-400"
                        } ${isUploading ? "opacity-50 cursor-wait" : ""}`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                        {isUploading ? (
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-brand-600" />
                        ) : (
                            <>
                                <PlusIcon className="h-8 w-8 text-gray-400" />
                                <span className="text-sm text-gray-500">
                                    {isDragActive
                                        ? "Solte para enviar"
                                        : "Adicionar Imagem"}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <p className="text-xs text-gray-500">
                Formatos suportados: PNG, JPG, WEBP.
            </p>
        </div>
    );
}
