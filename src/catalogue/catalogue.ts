import App from '../app';
import { ICategory, IChallenge } from '../challenges';
import Page from '../page';
import catalogue from './catalogue.html';
import Category from './category';

export default class Catalogue extends Page {
    constructor(app: App) {
        const element = document.createElement('div');
        element.innerHTML = catalogue;
        const categories = JSON.parse(localStorage.getItem('challenges')!) as ICategory[];
        const challenges = element.querySelector('.challenges')!;
        let i = 1;
        for (const category of categories) {
            if (category.available) {
                const _ = new Category(category, challenges, i, app);
                i++;
            }
        }
        super(element);
    }
}
