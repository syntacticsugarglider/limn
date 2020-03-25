export interface IProcedure {
    name: string;
    body: string;
    description: string;
    dependencies: string[];
}

export interface ILexicon {
    procedures: IProcedure[];
}
