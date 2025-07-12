import { IApi, IOrder, IProduct } from '../../types';

export class AppApi {
	private _baseApi: IApi;
	private cdn: string;

	constructor(cdn: string, baseApi: IApi) {
		this._baseApi = baseApi;
		this.cdn = cdn;
	}

	getProducts(): Promise<IProduct[]> {
		return this._baseApi
			.get<{ total: number; items: IProduct[] }>('/product')
			.then((res: { total: number; items: IProduct[] }) =>
				res.items.map((item) => ({
					...item,
					image: this.cdn + item.image,
				}))
			);
	}

	getProductItem(productId: string): Promise<IProduct> {
		return this._baseApi
			.get<IProduct>(`/product/${productId}`)
			.then((product: IProduct) => product);
	}

	postOrder(data: IOrder): Promise<{ id: string; total: number }> {
		return this._baseApi
			.post<{ id: string; total: number }>(`/order`, data)
			.then((res: { id: string; total: number }) => res);
	}
}
