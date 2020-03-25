import { ICategory } from './challenges';

const content: ICategory[] = [
    {
        available: true,
        challenges: [{
            active: true,
            available: true,
            index: 'A',
            name: 'Functions',
            short_description: 'Lorem ipsum dolor sit amet. More text to see what this looks like with content. Additional text.',
        }],
        name: 'Basic primitives',
    },
    {
        available: true,
        challenges: [{
            active: false,
            available: true,
            index: 'A',
            name: 'Circles',
            short_description: 'Lorem ipsum dolor sit amet. More text to see what this looks like with content. Additional text.',
        }, {
            active: true,
            available: true,
            index: 'B',
            name: 'Rectangles',
            short_description: 'Lorem ipsum dolor sit amet.',
        }],
        name: 'signed distance fields',
    },
];

export default content;
