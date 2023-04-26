import { describe, expect, it } from 'vitest'
import MarkdownIt from 'markdown-it'
import AmIt from '../src/index'
// @ts-expect-error no type
import Attrs from 'markdown-it-attrs'

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

describe('with mdit attrs', () => {
  const md = new MarkdownIt()
  md.use(AmIt, { enableOriginalKatex: true })
  md.use(Attrs)
  it('should render ``a+b``', () => {
    const text = 'Some text and formula ``a+b``\n\nEnd of text'
    expect(md.render(text)).toMatchInlineSnapshot(`
      "<p>Some text and formula <span class=\\"katex\\"><span class=\\"katex-mathml\\"><math xmlns=\\"http://www.w3.org/1998/Math/MathML\\"><semantics><mrow><mstyle scriptlevel=\\"0\\" displaystyle=\\"true\\"><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow></mstyle></mrow><annotation encoding=\\"application/x-tex\\">\\\\displaystyle{ a + b }</annotation></semantics></math></span><span class=\\"katex-html\\" aria-hidden=\\"true\\"><span class=\\"base\\"><span class=\\"strut\\" style=\\"height:0.7778em;vertical-align:-0.0833em;\\"></span><span class=\\"mord\\"><span class=\\"mord mathnormal\\">a</span><span class=\\"mspace\\" style=\\"margin-right:0.2222em;\\"></span><span class=\\"mbin\\">+</span><span class=\\"mspace\\" style=\\"margin-right:0.2222em;\\"></span><span class=\\"mord mathnormal\\">b</span></span></span></span></span></p>
      <p>End of text</p>
      "
    `)
  })

  it('should render single formula', () => {
    const text = '``a+b``'
    expect(md.render(text)).toMatchInlineSnapshot(`
      "<p><span class=\\"katex\\"><span class=\\"katex-mathml\\"><math xmlns=\\"http://www.w3.org/1998/Math/MathML\\"><semantics><mrow><mstyle scriptlevel=\\"0\\" displaystyle=\\"true\\"><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow></mstyle></mrow><annotation encoding=\\"application/x-tex\\">\\\\displaystyle{ a + b }</annotation></semantics></math></span><span class=\\"katex-html\\" aria-hidden=\\"true\\"><span class=\\"base\\"><span class=\\"strut\\" style=\\"height:0.7778em;vertical-align:-0.0833em;\\"></span><span class=\\"mord\\"><span class=\\"mord mathnormal\\">a</span><span class=\\"mspace\\" style=\\"margin-right:0.2222em;\\"></span><span class=\\"mbin\\">+</span><span class=\\"mspace\\" style=\\"margin-right:0.2222em;\\"></span><span class=\\"mord mathnormal\\">b</span></span></span></span></span></p>
      "
    `)
  })

  it('should render katex', () => {
    const text = '$\\displaystyle{ a + b }$'
    expect(md.render(text)).toMatchInlineSnapshot(`
      "<p><span class=\\"katex\\"><span class=\\"katex-mathml\\"><math xmlns=\\"http://www.w3.org/1998/Math/MathML\\"><semantics><mrow><mstyle scriptlevel=\\"0\\" displaystyle=\\"true\\"><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow></mstyle></mrow><annotation encoding=\\"application/x-tex\\">\\\\displaystyle{ a + b }</annotation></semantics></math></span><span class=\\"katex-html\\" aria-hidden=\\"true\\"><span class=\\"base\\"><span class=\\"strut\\" style=\\"height:0.7778em;vertical-align:-0.0833em;\\"></span><span class=\\"mord\\"><span class=\\"mord mathnormal\\">a</span><span class=\\"mspace\\" style=\\"margin-right:0.2222em;\\"></span><span class=\\"mbin\\">+</span><span class=\\"mspace\\" style=\\"margin-right:0.2222em;\\"></span><span class=\\"mord mathnormal\\">b</span></span></span></span></span></p>
      "
    `)
  })
})
