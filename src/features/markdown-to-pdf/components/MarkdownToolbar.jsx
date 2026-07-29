import { useState } from 'react';

function ToolbarButton({ onClick, disabled, label, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={[
        'inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-40',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 hidden h-5 w-px bg-slate-200 sm:block" aria-hidden="true" />;
}

/**
 * Insert / wrap markdown around the current textarea selection.
 */
export function applyMarkdownAction(textarea, markdown, setMarkdown, action) {
  if (!textarea) return;

  const start = textarea.selectionStart ?? 0;
  const end = textarea.selectionEnd ?? 0;
  const value = markdown;
  const selected = value.slice(start, end);
  const before = value.slice(0, start);
  const after = value.slice(end);

  let next = value;
  let selStart = start;
  let selEnd = end;

  const wrap = (left, right = left, placeholder = 'text') => {
    const inner = selected || placeholder;
    next = `${before}${left}${inner}${right}${after}`;
    selStart = start + left.length;
    selEnd = selStart + inner.length;
  };

  const linePrefix = (prefix) => {
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEndIdx = value.indexOf('\n', end);
    const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;
    const block = value.slice(lineStart, lineEnd);
    const lines = block.split('\n').map((line) => {
      const cleaned = line.replace(/^#{1,6}\s+/, '').replace(/^[-*+]\s+/, '').replace(/^\d+\.\s+/, '');
      return `${prefix}${cleaned || 'Item'}`;
    });
    next = `${value.slice(0, lineStart)}${lines.join('\n')}${value.slice(lineEnd)}`;
    selStart = lineStart;
    selEnd = lineStart + lines.join('\n').length;
  };

  switch (action) {
    case 'bold':
      wrap('**', '**', 'bold text');
      break;
    case 'italic':
      wrap('*', '*', 'italic text');
      break;
    case 'underline':
      wrap('<u>', '</u>', 'underlined');
      break;
    case 'strike':
      wrap('~~', '~~', 'strikethrough');
      break;
    case 'h1':
      linePrefix('# ');
      break;
    case 'h2':
      linePrefix('## ');
      break;
    case 'h3':
      linePrefix('### ');
      break;
    case 'ul':
      linePrefix('- ');
      break;
    case 'ol':
      linePrefix('1. ');
      break;
    case 'quote':
      linePrefix('> ');
      break;
    case 'code':
      if (selected.includes('\n') || !selected) {
        const inner = selected || 'code';
        next = `${before}\`\`\`\n${inner}\n\`\`\`${after}`;
        selStart = before.length + 4;
        selEnd = selStart + inner.length;
      } else {
        wrap('`', '`', 'code');
      }
      break;
    case 'link': {
      const label = selected || 'link text';
      next = `${before}[${label}](https://)${after}`;
      selStart = before.length + label.length + 3;
      selEnd = selStart + 8;
      break;
    }
    case 'hr':
      next = `${before}\n\n---\n\n${after}`;
      selStart = selEnd = before.length + 6;
      break;
    case 'fix':
      next = value.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').trim() + '\n';
      selStart = selEnd = Math.min(start, next.length);
      break;
    case 'beautify':
      next = value
        .replace(/\r\n/g, '\n')
        .replace(/[ \t]+$/gm, '')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/^(#{1,6} .+)$/gm, '\n$1\n')
        .replace(/^\n+/, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim() + '\n';
      selStart = selEnd = Math.min(start, next.length);
      break;
    default:
      return;
  }

  setMarkdown(next);
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(selStart, selEnd);
  });
}

export default function MarkdownToolbar({ textareaRef, markdown, setMarkdown, disabled }) {
  const [moreOpen, setMoreOpen] = useState(false);

  const run = (action) => {
    applyMarkdownAction(textareaRef?.current, markdown, setMarkdown, action);
    setMoreOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 rounded-t-xl border border-b-0 border-slate-200 bg-white px-2 py-1.5">
      <ToolbarButton label="Bold" disabled={disabled} onClick={() => run('bold')}>
        <span className="font-extrabold">B</span>
      </ToolbarButton>
      <ToolbarButton label="Italic" disabled={disabled} onClick={() => run('italic')}>
        <span className="italic font-serif">I</span>
      </ToolbarButton>
      <ToolbarButton label="Underline" disabled={disabled} onClick={() => run('underline')}>
        <span className="underline">U</span>
      </ToolbarButton>
      <ToolbarButton label="Strikethrough" disabled={disabled} onClick={() => run('strike')}>
        <span className="line-through">S</span>
      </ToolbarButton>

      <Divider />

      <ToolbarButton label="Heading 1" disabled={disabled} onClick={() => run('h1')}>
        H1
      </ToolbarButton>
      <ToolbarButton label="Heading 2" disabled={disabled} onClick={() => run('h2')}>
        H2
      </ToolbarButton>
      <ToolbarButton label="Heading 3" disabled={disabled} onClick={() => run('h3')}>
        H3
      </ToolbarButton>

      <Divider />

      <ToolbarButton label="Bullet list" disabled={disabled} onClick={() => run('ul')}>
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <circle cx="4" cy="5" r="1.5" />
          <circle cx="4" cy="10" r="1.5" />
          <circle cx="4" cy="15" r="1.5" />
          <rect x="8" y="4" width="9" height="2" rx="1" />
          <rect x="8" y="9" width="9" height="2" rx="1" />
          <rect x="8" y="14" width="9" height="2" rx="1" />
        </svg>
      </ToolbarButton>
      <ToolbarButton label="Numbered list" disabled={disabled} onClick={() => run('ol')}>
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <text x="2" y="7" fontSize="6" fontWeight="700">
            1
          </text>
          <text x="2" y="12" fontSize="6" fontWeight="700">
            2
          </text>
          <text x="2" y="17" fontSize="6" fontWeight="700">
            3
          </text>
          <rect x="8" y="4" width="9" height="2" rx="1" />
          <rect x="8" y="9" width="9" height="2" rx="1" />
          <rect x="8" y="14" width="9" height="2" rx="1" />
        </svg>
      </ToolbarButton>

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setMoreOpen((v) => !v)}
          className="inline-flex h-8 items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        >
          More
          <span aria-hidden="true">›</span>
        </button>
        {moreOpen ? (
          <div className="absolute left-0 top-full z-20 mt-1 min-w-[9rem] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
            {[
              { id: 'quote', label: 'Quote' },
              { id: 'code', label: 'Code' },
              { id: 'link', label: 'Link' },
              { id: 'hr', label: 'Divider' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => run(item.id)}
                className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <Divider />

      <ToolbarButton label="Fix formatting" disabled={disabled} onClick={() => run('fix')} className="gap-1 text-xs">
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z"
            clipRule="evenodd"
          />
        </svg>
        Fix
      </ToolbarButton>
      <ToolbarButton label="Beautify Markdown" disabled={disabled} onClick={() => run('beautify')} className="gap-1 text-xs">
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
          <rect x="3" y="4" width="14" height="2" rx="1" />
          <rect x="3" y="9" width="10" height="2" rx="1" />
          <rect x="3" y="14" width="12" height="2" rx="1" />
        </svg>
        Beautify
      </ToolbarButton>
    </div>
  );
}
