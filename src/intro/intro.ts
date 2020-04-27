import App from '../app';
import Cache from '../cache';
import content from '../content/content';
import Page from '../page';
import intro from './intro.html';

export default class Catalogue extends Page {
    constructor(app: App) {
        const element = document.createElement('div');
        element.innerHTML = intro;
        element.querySelector('.begin')?.addEventListener('click', () => {
            Cache.setContent(content);
            app.transition('catalogue');
        });
        super(element);
    }
}
