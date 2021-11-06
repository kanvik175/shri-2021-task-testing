const homePageUrl = '/hw/store';
const deliveryPageUrl = '/hw/store/delivery';
const contactsPageUrl = '/hw/store/contacts';

describe("страницы", async function() {
  it("главная страница должна иметь статическое содержимое", async function() {
    await this.browser.url(homePageUrl);
    await this.browser.assertView("home-page", ".Application", {
      allowViewportOverflow: true,
    });
  });

  it("страница доставки должна иметь статическое содержимое", async function() {
    await this.browser.url(deliveryPageUrl);
    await this.browser.assertView("delivery-page", ".Application", {
      allowViewportOverflow: true,
    });
  });

  it("страница контактов должна иметь статическое содержимое", async function() {
    await this.browser.url(contactsPageUrl);
    await this.browser.assertView("contacts-page", ".Application", {
      allowViewportOverflow: true,
    });
  });

  it("верстка главной страницы должна адаптироваться под ширину экрана", async function() {
    await this.browser.url(homePageUrl);
    await this.browser.setWindowSize(320, 568);
    await this.browser.assertView("mobile-contacts-page", ".Application", {
        allowViewportOverflow: true,
    });
  })

  it("верстка страницы доставки должна адаптироваться под ширину экрана", async function() {
    await this.browser.url(deliveryPageUrl);
    await this.browser.setWindowSize(320, 568);
    await this.browser.assertView("mobile-delivery-page", ".Application", {
        allowViewportOverflow: true,
    });
  })

  it("верстка страницы контактов должна адаптироваться под ширину экрана", async function() {
    await this.browser.url(contactsPageUrl);
    await this.browser.setWindowSize(320, 568);
    await this.browser.assertView("mobile-contacts-page", ".Application", {
        allowViewportOverflow: true,
    });
  })
})