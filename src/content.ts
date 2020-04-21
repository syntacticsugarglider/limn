import { IContent } from './challenges';

const content: IContent = {
    names: ['Basic primitives', 'signed distance fields'],
    content: {
        'Basic primitives': {
            available: true,
            name: 'Basic primitives',
            challenges: [{
                active: true,
                available: true,
                index: 'A',
                name: 'Functions',
                category: 'Basic primitives',
                short_description: 'Lorem ipsum dolor sit amet. More text to see what this looks like with content. Additional text.',
                next_challenges: [],
                next_catagories: ['signed distance fields'],
                notebook: [
                    [
                        {
                            type: 'text',
                            text: 'This is section 1 of the notebookbookbookbookbookbookbookbook'
                        }
                    ],
                    [
                        {
                            type: 'text',
                            text: 'this section will have input'
                        },
                        {
                            type: 'input',
                            id: 0,
                            default_frag: '',
                        }
                    ]
                ]
            }],
        },
        'signed distance fields': {
            available: false,
            name: 'signed distance fields',
            challenges: [{
                active: true,
                available: true,
                category: 'signed distance fields',
                index: 'A',
                name: 'Circles',
                short_description: 'Lorem ipsum dolor sit amet. More text to see what this looks like with content. Additional text.',
                next_catagories: [],
                next_challenges: [1],
                notebook: [[]]
            }, {
                active: true,
                available: false,
                category: 'signed distance fields',
                index: 'B',
                name: 'Rectangles',
                short_description: 'Lorem ipsum dolor sit amet.',
                next_catagories: [],
                next_challenges: [],
                notebook: [[]]
            }],
        },
    }
};

export default content;
