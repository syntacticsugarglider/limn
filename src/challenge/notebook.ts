import App from '../app';
import Cache from '../cache';
import { ChallengeCache } from '../cache';
import { IChallenge } from '../challenges';
import { ILexicon } from '../lexicon';
import ShaderWrapper from '../shader';
import defaultShader from './glsl/default_shader.glsl';
import shaderTemplate from './glsl/shader_template.glsl';
import template from './templates/notebook.html';
import inputTemplate from './templates/notebook_input.html';
import subpageTemplate from './templates/notebook_subpage.html';
import textTemplate from './templates/notebook_text.html';

import { CodeJar } from '@medv/codejar';

import * as Prism from 'prismjs';
import 'prismjs/components/prism-glsl.js';

interface IOptions {
    tab: string;
}

String.prototype.trim = function () {
    return this.replace(/\n$/g, '');
};

interface ICodeJar {
    updateOptions(options: Partial<IOptions>): void;
    updateCode(code: string): void;
    onUpdate(cb: (code: string) => void): void;
    destroy(): void;
    toString(): string;
}

export interface IWindows {
    [details: number]: Window | null;
}

export default class Notebook {
    private challenge: IChallenge;
    private shaders: ShaderWrapper[][];
    private windows: IWindows;
    private sectionElements: HTMLElement[];
    private revealedSections: number;
    private app: App;
    private cache: ChallengeCache;

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
                        partElement.querySelector('.continue')!.addEventListener('click', () => this.revealNext(false));
                        const lineNumbers = partElement.querySelector('.line-numbers')!;
                        const cachedFrag = this.cache.data.savedInput[part.id];
                        let initFrag: string;
                        if (cachedFrag != null && cachedFrag !== '') {
                            initFrag = cachedFrag;
                        } else {
                            initFrag = part.default_frag;
                        }
                        const codeEditor: ICodeJar =
                            CodeJar(partElement.querySelector('#editor')! as HTMLElement, (el) => {
                                const linesCount =
                                    ((codeEditor?.toString().trim()
                                        || initFrag.trim()).match(/\n/g) || '').length + 1;
                                lineNumbers.innerHTML = '';
                                Array(linesCount).fill(0).forEach((_, idx) => {
                                    const elem = document.createElement('div');
                                    elem.classList.add('linenum');
                                    elem.textContent = (idx + 1).toString();
                                    lineNumbers.appendChild(elem);
                                });
                                Prism.highlightElement(el);
                            }, { tab: ' '.repeat(4) });
                        let startingShader: string;
                        if (cachedFrag != null && cachedFrag !== '') {
                            codeEditor.updateCode(cachedFrag);
                            startingShader = this.templateEmbed(lexicon, cachedFrag);
                        } else {
                            codeEditor.updateCode(part.default_frag);
                            startingShader = defaultShader;
                        }
                        const canvas = partElement.querySelector('canvas')! as HTMLCanvasElement;
                        let shader: ShaderWrapper;
                        try {
                            shader =
                                new ShaderWrapper(
                                    canvas,
                                    startingShader,
                                );
                        } catch (e) {
                            shader =
                                new ShaderWrapper(
                                    canvas,
                                    defaultShader,
                                );
                        }

                        codeEditor.onUpdate((code) => {
                            const errors = shader.updateShader(
                                this.templateEmbed(lexicon, code),
                            );
                            if (errors) {
                                // TODO error handling

                                // for (const error of errors.trim().split('\n')) {
                                //     const error_terms = error.split(':');
                                //     console.log(error_terms);
                                // }
                            }
                            this.cache.data.savedInput[part.id] = code;
                            this.cache.store();
                        });

                        const canvasContainer = partElement.querySelector('.canvascontainer')!;
                        partElement.querySelector('.changeview')!.addEventListener('click', () => {
                            const shaderWindow = this.windows[part.id];
                            if (shaderWindow == null || shaderWindow.closed) {
                                const newWindow = window.open('', `${challenge.name} ${part.id}`, 'channelmode=yes');
                                if (newWindow != null) {
                                    canvas.remove();
                                    canvasContainer.classList.add('hidden');
                                    newWindow.document.body.innerHTML = subpageTemplate;
                                    newWindow.document.querySelector('.canvascontainer')!.appendChild(canvas);
                                    const closePopout = () => {
                                        canvas.remove();
                                        canvasContainer.appendChild(canvas);
                                        canvasContainer.classList.remove('hidden');
                                        newWindow.close();
                                    };
                                    newWindow.document
                                        .querySelector('.changeview')!
                                        .addEventListener('click', closePopout);
                                    newWindow.addEventListener('unload', closePopout);
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
                const max = e.getBoundingClientRect().height;
                e.style.height = '';
                e.style.height = `${Math.max(e.scrollHeight, max)}px`;
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
                    '',
                ),
            )
            .replace(
                'STUFF GOES HERE', embed,
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
