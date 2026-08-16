export function lexicalToText(node: unknown): string {
  if (!node) return ''
  if (typeof node === 'string') return node

  const n = node as Record<string, unknown>

  if (n.text !== undefined) {
    return String(n.text ?? '')
  }

  let text = ''

  if (Array.isArray(n.children)) {
    for (const child of n.children) {
      text += lexicalToText(child)
    }
  }

  const blockTypes = ['paragraph', 'heading', 'listitem', 'blockquote']
  if (typeof n.type === 'string' && blockTypes.includes(n.type)) {
    text += '\n\n'
  } else if (n.type === 'linebreak') {
    text += '\n'
  }

  return text.trim()
}
