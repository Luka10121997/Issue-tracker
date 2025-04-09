import test, { expect, Page } from "@playwright/test";
import PageContext from "../../issues-tracker-app/tests/Context/context"
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

test("Check is rendering with nav links works", async () => {

  //Click on "Issues" nav link and check is current url correct
  await navBar.clickOnLink("Issues")
  await expect(page).toHaveURL(/issues\/list/)
  await page.waitForTimeout(500)

  //Go back on Home page by click on "Dashboard" link and check is current url correct
  await navBar.clickOnLink("Dashboard")
  await expect(page).toHaveURL("http://localhost:3000/")
  await page.waitForTimeout(500)

  //Click again on Issues link and then go back on Dashboard page by click on the left arrow button
  await navBar.clickOnLink("Issues")
  await navBar.clickOnBackButton()

  //Confirm that "http://localhost:3000/" is url when user goes back with arrow left back button
  await expect(page).toHaveURL("http://localhost:3000/")
})