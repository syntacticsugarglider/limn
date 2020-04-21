import Catalogue from './catalogue/catalogue';
import Intro from './intro/intro';
import ChallengePage from './challenge/challenge_page';
import content from './content';
import Cache from './cache';

import Page from './page';

export default class App {
    private page: Page;

    constructor() {
        const page = Cache.getPage();

        if (!page) {
            Cache.setPage('intro');
        }

        switch (page) {
            case 'catalogue':
                this.page = new Catalogue(this);
                break;
            case 'intro':
                this.page = new Intro(this);
                break;
            case 'challenge':
                const challengeRaw = Cache.getCurrentChallenge();
                if (!challengeRaw) {
                    this.transition('catalogue');
                }
                for (const catagory of content) {
                    if (!catagory.available) {
                        continue;
                    }
                    for (const challenge of catagory.challenges) {
                        if (challenge.name === challengeRaw && challenge.available) {
                            this.page = new ChallengePage(this, { procedures: [] }, challenge);
                            return;
                        }
                    }
                }
                this.transition('catalogue');
            default:
                this.transition('intro');
        }
    }

    public transition(target: string) {
        Cache.setPage(target);
        window.location.reload();
    }
}
