import App from '../app';
import { ICategory, IChallenge } from '../challenges';
import Page from '../page';
import catalogue from './catalogue.html';
import Category from './category';
import Cache from '../cache';

export default class Catalogue extends Page {
    constructor(app: App) {
        const element = document.createElement('div');
        element.innerHTML = catalogue;
        const categories = Cache.getContent()!;
        const challenges = element.querySelector('.challenges')!;
        let i = 1;
        for (const category of categories.names) {
            const info = categories.content[category]!;
            if (info.available) {
                const _ = new Category(info, challenges, i, app);
                i++;
            }
        }
        super(element);
    }
}
