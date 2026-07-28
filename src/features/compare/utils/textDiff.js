export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Myers-inspired O(ND) token diff for short page texts.
 * @returns {{ type: 'equal'|'add'|'remove', text: string }[]}
 */
export function diffTokens(leftText, rightText) {
  const left = tokenize(leftText);
  const right = tokenize(rightText);

  if (left.length === 0 && right.length === 0) {
    return [{ type: 'equal', text: '' }];
  }

  const n = left.length;
  const m = right.length;
  const max = n + m;
  const offset = max;
  const v = new Int32Array(2 * max + 1).fill(-1);
  v[offset + 1] = 0;
  const trace = [];

  for (let d = 0; d <= max; d++) {
    const vCopy = new Int32Array(v);
    trace.push(vCopy);
    for (let k = -d; k <= d; k += 2) {
      let x;
      if (k === -d || (k !== d && v[offset + k - 1] < v[offset + k + 1])) {
        x = v[offset + k + 1];
      } else {
        x = v[offset + k - 1] + 1;
      }
      let y = x - k;
      while (x < n && y < m && left[x] === right[y]) {
        x++;
        y++;
      }
      v[offset + k] = x;
      if (x >= n && y >= m) {
        return buildDiff(left, right, trace, offset);
      }
    }
  }

  return [
    ...left.map((t) => ({ type: 'remove', text: t })),
    ...right.map((t) => ({ type: 'add', text: t })),
  ];
}

function tokenize(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(/(\s+)/)
    .filter((t) => t.length > 0);
}

function buildDiff(left, right, trace, offset) {
  const parts = [];
  let x = left.length;
  let y = right.length;

  for (let d = trace.length - 1; d >= 0 && (x > 0 || y > 0); d--) {
    const v = trace[d];
    const k = x - y;
    let prevK;
    if (k === -d || (k !== d && v[offset + k - 1] < v[offset + k + 1])) {
      prevK = k + 1;
    } else {
      prevK = k - 1;
    }
    const prevX = v[offset + prevK];
    const prevY = prevX - prevK;

    while (x > prevX && y > prevY) {
      parts.push({ type: 'equal', text: left[x - 1] });
      x--;
      y--;
    }

    if (d === 0) break;

    if (x === prevX) {
      parts.push({ type: 'add', text: right[y - 1] });
      y--;
    } else {
      parts.push({ type: 'remove', text: left[x - 1] });
      x--;
    }
  }

  parts.reverse();
  return mergeAdjacent(parts);
}

function mergeAdjacent(parts) {
  if (!parts.length) return parts;
  const out = [{ ...parts[0] }];
  for (let i = 1; i < parts.length; i++) {
    const prev = out[out.length - 1];
    const cur = parts[i];
    if (prev.type === cur.type) {
      prev.text += cur.text;
    } else {
      out.push({ ...cur });
    }
  }
  return out;
}

export function summarizeDiff(parts) {
  let added = 0;
  let removed = 0;
  for (const part of parts) {
    if (part.type === 'add') added += part.text.trim().split(/\s+/).filter(Boolean).length;
    if (part.type === 'remove') removed += part.text.trim().split(/\s+/).filter(Boolean).length;
  }
  return { added, removed, changed: added + removed > 0 };
}
