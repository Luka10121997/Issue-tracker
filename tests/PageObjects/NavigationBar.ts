import { expect, Locator, Page } from "@playwright/test";

export default class NavigationBar {
  private page: Page
  private wrapper: Locator
  private accountAvatar: Locator

  constructor(_page: Page) {
    this.page = _page
    this.wrapper = this.page.locator('.border-b.mb-5.border-spacing-10.px-5.py-3')
    this.accountAvatar = this.wrapper.locator('.rt-Box')
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
    const button = this.wrapper.getByRole("button")
    await expect(button).toBeVisible()
    await expect(button).toBeDisabled()
  }
}