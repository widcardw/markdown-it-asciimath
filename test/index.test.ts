import { describe, expect, it } from 'vitest'
import MarkdownIt from 'markdown-it'
import AmIt from '../src/index'

describe('should', () => {
  it('exported', () => {
    const md = new MarkdownIt()
    md.use(AmIt)

    expect(md.render('``x/y``')).toMatchSnapshot()

    expect(md.render('```asciimath\n[1,2,3;\n4,5,6;\n7,8,9;\n]```')).toMatchSnapshot()

    expect(md.render('```am\na -> b```')).toMatchSnapshot()
  })
})
