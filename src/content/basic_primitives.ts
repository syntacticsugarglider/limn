import { ICategory } from '../challenges';

const basicPrimitives: ICategory = {
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
};

export default basicPrimitives;
