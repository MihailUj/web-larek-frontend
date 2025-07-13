import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IPage {
	lock(): void;
	counter: number;
	catalog: HTMLElement[];
}

export class Page extends Component<IPage> {
	protected _pageWrapper: HTMLElement;
	protected events: IEvents;
	protected headerBasketCounter: HTMLElement;
	protected headerBasketButton: HTMLButtonElement;
	protected productContainer: HTMLElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this._pageWrapper = container.querySelector('.page__wrapper');
		this.headerBasketCounter = document.querySelector(
			'.header__basket-counter'
		);
		this.headerBasketButton = document.querySelector('.header__basket');
		this.productContainer = document.querySelector('.gallery');

		this.headerBasketButton.addEventListener('click', () => {
			this.events.emit('basket: open');
		});
	}

	set counter(value: number) {
		this.headerBasketCounter.textContent = String(value);
	}

	set catalog(items: HTMLElement[]) {
		this.productContainer.replaceChildren(...items);
	}

	set locked(value: boolean) {
		if (value) {
			this._pageWrapper.classList.add('page__wrapper_locked');
		} else {
			this._pageWrapper.classList.remove('page__wrapper_locked');
		}
	}
}
