import test, { expect, Page } from "@playwright/test";
import PageContext from "./Context/context";
import NavigationBar from "./PageObjects/NavigationBar";
import DashboardPage from "./PageObjects/Dashboard-page";
import IssuesPage from "./PageObjects/Issues-page";
import { useSearchParams } from "next/navigation";

let page: Page
let pageContext: PageContext
const pageUrl = "http://localhost:3000/issues/list"
let navBar: NavigationBar
let dashboard: DashboardPage
let issuesPage: IssuesPage

test.beforeAll(async () => {
  pageContext = new PageContext()
  await pageContext.initialize()
  page = pageContext.page
})

test.beforeEach(async () => {
  navBar = new NavigationBar(page)
  dashboard = new DashboardPage(page)
  issuesPage = new IssuesPage(page)
  await page.goto(pageUrl)
  expect(page).toHaveURL(/issues\/list/)
  await page.waitForTimeout(4000)
})


test('Check issues table elements', async () => {

  //Check table columns names
  await issuesPage.assertIssuesTableHeaderElements("Issue")
  await page.waitForTimeout(500)
  await issuesPage.assertIssuesTableHeaderElements("Status")
  await page.waitForTimeout(500)
  await issuesPage.assertIssuesTableHeaderElements("Created")
  await page.waitForTimeout(500)
  await issuesPage.assertIssuesTableHeaderElements("Comments")
  await page.waitForTimeout(500)

  //Confirm that defualt table issues count is 10
  await issuesPage.assertDefaultTableRowsCount()

  //Click on table row and go on Issue id page
  await issuesPage.clickOnTableRow(1)
  await page.waitForTimeout(1000)
  const pageUrl = page.url()
  await expect(page).toHaveURL(pageUrl)
})

test("Test pagination of Issues table", async () => {

  //Assert that first 2 Arrow pagination buttons are disabled
  await issuesPage.assertArrowIsDisabled(0)
  await issuesPage.assertArrowIsDisabled(1)
  await page.waitForTimeout(1000)

  //Click on single right arrow button
  await issuesPage.clickOnPaginationButton(2)
  await page.waitForTimeout(1000)

  //Confirm that page range is correct when user swith pages
  await issuesPage.assertPagesRange()
  await page.waitForTimeout(500)

  //Click on Right double arrow button and confirm that both right arrow buttons are disabled
  await issuesPage.clickOnPaginationButton(3)
  await page.waitForTimeout(500)
  await issuesPage.assertArrowIsDisabled(2)
  await issuesPage.assertArrowIsDisabled(3)
  await page.waitForTimeout(500)


  //Confirm that page range is correct when user swith pages
  await issuesPage.assertPagesRange()
  await page.waitForTimeout(500)

  //Click on Left single arrow button
  await issuesPage.clickOnPaginationButton(1)
  await page.waitForTimeout(500)

  //Confirm that page range is correct when user swith pages
  await issuesPage.assertPagesRange()
  await page.waitForTimeout(500)

  //Click on Left double arrow button
  await issuesPage.clickOnPaginationButton(0)
  await page.waitForTimeout(500)

  //Confirm that page range is correct when user swith pages and 2 left arrow buttons are disabled again
  await issuesPage.assertPagesRange()
  await issuesPage.assertArrowIsDisabled(0)
  await issuesPage.assertArrowIsDisabled(1)
  await page.waitForTimeout(500)
})
