import template from './templates/notebook.html';
import inputTemplate from './templates/notebook_input.html';
import textTemplate from './templates/notebook_text.html';
import subpageTemplate from './templates/notebook_subpage.html';
import { ILexicon } from '../lexicon';
import { IChallenge } from '../challenges';
import ShaderWrapper from '../shader';
import defaultShader from './glsl/default_shader.glsl';
import shaderTemplate from './glsl/shader_template.glsl';
import App from '../app';
import Cache from '../cache';
import { ChallengeCache } from '../cache';

export interface IWindows {
    [details: number]: Window | null;
}

export default class Notebook {
    challenge: IChallenge;
    shaders: ShaderWrapper[][];
    windows: IWindows;
    sectionElements: HTMLElement[];
    revealedSections: number;
    app: App;
    cache: ChallengeCache;

    constructor(parentElement: Element, app: App, challenge: IChallenge, lexicon: ILexicon) {
        this.challenge = challenge;
        this.sectionElements = [];
        this.shaders = [];
        this.windows = {};
        this.revealedSections = 0;
        this.app = app;
        this.cache = Cache.getChallengeCache(challenge.name);

        const element = document.createElement('div')!;
        element.innerHTML = template;

        const content = element.querySelector('.content')!;

        element.querySelector('.revealnext')!.addEventListener('click', () => this.revealNext(false));

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

                        const canvas = partElement.querySelector('canvas')! as HTMLCanvasElement;
                        let shader: ShaderWrapper;
                        try {
                            shader =
                                new ShaderWrapper(
                                   canvas,
                                    startingShader
                                );
                        } catch (e) {
                            shader =
                                new ShaderWrapper(
                                    canvas,
                                    defaultShader
                                );
                        }
                        partElement.querySelector('.compile')!.addEventListener('click', () => {
                            shader.updateShader(
                                this.templateEmbed(lexicon, codeEditor.value)
                            );
                        });

                        const shaderPortal = partElement.querySelector('.shaderportal')!;
                        const canvasContainer = partElement.querySelector('.canvascontainer')!;
                        partElement.querySelector('.changeview')!.addEventListener('click', () => {
                            const shaderWindow = this.windows[part.id];
                            if (shaderWindow == null || shaderWindow.closed) {
                                const newWindow = window.open('', `${challenge.name} ${part.id}`, 'channelmode=yes');
                                if (newWindow != null) {
                                    canvas.remove();
                                    shaderPortal.classList.add('hidden');
                                    newWindow.document.body.innerHTML = subpageTemplate;
                                    newWindow.document.querySelector('.canvascontainer')!.appendChild(canvas);
                                    const closePopout = () => {
                                        canvas.remove();
                                        canvasContainer.appendChild(canvas);
                                        shaderPortal.classList.remove('hidden');
                                        newWindow.close();
                                    };
                                    newWindow.document
                                        .querySelector('.changeview')!
                                        .addEventListener('click', closePopout);
                                    newWindow.addEventListener('close', closePopout);
                                    this.windows[part.id] = newWindow;
                                }
                            } else {
                                shaderWindow.focus();
                            }
                        });
                        shaders.push(shader);
                        break;
                }
                sectionElement.appendChild(partElement);
            }
            content.appendChild(sectionElement);
            this.shaders.push(shaders);
            this.sectionElements.push(sectionElement);
        }

        element.querySelectorAll('textarea').forEach((e) => {
            const resize = () => {
                e.style.height = '';
                e.style.height = `${e.scrollHeight}px`;
            };
            e.addEventListener('input', resize);
            setTimeout(resize, 100); // TODO: I can't figure out how to do this properly?
        });

        setTimeout(() => {
            for (let i = 0; i < this.cache.data.revealed; ++i) {
                this.revealNext(true);
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

    public revealNext(setup: boolean) {
        if (this.revealedSections === this.sectionElements.length) {
            Cache.completeChallenge(this.challenge);
            if (!setup) {
                this.app.transition('catalogue');
            }
            return;
        }

        this.sectionElements[this.revealedSections].classList.remove('hidden');
        this.shaders[this.revealedSections].forEach((s) => s.callonload());

        ++this.revealedSections;
        if (!setup) {
            this.cache.data.revealed = this.revealedSections;
            this.cache.store();
        }
    }
}