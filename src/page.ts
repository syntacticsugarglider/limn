export default abstract class Page {
    private element: Element;

    constructor(data: Element) {
        this.element = data;
        this.element.classList.add('page');
        document.body.appendChild(data);
    }

    public remove() {
        this.element.remove();
    }
}
