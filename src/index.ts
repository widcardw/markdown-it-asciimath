import type MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token'
import katex from 'katex'
import type { AmItOptions } from './types'
import { resolveOptions } from './types'
import { amBlockRenderer, amInlineGenerator } from './am'
import { math_block, math_inline } from './katex'

function texToHtmlInline(tex: string) {
  try {
    return katex.renderToString(tex, { throwOnError: false })
  }
  catch (err) {
    return `<pre style="white-space: normal; background-color: #7f7f7f18; padding: 0.5rem;">${err}</pre>`
  }
}

function texToHtmlBlock(tex: string) {
  try {
    return `<p>${katex.renderToString(tex, { displayMode: true, throwOnError: false })}</p>`
  }
  catch (err) {
    return `<pre style="white-space: normal; background-color: #7f7f7f18; padding: 0.5rem;">${err}</pre>`
  }
}

function tokenToHtmlInline(tokens: Token[], idx: number) {
  return texToHtmlInline(tokens[idx].content)
}

function tokenToHtmlBlock(tokens: Token[], idx: number) {
  return `${texToHtmlBlock(tokens[idx].content)}\n`
}

const AmIt: MarkdownIt.PluginWithOptions = (md, options: AmItOptions = {}) => {
  const o = resolveOptions(options)

  /**
   * asciimath block
   */
  amBlockRenderer(md, o)

  /**
   * asciimath inline
   */
  // In fact, second param here can be inconsistent with the `md.renderer.rules.am_inline`,
  //                                                                            ^^^^^^^^^
  // but must be relevant with the expression `token = state.push('am_inline', 'math', 0)`.
  //                                                               ^^^^^^^^^
  md.inline.ruler.after('escape', 'am_inline', amInlineGenerator(o))
  md.renderer.rules.am_inline = tokenToHtmlInline

  /**
   * Katex
   */
  if (o.enableOriginalKatex) {
    md.inline.ruler.after('escape', 'math_inline', math_inline)
    md.block.ruler.after('blockquote', 'math_block', math_block, {
      alt: ['paragraph', 'reference', 'blockquote', 'list'],
    })
    md.renderer.rules.math_inline = tokenToHtmlInline
    md.renderer.rules.math_block = tokenToHtmlBlock
  }
}

export default AmIt
