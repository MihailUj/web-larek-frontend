import { ApiPostMethods } from '../components/base/api';

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IOrder {
	items: string[];
	total: number;
	payment: string;
	email: string;
	phone: string;
	address: string;
}

export interface IProductsData {
	products: IProduct[];
	getProduct(productId: string): IProduct;
}

export interface IBasketData {
	products: IProduct[];
	totalPrice: number;
	counter: number;
	addProduct(productData: IProduct): void;
	deleteProduct(productId: string): void;
	cleanBasket(): void;
	updateCounter(): void;
	updateTotalPrice(): void;
	inBasket(productId: string): boolean;
}

export interface IOrderData {
	checkValidation(data: string): boolean;
	setFormData(field: string, value: string): void;
	setProductsData(productIds: string[], totalPrice: number): void;
	validateOrderForm(): boolean;
	validateContactsForm(): boolean;
	getOrderInfo(): IOrder;
}

export interface IApi {
	baseUrl: string;
	get<T>(url: string): Promise<T>;
	post<T>(url: string, data: object, method?: ApiPostMethods): Promise<T>;
}
