import type { Content, Field } from "@/content";

export type Values = Record<string, string | string[]>;
export type ContactCopy = Content["contact"];

export const NEEDS_FIELD = "needs.needs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_LIKE = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i;

export type StepGroup = { title?: string; fields: Field[] };

export function selectedNeeds(values: Values): string[] {
  const value = values[NEEDS_FIELD];
  return Array.isArray(value) ? value : [];
}

/**
 * The fields shown on a step. The details step is assembled from whichever
 * services were picked on the first step, so its questions differ per visitor.
 */
export function groupsForStep(
  copy: ContactCopy,
  stepIndex: number,
  values: Values,
): StepGroup[] {
  const step = copy.steps[stepIndex];

  if (step.id === "details") {
    const needs = selectedNeeds(values);
    return copy.detailGroups
      .filter((group) => needs.includes(group.need))
      .map((group) => ({ title: group.title, fields: group.fields }));
  }

  return [{ fields: step.fields }];
}

export function isEmpty(value: string | string[] | undefined) {
  if (value === undefined) return true;
  return Array.isArray(value) ? value.length === 0 : value.trim() === "";
}

export function validateField(
  field: Field,
  value: string | string[] | undefined,
  copy: ContactCopy,
): string | undefined {
  if (field.kind === "files") return undefined;
  if (field.kind === "consent") {
    return value === "yes" ? undefined : copy.consentRequired;
  }

  if (isEmpty(value)) {
    if (!field.required) return undefined;
    return field.kind === "chips" || field.kind === "select"
      ? copy.pickOne
      : copy.required;
  }

  const text = String(value).trim();
  if (field.kind === "email" && !EMAIL.test(text)) return copy.invalidEmail;
  if (field.kind === "url" && !URL_LIKE.test(text)) return copy.invalidUrl;
  if (field.kind === "area" && field.min && text.length < field.min) {
    return copy.tooShort.replace("{min}", String(field.min));
  }
  return undefined;
}

export function validateStep(
  copy: ContactCopy,
  stepIndex: number,
  values: Values,
): Record<string, string> {
  const errors: Record<string, string> = {};

  groupsForStep(copy, stepIndex, values).forEach((group) => {
    group.fields.forEach((field) => {
      const error = validateField(field, values[field.id], copy);
      if (error) errors[field.id] = error;
    });
  });

  return errors;
}

export function humanValue(field: Field, value: string | string[]): string {
  if (field.kind === "chips" || field.kind === "select") {
    const ids = Array.isArray(value) ? value : [value];
    return ids
      .map((id) => field.options.find((option) => option.id === id)?.label ?? id)
      .join(", ");
  }
  return Array.isArray(value) ? value.join(", ") : value.trim();
}

export type ReviewSection = {
  title: string;
  stepIndex: number;
  rows: { label: string; value: string }[];
};

/** One list drives both the review screen and the mail that goes out. */
export function buildSections(copy: ContactCopy, values: Values): ReviewSection[] {
  const sections: ReviewSection[] = [];

  copy.steps.forEach((step, stepIndex) => {
    if (step.id === "review") return;

    groupsForStep(copy, stepIndex, values).forEach((group) => {
      const rows = group.fields.flatMap((field) => {
        if (field.kind === "consent" || field.kind === "files") return [];
        const value = values[field.id];
        if (isEmpty(value)) return [];
        return [{ label: field.label, value: humanValue(field, value as string | string[]) }];
      });

      if (rows.length > 0) {
        sections.push({ title: group.title ?? step.title, stepIndex, rows });
      }
    });
  });

  return sections;
}
