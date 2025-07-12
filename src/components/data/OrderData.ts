import { IOrder, IOrderData } from '../../types';
import { isEmpty } from '../../utils/utils';
import { IEvents } from '../base/events';

export class OrderData implements IOrderData {
	protected _orders: IOrder[];
	protected events: IEvents;
	productIds: string[];
	totalPrice: number;
	payment: string;
	email: string;
	phone: string;
	address: string;
	_id: string | null;

	constructor(events: IEvents) {
		this.events = events;
	}

	checkValidation(data: string): boolean {
		return !isEmpty(data);
	}

	setFormData(field: string, value: string) {
		switch (field) {
			case 'address':
				this.address = value;
				break;
			case 'payment':
				this.payment = value;
				break;
			case 'email':
				this.email = value;
				break;
			case 'phone':
				this.phone = value;
				break;
		}
	}

	setProductsData(productIds: string[], totalPrice: number) {
		this.productIds = productIds;
		this.totalPrice = totalPrice;
	}

	validateOrderForm() {
		return !isEmpty(this.address) && !isEmpty(this.payment);
	}

	validateContactsForm() {
		return !isEmpty(this.phone) && !isEmpty(this.email);
	}

	getOrderInfo() {
		return {
			items: this.productIds,
			total: this.totalPrice,
			payment: this.payment,
			email: this.email,
			phone: this.phone,
			address: this.address,
		};
	}
}
