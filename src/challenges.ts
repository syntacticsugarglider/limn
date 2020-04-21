export interface ITextSection {
    type: 'text';
    text: string;
}

export interface IInputSection {
    type: 'input';
    id: number;
    default_frag: string;
}

export type INotebookSection = ITextSection | IInputSection;

export interface IChallenge {
    name: string;
    index: string;
    category: string;
    short_description: string;
    available: boolean;
    active: boolean;
    next_challenges: number[];
    next_catagories: string[];
    notebook: INotebookSection[][];
}

export interface ICategory {
    name: string;
    available: boolean;
    challenges: IChallenge[];
}

export interface IContent {
    names: string[];
    content: IContentHash;
}

export interface IContentHash {
    [name: string]: ICategory;
}
