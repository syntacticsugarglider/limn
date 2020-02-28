import Catalogue from './catalogue/catalogue';
import Intro from './intro/intro';

import Page from './page';

export default class App {
    private page: Page;

    constructor() {
        const page = localStorage.getItem('page');

        if (!page) {
            localStorage.setItem('page', 'intro');
        }

        switch (page) {
            case 'catalogue':
                this.page = new Catalogue(this);
                break;
            case 'intro':
                this.page = new Intro(this);
                break;
            default:
                this.transition('intro');
        }
    }

    public transition(target: string) {
        localStorage.setItem('page', target);
        window.location.reload();
    }
}
