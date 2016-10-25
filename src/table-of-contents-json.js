'use strict'

const cheerio = require('cheerio');
const minify = require('html-minifier').minify;

class TableOfContentsJSON {
    constructor() {
        this.defaultOptions = {
            skipHeader: 0
        }
    }

    /**
     * Generate a table of contents represented in a JSON structure based on HTML
     *
     * @public
     * @param {string} html
     * @return {array}
     */
    generateJSON (html, options) {
        if (!html || typeof html !== 'string') {
            throw new TypeError('html should be set and must be a string');
        }

        this.options = Object.assign({}, this.defaultOptions, options);

        let $ = cheerio.load(html);
        let $headers = $(':header');
        let list = [];

        for (let i = this.options.skipHeader; i < $headers.length; i++) {
            if ($headers[i].children.length > 0) {
                let name = $headers[i].children[0].data;
                let type = $headers[i].name;
                let headerSize = type.charAt(1);
                let node = {id: i, name: name, type: type, children: []};
                list.push(node);
            }
        }

        let tree = [];

        for (let i = 0; i < list.length; i++) {
            list[i].children = this.getChildrenJSON(list, list[i]);

            if (list[i].type === 'h1') {
                tree.push(list[i]);
            }
        }

        return tree;
    }

    /**
     * Get the children of a node based on a list of nodes
     *
     * @protected
     * @param {array} list
     * @param {object} node
     * @return {array}
     */
    getChildrenJSON (list, node) {
        let children = [];
        let nodeHeaderSize = parseInt(node.type.charAt(1));

        for (let i = 0; i < list.length; i++) {
            let listHeaderSize = parseInt(list[i].type.charAt(1));

            // add every immediate smaller header as a child of the current node
            if (listHeaderSize === nodeHeaderSize + 1 && list[i].id > node.id) {
                children.push(list[i]);
            }

            // when encountering a similar sized header after the current node, break the loop
            if (list[i].id > node.id && nodeHeaderSize === listHeaderSize) {
                break;
            }
        }

        return children;
    }


    /**
     * Generate a table of contents in HTML based on a JSON structure
     *
     * @public
     * @param {array} json
     * @param {string} base The base html file in which the toc should be embedded.
                            The toc will be placed at a [ table of contents ] placeholder
     * @return {string}
     */
    generateHTML (json, base, options) {
        if (!json || !(json instanceof Array)) {
            throw new TypeError('json should be set and must be an array');
        }

        this.options = Object.assign({}, this.defaultOptions, options);

        let html = base || '<html><head></head><body>[ table of contents ]</body></html>';
        let $ol = cheerio.load('<ol id="toc"></ol>');
        let style = '<style>#toc li,ol,ul { list-style: none; }</style>';

        for (let i = 0; i < json.length; i++) {
            let node = json[i];
            let $li = cheerio.load(`<li>${node.name}</li>`)('li');

            if (node.children.length) {
                this.addChildrenHTML($li, node.children);
            }

            $ol('#toc').append($li);
        }

        let toc = $ol.html();;
        if (this.options.tocHeader) {
            toc = `<h1>${options.tocHeader}</h1>${toc}`;
        }

        let $html = cheerio.load(html);
        $html('head').append(style);
        let result = $html.html();
        result = result.replace(/\[ table of contents \]/, toc);

        return minify(result, {
            collapseWhitespace: true
        });
    }

    /**
     * Add children to an element
     *
     * @protected
     * @param {object} $element
     * @param {array} children
     * @return {object}
     */
    addChildrenHTML ($element, children) {
        let $ol = cheerio.load(`<ol></ol>`)('ol');

        for (let i = 0; i < children.length; i++) {
            let node = children[i];
            let $li = cheerio.load(`<li>${node.name}</li>`)('li');
            $ol.append($li);

            if (node.children.length) {
                this.addChildrenHTML($li, node.children);
            }
        }

        $element.append($ol);
    }
}

module.exports = TableOfContentsJSON;
