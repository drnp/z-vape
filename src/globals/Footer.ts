import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: {
    group: 'Site Settings',
  },
  fields: [
    {
      name: 'brandDescription',
      type: 'textarea',
    },
    {
      name: 'customerService',
      type: 'group',
      fields: [
        {
          name: 'email',
          type: 'text',
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'hours',
          type: 'text',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: ['Instagram', 'Facebook', 'Twitter', 'TikTok', 'YouTube'],
        },
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
    {
      name: 'footerLinks',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'link',
          type: 'text',
        },
      ],
    },
  ],
}
