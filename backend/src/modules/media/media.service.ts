import fs from "node:fs/promises";
import path from "node:path";
import { Media, AssetTranslation } from "../../db/models/index.ts";
import { NotFoundError } from "../../lib/errors.ts";
import { parsePagination, buildPaginationMeta } from "../../lib/pagination.ts";
import type { Locale } from "../../config/constants.ts";
import { uploadDir, publicUrlFor } from "./upload.ts";

export interface CreateMediaInput {
  file: Express.Multer.File;
  uploadedById: number;
  folder?: string;
}

export async function createMedia(input: CreateMediaInput) {
  return Media.create({
    filename: input.file.filename,
    originalFilename: input.file.originalname,
    url: publicUrlFor(input.file.filename),
    mimeType: input.file.mimetype,
    size: input.file.size,
    width: null,
    height: null,
    folder: input.folder ?? null,
    storageProvider: "LOCAL",
    storageKey: input.file.filename,
    uploadedById: input.uploadedById,
  });
}

export async function listMediaAdmin(query: { page?: unknown; pageSize?: unknown; folder?: string }) {
  const { limit, offset, page, pageSize } = parsePagination(query);
  const where = query.folder ? { folder: query.folder } : {};
  const { rows, count } = await Media.findAndCountAll({
    where,
    include: [{ model: AssetTranslation, as: "translations" }],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });
  return { data: rows, meta: buildPaginationMeta(page, pageSize, count) };
}

export async function getMediaOr404(id: number) {
  const media = await Media.findByPk(id, { include: [{ model: AssetTranslation, as: "translations" }] });
  if (!media) throw new NotFoundError("Media not found");
  return media;
}

export async function updateMedia(id: number, data: { folder?: string }) {
  const media = await getMediaOr404(id);
  if (data.folder !== undefined) media.folder = data.folder;
  await media.save();
  return media;
}

export async function upsertMediaTranslation(
  id: number,
  locale: Locale,
  data: { altText?: string; caption?: string },
) {
  await getMediaOr404(id);
  const [translation] = await AssetTranslation.findOrCreate({
    where: { assetId: id, locale },
    defaults: { assetId: id, locale, altText: data.altText ?? null, caption: data.caption ?? null },
  });
  if (data.altText !== undefined) translation.altText = data.altText;
  if (data.caption !== undefined) translation.caption = data.caption;
  await translation.save();
  return translation;
}

export async function deleteMedia(id: number): Promise<void> {
  const media = await getMediaOr404(id);
  const absolutePath = path.join(uploadDir, media.filename);
  await media.destroy();
  await fs.unlink(absolutePath).catch(() => undefined);
}
