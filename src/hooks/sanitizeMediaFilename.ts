import crypto from 'node:crypto'
import type { CollectionBeforeOperationHook } from 'payload'

const EXT_PATTERN = /^[a-z0-9]{1,16}$/

export const formatHashedFilename = (originalName: string): string => {
  const lastDot = originalName.lastIndexOf('.')
  const rawExt = lastDot > 0 ? originalName.slice(lastDot + 1).split('?')[0] : ''
  const ext = rawExt
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 16)
  const hash = crypto.randomBytes(8).toString('hex')
  return EXT_PATTERN.test(ext) ? `${hash}.${ext}` : hash
}

export const sanitizeMediaFilename: CollectionBeforeOperationHook<'media'> = ({ args, operation, req }) => {
  if (!req.file || (operation !== 'create' && operation !== 'update') || !args.data) {
    return args
  }
  args.data.originalFilename = req.file.name
  req.file.name = formatHashedFilename(req.file.name)
  return args
}