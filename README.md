# markdown-it-asciimath

[![NPM version](https://img.shields.io/npm/v/@widcardw/markdown-it-asciimath?color=a1b858&label=)](https://www.npmjs.com/package/@widcardw/markdown-it-asciimath)

Render asciimath formulas within markdown. Based on [`asciimath-js`](https://github.com/zmx0142857/asciimathml) and [`katex`](https://katex.org). 

## Install

```sh
npm install -D @widcardw/markdown-it-asciimath
```

## Usage

Don't forget to add style to your CSS entry.

```css
@import 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.15.3/katex.min.css';
```

Then you can attach it to markdown-it. 

```ts
import AmIt from '@widcardw/markdown-it-asciimath'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()
md.use(AmIt, {
  /**
   * (Optional, @default 'asciimath' )
   */
  block: 'asciimath', // to recognize codeblocks written with syntax of asciimath
  /**
   * (Optional @default { open: '``', close: '``' } )
   *
   * to recognize formulas like ``x/y``
   */
  inline: {
    open: '``',
    close: '``'
  }
})
```

## License

[MIT](./LICENSE) License © 2022 [widcardw](https://github.com/widcardw)
