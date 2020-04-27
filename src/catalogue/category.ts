import App from '../app';
import Cache from '../cache';
import { ICategory } from '../challenges';
import template from './category.html';

export default class Category {
    constructor(category: ICategory, parent: Element, idx: number, app: App) {
        const element = document.createElement('div');
        parent.appendChild(element);
        element.innerHTML = template;
        element.querySelector('.n')!.textContent = idx.toString();
        element.querySelector('.name')!.textContent = category.name;
        let activeAssigned = false;
        const items = element.querySelector('.items')!;
        for (const challenge of category.challenges) {
            if (challenge.available) {
                const challengeElement = document.createElement('div');
                items.appendChild(challengeElement);
                if (challenge.active) {
                    activeAssigned = true;
                    element.querySelector('.num')!.innerHTML = `${idx}<div class="nanim">${challenge.index}</div>`;
                    element.querySelector('.title.wrapper .title')!.textContent = challenge.name;
                    element.querySelector('.description')!.textContent = challenge.short_description;
                    challengeElement.innerHTML = `<div class="item c active">${challenge.index}&nbsp;<span class="info">in progress</span></div>`;
                } else {
                    challengeElement.innerHTML = `<div class="item">${challenge.index} <div class="check"></div></div>`;
                }
                const setBackground = () => {
                    if (!challengeElement.children[0].classList.contains('active')) {
                        element.querySelector('.active')?.classList.remove('active');
                        challengeElement.children[0].classList.add('active');
                        element.querySelector('.num')!.innerHTML = `${idx}<div class="nanim">${challenge.index}</div>`;
                        element.querySelector('.title.wrapper .title')!.textContent = challenge.name;
                        element.querySelector('.description')!.textContent = challenge.short_description;
                    }
                };
                challengeElement.addEventListener('mouseenter', setBackground);
                if (challenge === category.challenges[category.challenges.length - 1] && !activeAssigned) {
                    setBackground();
                }
                challengeElement.addEventListener('click', () => {
                    Cache.setCurrentChallenge(challenge.name);
                    app.transition('challenge');
                });
            }
        }
        const resizeHeight = () => {
            const realDescription = element.querySelector('.description:not(test)')! as HTMLDivElement;
            let maxHeight = 0;
            for (const challenge of category.challenges) {
                const testDescription = document.createElement('div');
                testDescription.classList.add('description');
                testDescription.classList.add('test');
                testDescription.textContent = challenge.short_description;
                testDescription.style.width = `${Math.round(realDescription.getBoundingClientRect().width)}px`;
                testDescription.style.position = 'absolute';
                testDescription.style.top = '-100px';
                testDescription.style.left = '-100px';
                element.appendChild(testDescription);
                const height = Math.round(testDescription.getBoundingClientRect().height);
                if (height > maxHeight) {
                    maxHeight = height;
                }
                testDescription.remove();
            }
            realDescription.style.height = `${maxHeight}px`;
        };
        window.addEventListener('resize', resizeHeight);
        setTimeout(resizeHeight, 0);
    }
}
