export const EDIT_TOOLS = {
  SELECT: "select",
  TEXT: "text",
  IMAGE: "image",
  RECT: "rect",
  ELLIPSE: "ellipse",
  LINE: "line",
  PEN: "pen",
};

export const FONT_OPTIONS = [
  { id: "Helvetica", label: "Helvetica" },
  { id: "TimesRoman", label: "Times" },
  { id: "Courier", label: "Courier" },
];

export const DEFAULT_STYLE = {
  color: "#000000",
  fillColor: "#f43f5e33",
  fontSize: 18,
  strokeWidth: 3,
  fontFamily: "Helvetica",
};

export function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
