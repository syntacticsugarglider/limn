import template from './templates/notebook.html';
import inputTemplate from './templates/notebook_input.html';
import textTemplate from './templates/notebook_text.html';
import { ILexicon } from '../lexicon';
import { IChallenge, INotebookSection } from '../challenges';
import ShaderWrapper from '../shader';
import defaultShader from './glsl/default_shader.glsl';
import shaderTemplate from './glsl/shader_template.glsl';

// I predict izzy will not like this
export default class Notebook {
    challenge: IChallenge;
    shaders: ShaderWrapper[][];
    sectionElements: HTMLElement[];
    revealedSections: number;

    constructor(parentElement: Element, challenge: IChallenge, lexicon: ILexicon) {
        this.challenge = challenge;
        this.sectionElements = [];
        this.shaders = [];
        this.revealedSections = 0;

        const element = document.createElement('div')!;
        element.innerHTML = template;

        const content = element.querySelector('.content')!;

        element.querySelector('.revealnext')!.addEventListener('click', () => this.revealNext());

        for (const section of this.challenge.notebook) {
            const sectionElement = document.createElement('div')!;
            const shaders = [];
            sectionElement.classList.add('hidden');
            for (const part of section) {
                const partElement = document.createElement('div')!;
                switch (part.type) {
                    case 'text':
                        partElement.innerHTML = textTemplate;
                        partElement.querySelector('.text')!.textContent = part.text;
                        break;
                    case 'input':
                        partElement.innerHTML = inputTemplate;
                        const codeEditor = partElement.querySelector('textarea')!;
                        // I know izzy won't like this scheme
                        const cachedFragKey = `${challenge.name}-${this.challenge.notebook.indexOf(section)}-${section.indexOf(part)}`;
                        const cachedFrag = localStorage.getItem(cachedFragKey);
                        let startingShader: string;
                        if (cachedFrag != null && cachedFrag !== '') {
                            codeEditor.value = cachedFrag;
                            startingShader = this.templateEmbed(lexicon, cachedFrag);
                        } else {
                            codeEditor.value = part.default_frag;
                            startingShader = defaultShader;
                        }
                        codeEditor.addEventListener('change', () =>
                            localStorage.setItem(cachedFragKey, codeEditor.value));

                        let shader: ShaderWrapper;
                        try {
                            shader =
                                new ShaderWrapper(
                                    partElement.querySelector('canvas')! as HTMLCanvasElement,
                                    startingShader
                                );
                        } catch (e) {
                            shader =
                                new ShaderWrapper(
                                    partElement.querySelector('canvas')! as HTMLCanvasElement,
                                    defaultShader
                                );
                        }
                        shaders.push(shader);
                        partElement.querySelector('.compile')!.addEventListener('click', () => {
                            if (codeEditor.value !== '') {
                                shader.updateShader(
                                    this.templateEmbed(lexicon, codeEditor.value)
                                );
                            }
                        });
                        break;
                }
                sectionElement.appendChild(partElement);
            }
            content.appendChild(sectionElement);
            this.shaders.push(shaders);
            this.sectionElements.push(sectionElement);
        }

        const cachedRevealed = localStorage.getItem(`${this.challenge.name}-revealed`);
        setTimeout(() => {
            if (cachedRevealed != null) {

                for (let i = 0; i < Number(cachedRevealed); ++i) {
                    this.revealNext();
                }

            } else {
                this.revealNext();
            }
        }, 0);
        parentElement.appendChild(element);
    }

    public templateEmbed(lexicon: ILexicon, embed: string) {
        return shaderTemplate
            .replace(
                'LEXICON GOES HERE', lexicon.procedures.map((proc) => proc.body).reduce(
                    (prev, current) => prev + '\n' + current,
                    ''
                )
            )
            .replace(
                'STUFF GOES HERE', embed
            );
    }

    public revealNext() {
        if (this.revealedSections === this.sectionElements.length) {
            return false;
        }
        this.sectionElements[this.revealedSections].classList.remove('hidden');
        this.shaders[this.revealedSections].forEach((s) => s.callonload());
        ++this.revealedSections;
        localStorage.setItem(`${this.challenge.name}-revealed`, this.revealedSections.toString());
        return true;
    }
}