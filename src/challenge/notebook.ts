import template from './notebook.html';
import { ILexicon } from '../lexicon';
import { INotebookSection } from '../challenges';
import ShaderWrapper from '../shader';
import defaultShader from './glsl/default_shader.glsl';
import shaderTemplate from './glsl/shader_template.glsl';

export default class Notebook {
    sections: INotebookSection[][];
    sectionElements: HTMLElement[];
    revealedSections: number;

    constructor(parentElement: Element, sections: INotebookSection[][], lexicon: ILexicon) {
        this.sections = sections;
        this.sectionElements = [];
        this.revealedSections = 1;

        const element = document.createElement('div')!;
        element.innerHTML = template;

        const content = element.querySelector('.content')!;

        element.querySelector('.revelnext')!.addEventListener('click', () => this.revealNext());

        const textTemplate = element.querySelector('.text')!;
        textTemplate.remove();
        const inputTemplate = element.querySelector('.input')!;
        inputTemplate.remove();


        for (const section of sections) {
            const sectionElement = document.createElement('div')!;
            sectionElement.classList.add('hidden');
            for (const part of section) {
                switch (part.type) {
                    case 'text':
                        const text = textTemplate.cloneNode()! as HTMLElement;
                        text.textContent = part.text;
                        content.appendChild(text);
                        this.sectionElements.push(text);
                        break;
                    case 'input':
                        const input = inputTemplate.cloneNode()! as HTMLElement;
                        const codeEditor = input.querySelector('textarea')!;
                        codeEditor.value = part.default_frag;
                        const shader =
                            new ShaderWrapper(input.querySelector('canvas')! as HTMLCanvasElement, defaultShader);
                        input.querySelector('compile')!.addEventListener('click', () =>
                            shader.updateShader(
                                shaderTemplate
                                    .replace(
                                        'LEXICON GOES HERE', lexicon.procedures.map((proc) => proc.body).reduce(
                                            (prev, current) => prev + '\n' + current
                                        )
                                    )
                                    .replace(
                                        'STUFF GOES HERE', codeEditor.value
                                    )
                            )
                        );
                        this.sectionElements.push(input);
                        break;
                }
            }
        }

        parentElement.appendChild(element);
    }

    public revealNext() {
        if (this.revealedSections === this.sectionElements.length) {
            return false;
        }
        this.sectionElements[this.revealedSections].classList.remove('hidden');
        ++this.revealedSections;
        return true;
    }
}