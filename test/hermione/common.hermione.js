const { assert } = require("chai");

it("на ширине меньше 576px навигационное меню должно скрываться за 'гамбургер'", async () => {
  await this.browser.url("/hw/store");
  await this.browser.setWindowSize(320, 568);
  const nav = await this.browser.$('.navbar-collapse');

  assert.isFalse(await nav.isDisplayed())
});

it("при выборе элемента из меню 'гамбургера', меню должно закрываться", async () => {
  await this.browser.url("/hw/store");
  await this.browser.setWindowSize(320, 568);
  const nav = await this.browser.$('.navbar-collapse');
  const toggle = await this.browser.$('.navbar-toggler');

  toggle.click();

  assert.isTrue(await nav.isDisplayed())
});