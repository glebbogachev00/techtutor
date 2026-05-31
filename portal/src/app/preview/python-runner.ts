// Tiny fake Python interpreter for the preview demo.
// Supports: print(), simple assignments, +-*/ arithmetic,
// `for i in range(...)` loops. Not a real runtime — good enough for early lessons.

export function runPython(code: string): string {
  const lines = code.split("\n");
  const vars: Record<string, unknown> = {};
  const out: string[] = [];

  function evalExpr(expr: string): unknown {
    expr = expr.trim();
    if (!expr) return "";
    if (/^".*"$/.test(expr) || /^'.*'$/.test(expr)) return expr.slice(1, -1);
    if (/^-?\d+(\.\d+)?$/.test(expr)) return Number(expr);
    if (expr in vars) return vars[expr];
    try {
      const safe = expr.replace(/[A-Za-z_][A-Za-z0-9_]*/g, (m) =>
        m in vars ? String(vars[m]) : m,
      );
      if (/^[\d\s+\-*/().]+$/.test(safe)) {
        return Function(`"use strict";return (${safe});`)();
      }
    } catch {
      // ignore
    }
    return expr;
  }

  function execLine(raw: string) {
    const line = raw.replace(/\s+$/, "");
    if (!line.trim() || line.trim().startsWith("#")) return;
    const printMatch = line.match(/^\s*print\((.*)\)\s*$/);
    if (printMatch) {
      const args = splitArgs(printMatch[1]);
      out.push(args.map((a) => String(evalExpr(a))).join(" "));
      return;
    }
    const assign = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
    if (assign) {
      vars[assign[1]] = evalExpr(assign[2]);
      return;
    }
  }

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const forMatch = line.match(
      /^\s*for\s+([A-Za-z_][A-Za-z0-9_]*)\s+in\s+range\((.*)\):\s*$/,
    );
    if (forMatch) {
      const varName = forMatch[1];
      const rangeArgs = splitArgs(forMatch[2]).map((a) =>
        Number(evalExpr(a)),
      );
      let start = 0;
      let stop = 0;
      if (rangeArgs.length === 1) {
        stop = rangeArgs[0];
      } else {
        start = rangeArgs[0];
        stop = rangeArgs[1];
      }
      const body: string[] = [];
      i += 1;
      while (i < lines.length && /^(\s{4}|\t)/.test(lines[i])) {
        body.push(lines[i].replace(/^(\s{4}|\t)/, ""));
        i += 1;
      }
      for (let v = start; v < stop; v += 1) {
        vars[varName] = v;
        for (const b of body) execLine(b);
      }
      continue;
    }
    execLine(line);
    i += 1;
  }

  return out.join("\n") || "(no output)";
}

function splitArgs(s: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let current = "";
  let inStr: string | null = null;
  for (const ch of s) {
    if (inStr) {
      current += ch;
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inStr = ch;
      current += ch;
      continue;
    }
    if (ch === "(") depth += 1;
    if (ch === ")") depth -= 1;
    if (ch === "," && depth === 0) {
      out.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.trim()) out.push(current);
  return out;
}
