'use strict'

const cheerio = require('cheerio');
const camelCase = require('camelcase');

class TableOfContentsJSON {
    constructor() {
    }

    /**
     * Generate a table of contents represented in a JSON structure based on HTML
     *
     * @public
     * @param {string} html
     * @param {array}
     * @return {array}
     */
    generate (html) {
        if (!html || typeof html !== 'string') {
            throw new TypeError('html should be set and must be a string');
        }

        let $ = cheerio.load(html);
        let $headers = $(':header');
        let list = [];

        for (let i = 0; i < $headers.length; i++) {
            let name =  $headers[i].children[0].data;
            let type = $headers[i].name;
            let headerSize = type.charAt(1);
            let node = { id: i, name: name, type: type, children: [] };
            list.push(node);
        }

        let tree = [];

        for (let i = 0; i < list.length; i++) {
            list[i].children = this.getChildren(list, list[i]);

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
    getChildren (list, node) {
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
}

module.exports = TableOfContentsJSON;
