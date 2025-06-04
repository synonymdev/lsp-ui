import { Page, Locator } from '@playwright/test';

export class HomePage {
  
    heading: Locator;
    receivingInput: Locator;
    spendingInput: Locator;
    expiryInput: Locator;
    privateChannelCheckbox: Locator;
    createChannelButton: Locator;

    constructor(private page: Page) {
        this.heading = page.locator('.page-heading >> text=My channel');
        this.receivingInput = this.page.locator('#remote-balance');
        this.spendingInput = this.page.locator('#local-balance');
        this.expiryInput = this.page.locator('#channel-expiry');
        this.privateChannelCheckbox = this.page.locator('.custom-checkbox');
        this.createChannelButton = this.page.getByRole('button', { name: 'Create my channel' });
    }
  
    async goto() {
      await this.page.goto('https://widget.synonym.to/?embed=true');
    }

    async isLoaded() {
        return await this.heading.isVisible();
      }
  
    async fillChannelDetails(receiving: string, spending: string, weeks: string) {
      await this.receivingInput.fill(receiving);
      await this.spendingInput.fill(spending);
      await this.expiryInput.fill(weeks);
    }
  
    async enablePrivateChannel() {
      await this.privateChannelCheckbox.click();
    }
  
    async submit() {
      await this.createChannelButton.click();
    }
  }
  