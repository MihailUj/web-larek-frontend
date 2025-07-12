import { IOrder } from '../../types';
import { formErrorsMassage } from '../../utils/constants';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class Order extends Component<IOrder> {
	protected events: IEvents;

	protected paymentButtons: HTMLButtonElement[];
	protected submitButton: HTMLButtonElement;
	protected formErrors: HTMLElement;

	constructor(protected container: HTMLFormElement, events: IEvents) {
		super(container);
		this.events = events;

		this.paymentButtons = Array.from(container.querySelectorAll('.button_alt'));
		this.formErrors = container.querySelector('.form__errors');
		this.submitButton = container.querySelector('.order__button');

		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.payment = button.name;
				const field = 'payment';
				const value = button.name;
				this.events.emit('order: changed', { field, value });
			});
		});

		container.addEventListener('input', (evt) => {
			const target = evt.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;
			this.events.emit('order: changed', { field, value });
		});

		container.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit('order: submit');
		});
	}

	set valid(isValid: boolean) {
		this.submitButton.disabled = !isValid;
		if (isValid) this.errorMassage = '';
		else this.errorMassage = formErrorsMassage['order'];
	}

	set payment(paymentMethod: String) {
		if (paymentMethod) {
			this.paymentButtons.forEach((button) => {
				button.classList.toggle(
					'button_alt-active',
					button.name === paymentMethod
				);
			});
		} else {
			this.paymentButtons.forEach((button) => {
				button.classList.remove('button_alt-active');
			});
		}
	}

	set errorMassage(text: string) {
		this.formErrors.textContent = text;
	}

	resetForm() {
		this.payment = null;
		this.container.reset();
	}
}
