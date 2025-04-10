import { expect, Locator, Page } from "@playwright/test";

export default class IssuesPage {
  private page: Page
  private wrapper: Locator
  private tableRoot: Locator
  private tableBody: Locator
  private tableRows: Locator
  private paginationWrapper: Locator
  private selectDropdownsWrapper: Locator

  constructor(_page: Page) {
    this.page = _page
    this.wrapper = this.page.locator('main.p-4')
    this.tableRoot = this.wrapper.locator('.rt-TableRoot.rt-r-size-2.rt-variant-surface')
    this.tableBody = this.tableRoot.locator('tbody.rt-TableBody')
    this.tableRows = this.tableBody.locator('tr.rt-TableRow')
    this.paginationWrapper = this.page.locator('.rt-Flex.rt-r-ai-center.rt-r-gap-2')
    this.selectDropdownsWrapper = this.wrapper.locator('.rt-Box.space-x-2')
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

  public async assertFilteredIssuesByStatus(issuesCount: number, status: string) {
    for (let i = 0; i < issuesCount; i++) {
      const issuesRowsFilteredByStatus = this.tableRows.nth(i).locator('td > span').filter({ hasText: status })
      await expect(issuesRowsFilteredByStatus).toHaveText(status)
    }
  }
}