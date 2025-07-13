import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IModal {
	content: HTMLElement;
	open(): void;
	close(): void;
}

export class Modal extends Component<IModal> {
	protected events: IEvents;
	protected _content: HTMLElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this._content = container.querySelector('.modal__content');

		const closeButtonElement = this.container.querySelector('.modal__close');
		closeButtonElement.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('mousedown', (evt) => {
			if (evt.target === evt.currentTarget) {
				this.close();
			}
		});
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal: open');
	}

	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal: close');
	}
}
