import { IChallenge } from '../challenges';
import { ILexicon } from '../lexicon';
import ShaderWrapper from '../shader';
import template from './category.html';
import defaultShader from './default_shader.glsl';
import templateShader from './shader_template.glsl';

export default class ShaderPortal {
    constructor(lexicon: ILexicon, parent: Element) {
        const element = document.createElement('div');
        parent.appendChild(element);
        element.innerHTML = template;
        const shader = new ShaderWrapper(element.querySelector('.renderer')! as HTMLCanvasElement, defaultShader);
        const shaderEntry = element.querySelector('.shaderentry')! as HTMLTextAreaElement;
        const userTemplateShader: string = templateShader.replace('LEXICON GOES HERE', lexicon.procedures.map((p) => {
            return p.body;
        }).join(' '));
        shaderEntry.addEventListener('change', () => {
            shader.updateShader(userTemplateShader.replace('STUFF GOES HERE', shaderEntry.value));
        });
        const lexiconElement = element.querySelector('.lexicon')!;
        for (const procedure of lexicon.procedures) {
            const procedureElement = document.createElement('div');
            lexiconElement.append(procedureElement);
            procedureElement.classList.add('.procedure');
            const procedureName = document.createElement('div');
            procedureElement.appendChild(procedureName);
            procedureName.classList.add('.name');
            procedureElement.textContent = procedure.name;
            const procedureDescription = document.createElement('div');
            procedureDescription.classList.add('.description');
            procedureElement.appendChild(procedureDescription);
            procedureDescription.textContent = procedure.description;
        }
    }
}
