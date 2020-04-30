import { ICategory } from '../challenges';

const basicPrimitives: ICategory = {
    available: true,
    challenges: [{
        active: true,
        available: true,
        category: 'Basic primitives',
        index: 'A',
        name: 'Functions',
        next_categories: ['signed distance fields'],
        next_challenges: [],
        notebook: [
            [
                {
                    text: 'This is section 1 of the notebookbookbookbookbookbookbookbook',
                    type: 'text',
                },
                {
                    default_frag: '',
                    id: -1,
                    type: 'input',
                }
            ],
            [
                {
                    text: 'this section will have more input',
                    type: 'text',
                },
                {
                    default_frag: '',
                    id: 0,
                    type: 'input',
                },
            ],
        ],
        short_description: 'Lorem ipsum dolor sit amet. More text to see what this looks like with content. Additional text.',
    }],
    name: 'Basic primitives',
};

export default basicPrimitives;
