import type MarkdownIt from 'markdown-it'
import katex from 'katex'
// @ts-expect-error type declaration
import asciimath from 'asciimath-js'
import type Token from 'markdown-it/lib/token'
import type StateInline from 'markdown-it/lib/rules_inline/state_inline'
import type { RestrictAmItOptions } from './types'

function amBlockRenderer(md: MarkdownIt, o: RestrictAmItOptions) {
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
}

function amInlineGenerator(o: RestrictAmItOptions) {
  return (state: StateInline, silent: boolean) => {
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
  }
}

export {
  amBlockRenderer,
  amInlineGenerator,
}
