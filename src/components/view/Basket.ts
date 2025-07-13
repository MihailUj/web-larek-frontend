import { createElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IBasket {
	basketList: HTMLElement[];
	totalPrice: number;
}

export class Basket extends Component<IBasket> {
	protected events: IEvents;

	protected basketListContainer: HTMLElement;
	protected basketPrice: HTMLElement;
	protected basketButton: HTMLButtonElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.basketListContainer = container.querySelector('.basket__list');
		this.basketPrice = container.querySelector('.basket__price');
		this.basketButton = container.querySelector('.basket__button');

		this.basketButton.addEventListener('click', () => {
			this.events.emit('order: open');
		});
	}

	render(data: Partial<IBasket>) {
		if (data.totalPrice === 0) this.basketButton.disabled = true;
		else this.basketButton.disabled = false;
		Object.assign(this, data ?? {});
		return this.container;
	}

	set totalPrice(value: number) {
		this.basketPrice.textContent = String(value + ' синапсов');
	}

	set basketList(items: HTMLElement[]) {
		if (items.length) {
			this.basketListContainer.replaceChildren(...items);
		} else {
			this.basketButton.disabled = true;
			this.basketListContainer.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}
}
