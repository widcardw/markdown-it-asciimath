interface AmItOptions {
  /**
     * Boundary of inline ascii math
     *
     * @default { open: '``', close: '``' }
     */
  inline?: {
    open: string
    close: string
  }
  /**
     * Token info of codeblock
     *
     * @default ['am', 'asciimath']
     */
  block?: string | string[]
  /**
   * Whether to enable parsing formulas wrapped with `$`
   *
   * @default false
   */
  enableOriginalKatex?: boolean
}

interface RestrictAmItOptions extends Required<AmItOptions> {
  block: string[]
}

function resolveOptions(options: AmItOptions): RestrictAmItOptions {
  const resolved: RestrictAmItOptions /* default options */ = {
    inline: {
      open: '``', close: '``',
    },
    block: ['asciimath', 'am'],
    enableOriginalKatex: options.enableOriginalKatex || false,
  }

  if (options.inline?.open?.trim())
    resolved.inline.open = options.inline.open.trim()

  if (options.inline?.close?.trim())
    resolved.inline.close = options.inline.close.trim()

  if (options.block) {
    if (typeof options.block === 'string')
      resolved.block = [options.block]

    else if (Array.isArray(options.block) && options.block.length >= 1)
      resolved.block = options.block
  }

  return resolved
}

export {
  AmItOptions,
  RestrictAmItOptions,
  resolveOptions,
}

