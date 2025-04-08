import { expect, Locator, Page } from "@playwright/test";

export default class DashboardPage {
  private page: Page
  private latestIssueHeader: Locator

  constructor(_page: Page) {
    this.page = _page
    this.latestIssueHeader = this.page.locator('.rt-Heading.rt-r-size-4.rt-r-mb-5').filter({ hasText: "Latest issues" })
  }

  public async assertDashboardCards(cardName: string, count: number): Promise<void> {
    const card = this.page.locator('.rt-reset.rt-BaseCard.rt-Card').locator('.rt-Flex').filter({ hasText: cardName })
    await expect(card).toBeVisible()
    await expect(card).toContainText(cardName)
    await expect(card).toContainText(count.toString())
  }

  public async assertLatestIssuesList(latestIssuesCount: number): Promise<void> {
    const issuesTable = this.page.locator('.rt-TableRootTable').locator('.rt-TableRow')
    await expect(this.latestIssueHeader).toBeVisible()
    await expect(this.latestIssueHeader).toHaveText("Latest issues")
    await expect(issuesTable).toHaveCount(latestIssuesCount)
  }

  public async assertIssuesGraphIsVisible(issueCount: number, status: string): Promise<void> {
    const graph = this.page.locator('.recharts-wrapper')
    const yMaxValue = issueCount + 1
    const yAxisMaxValue = graph.locator('.recharts-yAxis.yAxis').locator('text').filter({ hasText: yMaxValue.toString() })
    const xAxis = graph.locator('.recharts-xAxis')

    await expect(graph).toBeVisible()
    await expect(yAxisMaxValue).toHaveText(yMaxValue.toString())

    const statusOnXAxis = xAxis.locator('text').filter({ hasText: status })
    await expect(statusOnXAxis).toHaveText(status)

  }
}