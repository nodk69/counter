import { useState, useRef, useEffect, useCallback, memo } from 'react';
import type { Editor } from '@tiptap/react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Undo2, Redo2,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Link as LinkIcon, Unlink,
  Type, ChevronDown, Paintbrush, Highlighter, CaseSensitive,
  Heading1, Heading2, Heading3, Pilcrow, Search, Trash2,
  Upload, Download, ClipboardCopy, Scissors, MousePointerClick,
  History,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { convertCase, type CaseType } from '@/utils/editor/caseConvert';

// ── Constants ───────────────────────────────────────────────────────────

const FONT_FAMILIES = [
  { label: 'Default', value: '' },
  { label: 'Inter', value: 'Inter' },
  { label: 'Arial', value: 'Arial' },
  { label: 'Helvetica', value: 'Helvetica' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Poppins', value: 'Poppins' },
  { label: 'Times New Roman', value: 'Times New Roman' },
];

const FONT_SIZES = [
  { label: '10', value: '10px' },
  { label: '12', value: '12px' },
  { label: '14', value: '14px' },
  { label: '16', value: '16px' },
  { label: '18', value: '18px' },
  { label: '20', value: '20px' },
  { label: '24', value: '24px' },
  { label: '28', value: '28px' },
  { label: '32', value: '32px' },
];

const LINE_HEIGHTS = [
  { label: '1', value: '1' },
  { label: '1.15', value: '1.15' },
  { label: '1.5', value: '1.5' },
  { label: '2', value: '2' },
  { label: '2.5', value: '2.5' },
  { label: '3', value: '3' },
];

const TEXT_COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#cccccc', '#ffffff',
  '#e03131', '#c2255c', '#9c36b5', '#6741d9', '#3b5bdb', '#1971c2',
  '#0c8599', '#099268', '#2f9e44', '#66a80f', '#f08c00', '#e8590c',
];

const HIGHLIGHT_COLORS = [
  '#fef08a', '#bef264', '#6ee7b7', '#67e8f9', '#a5b4fc', '#c4b5fd',
  '#f9a8d4', '#fca5a5', '#fdba74', '#fde68a', '#d9f99d', '#a7f3d0',
];

const CASE_OPTIONS: { label: string; value: CaseType }[] = [
  { label: 'UPPERCASE', value: 'upper' },
  { label: 'lowercase', value: 'lower' },
  { label: 'Title Case', value: 'title' },
  { label: 'Sentence case', value: 'sentence' },
  { label: 'tOGGLE cASE', value: 'toggle' },
];

// ── Dropdown Hook ───────────────────────────────────────────────────────

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return { open, setOpen, ref };
}

// ── Toolbar Button ──────────────────────────────────────────────────────

interface TBProps {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
}

const ToolbarButton = memo(function ToolbarButton({ icon, label, shortcut, onClick, isActive, disabled }: TBProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={`editor-toolbar-btn ${isActive ? 'is-active' : ''}`}
          aria-label={label}
          aria-pressed={isActive}
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        {label}{shortcut && <span className="ml-1.5 text-[10px] opacity-60">{shortcut}</span>}
      </TooltipContent>
    </Tooltip>
  );
});

// ── Separator ───────────────────────────────────────────────────────────

function Sep() {
  return <div className="editor-toolbar-sep" />;
}

// ── Main Toolbar ────────────────────────────────────────────────────────

interface EditorToolbarProps {
  editor: Editor;
  onToggleSearch: () => void;
  showSearch: boolean;
  onImport: () => void;
  onExportTxt: () => void;
  onExportHtml: () => void;
  onExportMd: () => void;
  onExportPdf: () => void;
  onClear: () => void;
  onToggleVersionHistory: () => void;
}

