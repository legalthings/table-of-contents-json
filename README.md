Legal Things - Table of contents JSON
==================

With this module you can generate a table of contents represented in a JSON structure based on a piece of HTML.

## Requirements

- [Node.js (ES6)](https://nodejs.org) >= 5.0.0

## Installation

The library can be installed using npm.

    npm install table-of-contents-json

## How it works
The library exposes a single function with which you can generate a table of contents.
The TOC is generated based on the headers in the html file that was given. Nesting is supported.

```javascript
const TOC = require('table-of-contents-json');
const toc = new TOC;

let html = `
    <html>
      <head>...</head>
      <body>
        <h1>Paragraph 1</h1>
        <h2>Paragraph 1.1</h2>
        <h1>Paragraph 2</h1>
        <h2>Paragraph 2.1</h2>
        <h2>Paragraph 2.2</h2>
        <h3>Paragraph 2.2.1</h3>
      </body>
    </html>
`;

console.log(toc.generate(html));
/* 
output:
[
    {
        "name": "Paragraph 1",
        "type": "h1",
        "children": [
            {
                "name": "Paragraph 1.1",
                "type": "h2",
                "children": []
            }
        ]
    },
    {
        "name": "Paragraph 2",
        "type": "h1",
        "children": [
            {
                "name": "Paragraph 2.1",
                "type": "h2",
                "children": []
            },
            {
                "name": "Paragraph 2.2",
                "type": "h2",
                "children": [
                    {
                        "name": "Paragraph 2.2.1",
                        "type": "h3",
                        "children": []
                    }
                ]
            }
        ]
    }
]
*/
```