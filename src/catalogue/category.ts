import { ICategory } from '../challenges';
import template from './category.html';

export default class Category {
    constructor(category: ICategory, parent: Element, idx: number) {
        const element = document.createElement('div');
        parent.appendChild(element);
        element.innerHTML = template;
        element.querySelector('.n')!.textContent = idx.toString();
        element.querySelector('.name')!.textContent = category.name;
        const items = element.querySelector('.items')!;
        for (const challenge of category.challenges) {
            if (challenge.available) {
                const challengeElement = document.createElement('div');
                items.appendChild(challengeElement);
                if (challenge.active) {
                    element.querySelector('.num')!.textContent = `${idx}${challenge.index}`;
                    challengeElement.outerHTML = `<div class="item c active">${challenge.index}&nbsp;<span class="info">in progress</span></div>`;
                } else {
                    challengeElement.outerHTML = `<div class="item">${challenge.index} <div class="check"></div></div>`;
                }
            }
        }
    }
}
