# markdown-it-asciimath

[![NPM version](https://img.shields.io/npm/v/@widcardw/markdown-it-asciimath?color=a1b858&label=)](https://www.npmjs.com/package/@widcardw/markdown-it-asciimath)

Render asciimath formulas within markdown. Based on [`asciimath-parser`](https://github.com/widcardw/asciimath-parser) and [`katex`](https://katex.org). 

## Install

```sh
npm i -D katex @widcardw/markdown-it-asciimath
```

## Usage

Don't forget to add style to your CSS entry.

```css
@import 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.15.3/katex.min.css';
/* or you can use the css within the KaTeX package */
```

Then you can attach it to markdown-it. 

```ts
import AmIt from '@widcardw/markdown-it-asciimath'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()
md.use(AmIt, {
  /**
   * (Optional, @default ['asciimath', 'am'] )
   *
   * To recognize codeblocks written with syntax of asciimath
   * You can add other alias like `math` and so on
   */
  block: ['asciimath', 'am', 'math'],
  /**
   * (Optional @default { open: '``', close: '``' } )
   *
   * To recognize formulas like ``x/y``
   */
  inline: {
    open: '``',
    close: '``'
  },
  /**
   * (Optional @default false )
   *
   * Whether to enable original Katex (wrapped with `$` for inline and `$$` for block).
   * When enabled, you do not have to install another plugin `markdown-it-new-katex`.
   */
  enableOriginalKatex: true
})
```

## License

[MIT](./LICENSE) License © 2022 [widcardw](https://github.com/widcardw)
