import { IBasketData, IProduct } from '../../types';
import { IEvents } from '../base/events';

export class BasketData implements IBasketData {
	protected _products: IProduct[];
	protected _totalPrice: number;
	protected _counter: number;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
		this._products = [];
		this._counter = 0;
		this._totalPrice = 0;
	}

	addProduct(productData: IProduct) {
		if (productData) {
			this._products.push(productData);
			this.updateCounter();
			this.updateTotalPrice();
			this.events.emit('basket: changed');
		}
	}

	deleteProduct(productId: string) {
		this._products = this._products.filter(
			(product) => product.id !== productId
		);
		this.updateCounter();
		this.updateTotalPrice();
		this.events.emit('basket: changed');
	}

	cleanBasket() {
		this._products = [];
		this.updateCounter();
		this.updateTotalPrice();
		this.events.emit('basket: changed');
	}

	updateCounter() {
		this._counter = this._products.length;
	}

	updateTotalPrice() {
		this._totalPrice = this._products.reduce(
			(sum, product) => sum + product.price,
			0
		);
	}

	inBasket(productId: string) {
		return this._products.some((product) => product.id === productId);
	}

	get productIds(): string[] {
		return this._products.map((item) => item.id);
	}

	get counter(): number {
		return this._counter;
	}

	get products() {
		return this._products;
	}

	get totalPrice() {
		return this._totalPrice;
	}
}
