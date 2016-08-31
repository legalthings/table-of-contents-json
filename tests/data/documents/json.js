'use strict';

const json = [
    {
        "id": 0,
        "name": "Paragraph 1",
        "type": "h1",
        "children": [
            {
                "id": 1,
                "name": "Paragraph 1.1",
                "type": "h2",
                "children": []
            }
        ]
    },
    {
        "id": 2,
        "name": "Paragraph 2",
        "type": "h1",
        "children": [
            {
                "id": 3,
                "name": "Paragraph 2.1",
                "type": "h2",
                "children": []
            },
            {
                "id": 4,
                "name": "Paragraph 2.2",
                "type": "h2",
                "children": [
                    {
                        "id": 5,
                        "name": "Paragraph 2.2.1",
                        "type": "h3",
                        "children": []
                    }
                ]
            }
        ]
    }
];


module.exports = json;
