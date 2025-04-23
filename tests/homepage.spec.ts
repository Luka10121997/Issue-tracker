import test, { expect, Page } from "@playwright/test";
import PageContext from "../../issues-tracker-app/tests/Context/context"
import NavigationBar from "./PageObjects/NavigationBar";
import DashboardPage from "./PageObjects/Dashboard-page";
import { prisma } from "@/prisma/client";
import IssuesPage from "./PageObjects/Issues-page";
import IssueIdPage from "./PageObjects/IssueId-page";

let page: Page
let pageContext: PageContext
const pageUrl = "http://localhost:3000/"
let navBar: NavigationBar
let dashboard: DashboardPage
let issuesPage: IssuesPage
let issueIdPage: IssueIdPage

test.beforeAll(async () => {
  pageContext = new PageContext()
  await pageContext.initialize()
  page = pageContext.page
})

test.beforeEach(async () => {
  navBar = new NavigationBar(page)
  dashboard = new DashboardPage(page)
  issuesPage = new IssuesPage(page)
  issueIdPage = new IssueIdPage(page)
  await page.goto(pageUrl)
  expect(page).toHaveURL("http://localhost:3000/")
  await page.waitForTimeout(2000)
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
  await dashboard.assertIssuesGraphIsVisible("Open")
  await dashboard.assertIssuesGraphIsVisible("In Progress")
  await dashboard.assertIssuesGraphIsVisible("Closed")
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

test("Click on Issues counts per status and check is user correctly rendered and correct issues are displayed", async () => {

  //get issues counts by their statuses
  const openCount = await prisma.issue.count({ where: { status: 'OPEN' }, take: 10 })
  const inProgressCount = await prisma.issue.count({ where: { status: 'IN_PROGRESS' }, take: 10 })
  const closedCount = await prisma.issue.count({ where: { status: 'CLOSED' }, take: 10 })

  await page.waitForTimeout(1000)

  //Find Open Issues card and click on it
  await dashboard.clickOnIssuesCountCard("Open Issues")

  //Confirm that user is redirected on url which contains status=OPEN
  expect(page).toHaveURL(/status=OPEN/)

  //Check that visible Issues are only with status OPEN
  await issuesPage.assertFilteredIssuesBySelectedValue(openCount, "Open")
  await page.waitForTimeout(500)

  //Go back on Dashboard page and click on In Progress Issues card
  await navBar.clickOnBackButton()
  await page.waitForTimeout(1500)
  await dashboard.clickOnIssuesCountCard("In-progress Issues")

  //Confirm that user is redirected on url which contains status=IN_PROGRESS
  expect(page).toHaveURL(/status=IN_PROGRESS/)

  //Check that visible Issues are only with status IN_PROGRESS
  await issuesPage.assertFilteredIssuesBySelectedValue(inProgressCount, "In Progress")
  await page.waitForTimeout(500)

  //Go back on Dashboard page and click on Closed Issues card
  await navBar.clickOnBackButton()
  await page.waitForTimeout(1500)
  await dashboard.clickOnIssuesCountCard("Closed Issues")

  //Confirm that user is redirected on url which contains status=CLOSED
  expect(page).toHaveURL(/status=CLOSED/)

  //Check that visible Issues are only with status CLOSED
  await issuesPage.assertFilteredIssuesBySelectedValue(closedCount, "Closed")
  await page.waitForTimeout(500)
})

test("Click on one of the latest issues and confirm that user is rendered on Issue page, and do the same for the last issue from the latest issues table", async () => {

  //Assert latest issues table count and latest issues visibility
  await dashboard.assertLatestIssuesList(5)
  await page.waitForTimeout(500)

  //Get table data of the issue which will be clicked
  const tableData = await dashboard.getLatestIssuesTableRowData(1)
  const issueTitle = (await tableData[0].innerText()).toString()
  const issueStatus = (await tableData[1].innerText()).toString()

  //Click on the second latest issue and confirm that user is redirected on Issue page
  await dashboard.clickOnOneOfTheLatestIssues(1)
  await page.waitForTimeout(1000)

  //Get from url id of the issue which is clicked
  const currenturl = page.url()
  const issueId = currenturl.split("/").pop()
  expect(page).toHaveURL(new RegExp(`issues/${issueId}`))
  await page.waitForTimeout(1000)

  //Assert Issue title and description after it's open
  await issueIdPage.assertIssueTitle(issueTitle)
  await issueIdPage.assertIssueStatus(issueStatus)
  await page.waitForTimeout(500)

  //Go back on dashboard page and then click on the last Issue from the latest issues table
  await navBar.clickOnBackButton()
  const tableData2 = await dashboard.getLatestIssuesTableRowData(4)
  const issueTitle2 = (await tableData2[0].innerText()).toString()
  const issueStatus2 = (await tableData2[1].innerText()).toString()
  await dashboard.clickOnOneOfTheLatestIssues(4)
  await page.waitForTimeout(1000)

  //Get from url id of the last issue which is clicked
  const currenturl2 = page.url()
  const issueId2 = currenturl2.split("/").pop()
  expect(page).toHaveURL(new RegExp(`issues/${issueId2}`))
  await page.waitForTimeout(1000)

  //Assert Issue title and description after it's open
  await issueIdPage.assertIssueTitle(issueTitle2)
  await issueIdPage.assertIssueStatus(issueStatus2)
  await page.waitForTimeout(500)
}
)