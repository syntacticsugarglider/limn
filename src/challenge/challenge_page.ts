import { IChallenge } from '../challenges';
import { ILexicon } from '../lexicon';
import Notebook from './notebook';
import App from '../app';
import template from './templates/challenge_page.html';
import Page from '../page';

export default class ChallengePage extends Page {
    constructor(app: App, lexicon: ILexicon, challenge: IChallenge) {
        const element = document.createElement('div');
        element.innerHTML = template;
        const notebook = new Notebook(element, challenge, lexicon);
        super(element);
    }
}
