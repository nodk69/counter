/**
 * Search and Replace utilities for TipTap editor.
 * Uses ProseMirror's TextSelection and the editor's transaction API.
 */
import type { Editor } from '@tiptap/core';

export interface SearchResult {
  from: number;
  to: number;
}

export interface SearchOptions {
  caseSensitive: boolean;
  wholeWord: boolean;
}

/**
 * Find all occurrences of a search term in the editor document.
 */
export function findAll(
  editor: Editor,
  searchTerm: string,
  options: SearchOptions = { caseSensitive: false, wholeWord: false }
): SearchResult[] {
  if (!searchTerm) return [];

  const doc = editor.state.doc;
  const results: SearchResult[] = [];
  const text = doc.textContent;
  const flags = options.caseSensitive ? 'g' : 'gi';

  let pattern = searchTerm.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
  if (options.wholeWord) {
    pattern = `\\b${pattern}\\b`;
  }

  const regex = new RegExp(pattern, flags);
  let match: RegExpExecArray | null;

  // We need to map text positions to document positions
  // Walk the doc to build a position map
  const posMap: number[] = []; // posMap[textIndex] = docPos
  let textIndex = 0;

  doc.descendants((node, pos) => {
    if (node.isText && node.text) {
      for (let i = 0; i < node.text.length; i++) {
        posMap[textIndex] = pos + i;
        textIndex++;
      }
    } else if (node.isBlock && posMap.length > 0) {
      // Add a separator for block boundaries so positions stay aligned
      // Don't add for the first block
    }
    return true;
  });

  while ((match = regex.exec(text)) !== null) {
    const startTextIdx = match.index;
    const endTextIdx = match.index + match[0].length;

    if (posMap[startTextIdx] !== undefined && posMap[endTextIdx - 1] !== undefined) {
      results.push({
        from: posMap[startTextIdx],
        to: posMap[endTextIdx - 1] + 1,
      });
    }
  }

  return results;
}

/**
 * Replace a single occurrence.
 */
export function replaceAt(
  editor: Editor,
  result: SearchResult,
  replacement: string
): void {
  editor
    .chain()
    .focus()
    .insertContentAt(
      { from: result.from, to: result.to },
      replacement
    )
    .run();
}

/**
 * Replace all occurrences (processes from end to start to maintain positions).
 */
export function replaceAll(
  editor: Editor,
  searchTerm: string,
  replacement: string,
  options: SearchOptions = { caseSensitive: false, wholeWord: false }
): number {
  const results = findAll(editor, searchTerm, options);
  if (results.length === 0) return 0;

  // Replace from end to start to maintain positions
  const reversed = [...results].reverse();

  editor.chain().focus().command(({ tr }) => {
    for (const result of reversed) {
      tr.insertText(replacement, result.from, result.to);
    }
    return true;
  }).run();

  return results.length;
}

/**
 * Scroll a search result into view and select it.
 */
export function selectResult(editor: Editor, result: SearchResult): void {
  editor
    .chain()
    .focus()
    .setTextSelection({ from: result.from, to: result.to })
    .scrollIntoView()
    .run();
}
