import App from '../app';
import content from '../content';
import Page from '../page';
import intro from './intro.html';
import Cache from '../cache';

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
