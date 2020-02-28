export interface IChallenge {
    name: string;
    index: string;
    short_description: string;
    available: boolean;
    active: boolean;
}

export interface ICategory {
    name: string;
    challenges: IChallenge[];
}
