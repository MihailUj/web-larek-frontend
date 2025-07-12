import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface ISuccess {
	_description: HTMLElement;
	button: HTMLButtonElement;
	totalPrice: number;
}

export class Success extends Component<ISuccess> {
	_description: HTMLElement;
	button: HTMLButtonElement;
	events: IEvents;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this._description = this.container.querySelector(
			'.order-success__description'
		);
		this.button = this.container.querySelector('.order-success__close');

		this.button.addEventListener('click', () =>
			this.events.emit('success: close')
		);
	}

	set totalPrice(total: number) {
		this._description.textContent = String(`Списано ${total} синапсов`);
	}
}
