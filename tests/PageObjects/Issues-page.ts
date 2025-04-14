import { expect, Locator, Page } from "@playwright/test";

export default class IssuesPage {
  private page: Page
  private wrapper: Locator
  private tableRoot: Locator
  private tableBody: Locator
  private tableRows: Locator
  private paginationWrapper: Locator
  private selectDropdownsWrapper: Locator
  private pageSizeContentMenuWrapper: Locator
  private selectedOptionCheckMark: Locator

  constructor(_page: Page) {
    this.page = _page
    this.wrapper = this.page.locator('main.p-4')
    this.tableRoot = this.wrapper.locator('.rt-TableRoot.rt-r-size-2.rt-variant-surface')
    this.tableBody = this.tableRoot.locator('tbody.rt-TableBody')
    this.tableRows = this.tableBody.locator('tr.rt-TableRow')
    this.paginationWrapper = this.page.locator('.rt-Flex.rt-r-ai-center.rt-r-gap-2')
    this.selectDropdownsWrapper = this.wrapper.locator('.rt-Box.space-x-2')
    this.pageSizeContentMenuWrapper = this.page.locator('.rt-SelectGroup')
    this.selectedOptionCheckMark = this.page.locator('span.rt-SelectItemIndicator')
  }

  public async assertIssuesTableHeaderElements(headerName: string) {
    const tableColumn = this.tableRoot.locator('.rt-TableHeader').filter({ hasText: headerName })
    await expect(tableColumn).toBeVisible()
    await expect(tableColumn).toContainText(headerName)
  }

  public async assertDefaultTableRowsCount() {
    await expect(this.tableRows).toHaveCount(10)
  }

  public async clickOnTableRow(row: number) {
    await this.tableRows.nth(row).locator('td.rt-TableCell.myClass > a').click()
  }

  public async clickOnPaginationButton(arrowNumber: number) {
    const arrow = this.paginationWrapper.locator('.rt-reset.rt-BaseButton').nth(arrowNumber)
    await arrow.click()
  }

  public async assertArrowIsDisabled(arrowNumber: number) {
    const arrow = this.paginationWrapper.locator('button').nth(arrowNumber)
    await expect(arrow).toBeDisabled()
  }

  public async assertPagesRange() {
    const pagesRange = (await this.paginationWrapper.locator('p').filter({ hasText: "Page" }).allTextContents()).toString()
    const currentPageSize = pagesRange.substring(4, 7)
    const lastPage = pagesRange.substring(10, 11)
    expect(pagesRange).toContain(`Page${currentPageSize}of ${lastPage}`)
  }

  public async clickOnDropdown(placeholderText: string) {
    await this.selectDropdownsWrapper.locator('button > span', { hasText: placeholderText }).click()
  }

  public async selectDropdownOption(status: string) {
    const option = this.page.getByRole('option').filter({ hasText: status })
    await option.click()
  }

  public async assertFilteredIssuesBySelectedValue(issuesCount: number, status?: string) {
    if (status != undefined) {
      for (let i = 0; i < issuesCount; i++) {
        const issuesRowsFilteredBySelectedValue = this.tableRows.nth(i).locator('td > span').filter({ hasText: status })
        await expect(issuesRowsFilteredBySelectedValue).toHaveText(status)
        await expect(this.tableRows).toHaveCount(issuesCount)
      }
    }
    await expect(this.tableRows).toHaveCount(issuesCount)
  }

  public async confirmDropdownSelectedValue(selectedValue: string) {
    const dropdownSelectedValue = this.selectDropdownsWrapper.locator('button > span', { hasText: selectedValue })
    await expect(dropdownSelectedValue).toHaveText(selectedValue)
  }

  public async getPageSizeDropdowmn(placeholderText: string): Promise<Locator> {
    return this.paginationWrapper.locator('button > span', { hasText: placeholderText })
  }

  public async clickPageSizeDropdown(placeholderText: string) {
    const dropdown = this.getPageSizeDropdowmn(placeholderText)
    await (await dropdown).click()
  }

  public async selectPageSizeOption(option: string) {
    const suggestions = this.pageSizeContentMenuWrapper.locator('.rt-SelectLabel')
    await expect(suggestions).toHaveText("Suggestions")
    const dropdownContent = this.pageSizeContentMenuWrapper.getByRole('option', { name: option, exact: true }).filter({ hasText: option })
    await dropdownContent.click()
    expect(await this.getPageSizeDropdowmn(option)).toHaveText(option)
  }

  public async assertCheckMarkIsVisible() {
    await expect(this.selectedOptionCheckMark).toBeVisible()
    await expect(this.selectedOptionCheckMark).toHaveCSS('border-bottom-color', 'rgb(229, 231, 235)')
  }

  public async clickOnCreateNewIssueButton(buttonName: string) {
    const button = this.wrapper.getByRole('button').filter({ hasText: buttonName })
    await expect(button).toBeVisible()
    await expect(button).toHaveText(buttonName)
    await button.click()
  }

  public async assertLastCreatedIssueOnIssuesPage(title: string) {
    const titleData = this.tableRows.last().locator('td.rt-TableCell.myClass > a').filter({ hasText: title })
    const statusData = this.tableRows.last().locator('td.rt-TableCell > span').filter({ hasText: "Open" })
    await expect(titleData).toHaveText(title)
    await expect(statusData).toHaveText('Open')
  }
}


