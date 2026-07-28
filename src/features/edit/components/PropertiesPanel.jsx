import { FONT_OPTIONS } from '../utils/editConstants';

export default function PropertiesPanel({ style, updateStyle, selectedAnnotation, updateAnnotation }) {
  const isText = selectedAnnotation?.type === 'text';
  const isShape = ['rect', 'ellipse', 'line', 'pen'].includes(selectedAnnotation?.type);
  const isImage = selectedAnnotation?.type === 'image';

  const colorValue = selectedAnnotation?.color || style.color;
  const fontSizeValue = selectedAnnotation?.fontSize || style.fontSize;
  const strokeValue = selectedAnnotation?.strokeWidth || style.strokeWidth;
  const fontFamilyValue = selectedAnnotation?.fontFamily || style.fontFamily;

  const setColor = (value) => {
    updateStyle({ color: value });
    if (selectedAnnotation) updateAnnotation(selectedAnnotation.id, { color: value });
  };

  const setFontSize = (value) => {
    const fontSize = Number(value);
    updateStyle({ fontSize });
    if (selectedAnnotation?.type === 'text') {
      updateAnnotation(selectedAnnotation.id, { fontSize });
    }
  };

  const setStroke = (value) => {
    const strokeWidth = Number(value);
    updateStyle({ strokeWidth });
    if (selectedAnnotation && isShape) {
      updateAnnotation(selectedAnnotation.id, { strokeWidth });
    }
  };

  const setFontFamily = (value) => {
    updateStyle({ fontFamily: value });
    if (selectedAnnotation?.type === 'text') {
      updateAnnotation(selectedAnnotation.id, { fontFamily: value });
    }
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-1">Properties</h3>
        <p className="text-xs text-slate-500">
          {selectedAnnotation
            ? `Editing ${selectedAnnotation.type}`
            : 'Defaults for new annotations'}
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={colorValue.slice(0, 7)}
            onChange={(e) => setColor(e.target.value)}
            className="h-9 w-12 rounded border border-slate-200 cursor-pointer"
          />
          <input
            type="text"
            value={colorValue}
            onChange={(e) => setColor(e.target.value)}
            className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded-lg"
          />
        </div>
      </div>

      {(isText || !selectedAnnotation) && (
        <>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Font size ({fontSizeValue}px)
            </label>
            <input
              type="range"
              min="10"
              max="72"
              value={fontSizeValue}
              onChange={(e) => setFontSize(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Font</label>
            <select
              value={fontFamilyValue}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full px-2 py-2 text-sm border border-slate-200 rounded-lg"
            >
              {FONT_OPTIONS.map((font) => (
                <option key={font.id} value={font.id}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {(isShape || !selectedAnnotation) && !isText && !isImage && (
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Stroke ({strokeValue}px)
          </label>
          <input
            type="range"
            min="1"
            max="16"
            value={strokeValue}
            onChange={(e) => setStroke(e.target.value)}
            className="w-full"
          />
        </div>
      )}

      {isText && (
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Text content</label>
          <textarea
            value={selectedAnnotation.text || ''}
            onChange={(e) => updateAnnotation(selectedAnnotation.id, { text: e.target.value })}
            rows={3}
            className="w-full px-2 py-2 text-sm border border-slate-200 rounded-lg resize-none"
          />
        </div>
      )}

      {isImage && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Width ({Math.round(selectedAnnotation.width)}px)
            </label>
            <input
              type="range"
              min="40"
              max="600"
              value={selectedAnnotation.width}
              onChange={(e) =>
                updateAnnotation(selectedAnnotation.id, { width: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Height ({Math.round(selectedAnnotation.height)}px)
            </label>
            <input
              type="range"
              min="40"
              max="600"
              value={selectedAnnotation.height}
              onChange={(e) =>
                updateAnnotation(selectedAnnotation.id, { height: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>
        </div>
      )}
    </aside>
  );
}
