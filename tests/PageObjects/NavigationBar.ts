import { expect, Locator, Page } from "@playwright/test";

export default class NavigationBar {
  private page: Page
  private wrapper: Locator
  private accountAvatar: Locator
  private navButton: Locator

  constructor(_page: Page) {
    this.page = _page
    this.wrapper = this.page.locator('.border-b.mb-5.border-spacing-10.px-5.py-3')
    this.accountAvatar = this.wrapper.locator('.rt-Box')
    this.navButton = this.wrapper.getByRole("button")
  }

  public async getAndAssertNavLink(linkName: string): Promise<void> {
    const link = this.wrapper.locator('.nav-link', { hasText: linkName })
    await expect(link).toBeVisible()
    await expect(link).toHaveText(linkName)
  }

  public async assertUserAccountAvatar(): Promise<void> {
    await expect(this.accountAvatar).toBeVisible()
  }

  public async assertButtonVisibleAndDisabled(): Promise<void> {
    await expect(this.navButton).toBeVisible()
    await expect(this.navButton).toBeDisabled()
  }

  public async clickOnBackButton() {
    await expect(this.navButton).toBeEnabled()
    await this.navButton.click()
  }

  public async clickOnLink(linkName: string): Promise<void> {
    const link = this.wrapper.locator('.nav-link', { hasText: linkName })
    await link.click()
  }
}