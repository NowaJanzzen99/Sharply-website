"use client";

import { useRef } from "react";
import { CaretDown, Check, Paperclip, WarningCircle, X } from "@phosphor-icons/react";
import type { Field } from "@/content";
import { ALLOWED_EXTENSIONS } from "@/lib/contact-schema";
import type { ContactCopy } from "./form-model";

const fieldClass =
  "w-full rounded-[var(--radius-md)] border border-hairline-strong bg-canvas-deep px-4 py-3 text-[16px] text-text placeholder:text-text-faint transition-colors duration-200 ease-out focus:border-accent";

const chipBase =
  "cursor-pointer rounded-[var(--radius-pill)] border px-4 py-2.5 text-[15px] transition-[border-color,background-color,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.97]";

function Label({
  htmlFor,
  field,
  copy,
  as = "label",
}: {
  htmlFor?: string;
  field: Field;
  copy: ContactCopy;
  as?: "label" | "legend";
}) {
  const Tag = as;
  return (
    <Tag htmlFor={as === "label" ? htmlFor : undefined} className="block text-[14px] font-medium text-text">
      {field.label}
      {!field.required && field.kind !== "consent" ? (
        <span className="ml-1.5 font-normal text-text-faint">({copy.optional})</span>
      ) : null}
    </Tag>
  );
}

function ErrorLine({ id, message }: { id: string; message: string }) {
  return (
    <p
      id={id}
      role="alert"
      data-field-error
      className="mt-2 flex items-center gap-1.5 text-[14px] text-accent-bright"
    >
      <WarningCircle size={15} weight="fill" className="shrink-0" />
      {message}
    </p>
  );
}

