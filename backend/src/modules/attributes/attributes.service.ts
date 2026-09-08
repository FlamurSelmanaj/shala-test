import { Attribute, AttributeTranslation, AttributeOption, AttributeOptionTranslation } from "../../db/models/index.ts";
import { NotFoundError } from "../../lib/errors.ts";
import type { Locale } from "../../config/constants.ts";

const ATTRIBUTE_INCLUDES = [
  { model: AttributeTranslation, as: "translations" },
  { model: AttributeOption, as: "options", include: [{ model: AttributeOptionTranslation, as: "translations" }] },
];

export async function listAttributesAdmin() {
  return Attribute.findAll({ include: ATTRIBUTE_INCLUDES, order: [["sortOrder", "ASC"]] });
}

export async function getAttributeAdminOr404(id: number) {
  const attribute = await Attribute.findByPk(id, { include: ATTRIBUTE_INCLUDES });
  if (!attribute) throw new NotFoundError("Attribute not found");
  return attribute;
}

export interface AttributeTranslationInput {
  locale: Locale;
  label?: string;
  helpText?: string | null;
}

export interface AttributeInput {
  key?: string;
  type?: string;
  unit?: string | null;
  isFilterable?: boolean;
  sortOrder?: number;
  translations?: AttributeTranslationInput[];
}

export async function createAttribute(
  input: AttributeInput & { key: string; type: string; translations: AttributeTranslationInput[] },
) {
  const attribute = await Attribute.create({
    key: input.key,
    type: input.type,
    unit: input.unit ?? null,
    isFilterable: input.isFilterable ?? true,
    sortOrder: input.sortOrder ?? 0,
  });

  await AttributeTranslation.bulkCreate(
    input.translations.map((t) => ({
      attributeId: attribute.id,
      locale: t.locale,
      label: t.label ?? "",
      helpText: t.helpText ?? null,
    })),
  );

  return getAttributeAdminOr404(attribute.id);
}

export async function updateAttribute(id: number, input: AttributeInput) {
  const attribute = await getAttributeAdminOr404(id);

  if (input.key !== undefined) attribute.key = input.key;
  if (input.type !== undefined) attribute.type = input.type;
  if (input.unit !== undefined) attribute.unit = input.unit;
  if (input.isFilterable !== undefined) attribute.isFilterable = input.isFilterable;
  if (input.sortOrder !== undefined) attribute.sortOrder = input.sortOrder;
  await attribute.save();

  if (input.translations) {
    for (const t of input.translations) {
      await upsertAttributeTranslation(id, t.locale, t);
    }
  }

  return getAttributeAdminOr404(id);
}

export async function upsertAttributeTranslation(id: number, locale: Locale, data: Partial<AttributeTranslationInput>) {
  await getAttributeAdminOr404(id);
  const [translation] = await AttributeTranslation.findOrCreate({
    where: { attributeId: id, locale },
    defaults: { attributeId: id, locale, label: data.label ?? "", helpText: data.helpText ?? null },
  });
  if (data.label !== undefined) translation.label = data.label;
  if (data.helpText !== undefined) translation.helpText = data.helpText;
  await translation.save();
  return translation;
}

export async function deleteAttribute(id: number): Promise<void> {
  const attribute = await getAttributeAdminOr404(id);
  await attribute.destroy();
}

export interface AttributeOptionTranslationInput {
  locale: Locale;
  label?: string;
}

export interface AttributeOptionInput {
  value?: string;
  sortOrder?: number;
  translations?: AttributeOptionTranslationInput[];
}

export async function getAttributeOptionOr404(id: number) {
  const option = await AttributeOption.findByPk(id, {
    include: [{ model: AttributeOptionTranslation, as: "translations" }],
  });
  if (!option) throw new NotFoundError("Attribute option not found");
  return option;
}

export async function createAttributeOption(
  attributeId: number,
  input: AttributeOptionInput & { value: string; translations: AttributeOptionTranslationInput[] },
) {
  await getAttributeAdminOr404(attributeId);
  const option = await AttributeOption.create({ attributeId, value: input.value, sortOrder: input.sortOrder ?? 0 });

  await AttributeOptionTranslation.bulkCreate(
    input.translations.map((t) => ({ optionId: option.id, locale: t.locale, label: t.label ?? "" })),
  );

  return getAttributeOptionOr404(option.id);
}

export async function updateAttributeOption(id: number, input: AttributeOptionInput) {
  const option = await getAttributeOptionOr404(id);
  if (input.value !== undefined) option.value = input.value;
  if (input.sortOrder !== undefined) option.sortOrder = input.sortOrder;
  await option.save();

  if (input.translations) {
    for (const t of input.translations) {
      await upsertAttributeOptionTranslation(id, t.locale, t);
    }
  }

  return getAttributeOptionOr404(id);
}

export async function upsertAttributeOptionTranslation(
  id: number,
  locale: Locale,
  data: Partial<AttributeOptionTranslationInput>,
) {
  await getAttributeOptionOr404(id);
  const [translation] = await AttributeOptionTranslation.findOrCreate({
    where: { optionId: id, locale },
    defaults: { optionId: id, locale, label: data.label ?? "" },
  });
  if (data.label !== undefined) translation.label = data.label;
  await translation.save();
  return translation;
}

export async function deleteAttributeOption(id: number): Promise<void> {
  const option = await getAttributeOptionOr404(id);
  await option.destroy();
}
