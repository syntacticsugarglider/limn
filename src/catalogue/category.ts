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
                    element.querySelector('.title.wrapper .title')!.textContent = challenge.name;
                    element.querySelector('.description')!.textContent = challenge.short_description;
                    challengeElement.innerHTML = `<div class="item c active">${challenge.index}&nbsp;<span class="info">in progress</span></div>`;
                } else {
                    challengeElement.innerHTML = `<div class="item">${challenge.index} <div class="check"></div></div>`;
                }
                challengeElement.addEventListener('mouseover', () => {
                    element.querySelector('.active')?.classList.remove('active');
                    challengeElement.children[0].classList.add('active');
                    element.querySelector('.num')!.textContent = `${idx}${challenge.index}`;
                    element.querySelector('.title.wrapper .title')!.textContent = challenge.name;
                    element.querySelector('.description')!.textContent = challenge.short_description;
                });
            }
        }
    }
}
