import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { Router } from "react-router";
import { createMemoryHistory } from "history";

import { initStore } from "../../src/client/store";
import { MockExampleApi } from "../mockApi";
import { CartApi } from "../../src/client/api";
import { Application } from "../../src/client/Application";

describe("страницы", () => {
  const history = createMemoryHistory({
    initialEntries: ["/"],
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
    history.push("/");
  });

  it("в магазине должны быть страницы: главная, каталог, условия доставки, контакты", () => {
    const { getByRole, getByText } = render(application);

    const pages = [
      {
        link: "catalog",
        header: /catalog/i,
      },
      {
        link: "delivery",
        header: /delivery/i,
      },
      {
        link: "contacts",
        header: /contacts/i,
      },
      {
        link: "cart",
        header: /shopping cart/i,
      },
    ];

    expect(getByText(/welcome to example store!/i)).toBeInTheDocument();

    pages.forEach(({ link, header }) => {
      history.push(link);
      expect(getByRole("heading", { name: new RegExp(header, "i") }));
    });
  });
});
