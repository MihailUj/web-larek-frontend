import { AppApi } from './components/data/AppApi';
import { Api } from './components/base/api';
import { EventEmitter, IEvents } from './components/base/events';
import { Basket } from './components/view/Basket';
import { BasketData } from './components/data/BasketData';
import { Modal } from './components/common/Modal';
import { Contacts } from './components/view/Contacts';
import { Order } from './components/view/Order';
import { OrderData } from './components/data/OrderData';
import { Card } from './components/view/Card';
import { ProductsData } from './components/data/ProductsData';
import { Success } from './components/view/Success';
import './scss/styles.scss';
import { IApi, IOrder } from './types';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { cloneTemplate } from './utils/utils';
import { Page } from './components/view/Page';

const events = new EventEmitter();

const productsData = new ProductsData(events);
const basketData = new BasketData(events);
const orderData = new OrderData(events);

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(CDN_URL, baseApi);


const modalContainer = new Modal(
	document.querySelector('#modal-container'),
	events
);

const basketTemplate: HTMLTemplateElement = document.querySelector('#basket');
const cardPreviewTemplate: HTMLTemplateElement =
	document.querySelector('#card-preview');
const cardCatalogTemplate: HTMLTemplateElement =
	document.querySelector('#card-catalog');
const cardBasketTemplate: HTMLTemplateElement =
	document.querySelector('#card-basket');
const orderTemplate: HTMLTemplateElement = document.querySelector('#order');
const contactsTemplate: HTMLTemplateElement =
	document.querySelector('#contacts');
const successTemplate: HTMLTemplateElement = document.querySelector('#success');

const page = new Page(document.querySelector('.page'), events);

const basketModal = new Basket(cloneTemplate(basketTemplate), events);
const orderModal = new Order(cloneTemplate(orderTemplate), events);
const contactsModal = new Contacts(cloneTemplate(contactsTemplate), events);
const successModal = new Success(cloneTemplate(successTemplate), events);

const previewInstant = new Card(
	cloneTemplate(cardPreviewTemplate),
	events,
	'cardPreview'
);
/*
events.onAll((event) => {
	console.log(event.eventName, event.data);
});
*/
api
	.getProducts()
	.then((productData) => {
		productsData.products = productData;
		events.emit('initialData: loaded');
	})
	.catch((err) => {
		console.log(err);
	});

events.on('initialData: loaded', () => {
	const productArray = productsData.products.map((product) => {
		const cardInstant = new Card(
			cloneTemplate(cardCatalogTemplate),
			events,
			'cardCatalog'
		);
		return cardInstant.render(product, basketData.inBasket(product.id));
	});
	page.render({ catalog: productArray });
});

events.on('basket: open', () => {
	const basketArray = basketData.products.map((product, index) => {
		const cardInstant = new Card(
			cloneTemplate(cardBasketTemplate),
			events,
			'cardBasket'
		);
		return cardInstant.render(product, true, index + 1);
	});
	const basket = { totalPrice: basketData.totalPrice, basketList: basketArray };
	modalContainer.render({ content: basketModal.render(basket) });
	modalContainer.open();
});

events.on('order: open', () => {
	const card = { content: orderModal.render() };
	modalContainer.render(card);
});

events.on('card: select', (data: { card: Card }) => {
	const { card } = data;
	const productData = productsData.getProduct(card.id);
	const inBasket = basketData.inBasket(card.id);
	const preview = previewInstant.render(productData, inBasket);
	modalContainer.render({ content: preview });
	modalContainer.open();
});

events.on('cardPreview: changed', (data: { card: Card }) => {
	const { card } = data;
	if (basketData.inBasket(card.id)) basketData.deleteProduct(card.id);
	else basketData.addProduct(productsData.getProduct(card.id));
	const productData = productsData.getProduct(card.id);
	const inBasket = basketData.inBasket(card.id);
	previewInstant.render(productData, inBasket);
});

events.on('cardBasket: changed', (data: { card: Card }) => {
	const { card } = data;
	basketData.deleteProduct(card.id);
	card.deleteCard();
	const basketArray = basketData.products.map((product, index) => {
		const cardInstant = new Card(
			cloneTemplate(cardBasketTemplate),
			events,
			'cardBasket'
		);
		return cardInstant.render(product, true, index + 1);
	});
	const basket = { totalPrice: basketData.totalPrice, basketList: basketArray };
	basketModal.render(basket);
});

events.on('basket: changed', () => {
	const basketProductsCount = basketData.counter;
	page.render({ counter: basketProductsCount });
});

events.on('order: changed', (data: { field: string; value: string }) => {
	orderData.setFormData(data.field, data.value);
	orderModal.valid = orderData.validateOrderForm();
});

events.on('order: submit', () => {
	const productIds: string[] = basketData.productIds;
	const totalPrice: number = basketData.totalPrice;
	orderData.setProductsData(productIds, totalPrice);
	const card = { content: contactsModal.render() };
	modalContainer.render(card);
});

events.on('contacts: changed', (data: { field: string; value: string }) => {
	orderData.setFormData(data.field, data.value);
	contactsModal.valid = orderData.validateContactsForm();
});

events.on('contacts: submit', () => {
	const orderInfo: IOrder = orderData.getOrderInfo();
	api
		.postOrder(orderInfo)
		.then((order) => {
			const modal = {
				content: successModal.render({ totalPrice: basketData.totalPrice }),
			};
			modalContainer.render(modal);
			basketData.cleanBasket();
		})
		.catch((err) => {
			console.log(err);
		});
});

events.on('success: close', () => {
	modalContainer.close();
});

events.on('modal: close', () => {
	orderModal.resetForm();
	contactsModal.resetForm();
	page.locked = false;
});

events.on('modal: open', () => {
	page.locked = true;
})