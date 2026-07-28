import { EDIT_TOOLS } from '../utils/editConstants';

const TOOL_BUTTONS = [
  { id: EDIT_TOOLS.SELECT, label: 'Select' },
  { id: EDIT_TOOLS.TEXT, label: 'Text' },
  { id: EDIT_TOOLS.IMAGE, label: 'Image' },
  { id: EDIT_TOOLS.RECT, label: 'Rectangle' },
  { id: EDIT_TOOLS.ELLIPSE, label: 'Ellipse' },
  { id: EDIT_TOOLS.LINE, label: 'Line' },
  { id: EDIT_TOOLS.PEN, label: 'Draw' },
];

export default function EditToolbar({
  tool,
  setTool,
  onPickImage,
  onDelete,
  onClearPage,
  onExport,
  canExport,
  isExporting,
  hasSelection,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 border-b border-slate-200">
      <div className="flex flex-wrap gap-1">
        {TOOL_BUTTONS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              if (item.id === EDIT_TOOLS.IMAGE) {
                onPickImage();
                return;
              }
              setTool(item.id);
            }}
            className={[
              'px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors',
              tool === item.id
                ? 'bg-fuchsia-600 text-white border-fuchsia-600'
                : 'bg-white text-slate-700 border-slate-200 hover:border-fuchsia-300',
            ].join(' ')}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      <button
        type="button"
        onClick={onDelete}
        disabled={!hasSelection}
        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
      >
        Delete
      </button>
      <button
        type="button"
        onClick={onClearPage}
        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
      >
        Clear page
      </button>
      <button
        type="button"
        onClick={onExport}
        disabled={!canExport || isExporting}
        className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-fuchsia-600 text-white hover:bg-fuchsia-700 disabled:opacity-40"
      >
        {isExporting ? 'Exporting…' : 'Download PDF'}
      </button>
    </div>
  );
}
