import { IChallenge } from '../challenges';
import { ILexicon } from '../lexicon';
import ShaderPortal from './shader_portal';
import App from '../app';
import template from './challenge_page.html';
import Page from '../page';

export default class ChallengePage extends Page {
    constructor(app: App, lexicon: ILexicon, challenge: IChallenge) {
        const element = document.createElement('div');
        element.innerHTML = template;
        const _ = new ShaderPortal(lexicon, element);
        super(element);
    }
}
