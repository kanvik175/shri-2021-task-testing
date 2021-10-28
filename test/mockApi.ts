import { AxiosResponse } from "axios";
import {
  CartState,
  CheckoutFormData,
  CheckoutResponse,
  Product,
  ProductShortInfo,
} from "../src/common/types";
import { ExampleApi } from "../src/client/api";

export class MockExampleApi extends ExampleApi {
  private products: Product[] = [
    {
      id: 1,
      name: "Халат",
      price: 200,
      description: "классный халат",
      material: "хлопок",
      color: "зеленый",
    },
    {
      id: 2,
      name: "Куртка",
      price: 600,
      description: "теплая куртка",
      material: "пух",
      color: "черная",
    },
    {
      id: 3,
      name: "Свитер",
      price: 400,
      description: "мягкий свитер",
      material: "шерсть",
      color: "красный",
    },
  ];

  constructor(basename: string) {
    super(basename);
  }

  async getProducts() {
    return {
      data: this.products.map(({ id, name, price }) => ({
        id,
        name,
        price,
      })),
    } as AxiosResponse<ProductShortInfo[]>;
  }

  async getProductById(id: number) {
    return {
      data: this.products.find((product) => {
        return product.id === id;
      }),
    } as AxiosResponse<Product>;
  }

  async checkout(form: CheckoutFormData, cart: CartState) {
    return {
      data: {
        id: 234,
      },
    } as AxiosResponse<CheckoutResponse>;
  }
}
