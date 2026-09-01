import type { CollectionConfig } from 'payload'
import { sanitizeMediaFilename } from '../hooks/sanitizeMediaFilename'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'originalFilename',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeOperation: [sanitizeMediaFilename],
  },
  upload: {
    // Manual DB maintenance: see /docs/alters/xxx-media-sizes.sql
    staticDir: 'media',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'],
    focalPoint: true,
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 400,
        crop: 'center',
        formatOptions: { format: 'webp' },
      },
      {
        name: 'card',
        width: 600,
        height: 600,
        crop: 'center',
        formatOptions: { format: 'webp' },
      },
      {
        name: 'gallery',
        width: 1200,
        height: 1200,
        fit: 'inside',
        withoutEnlargement: true,
        formatOptions: { format: 'webp' },
      },
    ],
  },
}
