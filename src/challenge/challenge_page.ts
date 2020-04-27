import App from '../app';
import { IChallenge } from '../challenges';
import { ILexicon } from '../lexicon';
import Page from '../page';
import Notebook from './notebook';
import template from './templates/challenge_page.html';

export default class ChallengePage extends Page {
    constructor(app: App, lexicon: ILexicon, challenge: IChallenge) {
        const element = document.createElement('div');
        element.innerHTML = template;
        element.querySelector('.cataloguenav')!.addEventListener('click', () => app.transition('catalogue'));
        const notebook = new Notebook(element.querySelector('.content')!, app, challenge, lexicon);
        super(element);
    }
}
