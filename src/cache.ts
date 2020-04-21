import { IContent, IChallenge } from './challenges';

export interface IHash {
    [details: number]: string | null;
}

export interface IChallengeCache {
    savedInput: IHash;
    revealed: number;
}

export class ChallengeCache {
    public data: IChallengeCache;
    public challenge: string;

    constructor(challenge: string) {
        const raw = localStorage.getItem(`${challenge}-state`);
        if (raw != null) {
            this.data = JSON.parse(raw) as IChallengeCache;
        } else {
            this.data = {
                savedInput: {},
                revealed: 1,
            };
        }
        this.challenge = challenge;
    }

    public store() {
        localStorage.setItem(`${this.challenge}-state`, JSON.stringify(this.data));
    }
}

const CHALLENGES = 'challenges';
const CURRENT_CHALLENGE = 'challenge';
const PAGE = 'page';
// tslint:disable-next-line: max-classes-per-file
export default class Cache {
    public static getContent() {
        const challenges = localStorage.getItem(CHALLENGES);
        return challenges == null ? null : JSON.parse(challenges) as IContent;
    }

    public static setContent(content: IContent) {
        localStorage.setItem(CHALLENGES, JSON.stringify(content));
    }

    public static completeChallenge(challenge: IChallenge) {
        const rawContent = Cache.getContent()!;
        const content = rawContent.content;
        const chall = content[challenge.category].challenges.find((c) => c.name === challenge.name)!;
        chall.active = false;
        for (const unlockedChallengeIdx of challenge.next_challenges) {
            const unlockedChallenge = content[challenge.category].challenges[unlockedChallengeIdx];
            unlockedChallenge.available = true;
            unlockedChallenge.active = true;
        }
        for (const unlockedCategoryName of challenge.next_catagories) {
            content[unlockedCategoryName].available = true;
        }
        this.setContent(rawContent);
    }

    public static getCurrentChallenge() {
        return localStorage.getItem(CURRENT_CHALLENGE);
    }

    public static setCurrentChallenge(challenge: string) {
        return localStorage.setItem(CURRENT_CHALLENGE, challenge);
    }

    public static getPage() {
        return localStorage.getItem(PAGE);
    }

    public static setPage(page: string) {
        localStorage.setItem(PAGE, page);
    }

    public static getChallengeCache(challenge: string) {
        return new ChallengeCache(challenge);
    }
}