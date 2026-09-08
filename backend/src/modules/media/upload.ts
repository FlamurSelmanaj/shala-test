import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { env } from "../../config/env.ts";

const uploadDir = path.resolve(process.cwd(), env.UPLOAD_DIR);
fs.mkdirSync(uploadDir, { recursive: true });

/** The last path segment of UPLOAD_DIR, used as the public URL prefix (e.g. "uploads"). */
export const uploadsUrlBase = env.UPLOAD_DIR.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "").split("/").pop() ?? "uploads";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "application/pdf",
]);

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new Error("Unsupported file type"));
      return;
    }
    cb(null, true);
  },
});

/**
 * Public URL path for an uploaded file — a plain relative path so it works
 * identically behind express.static (dev) and Apache/LiteSpeed serving
 * public_html/uploads directly (prod, see plan §9).
 */
export function publicUrlFor(filename: string): string {
  return `/${uploadsUrlBase}/${filename}`;
}

export { uploadDir };
