import Cache from './cache';
import Catalogue from './catalogue/catalogue';
import ChallengePage from './challenge/challenge_page';
import defaultContent from './content/content';
import Intro from './intro/intro';

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
                let content = Cache.getContent();
                if (content === null) {
                    content = defaultContent;
                }
                const challengeRaw = Cache.getCurrentChallenge();
                if (!challengeRaw) {
                    this.transition('catalogue');
                }
                for (const categoryName of content.names) {
                    const category = content.content[categoryName];
                    if (!category.available) {
                        continue;
                    }
                    for (const challenge of category.challenges) {
                        if (challenge.name === challengeRaw && challenge.available) {
                            this.page = new ChallengePage(this, { procedures: [] }, challenge);
                            return;
                        }
                    }
                }
                this.transition('catalogue');
                break;
            default:
                this.transition('intro');
        }
    }

    public transition(target: string) {
        Cache.setPage(target);
        window.location.reload();
    }
}
