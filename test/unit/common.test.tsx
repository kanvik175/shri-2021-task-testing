import "@testing-library/jest-dom";
import { render, within } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { Router } from "react-router";
import { createMemoryHistory } from "history";

import { initStore } from "../../src/client/store";
import { MockExampleApi } from "../mockApi";
import { CartApi } from "../../src/client/api";
import { Application } from "../../src/client/Application";

describe("общие требования", () => {
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

  it("в шапке отображаются ссылки на страницы магазина, а также ссылка на корзину", () => {
    const { getByRole } = render(application);

    const checkLinks = ["/", "/catalog", "/delivery", "/contacts", "/cart"];

    const navLinks = within(getByRole("navigation"))
      .getAllByRole("link")
      .map((element) => element.getAttribute("href"));

    expect(navLinks).toEqual(checkLinks);
  });

  it("название магазина в шапке должно быть ссылкой на главную страницу", () => {
    const { getByRole } = render(application);

    const shopNameLink = getByRole("link", {
      name: /example store/i,
    }).getAttribute("href");

    expect(shopNameLink).toBe("/");
  });
});
