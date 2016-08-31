Legal Things - Table of contents JSON
==================

With this module you can generate a table of contents represented in a JSON structure based on a piece of HTML.

## Requirements

- [Node.js (ES6)](https://nodejs.org) >= 5.0.0

## Installation

The library can be installed using npm.

    npm install table-of-contents-json

## How it works
The library exposes two functions. You can generate a table of contents in JSON format.
Based on the returned JSON format you can generate a table of contents in HTML.
The TOC is generated based on the headers in the html file that was given. Nesting is supported.

**HTML page to JSON table of contents** 
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

console.log(toc.generateJSON(html));
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

**JSON to HTML table of contents** 
```javascript
const TOC = require('table-of-contents-json');
const toc = new TOC;

let json = [
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
];

console.log(toc.generateHTML(html));
/* 
<html>
  <head>
    <style>
      #toc li,ol,ul { list-style: none; }
    </style>
  </head>
  <body>
  <ol id="toc">
    <li>
      Paragraph 1
      <ol>
        <li>Paragraph 1.1</li>
      </ol>
    </li>
    <li>
      Paragraph 2
      <ol>
        <li>Paragraph 2.1</li>
        <li>
          Paragraph 2.2
          <ol>
            <li>Paragraph 2.2.1</li>
          </ol>
        </li>
      </ol>
    </li>
  </ol>
  </body>
</html>
*/
```
