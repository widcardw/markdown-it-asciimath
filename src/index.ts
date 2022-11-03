import type MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token'
import katex from 'katex'
// @ts-expect-error type declaration
import asciimath from 'asciimath-js'

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

function am_inline(tex: string) {
  try {
    return katex.renderToString(tex, { throwOnError: false })
  }
  catch (err) {
    return `<pre style="white-space: normal; background-color: #7f7f7f18; padding: 0.5rem;">${err}</pre>`
  }
}

const AmIt: MarkdownIt.PluginWithOptions = (md, options: AmItOptions = {}) => {
  const o = resolveOptions(options)

  /**
   * asciimath codeblock renderer
   */
  const temp = md.renderer.rules.fence!.bind(md.renderer.rules)
  md.renderer.rules.fence = (tokens, index, options, env, slf) => {
    const token = tokens[index]

    // recognize ```asciimath or ```am
    //              ^^^^^^^^^       ^^
    if (o.block.includes(token.info.trim())) {
      try {
        const content = token.content.trim()
        const tex = asciimath.am2tex(content)
        return `<p>${katex.renderToString(tex, { displayMode: true, throwOnError: false })}</p>`
      }
      catch (err) {
        return `<pre style="white-space: normal; background-color: #7f7f7f18; padding: 0.5rem;">${err}</pre>`
      }
    }
    return temp(tokens, index, options, env, slf)
  }

  /**
   * asciimath inline renderer
   */
  md.inline.ruler.before('escape', 'asciimath-inline', (state, silent) => {
    // End of line
    if (state.pos + 2 >= state.posMax)
      return false

    const { open, close } = o.inline
    // ignore escapes not start with `options.inline.open`
    if (state.src.slice(state.pos, state.pos + 2) !== open)
      return false

    // ``x/y``
    //   ^- start
    const start = state.pos + open.length

    let match = start
    let pos: number
    let token: Token

    // borrowed from markdown-it-katex
    // eslint-disable-next-line no-cond-assign
    while ((match = state.src.indexOf(close, match)) !== -1) {
      pos = match - 1
      while (state.src[pos] === '\\') pos -= 1

      // Even number of escapes, potential closing delimiter found
      if ((match - pos) % 2 === 1)
        break

      match += 1
    }

    // does not match
    if (match === -1) {
      if (!silent)
        state.pending += close

      state.pos = start

      return false
    }

    // render inline tex
    if (!silent) {
      const content = state.src.slice(start, match)
      const tex = asciimath.am2tex(content)

      // push token `am_inline` into token stream
      // which is schedule to be processed by the rule `am_inline`
      token = state.push('am_inline', 'math', 0)
      token.markup = open
      token.content = tex
    }

    // process offset
    state.pos = match + close.length

    return true
  })

  md.renderer.rules.am_inline = (tokens, idx) => {
    return am_inline(tokens[idx].content)
  }
}

export default AmIt
