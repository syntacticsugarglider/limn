import App from '../app';
import { ICategory, IChallenge } from '../challenges';
import Page from '../page';
import intro from './intro.html';

export default class Catalogue extends Page {
    constructor(app: App) {
        const element = document.createElement('div');
        element.innerHTML = intro;
        const categories: ICategory[] = [
            {
                challenges: [{
                    active: true,
                    available: true,
                    index: 'A',
                    name: 'Functions',
                    short_description: 'Lorem ipsum dolor sit amet.',
                }],
                name: 'Basic primitives',
            },
            {
                challenges: [{
                    active: false,
                    available: true,
                    index: 'A',
                    name: 'Circle',
                    short_description: 'Lorem ipsum dolor sit amet.',
                }, {
                    active: true,
                    available: true,
                    index: 'B',
                    name: 'Rectangle',
                    short_description: 'Lorem ipsum dolor sit amet.',
                }],
                name: 'signed distance fields',
            },
        ];
        element.querySelector('.begin')?.addEventListener('click', () => {
            localStorage.setItem('challenges', JSON.stringify(categories));
            app.transition('catalogue');
        });
        super(element);
    }
}
