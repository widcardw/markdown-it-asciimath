import { describe, expect, it } from 'vitest'
import MarkdownIt from 'markdown-it'
import AmIt from '../src/index'

describe('instance', () => {
  it('should create instance of md', () => {
    const md = new MarkdownIt()
    md.use(AmIt, { enableOriginalKatex: true })
    // @ts-expect-error no such property
    expect(md.inline.ruler.__rules__.map(i => i.name)).toMatchInlineSnapshot(`
      [
        "text",
        "linkify",
        "newline",
        "escape",
        "math_inline",
        "am_inline",
        "backticks",
        "strikethrough",
        "emphasis",
        "link",
        "image",
        "autolink",
        "html_inline",
        "entity",
      ]
    `)
  })
})

describe('am and katex', () => {
  it('should export formulas correctly', () => {
    const md = new MarkdownIt()
    md.use(AmIt, { enableOriginalKatex: true })

    expect(md.render('``x/y``')).toMatchSnapshot()

    expect(md.render('```asciimath\n[1,2,3;\n4,5,6;\n7,8,9;\n]```')).toMatchSnapshot()

    expect(md.render('```am\na -> b```')).toMatchSnapshot()

    expect(md.render('$a/b$')).toMatchSnapshot()

    expect(md.render(String.raw`$$\sum_{i=1}^\infty{1 \over n^2}$$`)).toMatchSnapshot()
  })

  it('should not parse other blocks', () => {
    const md = new MarkdownIt()
    md.use(AmIt, { enableOriginalKatex: true })

    expect(md.render('`def`')).toMatchSnapshot()

    expect(md.render('`$abc$`')).toMatchSnapshot()

    expect(md.render('```text\n``x/y``\n```')).toMatchSnapshot()

    expect(md.render('```text\n$a/b$\n```')).toMatchSnapshot()
  })

  it('should parse `$', () => {
    const md = new MarkdownIt()
    md.use(AmIt, {
      enableOriginalKatex: true,
      inline: {
        open: '`$',
        close: '$`',
      },
    })
    expect(md.render('`$`')).toMatchInlineSnapshot(`
      "<p><code>$</code></p>
      "
    `)

    expect(md.render('`$\\$`')).toMatchInlineSnapshot(`
      "<p><code>$\\\\$</code></p>
      "
    `)
  })
})
