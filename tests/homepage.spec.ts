import test, { expect, Page } from "@playwright/test";
import PageContext from "./context";
import NavigationBar from "./PageObjects/NavigationBar";
import DashboardPage from "./PageObjects/Dashboard-page";
import { prisma } from "@/prisma/client";

let page: Page
let pageContext: PageContext
const pageUrl = "http://localhost:3000/"
let navBar: NavigationBar
let dashboard: DashboardPage

test.beforeAll(async () => {
  pageContext = new PageContext()
  await pageContext.initialize()
  page = pageContext.page
})


test.beforeEach(async () => {
  navBar = new NavigationBar(page)
  dashboard = new DashboardPage(page)
  await page.goto(pageUrl)
  expect(page).toHaveURL("http://localhost:3000/")
  await page.waitForTimeout(4000)
})


test('Check nav bar', async () => {

  //Check nav bar links
  await navBar.getAndAssertNavLink("Dashboard")
  await navBar.getAndAssertNavLink("Issues")

  //Check that user account avatar(user is already authenticated) is visible
  await navBar.assertUserAccountAvatar()

  //Check that back arrow button is visible and disabled on Dashboard nav bar
  await navBar.assertButtonVisibleAndDisabled()
})

test("Check dashboard cards visibility and issue counts per status", async () => {

  //get issues counts by their statuses
  const open = await prisma.issue.count({ where: { status: 'OPEN' } })
  const inProgress = await prisma.issue.count({ where: { status: 'IN_PROGRESS' } })
  const closed = await prisma.issue.count({ where: { status: 'CLOSED' } })
  const comments = await prisma.issue.count({ where: { comment: { not: null } } })

  //Assert dashboard cards visibility and their counts
  await dashboard.assertDashboardCards("In-progress Issues", inProgress)
  await dashboard.assertDashboardCards("Open Issues", open)
  await dashboard.assertDashboardCards("Closed Issues", closed)
  await dashboard.assertDashboardCards("Commented Issues", comments)
  await page.waitForTimeout(1000)

  //Assert latest issues table count and latest issues visibility
  await dashboard.assertLatestIssuesList(5)
  await page.waitForTimeout(500)

  //Assert Issues graph
  await dashboard.assertIssuesGraphIsVisible(open, "Open")
  await dashboard.assertIssuesGraphIsVisible(open, "In Progress")
  await dashboard.assertIssuesGraphIsVisible(open, "Closed")
})