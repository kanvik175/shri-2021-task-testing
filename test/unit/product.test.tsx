import "@testing-library/jest-dom";
import { render, within, waitFor } from "@testing-library/react";
import event from "@testing-library/user-event";
import React from "react";
import { Provider } from "react-redux";
import { Router } from "react-router";
import { createMemoryHistory } from "history";

import { initStore } from "../../src/client/store";
import { MockExampleApi } from "../mockApi";
import { CartApi } from "../../src/client/api";
import { Application } from "../../src/client/Application";

describe("каталог", () => {
  const productId = 1;
  const history = createMemoryHistory({
    initialEntries: [`/catalog/${productId}`],
    initialIndex: 0,
  });

  let mockExampleApi = new MockExampleApi("/");
  let cartApi = new CartApi();

  const reInitStore = () => initStore(mockExampleApi, cartApi);

  let store = reInitStore();

  let application = (
    <Router history={history}>
      <Provider store={store}>
        <Application />
      </Provider>
    </Router>
  );

  beforeEach(() => {
    cartApi.setState({});

    store = reInitStore();
    application = (
      <Router history={history}>
        <Provider store={store}>
          <Application />
        </Provider>
      </Router>
    );
  });

  it("на странице отображаются: название товара, его описание, цена, цвет, материал и кнопка 'добавить в корзину'", async () => {
    const { getByRole, getByText } = render(application);

    const { name, description, price } = (
      await mockExampleApi.getProductById(productId)
    ).data;

    expect(getByRole("heading", { level: 1, name })).toBeInTheDocument();
    expect(getByText(description)).toBeInTheDocument();
    expect(getByText(`$${price}`)).toBeInTheDocument();
    expect(getByRole("button", { name: /add to cart/i })).toBeInTheDocument();
  });

  it("если товар уже добавлен в корзину, в каталоге и на странице товара должно отображаться сообщение об этом", async () => {
    const { getByRole, getByText } = render(application);

    await waitFor(() => !getByText(/loading/i));

    event.click(getByRole("button", { name: /add to cart/i }));

    await waitFor(
      () => expect(getByText(/item in cart/i)).toBeInTheDocument(),
      { timeout: 1000 }
    );
  });

  it("если товар уже добавлен в корзину, повторное нажатие кнопки 'добавить в корзину' должно увеличивать его количество", async () => {
    const clickCount = 4;

    const { getByRole, getByText } = render(application);

    await waitFor(() => !getByText(/loading/i));

    [...Array(clickCount)].forEach(() => {
      event.click(getByRole("button", { name: /add to cart/i }));
    });

    await waitFor(
      () => {
        const { cart } = store.getState();

        expect(cart[productId].count).toBe(clickCount);
      },
      { timeout: 1000 }
    );
  });
});
