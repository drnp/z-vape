import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  admin: {
    group: 'Site Settings',
  },
  fields: [
    {
      name: 'brandName',
      type: 'text',
      defaultValue: 'Z-VAPE',
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
