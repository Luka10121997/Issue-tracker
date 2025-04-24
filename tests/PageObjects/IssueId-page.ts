import { expect, Locator, Page } from "@playwright/test";

export default class IssueIdPage {
  private page: Page
  private wrapper: Locator
  private title: Locator
  private statusAndDateWrapper: Locator
  private deleteDropdown: Locator
  private commentBox: Locator
  private fieldValidationMessage: Locator

  constructor(_page: Page) {
    this.page = _page
    this.wrapper = this.page.locator('.rt-ContainerInner')
    this.title = this.wrapper.locator('.rt-Heading.rt-r-size-6')
    this.statusAndDateWrapper = this.wrapper.locator('.rt-Flex.rt-r-ai-center.rt-r-gap-2')
    this.deleteDropdown = this.page.getByRole('alertdialog')
    this.commentBox = this.wrapper.locator('.rt-TextAreaRoot')
    this.fieldValidationMessage = this.wrapper.locator('p')
  }

  public async assertIssueTitle(title: string): Promise<void> {
    await expect(this.title).toBeVisible()
    await expect(this.title).toHaveText(title)
  }

  public async assertIssueStatus(status: string): Promise<void> {
    const statusText = this.statusAndDateWrapper.locator('span').filter({ hasText: status }).first()
    await expect(statusText).toBeVisible()
    await expect(statusText).toHaveText(status)
  }
  public async assertDate(date: string): Promise<void> {
    const dateText = this.statusAndDateWrapper.locator('span').filter({ hasText: date })
    await expect(dateText).toBeVisible()
    await expect(dateText).toHaveText(date)
  }

  public async assertIssueDescription(description: string): Promise<void> {
    const descriptionTextBox = this.wrapper.locator('p').filter({ hasText: description })
    await expect(descriptionTextBox).toBeVisible()
    await expect(descriptionTextBox).toHaveText(description)
  }

  public async assertAndClickOnButton(buttonName: string): Promise<void> {
    const button = this.wrapper.getByRole('button', { name: buttonName })
    await expect(button).toBeVisible()
    await expect(button).toHaveText(buttonName)
    await button.click()
  }

  public async clickOnStatusDropdown(status: string): Promise<void> {
    const statusDropdown = this.wrapper.locator('button > span').filter({ hasText: status })
    await expect(statusDropdown).toBeVisible()
    await statusDropdown.click()
  }

  public async selectStatus(option: number): Promise<string> {
    const uncheckedOption = this.page.locator('[data-state="unchecked"]').nth(option)
    const selectedStatus = (await uncheckedOption.innerText()).toString()
    const statusDropdown = this.wrapper.locator('button > span').filter({ hasText: selectedStatus })
    await uncheckedOption.click()
    return statusDropdown.innerText()
  }
  /**
   * Method to assert the delete confirmation dropdown and click on the specified button of the dropdown
   * @param buttonName - name of the button to be clicked in the delete confirmation dropdown
   */
  public async assertDeleteConfirmationDropdownAndClickOnButtons(buttonName: string): Promise<void> {
    await expect(this.deleteDropdown).toBeVisible()
    const dropdownTitle = (await this.deleteDropdown.getByRole('heading', { name: 'Confirm Deletion' }).innerText())
    expect(dropdownTitle).toContain('Confirm Deletion')
    const dropdownDescription = await this.deleteDropdown.locator('p').innerText()
    expect(dropdownDescription).toContain('Are you sure, you want to delete this issue')
    const button = this.deleteDropdown.getByRole('button', { name: buttonName })
    await expect(button).toHaveText(buttonName)
    await button.click()
  }

  public async addComment(comment: string): Promise<string> {
    await expect(this.commentBox).toBeVisible()
    await this.commentBox.click()
    await this.commentBox.type(comment)
    const button = this.wrapper.getByRole('button', { name: 'Add comment' })
    await expect(button).toBeVisible()
    await button.click()
    return comment

  }

  public async assertAddedComment(comment: string): Promise<void> {
    const commentCard = this.wrapper.locator('div.rt-BaseCard.rt-Card').filter({ hasText: comment })
    await expect(commentCard).toBeVisible()
    await expect(commentCard).toHaveText(comment)
  }

  public async assertCommentValidationMessage(message: string): Promise<void> {
    const validation = this.fieldValidationMessage.filter({ hasText: message })
    await expect(validation).toContainText(message)
    await expect(validation).toHaveCSS('color', 'rgba(196, 0, 6, 0.827)')
  }

  public async assertSuccessToast(toastMess: string): Promise<void> {
    const toast = this.page.getByRole('status').filter({ hasText: toastMess }).nth(1)
    const greenConfirmationIcon = this.page.locator('.go2344853693').nth(1)
    await expect(toast).toBeVisible()
    await expect(toast).toHaveText(toastMess)
    await expect(greenConfirmationIcon).toBeVisible()
    await expect(greenConfirmationIcon).toHaveCSS('background-color', 'rgb(97, 211, 69)')
  }
}