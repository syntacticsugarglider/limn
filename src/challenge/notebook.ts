import template from './templates/notebook.html';
import inputTemplate from './templates/notebook_input.html';
import textTemplate from './templates/notebook_text.html';
import { ILexicon } from '../lexicon';
import { IChallenge } from '../challenges';
import ShaderWrapper from '../shader';
import defaultShader from './glsl/default_shader.glsl';
import shaderTemplate from './glsl/shader_template.glsl';
import App from '../app';
import Cache from '../cache';
import { ChallengeCache } from '../cache';

// I predict izzy will not like this
export default class Notebook {
    challenge: IChallenge;
    shaders: ShaderWrapper[][];
    sectionElements: HTMLElement[];
    revealedSections: number;
    app: App;
    cache: ChallengeCache;

    constructor(parentElement: Element, app: App, challenge: IChallenge, lexicon: ILexicon) {
        this.challenge = challenge;
        this.sectionElements = [];
        this.shaders = [];
        this.revealedSections = 0;
        this.app = app;
        this.cache = Cache.getChallengeCache(challenge.name);

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
                        let startingShader: string;
                        const cachedFrag = this.cache.data.savedInput[part.id];
                        if (cachedFrag != null && cachedFrag !== '') {
                            codeEditor.value = cachedFrag;
                            startingShader = this.templateEmbed(lexicon, cachedFrag);
                        } else {
                            codeEditor.value = part.default_frag;
                            startingShader = defaultShader;
                        }
                        codeEditor.addEventListener('change', () => {
                            this.cache.data.savedInput[part.id] = codeEditor.value;
                            this.cache.store();
                        });

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

        setTimeout(() => {
            for (let i = 0; i < this.cache.data.revealed; ++i) {
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
            this.app.transition('catalogue');
        }
        this.sectionElements[this.revealedSections].classList.remove('hidden');
        this.shaders[this.revealedSections].forEach((s) => s.callonload());
        ++this.revealedSections;
        this.cache.data.revealed = this.revealedSections;
        this.cache.store();
    }
}