export function FieldControl({
  field,
  value,
  error,
  copy,
  uid,
  onChange,
  onBlurCheck,
  files,
  fileError,
  onFiles,
  onRemoveFile,
}: {
  field: Field;
  value: string | string[] | undefined;
  error?: string;
  copy: ContactCopy;
  uid: string;
  onChange: (id: string, value: string | string[]) => void;
  onBlurCheck: (field: Field) => void;
  files: File[];
  fileError?: string;
  onFiles: (list: FileList | null) => void;
  onRemoveFile: (index: number) => void;
}) {
  const inputId = `${uid}-${field.id}`;
  const errorId = `${inputId}-error`;
  const describedBy = error ? errorId : field.hint ? `${inputId}-hint` : undefined;
  const fileInput = useRef<HTMLInputElement>(null);

  const hint = field.hint ? (
    <p id={`${inputId}-hint`} className="mt-1 text-[13px] text-text-faint">
      {field.hint}
    </p>
  ) : null;

  if (field.kind === "chips") {
    const selected = Array.isArray(value) ? value : value ? [value] : [];
    const multi = Boolean(field.multi);

    return (
      <fieldset aria-describedby={describedBy}>
        <Label field={field} copy={copy} as="legend" />
        {hint}
        <div className="mt-3 flex flex-wrap gap-2">
          {field.options.map((option) => {
            const active = selected.includes(option.id);
            return (
              <label
                key={option.id}
                className={`${chipBase} ${
                  active
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-hairline-strong text-text-muted hover-fine:hover:border-text-faint hover-fine:hover:text-text"
                }`}
              >
                <input
                  type={multi ? "checkbox" : "radio"}
                  name={inputId}
                  className="sr-only"
                  checked={active}
                  onChange={() => {
                    if (multi) {
                      onChange(
                        field.id,
                        active
                          ? selected.filter((id) => id !== option.id)
                          : [...selected, option.id],
                      );
                    } else {
                      onChange(field.id, option.id);
                    }
                  }}
                  /* A radio cannot be un-picked by clicking it again, so an
                     optional single choice needs its own way back to empty. */
                  onClick={() => {
                    if (!multi && active && !field.required) onChange(field.id, []);
                  }}
                />
                <span className="flex items-center gap-1.5">
                  {active ? <Check size={13} weight="bold" /> : null}
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
        {error ? <ErrorLine id={errorId} message={error} /> : null}
      </fieldset>
    );
  }

  if (field.kind === "select") {
    return (
      <div>
        <Label htmlFor={inputId} field={field} copy={copy} />
        <div className="relative mt-2">
          <select
            id={inputId}
            value={typeof value === "string" ? value : ""}
            onChange={(event) => onChange(field.id, event.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={`${fieldClass} appearance-none pr-11`}
          >
            <option value="">{field.placeholder ?? copy.selectPlaceholder}</option>
            {field.options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <CaretDown
            size={16}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-faint"
          />
        </div>
        {hint}
        {error ? <ErrorLine id={errorId} message={error} /> : null}
      </div>
    );
  }

  if (field.kind === "area") {
    return (
      <div>
        <Label htmlFor={inputId} field={field} copy={copy} />
        <textarea
          id={inputId}
          rows={field.rows ?? 3}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(field.id, event.target.value)}
          onBlur={() => onBlurCheck(field)}
          placeholder={field.placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`mt-2 ${fieldClass} resize-y`}
        />
        {hint}
        {error ? <ErrorLine id={errorId} message={error} /> : null}
      </div>
    );
  }

  if (field.kind === "files") {
    return (
      <div>
        <Label field={field} copy={copy} as="legend" />
        {hint}
        <p className="mt-1 text-[13px] text-text-faint">{copy.filesHint}</p>
        <input
          ref={fileInput}
          id={inputId}
          type="file"
          multiple
          accept={ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(",")}
          className="sr-only"
          onChange={(event) => {
            onFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="mt-3 inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-dashed border-hairline-strong px-4 py-2.5 text-[15px] text-text-muted transition-[border-color,color,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.97] hover-fine:hover:border-accent hover-fine:hover:text-text"
        >
          <Paperclip size={16} />
          {copy.filesAdd}
        </button>

        {files.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-2">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-hairline px-3.5 py-2.5 text-[14px] text-text"
              >
                <span className="truncate">{file.name}</span>
                <span className="flex shrink-0 items-center gap-3">
                  <span className="font-mono text-[12px] text-text-faint">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveFile(index)}
                    aria-label={`${copy.filesRemove}: ${file.name}`}
                    className="flex h-6 w-6 items-center justify-center rounded-[var(--radius-pill)] text-text-faint transition-colors duration-150 ease-out hover:text-text"
                  >
                    <X size={14} />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        ) : null}
        {fileError ? <ErrorLine id={errorId} message={fileError} /> : null}
      </div>
    );
  }

  if (field.kind === "consent") {
    const checked = value === "yes";
    return (
      <div>
        <label
          htmlFor={inputId}
          className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-hairline-strong p-4 text-[15px] leading-[1.5] text-text-muted transition-colors duration-200 ease-out hover-fine:hover:border-text-faint"
        >
          <input
            id={inputId}
            type="checkbox"
            checked={checked}
            onChange={(event) => onChange(field.id, event.target.checked ? "yes" : "")}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className="sr-only"
          />
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border transition-[background-color,border-color] duration-150 ease-[var(--ease-out)]"
            style={{
              borderColor: checked ? "var(--accent)" : "var(--hairline-strong)",
              backgroundColor: checked ? "var(--accent)" : "transparent",
            }}
          >
            {checked ? <Check size={13} weight="bold" className="text-accent-ink" /> : null}
          </span>
          <span>{field.label}</span>
        </label>
        {error ? <ErrorLine id={errorId} message={error} /> : null}
      </div>
    );
  }

  // text, email, tel, url, date
  return (
    <div>
      <Label htmlFor={inputId} field={field} copy={copy} />
      <input
        id={inputId}
        type={field.kind === "url" ? "text" : field.kind}
        inputMode={
          field.kind === "email"
            ? "email"
            : field.kind === "tel"
              ? "tel"
              : field.kind === "url"
                ? "url"
                : undefined
        }
        autoComplete={field.autoComplete}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(field.id, event.target.value)}
        onBlur={() => onBlurCheck(field)}
        placeholder={field.placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`mt-2 ${fieldClass}`}
      />
      {hint}
      {error ? <ErrorLine id={errorId} message={error} /> : null}
    </div>
  );
}
