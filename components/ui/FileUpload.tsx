'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { getSignedUploadUrl } from '@/lib/api';

interface FileUploadProps {
    label?: string;
    maxFiles?: number;
    accept?: string;
    onFilesChange: (files: Array<{ url: string; type: 'IMAGE' | 'VIDEO'; sortOrder: number; file?: File }>) => void;
    initialFiles?: Array<{ url: string; type: 'IMAGE' | 'VIDEO'; sortOrder: number }>;
}

export function FileUpload({
    label = "Rasmlar yuklash",
    maxFiles = 5,
    accept = "image/*,video/*",
    onFilesChange,
    initialFiles = []
}: FileUploadProps) {
    const [files, setFiles] = useState<{ url: string; type: 'IMAGE' | 'VIDEO'; sortOrder: number; file?: File }[]>(() => {
        // Filter out any blob URLs from initialFiles on mount
        const validInitialFiles = initialFiles.filter(f => !f.url.startsWith('blob:'));
        return validInitialFiles;
    });
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const blobUrlsRef = useRef<Set<string>>(new Set());

    // Cleanup all blob URLs on unmount
    useEffect(() => {
        return () => {
            blobUrlsRef.current.forEach(url => {
                URL.revokeObjectURL(url);
            });
            blobUrlsRef.current.clear();
        };
    }, []);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length === 0) return;

        if (files.length + selectedFiles.length > maxFiles) {
            alert(`Maksimal ${maxFiles} ta fayl yuklash mumkin`);
            return;
        }

        setIsUploading(true);

        try {
            const newFiles = selectedFiles.map((file, idx) => {
                const type: 'IMAGE' | 'VIDEO' = file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE';
                const objectUrl = URL.createObjectURL(file);

                // Track blob URL for cleanup
                blobUrlsRef.current.add(objectUrl);

                return {
                    url: objectUrl,
                    type,
                    sortOrder: files.length + idx,
                    file
                };
            });

            const updatedFiles = [...files, ...newFiles];
            setFiles(updatedFiles);
            onFilesChange(updatedFiles);
        } catch (error) {
            console.error('Upload failed', error);
            alert('Rasmlarni yuklashda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');
        } finally {
            setIsUploading(false);
            // Reset input
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    const removeFile = (index: number) => {
        const fileToRemove = files[index];

        // Revoke blob URL before removing
        if (fileToRemove.url.startsWith('blob:')) {
            URL.revokeObjectURL(fileToRemove.url);
            blobUrlsRef.current.delete(fileToRemove.url);
        }

        const updatedFiles = files.filter((_, i) => i !== index)
            .map((file, idx) => ({ ...file, sortOrder: idx })); // Reorder

        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
    };

    return (
        <div className="w-full">
            {label && <label className="label">{label}</label>}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {files.map((file, index) => (
                    <div key={index} className="relative aspect-square bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden group border border-slate-200 dark:border-slate-600">
                        {file.type === 'VIDEO' ? (
                            <video
                                src={file.url}
                                className="w-full h-full object-cover"
                                aria-label={`Yuklangan video ${index + 1}`}
                                onError={(e) => {
                                    console.warn('Video load error:', file.url);
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        ) : (
                            <img
                                src={file.url}
                                alt={`Yuklangan rasm ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    console.warn('Image load error:', file.url);
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        )}

                        <button
                            onClick={() => removeFile(index)}
                            className="absolute top-2 right-2 p-1 bg-white dark:bg-slate-800 rounded-full shadow-sm hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            type="button"
                            aria-label={`${index + 1}-faylni o'chirish`}
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 rounded text-xs text-white">
                            {file.type === 'VIDEO' ? 'Video' : 'Rasm'} #{index + 1}
                        </div>
                    </div>
                ))}

                {files.length < maxFiles && (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={isUploading}
                        className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Fayl yuklash"
                    >
                        {isUploading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-2" />
                                <span className="text-sm text-slate-500 dark:text-slate-400">Yuklash</span>
                            </>
                        )}
                    </button>
                )}
            </div>

            <input
                type="file"
                ref={inputRef}
                onChange={handleFileSelect}
                className="hidden"
                multiple
                accept={accept}
            />

            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                Maksimal {maxFiles} ta fayl. JPG, PNG va MP4 formatlar.
            </p>
        </div>
    );
}
