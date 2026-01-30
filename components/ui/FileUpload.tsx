'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Video } from 'lucide-react';
import { getSignedUploadUrl } from '@/lib/api';

interface FileUploadProps {
    label?: string;
    maxFiles?: number;
    accept?: string;
    onFilesChange: (files: Array<{ url: string; type: 'IMAGE' | 'VIDEO'; file?: File }>) => void;
    initialFiles?: Array<{ url: string; type: 'IMAGE' | 'VIDEO' }>;
}

export function FileUpload({
    label = "Rasmlar yuklash",
    maxFiles = 5,
    accept = "image/*,video/*",
    onFilesChange,
    initialFiles = []
}: FileUploadProps) {
    const [files, setFiles] = useState<{ url: string; type: 'IMAGE' | 'VIDEO'; file?: File }[]>(initialFiles);
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length === 0) return;

        if (files.length + selectedFiles.length > maxFiles) {
            alert(`Maksimal ${maxFiles} ta fayl yuklash mumkin`);
            return;
        }

        setIsUploading(true);

        try {
            const newFiles = await Promise.all(selectedFiles.map(async (file) => {
                const type = file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE';

                // 1. Get signed URL
                const { uploadUrl, fileUrl } = await getSignedUploadUrl('listing', file.type);

                // 2. Upload to S3 (Mocking fetch for now as placeholder endpoint doesn't actually work)
                // await fetch(uploadUrl, { method: 'PUT', body: file });

                // For current mock setup, we just return a blob URL or placeholder
                const objectUrl = URL.createObjectURL(file);

                return {
                    url: objectUrl, // In real app: fileUrl
                    type,
                    file
                };
            }));

            const updatedFiles = [...files, ...newFiles];
            setFiles(updatedFiles);
            onFilesChange(updatedFiles);
        } catch (error) {
            console.error('Upload failed', error);
            alert('Yuklashda xatolik yuz berdi');
        } finally {
            setIsUploading(false);
            // Reset input
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    const removeFile = (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
    };

    return (
        <div className="w-full">
            {label && <label className="label">{label}</label>}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {files.map((file, index) => (
                    <div key={index} className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden group border border-slate-200">
                        {file.type === 'VIDEO' ? (
                            <video src={file.url} className="w-full h-full object-cover" />
                        ) : (
                            <img src={file.url} alt="Preview" className="w-full h-full object-cover" />
                        )}

                        <button
                            onClick={() => removeFile(index)}
                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors"
                            type="button"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 rounded text-xs text-white">
                            {file.type === 'VIDEO' ? 'Video' : 'Rasm'}
                        </div>
                    </div>
                ))}

                {files.length < maxFiles && (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={isUploading}
                        className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-slate-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                <span className="text-sm text-slate-500">Yuklash</span>
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

            <p className="text-xs text-slate-400 mt-2">
                Maksimal {maxFiles} ta fayl. JPG, PNG va MP4 formatlar.
            </p>
        </div>
    );
}
