import { expect, Locator, Page } from "@playwright/test";
import { toast } from "react-toastify";

export default class CreateNewIssuePage {

  private page: Page
  private wrapper: Locator
  private titleField: Locator
  private descriptionFieldWrapper: Locator
  private descriptionField: Locator
  private fieldValidationMessage: Locator

  constructor(_page: Page) {
    this.page = _page
    this.wrapper = this.page.locator('.max-w-xl')
    this.titleField = this.wrapper.locator('[name = "title"]')
    this.descriptionFieldWrapper = this.wrapper.locator('.EasyMDEContainer')
    this.descriptionField = this.descriptionFieldWrapper.locator('.CodeMirror.cm-s-easymde.CodeMirror-wrap')
    this.fieldValidationMessage = this.wrapper.locator('p')
  }

  public async assertAndFillTitleField(inputValue: string) {
    await this.clickOnField(this.titleField)
    if ((await this.titleField.inputValue()).length == 0)
      await expect(this.titleField).toBeEmpty()

    await expect(this.titleField).toBeVisible()
    await this.titleField.type(inputValue)
  }

  public async assertAndFillDescriptionField(inputValue: string) {
    await this.clickOnField(this.descriptionField)
    await expect(this.descriptionField).toBeVisible()
    if ((await this.descriptionField.innerText()).length == 0)
      await expect(this.descriptionField).toHaveClass(/empty/)
    await this.descriptionField.click()
    await this.descriptionField.type(inputValue)
  }

  public async assertAndClickOnSubmitButton(buttonName: string) {
    const submitButton = this.wrapper.getByRole('button', { name: buttonName })
    await expect(submitButton).toHaveText(buttonName)
    await expect(submitButton).toBeEnabled()
    await submitButton.click()
  }

  public async assertSuccessToast(toastMess: string) {
    const toast = this.page.getByRole('status').filter({ hasText: toastMess }).nth(1)
    const greenConfirmationIcon = this.page.locator('.go2344853693').nth(1)
    await expect(toast).toBeVisible()
    await expect(toast).toHaveText(toastMess)
    await expect(greenConfirmationIcon).toBeVisible()
    await expect(greenConfirmationIcon).toHaveCSS('background-color', 'rgb(97, 211, 69)')
  }

  public async assertFieldValidationMessage(message: string) {
    const validation = this.fieldValidationMessage.filter({ hasText: message })
    await expect(validation).toContainText(message)
    await expect(validation).toHaveCSS('color', 'rgba(196, 0, 6, 0.827)')
  }

  public async assertValidationNotVisible(message: string) {
    const validation = this.fieldValidationMessage.filter({ hasText: message })
    await expect(validation).not.toBeVisible()
  }

  public async clickOnField(field: Locator) {
    await field.click()
  }

  public async clearTitleField() {
    await this.clickOnField(this.titleField)
    await this.titleField.clear()
  }
}
