import App from '../app';
import Page from '../page';
import catalogue from './catalogue.html';

export default class Catalogue extends Page {
    constructor(app: App) {
        const element = document.createElement('div');
        element.innerHTML = catalogue;
        super(element);
    }
}
