import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'brand', 'price', 'stock', 'status'],
    group: 'Catalog',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 10,
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      admin: {
        description: 'First image is the cover (used in cards/cart/checkout). Drag to reorder. Max 10.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        position: 'sidebar',
        description: 'Price in AUD',
      },
    },
    {
      name: 'compareAtPrice',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Original price (for showing discounts)',
      },
    },
    {
      name: 'flavour',
      type: 'text',
    },
    {
      name: 'puffCount',
      type: 'number',
      admin: {
        description: 'Number of puffs (e.g. 5000, 8000)',
      },
    },
    {
      name: 'nicotineStrength',
      type: 'text',
      admin: {
        description: 'Nicotine strength (e.g. "5%", "20mg")',
      },
    },
    {
      name: 'sku',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'stock',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'newArrival',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'active', 'archived'],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  defaultSort: '-createdAt',
  timestamps: true,
}
