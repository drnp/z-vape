import type { Access, CollectionConfig } from 'payload'

const isAdmin = (req: Parameters<Access>[0]['req']): boolean =>
  Boolean(req.user?.roles?.includes('admin'))

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer', 'total', 'status', 'createdAt'],
    group: 'Commerce',
  },
  access: {
    create: ({ req }) => Boolean(req.user),
    read: ({ req }) => {
      if (isAdmin(req)) return true
      if (!req.user) return false
      return {
        customer: { equals: req.user.id },
      }
    },
    update: ({ req }) => isAdmin(req),
    delete: ({ req }) => isAdmin(req),
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'shipping',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'],
      defaultValue: 'pending',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'line1',
          type: 'text',
          required: true,
        },
        {
          name: 'line2',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'state',
          type: 'select',
          options: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'],
        },
        {
          name: 'postcode',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'ageVerified',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Customer confirmed they are 18 or older at checkout.',
      },
    },
  ],
  timestamps: true,
}
