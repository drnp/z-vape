-- Manual ALTER for production (no Payload migrations)
-- Payload 3.88 @payloadcms/db-postgres + Postgres (uuid)
-- Media: upload imageSizes [thumbnail(400), card(600), gallery(1200)] + adminThumbnail + focalPoint
-- NOTE: Run BEFORE deploying new code, otherwise INSERT will fail on missing columns.
-- Idempotent: safe to re-run (IF NOT EXISTS / DO blocks).

-- 1) Ensure focal point columns exist (base upload already requires them when imageSizes enabled,
--    but production may be on old `upload:true` without them)
ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "focal_x" numeric;
ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "focal_y" numeric;

-- 2) Payload postgres stores `sizes` group as flattened columns: sizes_<size>_<field>
--    Each size has: url (varchar), width/height/filesize (numeric/integer), mimeType (varchar), filename (varchar)
--    Generated from getBaseFields.js:151-293 (group `sizes` -> group `<sizeName>` -> fields)
--    The SQL below matches payload-types.ts:188-213 after `pnpm payload generate:types`

DO $$ BEGIN
  -- thumbnail (400x400 center webp) — used for adminThumbnail + product thumbs / cart
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='media' AND column_name='sizes_thumbnail_url') THEN
    ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_url" varchar;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='media' AND column_name='sizes_thumbnail_width') THEN
    ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_width" numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='media' AND column_name='sizes_thumbnail_height') THEN
    ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_height" numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='media' AND column_name='sizes_thumbnail_mime_type') THEN
    ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_mime_type" varchar;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='media' AND column_name='sizes_thumbnail_filesize') THEN
    ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_filesize" numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='media' AND column_name='sizes_thumbnail_filename') THEN
    ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_filename" varchar;
  END IF;

  -- card (600x600 center webp) — used for ProductCard / HotBlocks
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='media' AND column_name='sizes_card_url') THEN
    ALTER TABLE "media" ADD COLUMN "sizes_card_url" varchar;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='media' AND column_name='sizes_card_width') THEN
    ALTER TABLE "media" ADD COLUMN "sizes_card_width" numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='media' AND column_name='sizes_card_height') THEN
    ALTER TABLE "media" ADD COLUMN "sizes_card_height" numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='media' AND column_name='sizes_card_mime_type') THEN
    ALTER TABLE "media" ADD COLUMN "sizes_card_mime_type" varchar;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='media' AND column_name='sizes_card_filesize') THEN
    ALTER TABLE "media" ADD COLUMN "sizes_card_filesize" numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='media' AND column_name='sizes_card_filename') THEN
    ALTER TABLE "media" ADD COLUMN "sizes_card_filename" varchar;
  END IF;

  -- gallery (1200 inside webp, withoutEnlargement) — used for ProductGallery main
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='media' AND column_name='sizes_gallery_url') THEN
    ALTER TABLE "media" ADD COLUMN "sizes_gallery_url" varchar;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='media' AND column_name='sizes_gallery_width') THEN
    ALTER TABLE "media" ADD COLUMN "sizes_gallery_width" numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='media' AND column_name='sizes_gallery_height') THEN
    ALTER TABLE "media" ADD COLUMN "sizes_gallery_height" numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='media' AND column_name='sizes_gallery_mime_type') THEN
    ALTER TABLE "media" ADD COLUMN "sizes_gallery_mime_type" varchar;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='media' AND column_name='sizes_gallery_filesize') THEN
    ALTER TABLE "media" ADD COLUMN "sizes_gallery_filesize" numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='media' AND column_name='sizes_gallery_filename') THEN
    ALTER TABLE "media" ADD COLUMN "sizes_gallery_filename" varchar;
  END IF;
END $$;

-- 3) Fallback: some Payload versions store `sizes` as single JSONB column instead of flattened columns.
--    Keep both representations if present; the DO block above already covers flattened case.
--    If your `media` table already has a JSONB `sizes`, this is no-op; otherwise add it for forward compat.
ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes" jsonb;

-- 4) Products.images: array maxRows=10 is validation-only (no DDL). Array is stored in `_products_images` or jsonb depending on adapter version.
--    No ALTER required. If your install uses a separate table `products_images`, no change needed.
--    Verify: \d "products" should show `images` count not constrained at DB level.

-- Post-deploy notes:
-- - Existing rows will have NULL for new size columns; re-upload or run a one-off script to regenerate sizes via sharp (payload will populate on next `payload.update`).
-- - Frontend falls back to `media.url` when size is NULL (src/lib/media.ts: getMediaUrl fallback).
-- - If you prefer JSONB-only storage, you can keep just `sizes` JSONB and drop flattened columns, but Payload postgres expects flattened — keep both.
