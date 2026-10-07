"use client";

import { useRef } from "react";
import { Bold, Italic, Underline } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { RichText } from "@/components/ui/rich-text";

const FORMATS = [
  { label: "Negrita", mark: "**", Icon: Bold },
  { label: "Cursiva", mark: "*", Icon: Italic },
  { label: "Subrayado", mark: "__", Icon: Underline },
] as const;

export function RichTextField({
  id,
  name,
  value,
  onChange,
  rows = 10,
  showPreview = false,
  invalid,
  describedBy,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  showPreview?: boolean;
  invalid?: boolean;
  describedBy?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function applyFormat(mark: string) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    onChange(`${value.slice(0, start)}${mark}${value.slice(start, end)}${mark}${value.slice(end)}`);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + mark.length, end + mark.length);
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1" role="toolbar" aria-label="Formato del texto">
        {FORMATS.map(({ label, mark, Icon }) => (
          <button
            key={mark}
            type="button"
            title={label}
            aria-label={label}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => applyFormat(mark)}
            className="flex size-8 items-center justify-center rounded-lg border border-cream-50/10 text-muted-400 transition-colors hover:bg-cream-50/10 hover:text-cream-50"
          >
            <Icon className="size-4" aria-hidden />
          </button>
        ))}
      </div>

      <Textarea
        ref={ref}
        id={id}
        name={name}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={invalid}
        aria-describedby={describedBy}
      />

      {showPreview && value.trim() && (
        <div className="rounded-lg border border-cream-50/10 bg-ink-900/60 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-400">
            Vista previa
          </p>
          <RichText text={value} className="space-y-4 text-sm leading-relaxed text-cream-50/90" />
        </div>
      )}
    </div>
  );
}
