import { IProduct } from '../../types';
import { cloneTemplate, isEmpty } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Component } from '../base/Component';
import { buttonNames, categoryColors } from '../../utils/constants';

export class Card extends Component<IProduct> {
	protected events: IEvents;
	protected blockName: String;
	protected cardTitle: HTMLElement;
	protected cardDescription: HTMLElement;
	protected cardCategory: HTMLElement;
	protected cardPrice: HTMLElement;
	protected cardImage: HTMLImageElement;
	protected cardButton: HTMLButtonElement;
	protected ItemIndex: HTMLElement;
	protected productId: string;

	constructor(
		protected container: HTMLTemplateElement,
		events: IEvents,
		blockName: String
	) {
		super(container);
		this.events = events;
		this.blockName = blockName;

		this.cardCategory = this.container.querySelector('.card__category');
		this.cardTitle = this.container.querySelector('.card__title');
		this.cardImage = this.container.querySelector('.card__image');
		this.cardPrice = this.container.querySelector('.card__price');
		this.cardDescription = this.container.querySelector('.card__text');
		this.cardButton = this.container.querySelector('.card__button');
		this.ItemIndex = this.container.querySelector('.basket__item-index');

		if (this.blockName === 'cardCatalog') {
			this.container.addEventListener('click', () => {
				this.events.emit('card: select', { card: this });
			});
		}

		if (this.cardButton) {
			this.cardButton.addEventListener('click', () => {
				this.events.emit(`${this.blockName}: changed`, { card: this });
			});
		}
	}
	render(data?: Partial<IProduct>, inBasket?: boolean): HTMLElement;
	render(
		data: Partial<IProduct>,
		inBasket: boolean,
		index: number
	): HTMLElement;

	render(
		data: Partial<IProduct> | undefined,
		inBasket: boolean,
		index?: number
	) {
		if (index) this.index = index;
		if (!Boolean(data.price)) this.buttonState = 'notSale';
		else if (inBasket) this.buttonState = 'inBasket';
		else this.buttonState = 'notInBasket';
		Object.assign(this, data);
		return this.container;
	}

	set index(value: number) {
		if (this.ItemIndex) this.ItemIndex.textContent = String(value);
	}

	set title(title: string) {
		if (this.cardTitle) this.cardTitle.textContent = title;
	}

	set description(description: string) {
		if (this.cardDescription) this.cardDescription.textContent = description;
	}

	set category(category: string) {
		if (this.cardCategory) {
			this.cardCategory.textContent = category;
			this.cardCategory.className = `card__category card__category_${categoryColors[category]}`;
		}
	}

	set image(image: string) {
		if (this.cardImage) this.cardImage.src = image;
	}

	set price(price: number) {
		if (this.cardPrice)
			if(price) this.cardPrice.textContent = String(price + ' синапсов');
			else this.cardPrice.textContent = String('Бесценно');
	}

	set id(id: string) {
		this.productId = id;
	}

	get id() {
		return this.productId;
	}

	set buttonState(state: string) {
		if (this.blockName === 'cardPreview') {
			if (state === 'notSale') this.cardButton.disabled = true;
			else this.cardButton.disabled = false;
			this.cardButton.textContent = buttonNames[state];
		}
	}

	deleteCard() {
		this.container.remove();
		this.container = null;
	}
}