function EditorToolbar({
  editor,
  onToggleSearch,
  showSearch,
  onImport,
  onExportTxt,
  onExportHtml,
  onExportMd,
  onExportPdf,
  onClear,
  onToggleVersionHistory,
}: EditorToolbarProps) {
  const fontDropdown = useDropdown();
  const sizeDropdown = useDropdown();
  const lineHeightDropdown = useDropdown();
  const headingDropdown = useDropdown();
  const textColorDropdown = useDropdown();
  const highlightDropdown = useDropdown();
  const caseDropdown = useDropdown();
  const exportDropdown = useDropdown();

  // ── Copy / Cut / Select All ────────────────────────────────────────
  const handleCopy = useCallback(() => {
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, '\n');
    if (text) navigator.clipboard.writeText(text);
  }, [editor]);

  const handleCut = useCallback(() => {
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, '\n');
    if (text) {
      navigator.clipboard.writeText(text);
      editor.commands.deleteSelection();
    }
  }, [editor]);

  const handleSelectAll = useCallback(() => {
    editor.commands.selectAll();
  }, [editor]);

  // ── Link ───────────────────────────────────────────────────────────
  const handleLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href || '';
    const url = window.prompt('Enter URL:', previousUrl);
    if (url === null) return; // cancelled
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  }, [editor]);

  // ── Case Convert ───────────────────────────────────────────────────
  const handleCaseConvert = useCallback(
    (caseType: CaseType) => {
      const { from, to, empty } = editor.state.selection;
      if (empty) {
        // Apply to entire document
        const fullText = editor.getText();
        const converted = convertCase(fullText, caseType);
        editor.commands.setContent(`<p>${converted.replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br>')}</p>`);
      } else {
        const selectedText = editor.state.doc.textBetween(from, to, '\n');
        const converted = convertCase(selectedText, caseType);
        editor.chain().focus().insertContentAt({ from, to }, converted).run();
      }
      caseDropdown.setOpen(false);
    },
    [editor, caseDropdown]
  );

  // ── Get current heading level label ────────────────────────────────
  const getHeadingLabel = () => {
    if (editor.isActive('heading', { level: 1 })) return 'H1';
    if (editor.isActive('heading', { level: 2 })) return 'H2';
    if (editor.isActive('heading', { level: 3 })) return 'H3';
    return 'P';
  };

  // ── Get current font family ────────────────────────────────────────
  const getCurrentFont = () => {
    const attrs = editor.getAttributes('textStyle');
    return attrs?.fontFamily || 'Default';
  };

  // ── Get current font size ──────────────────────────────────────────
  const getCurrentSize = () => {
    const attrs = editor.getAttributes('textStyle');
    return attrs?.fontSize || '16px';
  };

  return (
    <div className="editor-toolbar" role="toolbar" aria-label="Editor formatting toolbar">
      {/* ── History ─────────────────────────────────────────────────── */}
      <ToolbarButton icon={<Undo2 className="w-4 h-4" />} label="Undo" shortcut="Ctrl+Z" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} />
      <ToolbarButton icon={<Redo2 className="w-4 h-4" />} label="Redo" shortcut="Ctrl+Y" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} />

      <Sep />

      {/* ── Clipboard ───────────────────────────────────────────────── */}
      <ToolbarButton icon={<ClipboardCopy className="w-4 h-4" />} label="Copy" shortcut="Ctrl+C" onClick={handleCopy} />
      <ToolbarButton icon={<Scissors className="w-4 h-4" />} label="Cut" shortcut="Ctrl+X" onClick={handleCut} />
      <ToolbarButton icon={<MousePointerClick className="w-4 h-4" />} label="Select All" shortcut="Ctrl+A" onClick={handleSelectAll} />

      <Sep />

      {/* ── Text Style ──────────────────────────────────────────────── */}
      <ToolbarButton icon={<Bold className="w-4 h-4" />} label="Bold" shortcut="Ctrl+B" onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} />
      <ToolbarButton icon={<Italic className="w-4 h-4" />} label="Italic" shortcut="Ctrl+I" onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} />
      <ToolbarButton icon={<UnderlineIcon className="w-4 h-4" />} label="Underline" shortcut="Ctrl+U" onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} />
      <ToolbarButton icon={<Strikethrough className="w-4 h-4" />} label="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} />

      <Sep />

      {/* ── Headings Dropdown ───────────────────────────────────────── */}
      <div className="relative" ref={headingDropdown.ref}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="editor-toolbar-select"
              onClick={() => headingDropdown.setOpen(!headingDropdown.open)}
              aria-label="Heading level"
            >
              <Pilcrow className="w-3.5 h-3.5" />
              <span>{getHeadingLabel()}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Heading Level</TooltipContent>
        </Tooltip>
        {headingDropdown.open && (
          <div className="editor-dropdown">
            <button className={`editor-dropdown-item ${editor.isActive('paragraph') ? 'is-active' : ''}`} onClick={() => { editor.chain().focus().setParagraph().run(); headingDropdown.setOpen(false); }}>
              <Pilcrow className="w-4 h-4" /> Paragraph
            </button>
            <button className={`editor-dropdown-item ${editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}`} onClick={() => { editor.chain().focus().toggleHeading({ level: 1 }).run(); headingDropdown.setOpen(false); }}>
              <Heading1 className="w-4 h-4" /> Heading 1
            </button>
            <button className={`editor-dropdown-item ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`} onClick={() => { editor.chain().focus().toggleHeading({ level: 2 }).run(); headingDropdown.setOpen(false); }}>
              <Heading2 className="w-4 h-4" /> Heading 2
            </button>
            <button className={`editor-dropdown-item ${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`} onClick={() => { editor.chain().focus().toggleHeading({ level: 3 }).run(); headingDropdown.setOpen(false); }}>
              <Heading3 className="w-4 h-4" /> Heading 3
            </button>
          </div>
        )}
      </div>

      <Sep />

      {/* ── Alignment ───────────────────────────────────────────────── */}
      <ToolbarButton icon={<AlignLeft className="w-4 h-4" />} label="Align Left" onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} />
      <ToolbarButton icon={<AlignCenter className="w-4 h-4" />} label="Align Center" onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} />
      <ToolbarButton icon={<AlignRight className="w-4 h-4" />} label="Align Right" onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} />
      <ToolbarButton icon={<AlignJustify className="w-4 h-4" />} label="Justify" onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} />

      <Sep />

      {/* ── Lists ───────────────────────────────────────────────────── */}
      <ToolbarButton icon={<List className="w-4 h-4" />} label="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} />
      <ToolbarButton icon={<ListOrdered className="w-4 h-4" />} label="Numbered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} />

      <Sep />

      {/* ── Font Family Dropdown ────────────────────────────────────── */}
      <div className="relative" ref={fontDropdown.ref}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" className="editor-toolbar-select" onClick={() => fontDropdown.setOpen(!fontDropdown.open)} aria-label="Font family">
              <Type className="w-3.5 h-3.5" />
              <span className="max-w-[5rem] truncate">{getCurrentFont()}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Font Family</TooltipContent>
        </Tooltip>
        {fontDropdown.open && (
          <div className="editor-dropdown" style={{ minWidth: '12rem' }}>
            {FONT_FAMILIES.map((f) => (
              <button
                key={f.value}
                className={`editor-dropdown-item ${getCurrentFont() === (f.value || 'Default') ? 'is-active' : ''}`}
                style={{ fontFamily: f.value || 'inherit' }}
                onClick={() => {
                  if (f.value) {
                    editor.chain().focus().setFontFamily(f.value).run();
                  } else {
                    editor.chain().focus().unsetFontFamily().run();
                  }
                  fontDropdown.setOpen(false);
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Font Size Dropdown ──────────────────────────────────────── */}
      <div className="relative" ref={sizeDropdown.ref}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" className="editor-toolbar-select" onClick={() => sizeDropdown.setOpen(!sizeDropdown.open)} aria-label="Font size">
              <span>{getCurrentSize().replace('px', '')}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Font Size</TooltipContent>
        </Tooltip>
        {sizeDropdown.open && (
          <div className="editor-dropdown" style={{ minWidth: '5rem' }}>
            {FONT_SIZES.map((s) => (
              <button
                key={s.value}
                className={`editor-dropdown-item ${getCurrentSize() === s.value ? 'is-active' : ''}`}
                onClick={() => {
                  editor.chain().focus().setFontSize(s.value).run();
                  sizeDropdown.setOpen(false);
                }}
              >
                {s.label}px
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Line Height Dropdown ────────────────────────────────────── */}
      <div className="relative" ref={lineHeightDropdown.ref}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" className="editor-toolbar-select" onClick={() => lineHeightDropdown.setOpen(!lineHeightDropdown.open)} aria-label="Line height">
              <span className="text-[10px]">↕</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Line Height</TooltipContent>
        </Tooltip>
        {lineHeightDropdown.open && (
          <div className="editor-dropdown" style={{ minWidth: '5rem' }}>
            {LINE_HEIGHTS.map((lh) => (
              <button
                key={lh.value}
                className="editor-dropdown-item"
                onClick={() => {
                  editor.chain().focus().setLineHeight(lh.value).run();
                  lineHeightDropdown.setOpen(false);
                }}
              >
                {lh.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <Sep />

      {/* ── Text Color ──────────────────────────────────────────────── */}
      <div className="relative" ref={textColorDropdown.ref}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="editor-toolbar-btn"
              onClick={() => textColorDropdown.setOpen(!textColorDropdown.open)}
              aria-label="Text color"
            >
              <Paintbrush className="w-4 h-4" />
              <div className="w-3 h-0.5 mt-px rounded-full" style={{ background: editor.getAttributes('textStyle')?.color || 'currentColor' }} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Text Color</TooltipContent>
        </Tooltip>
        {textColorDropdown.open && (
          <div className="editor-dropdown" style={{ minWidth: '12rem' }}>
            <div className="editor-color-grid">
              {TEXT_COLORS.map((color) => (
                <button
                  key={color}
                  className={`editor-color-swatch ${editor.getAttributes('textStyle')?.color === color ? 'is-active' : ''}`}
                  style={{ background: color }}
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    textColorDropdown.setOpen(false);
                  }}
                  aria-label={`Text color ${color}`}
                />
              ))}
            </div>
            <div className="px-3 py-2 border-t border-border">
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                Custom:
                <input
                  type="color"
                  className="w-6 h-6 rounded border-0 cursor-pointer"
                  value={editor.getAttributes('textStyle')?.color || '#000000'}
                  onChange={(e) => {
                    editor.chain().focus().setColor(e.target.value).run();
                  }}
                />
              </label>
            </div>
            <button
              className="editor-dropdown-item text-xs text-muted-foreground"
              onClick={() => {
                editor.chain().focus().unsetColor().run();
                textColorDropdown.setOpen(false);
              }}
            >
              Remove Color
            </button>
          </div>
        )}
      </div>

      {/* ── Highlight Color ─────────────────────────────────────────── */}
      <div className="relative" ref={highlightDropdown.ref}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className={`editor-toolbar-btn ${editor.isActive('highlight') ? 'is-active' : ''}`}
              onClick={() => highlightDropdown.setOpen(!highlightDropdown.open)}
              aria-label="Highlight color"
            >
              <Highlighter className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Highlight</TooltipContent>
        </Tooltip>
        {highlightDropdown.open && (
          <div className="editor-dropdown" style={{ minWidth: '12rem' }}>
            <div className="editor-color-grid">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color}
                  className="editor-color-swatch"
                  style={{ background: color }}
                  onClick={() => {
                    editor.chain().focus().toggleHighlight({ color }).run();
                    highlightDropdown.setOpen(false);
                  }}
                  aria-label={`Highlight ${color}`}
                />
              ))}
            </div>
            <button
              className="editor-dropdown-item text-xs text-muted-foreground"
              onClick={() => {
                editor.chain().focus().unsetHighlight().run();
                highlightDropdown.setOpen(false);
              }}
            >
              Remove Highlight
            </button>
          </div>
        )}
      </div>

      <Sep />

      {/* ── Link ─────────────────────────────────────────────────────── */}
      <ToolbarButton icon={<LinkIcon className="w-4 h-4" />} label="Add Link" onClick={handleLink} isActive={editor.isActive('link')} />
      {editor.isActive('link') && (
        <ToolbarButton icon={<Unlink className="w-4 h-4" />} label="Remove Link" onClick={() => editor.chain().focus().unsetLink().run()} />
      )}

      <Sep />

      {/* ── Case Conversion ──────────────────────────────────────────── */}
      <div className="relative" ref={caseDropdown.ref}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="editor-toolbar-select"
              onClick={() => caseDropdown.setOpen(!caseDropdown.open)}
              aria-label="Case conversion"
            >
              <CaseSensitive className="w-3.5 h-3.5" />
              <span>Aa</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Case Convert</TooltipContent>
        </Tooltip>
        {caseDropdown.open && (
          <div className="editor-dropdown">
            {CASE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className="editor-dropdown-item"
                onClick={() => handleCaseConvert(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <Sep />

      {/* ── Tools ────────────────────────────────────────────────────── */}
      <ToolbarButton
        icon={<Search className="w-4 h-4" />}
        label="Find & Replace"
        shortcut="Ctrl+F"
        onClick={onToggleSearch}
        isActive={showSearch}
      />
      <ToolbarButton icon={<History className="w-4 h-4" />} label="Version History" onClick={onToggleVersionHistory} />
      <ToolbarButton icon={<Upload className="w-4 h-4" />} label="Import File" onClick={onImport} />

      {/* ── Export Dropdown ───────────────────────────────────────────── */}
      <div className="relative" ref={exportDropdown.ref}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="editor-toolbar-select"
              onClick={() => exportDropdown.setOpen(!exportDropdown.open)}
              aria-label="Export"
            >
              <Download className="w-3.5 h-3.5" />
              <ChevronDown className="w-3 h-3" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Export</TooltipContent>
        </Tooltip>
        {exportDropdown.open && (
          <div className="editor-dropdown">
            <button className="editor-dropdown-item" onClick={() => { onExportTxt(); exportDropdown.setOpen(false); }}>
              Export as TXT
            </button>
            <button className="editor-dropdown-item" onClick={() => { onExportHtml(); exportDropdown.setOpen(false); }}>
              Export as HTML
            </button>
            <button className="editor-dropdown-item" onClick={() => { onExportMd(); exportDropdown.setOpen(false); }}>
              Export as Markdown
            </button>
            <button className="editor-dropdown-item" onClick={() => { onExportPdf(); exportDropdown.setOpen(false); }}>
              Export as PDF
            </button>
          </div>
        )}
      </div>

      <ToolbarButton icon={<Trash2 className="w-4 h-4" />} label="Clear All" onClick={onClear} />
    </div>
  );
}

export default memo(EditorToolbar);
