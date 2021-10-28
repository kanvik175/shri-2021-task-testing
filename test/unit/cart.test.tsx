import "@testing-library/jest-dom";
import { render, within, screen } from "@testing-library/react";
import event from "@testing-library/user-event";
import React from "react";
import { Provider } from "react-redux";
import { Router } from "react-router";
import { createMemoryHistory } from "history";

import { initStore, addToCart } from "../../src/client/store";
import { MockExampleApi } from "../mockApi";
import { CartApi } from "../../src/client/api";
import { Application } from "../../src/client/Application";

describe("корзина", () => {
  const history = createMemoryHistory({
    initialEntries: ["/cart"],
    initialIndex: 0,
  });

  const mockExampleApi = new MockExampleApi("/");
  const cartApi = new CartApi();

  let store = initStore(mockExampleApi, cartApi);

  let application = (
    <Router history={history}>
      <Provider store={store}>
        <Application />
      </Provider>
    </Router>
  );

  beforeEach(() => {
    cartApi.setState({});

    store = initStore(mockExampleApi, cartApi);

    application = (
      <Router history={history}>
        <Provider store={store}>
          <Application />
        </Provider>
      </Router>
    );
  });

  it("в шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней", async () => {
    const { getByRole } = render(application);

    await [...Array(3)].forEach(async () => {
      const product = (await mockExampleApi.getProductById(1)).data;
      store.dispatch(addToCart(product));
    });

    await [...Array(2)].forEach(async () => {
      const product = (await mockExampleApi.getProductById(2)).data;
      store.dispatch(addToCart(product));
    });

    const { productCount } = getByRole("link", {
      name: /cart/i,
    }).textContent.match(/Cart\s\((?<productCount>\d)\)/).groups;

    expect(productCount).toBe("2");
  });

  it("в корзине должна отображаться таблица с добавленными в нее товарами", async () => {
    const { getByRole } = render(application);

    const product = (await mockExampleApi.getProductById(1)).data;
    store.dispatch(addToCart(product));

    expect(getByRole("table")).toBeInTheDocument();
  });

  it("для каждого товара должны отображаться название, цена, количество , стоимость, а также должна отображаться общая сумма заказа", async () => {
    const { getAllByRole } = render(application);

    const getPriceWithCurrency = (price: number) => `$${price}`;

    const product = (await mockExampleApi.getProductById(1)).data;
    const productCount = 7;
    const productPrice = product.price;
    const productName = product.name;
    const productTotalPrice = 7 * product.price;

    [...Array(productCount)].forEach(() => {
      store.dispatch(addToCart(product));
    });

    const cellValues = Array.from(getAllByRole("cell")).map(
      ({ textContent }) => textContent
    );

    const checkValues = [
      productName,
      getPriceWithCurrency(productPrice),
      getPriceWithCurrency(productTotalPrice),
      String(productCount),
    ];

    checkValues.forEach((value) => {
      expect(cellValues).toContain(value);
    });
  });

  it("в корзине должна быть кнопка 'очистить корзину', по нажатию на которую все товары должны удаляться", async () => {
    const { getByRole, container } = render(application);

    const product = (await mockExampleApi.getProductById(2)).data;
    store.dispatch(addToCart(product));

    const clearButton = getByRole("button", { name: /clear shopping cart/i });

    event.click(clearButton);

    expect(within(container).queryByText(/cart is empty/i)).toBeInTheDocument();
  });

  it("если корзина пустая, должна отображаться ссылка на каталог товаров", () => {
    const { getByRole } = render(application);

    const catalogLink = getByRole("link", { name: /catalog/ });

    expect(catalogLink).toBeInTheDocument();
  });

  it("содержимое корзины должно сохраняться между перезагрузками страницы", async () => {
    const product = (await mockExampleApi.getProductById(1)).data;
    store.dispatch({
      type: "ADD_TO_CART",
      product,
    });
    const cart = store.getState().cart;

    history.push("/cart");

    const newCart = store.getState().cart;

    expect(newCart).toEqual(cart);
  });
});
