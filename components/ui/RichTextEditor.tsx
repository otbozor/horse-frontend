'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import {
    Bold, Italic, Strikethrough, List, ListOrdered,
    Heading2, Heading3, Minus, Undo, Redo, Quote,
} from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export default function RichTextEditor({ value, onChange, placeholder, disabled }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: placeholder || 'Maqola matnini kiriting...',
            }),
        ],
        content: value,
        editable: !disabled,
        immediatelyRender: false,
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
    });

    // Edit sahifasida ma'lumot yuklanganida sync qilish
    useEffect(() => {
        if (!editor) return;
        const current = editor.getHTML();
        if (value !== current) {
            editor.commands.setContent(value || '', { emitUpdate: false });
        }
    }, [value, editor]);

    useEffect(() => {
        editor?.setEditable(!disabled);
    }, [disabled, editor]);

    if (!editor) return null;

    const ToolbarBtn = ({
        onClick, active, title, children,
    }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) => (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`p-1.5 rounded transition-colors ${
                active
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
        >
            {children}
        </button>
    );

    return (
        <div className="border border-slate-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent transition-all">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-slate-200 bg-slate-50">
                <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Qalin (Bold)">
                    <Bold className="w-4 h-4" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Kursiv (Italic)">
                    <Italic className="w-4 h-4" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Chizilgan">
                    <Strikethrough className="w-4 h-4" />
                </ToolbarBtn>

                <div className="w-px h-5 bg-slate-300 mx-1" />

                <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Katta sarlavha">
                    <Heading2 className="w-4 h-4" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Kichik sarlavha">
                    <Heading3 className="w-4 h-4" />
                </ToolbarBtn>

                <div className="w-px h-5 bg-slate-300 mx-1" />

                <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Ro'yxat">
                    <List className="w-4 h-4" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Raqamli ro'yxat">
                    <ListOrdered className="w-4 h-4" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Iqtibos">
                    <Quote className="w-4 h-4" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Chiziq" active={false}>
                    <Minus className="w-4 h-4" />
                </ToolbarBtn>

                <div className="w-px h-5 bg-slate-300 mx-1" />

                <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Orqaga" active={false}>
                    <Undo className="w-4 h-4" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Oldinga" active={false}>
                    <Redo className="w-4 h-4" />
                </ToolbarBtn>
            </div>

            {/* Editor */}
            <EditorContent
                editor={editor}
                className="
                    min-h-[300px] px-4 py-3 bg-white text-slate-900
                    [&_.tiptap]:outline-none [&_.tiptap]:min-h-[300px]
                    [&_.tiptap_h2]:text-xl [&_.tiptap_h2]:font-bold [&_.tiptap_h2]:mt-4 [&_.tiptap_h2]:mb-2
                    [&_.tiptap_h3]:text-lg [&_.tiptap_h3]:font-semibold [&_.tiptap_h3]:mt-3 [&_.tiptap_h3]:mb-1
                    [&_.tiptap_p]:mb-2 [&_.tiptap_p]:leading-relaxed
                    [&_.tiptap_strong]:font-bold
                    [&_.tiptap_em]:italic
                    [&_.tiptap_s]:line-through
                    [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-5 [&_.tiptap_ul]:mb-2
                    [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-5 [&_.tiptap_ol]:mb-2
                    [&_.tiptap_li]:mb-1
                    [&_.tiptap_blockquote]:border-l-4 [&_.tiptap_blockquote]:border-slate-300 [&_.tiptap_blockquote]:pl-4 [&_.tiptap_blockquote]:italic [&_.tiptap_blockquote]:text-slate-600 [&_.tiptap_blockquote]:my-2
                    [&_.tiptap_hr]:border-slate-300 [&_.tiptap_hr]:my-4
                    [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_p.is-editor-empty:first-child::before]:text-slate-400 [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0
                "
            />
        </div>
    );
}
