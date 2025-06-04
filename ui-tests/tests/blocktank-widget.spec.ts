import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home-page';
import { ReviewChannelPage } from './pages/review-page';

test('Widget loads', async ({ page }) => {
  const widgetPage = new HomePage(page);

  await widgetPage.goto();
  await widgetPage.isLoaded();
});


test('Create channel flow', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();

  expect(await homePage.isLoaded()).toBeTruthy();

  await homePage.fillChannelDetails('1000000', '500000', '52');
  await homePage.enablePrivateChannel();
  await homePage.submit();

  const reviewPage = new ReviewChannelPage(page);
  expect(await reviewPage.isLoaded());

});
