import { IOrder } from '../../types';
import { formErrorsMassage } from '../../utils/constants';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class Contacts extends Component<IOrder> {
	protected events: IEvents;

	protected submitButton: HTMLButtonElement;
	protected formErrors: HTMLElement;
	protected inputs: HTMLInputElement[];

	constructor(protected container: HTMLFormElement, events: IEvents) {
		super(container);
		this.events = events;

		this.formErrors = container.querySelector('.form__errors');
		this.submitButton = container.querySelector('.button');
		this.inputs = Array.from(container.querySelectorAll('.form__input'));

		this.inputs.forEach((input) => {
			input.addEventListener('input', (evt) => {
				const target = evt.target as HTMLInputElement;
				const field = target.name;
				const value = target.value;
				this.events.emit('contacts: changed', { field, value });
			});
		});

		container.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit('contacts: submit');
		});
	}

	set valid(isValid: boolean) {
		this.submitButton.disabled = !isValid;
		if (isValid) this.errorMassage = '';
		else this.errorMassage = formErrorsMassage['contacts'];
	}

	set errorMassage(text: string) {
		this.formErrors.textContent = text;
	}

	resetForm() {
		this.container.reset();
	}
}
