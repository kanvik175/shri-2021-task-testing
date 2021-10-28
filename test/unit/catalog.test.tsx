import "@testing-library/jest-dom";
import { render, within, waitFor } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { Router } from "react-router";
import { createMemoryHistory } from "history";

import { initStore } from "../../src/client/store";
import { MockExampleApi } from "../mockApi";
import { CartApi } from "../../src/client/api";
import { Application } from "../../src/client/Application";

describe("каталог", () => {
  const history = createMemoryHistory({
    initialEntries: ["/catalog"],
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

  it("должны отображаться товары, список которых приходит с сервера", async () => {
    const { getByText, getByRole } = render(application);
    await waitFor(() => !getByText(/loading/i));

    store.getState().products.forEach(({ name }) => {
      expect(getByRole("heading", { level: 5, name })).toBeInTheDocument();
    });
  });

  it("для каждого товара отображается название, цена и ссылка на страницу с подробной информацией о товаре", async () => {
    const { getByText, getAllByTestId } = render(application);
    await waitFor(() => !getByText(/loading/i));

    store.getState().products.forEach(({ id, name, price }) => {
      const { getByRole, getByText } = within(getAllByTestId(id)[0]);

      expect(getByRole("heading", { level: 5 }).textContent).toBe(name);
      expect(getByRole("link").getAttribute("href")).toMatch(
        new RegExp(`catalog/${id}`, "i")
      );
      expect(getByText(`$${price}`)).toBeDefined();
    });
  });
});
