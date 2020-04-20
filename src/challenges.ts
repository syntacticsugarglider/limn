export interface ITextSection {
    type: 'text';
    text: string;
}

export interface IInputSection {
    type: 'input';
    default_frag: string;
}

export type INotebookSection = ITextSection | IInputSection;

export interface IChallenge {
    name: string;
    index: string;
    short_description: string;
    available: boolean;
    active: boolean;
    notebook: INotebookSection[][];
}

export interface ICategory {
    name: string;
    available: boolean;
    challenges: IChallenge[];
}
