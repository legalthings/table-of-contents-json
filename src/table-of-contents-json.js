'use strict'

const cheerio = require('cheerio');
const beautifyHtml = require('js-beautify').html;
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

        // we minify because cheerio seems to have trouble finding children if they aren't on one line
        const minifiedHtml = minify(html, {collapseWhitespace: true});
        const $ = cheerio.load(minifiedHtml);
        const $headers = $(':header');
        const list = [];

        for (let i = this.options.skipHeader; i < $headers.length; i++) {
            if (!$headers[i].children.length) {
                continue;
            }

            const name = this.findNodeName($headers[i]);

            if (!name || typeof name !== 'string' || !name.trim()) {
                // do not add empty or corrupt headers to table of contents
                continue;
            }

            const type = $headers[i].name;
            const headerSize = type.charAt(1);
            const node = {id: i, name: name, type: type, children: []};
            list.push(node);
        }

        const tree = [];

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
        const children = [];
        const nodeHeaderSize = parseInt(node.type.charAt(1));

        for (let i = 0; i < list.length; i++) {
            const listHeaderSize = parseInt(list[i].type.charAt(1));

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
     * Find the name of a node
     * This looks at only the first child of every nested node
     * Needed in the case of for example <h1><b>Bold header</b></h1>
     *
     * @protected
     * @param {object} node
     * @return {string|null}
     */
    findNodeName (node) {
        if (!node.children.length) {
            return;
        }

        const name = node.children[0].data;

        if (!name && node.children[0].children.length) {
            return this.findNodeName(node.children[0])
        }

        return name;
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

        const html = base || '<html><head></head><body>[ table of contents ]</body></html>';
        const $ol = cheerio.load('<ol id="toc"></ol>');
        const style = '<style>#toc li, #toc ol, #toc ul { list-style: none; }</style>';

        for (let i = 0; i < json.length; i++) {
            const node = json[i];
            const $li = cheerio.load(`<li>${node.name}</li>`)('li');

            if (node.children.length) {
                this.addChildrenHTML($li, node.children);
            }

            $ol('#toc').append($li);
        }

        let toc = $ol.html();;
        if (this.options.tocHeader) {
            toc = `<h1>${options.tocHeader}</h1>${toc}`;
        }

        const $html = cheerio.load(html);
        $html('head').append(style);
        let result = $html.html();
        result = result.replace(/\[ table of contents \]/, toc);

        return beautifyHtml(result, {
            indent_size: 2
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
        const $ol = cheerio.load(`<ol></ol>`)('ol');

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
