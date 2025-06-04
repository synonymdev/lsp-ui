import { Page, Locator } from '@playwright/test';

export class ReviewChannelPage {
  readonly page: Page;
  readonly reviewHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.reviewHeading = page.locator('.page-heading >> text=Review Channel');
  }

  async isLoaded() {
    return await this.reviewHeading.isVisible();
  }
}