import { expect, Locator, Page } from "@playwright/test";

export default class DashboardPage {
  private page: Page
  private latestIssueHeader: Locator
  private issuesCard: Locator
  private tableRoot: Locator
  private tableRows: Locator

  constructor(_page: Page) {
    this.page = _page
    this.latestIssueHeader = this.page.locator('.rt-Heading.rt-r-size-4.rt-r-mb-5').filter({ hasText: "Latest issues" })
    this.issuesCard = this.page.locator('.rt-reset.rt-BaseCard.rt-Card').locator('.rt-Flex')
    this.tableRoot = this.page.locator('.rt-TableRootTable')
    this.tableRows = this.tableRoot.locator('tr.rt-TableRow')
  }

  public async assertDashboardCards(cardName: string, count: number): Promise<void> {
    const card = this.issuesCard.filter({ hasText: cardName })
    await expect(card).toBeVisible()
    await expect(card).toContainText(cardName)
    await expect(card).toContainText(count.toString())
  }

  public async assertLatestIssuesList(latestIssuesCount: number): Promise<void> {
    await expect(this.latestIssueHeader).toBeVisible()
    await expect(this.latestIssueHeader).toHaveText("Latest issues")
    await expect(this.tableRows).toHaveCount(latestIssuesCount)
  }

  public async clickOnOneOfTheLatestIssues(row: number): Promise<void> {
    const latestIssue = this.tableRows.getByRole('link').nth(row)
    await latestIssue.click()
  }

  public async assertIssuesGraphIsVisible(status: string): Promise<void> {
    const graph = this.page.locator('.recharts-wrapper')
    const yAxisMaxValue = graph.locator('.recharts-yAxis.yAxis').locator('text').last()
    const yMaxValue = (await yAxisMaxValue.textContent())
    const xAxis = graph.locator('.recharts-xAxis')

    await expect(graph).toBeVisible()
    await expect(yAxisMaxValue).toContainText(yMaxValue!)

    const statusOnXAxis = xAxis.locator('text').filter({ hasText: status })
    await expect(statusOnXAxis).toHaveText(status)
  }

  public async clickOnIssuesCountCard(cardName: string): Promise<void> {
    const card = this.issuesCard.locator('a').filter({ hasText: cardName })
    await card.click()
  }

  public async getLatestIssuesTableRowData(row: number): Promise<Locator[]> {
    const issueRow = this.tableRows.nth(row)
    const titleData = issueRow.locator('td.rt-TableCell').getByRole('link')
    const statusData = issueRow.locator('td.rt-TableCell').locator('span')
    return [titleData, statusData]
  }
}