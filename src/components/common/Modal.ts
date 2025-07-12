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
	protected _pageWrapper: HTMLElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this._content = container.querySelector('.modal__content');
		this._pageWrapper = document.querySelector('.page__wrapper');

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

	set locked(value: boolean) {
		if (value) {
			this._pageWrapper.classList.add('page__wrapper_locked');
		} else {
			this._pageWrapper.classList.remove('page__wrapper_locked');
		}
	}

	open() {
		this.container.classList.add('modal_active');
		this.locked = true;
	}

	close() {
		this.container.classList.remove('modal_active');
		this.locked = false;
		this.content = null;
		this.events.emit('modal: close');
	}
}
