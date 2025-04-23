import test, { expect, Page } from "@playwright/test";
import PageContext from "./Context/context";
import IssuesPage from "./PageObjects/Issues-page";
import { prisma } from "@/prisma/client";
import { PageSize } from "./enums/enums";


let page: Page
let pageContext: PageContext
const pageUrl = "http://localhost:3000/issues/list"
let issuesPage: IssuesPage

test.beforeAll(async () => {
  pageContext = new PageContext()
  await pageContext.initialize()
  page = pageContext.page
})

test.beforeEach(async () => {
  issuesPage = new IssuesPage(page)
  await page.goto(pageUrl)
  expect(page).toHaveURL(/issues\/list/)
  await page.waitForTimeout(2000)
})


test('Check issues table elements', async () => {

  //Check table columns names
  await issuesPage.assertIssuesTableHeaderElements(["Issue", "Status", "Created", "Comments"])
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

test("Test status dropdown with all 3 possible status values", async () => {

  //get issues counts by their statuses
  const open_count = await prisma.issue.count({ where: { status: 'OPEN' }, take: 10 })
  const inProgress_count = await prisma.issue.count({ where: { status: 'IN_PROGRESS' }, take: 10 })
  const closed_count = await prisma.issue.count({ where: { status: 'CLOSED' }, take: 10 })

  //Click on Status dropdown
  await issuesPage.clickOnDropdown('Filter by status...')
  await page.waitForTimeout(500)

  //Select "open" status
  await issuesPage.selectDropdownOption('Open')
  await page.waitForTimeout(500)

  //Assert that rows have selected "Open" status
  await issuesPage.assertFilteredIssuesBySelectedValue(open_count, 'Open')

  //Get current url and confirm that correct status is placed in url
  await expect(page).toHaveURL(new RegExp(`issues/list\\?status=OPEN`))
  await page.waitForTimeout(1000)

  //Select "Closed" status
  await issuesPage.clickOnDropdown('Open')
  await page.waitForTimeout(500)
  await issuesPage.selectDropdownOption('Closed')
  await page.waitForTimeout(500)

  //Assert that rows have selected "Closed" status
  await issuesPage.assertFilteredIssuesBySelectedValue(closed_count, 'Closed')

  //Get current url and confirm that correct status is placed in url
  await expect(page).toHaveURL(new RegExp(`issues/list\\?status=CLOSED`))
  await page.waitForTimeout(1000)

  //Select "In Progress" status
  await issuesPage.clickOnDropdown('Closed')
  await page.waitForTimeout(500)
  await issuesPage.selectDropdownOption('In Progress')
  await page.waitForTimeout(500)

  //Assert that rows have selected "Closed" status
  await issuesPage.assertFilteredIssuesBySelectedValue(inProgress_count, 'In Progress')

  //Get current url and confirm that correct status is placed in url
  await expect(page).toHaveURL(new RegExp(`issues/list\\?status=IN_PROGRESS`))
  await page.waitForTimeout(1000)

  //Select "All" from dropdown list
  await issuesPage.clickOnDropdown('In Progress')
  await page.waitForTimeout(500)
  await issuesPage.selectDropdownOption('All')

  //Get current url and confirm that correct status is placed in url
  await expect(page).toHaveURL(new RegExp(`issues/list\\?status=_all`))
  await page.waitForTimeout(1000)
})

test("Test assignee users dropdown with user and without any assigned user", async () => {

  //Get users from db
  const users = await prisma.user.findMany({ orderBy: { name: 'asc' } })
  const username = users[0].name
  const userId = users[0].id

  const issuesCount = await prisma.issue.count({ where: { assignedToUserId: users[0].id }, take: 10 })

  //Click on Assignee user dropdown
  await issuesPage.clickOnDropdown('Filter by assigned user...')
  await page.waitForTimeout(1000)

  //Select user
  await issuesPage.selectDropdownOption(username!)
  await issuesPage.confirmDropdownSelectedValue(username!)

  //Get current url and confirm that user is placed in url
  await expect(page).toHaveURL(new RegExp(`issues/list\\?user=${userId}`))
  await page.waitForTimeout(1000)

  //Confirm that there is correct number of displayed filtered issues
  await issuesPage.assertFilteredIssuesBySelectedValue(issuesCount)


  //Select unassigned value
  await issuesPage.clickOnDropdown(username!)
  await issuesPage.selectDropdownOption("Unassigned")
  await issuesPage.confirmDropdownSelectedValue("Unassigned")

  //Get current url and confirm that user "unassigned" is placed in url
  await expect(page).toHaveURL(new RegExp(`issues/list\\?user=unassigned`))
  await page.waitForTimeout(1000)
})

test("Test combination of assigned user and assigned issue status", async () => {

  //Get users from db
  const users = await prisma.user.findMany({ orderBy: { name: 'asc' } })
  const username = users[0].name
  const userId = users[0].id

  //Get issuesCount for different cases
  const issuesCountClosedWithUser = await prisma.issue.count({ where: { assignedToUserId: users[0].id, status: 'CLOSED' }, take: 10 })
  const issuesCountInProgressWithUser = await prisma.issue.count({ where: { assignedToUserId: users[0].id, status: 'IN_PROGRESS' }, take: 10 })
  const issuesCountInProgressWithoutUser = await prisma.issue.count({ where: { status: 'IN_PROGRESS' }, take: 10 })
  const issuesCountClosedWithoutUser = await prisma.issue.count({ where: { status: 'CLOSED' }, take: 10 })
  const issuesCountAllWithoutUser = await prisma.issue.count({ take: 10 })
  const issuesCountAllWithUser = await prisma.issue.count({ where: { assignedToUserId: users[0].id }, take: 10 })

  //Click on Assignee user dropdown
  await issuesPage.clickOnDropdown('Filter by assigned user...')
  await page.waitForTimeout(1000)

  //Select user
  await issuesPage.selectDropdownOption(username!)
  await issuesPage.confirmDropdownSelectedValue(username!)
  await issuesPage.confirmDropdownSelectedValue(username!)
  await page.waitForTimeout(500)

  //Get current url and confirm that user is placed in url
  await expect(page).toHaveURL(new RegExp(`issues/list\\?user=${userId}`))
  await page.waitForTimeout(1000)

  //Click on Status dropdown and select "Closed" status
  await issuesPage.clickOnDropdown('Filter by status...')
  await issuesPage.selectDropdownOption('Closed')
  await issuesPage.confirmDropdownSelectedValue('Closed')
  await issuesPage.confirmDropdownSelectedValue(username!)
  await issuesPage.assertFilteredIssuesBySelectedValue(issuesCountClosedWithUser, 'Closed')

  //Get current url and confirm that correct status and user are placed in url
  await expect(page).toHaveURL(new RegExp(`issues/list\\?status=CLOSED&user=${userId}`))
  await page.waitForTimeout(1000)

  //Click on Status dropdown and select "In Progress" status
  await issuesPage.clickOnDropdown('Closed')
  await issuesPage.assertCheckMarkIsVisible()
  await issuesPage.selectDropdownOption("In Progress")
  await issuesPage.confirmDropdownSelectedValue('In Progress')
  await issuesPage.confirmDropdownSelectedValue(username!)
  await issuesPage.assertFilteredIssuesBySelectedValue(issuesCountInProgressWithUser, 'In Progress')

  //Get current url and confirm that correct status and user are placed in url
  await expect(page).toHaveURL(new RegExp(`issues/list\\?status=IN_PROGRESS&user=${userId}`))
  await page.waitForTimeout(1000)

  //Click on Users dropdown and select "Unassigned"
  await issuesPage.clickOnDropdown(username!)
  await issuesPage.assertCheckMarkIsVisible()
  await issuesPage.selectDropdownOption("Unassigned")
  await issuesPage.confirmDropdownSelectedValue('Unassigned')
  await issuesPage.confirmDropdownSelectedValue('In Progress')
  await issuesPage.assertFilteredIssuesBySelectedValue(issuesCountInProgressWithoutUser, 'In Progress')

  //Get current url and confirm that "unassigned" user value and correct status are placed in url
  await expect(page).toHaveURL(new RegExp(`issues/list\\?user=unassigned&status=IN_PROGRESS`))
  await page.waitForTimeout(1000)

  //Click on Status dropdown and select "Closed"
  await issuesPage.clickOnDropdown("In Progress")
  await issuesPage.assertCheckMarkIsVisible()
  await issuesPage.selectDropdownOption('Closed')
  await issuesPage.confirmDropdownSelectedValue("Closed")
  await issuesPage.confirmDropdownSelectedValue('Unassigned')
  await issuesPage.assertFilteredIssuesBySelectedValue(issuesCountClosedWithoutUser, "Closed")

  //Get current url and confirm that correct status and "unassigned" user value are placed in url
  await expect(page).toHaveURL(new RegExp(`issues/list\\?status=CLOSED&user=unassigned`))
  await page.waitForTimeout(1000)

  //Click on Status dropdown and select "All" statuses
  await issuesPage.clickOnDropdown("Closed")
  await issuesPage.assertCheckMarkIsVisible()
  await issuesPage.selectDropdownOption('All')
  await issuesPage.confirmDropdownSelectedValue("All")
  await issuesPage.confirmDropdownSelectedValue('Unassigned')
  await issuesPage.assertFilteredIssuesBySelectedValue(issuesCountAllWithoutUser)

  //Get current url and confirm that correct status and "unassigned" user value are placed in url
  await expect(page).toHaveURL(new RegExp(`issues/list\\?status=_all&user=unassigned`))
  await page.waitForTimeout(1000)

  //Click on User dropdown and select user
  await issuesPage.clickOnDropdown("Unassigned")
  await issuesPage.assertCheckMarkIsVisible()
  await issuesPage.selectDropdownOption(username!)
  await issuesPage.confirmDropdownSelectedValue(username!)
  await issuesPage.confirmDropdownSelectedValue('All')
  await issuesPage.assertFilteredIssuesBySelectedValue(issuesCountAllWithUser)

  //Get current url and confirm that user and "_all" status are placed in url
  await expect(page).toHaveURL(new RegExp(`issues/list\\?user=${userId}&status=_all`))
  await page.waitForTimeout(1000)
})

test("Test 'Select page size' dropdown", async () => {

  //Select page size '5
  await issuesPage.clickPageSizeDropdown('Select page size...')
  await page.waitForTimeout(500)
  await issuesPage.selectPageSizeOption(PageSize.five)
  await page.waitForTimeout(1000)

  //Assert page range after it's selected page size = 5 and assert that 5 issues are displayed
  await issuesPage.assertPagesRange()
  const pageSize = await issuesPage.assertFilteredIssuesBySelectedValue(5)

  //Get current url and confirm that correct page size is placed in url
  await expect(page).toHaveURL(new RegExp(`issues/list\\?size=${pageSize}`))
  await page.waitForTimeout(1000)

  //Select page size '10'
  await issuesPage.clickPageSizeDropdown(PageSize.five)
  await issuesPage.assertCheckMarkIsVisible()
  await page.waitForTimeout(500)
  await issuesPage.selectPageSizeOption(PageSize.ten)
  await page.waitForTimeout(1000)

  //Assert page range after it's selected page size = 10 and assert that 10 issues are displayed
  await issuesPage.assertPagesRange()
  const pageSize2 = await issuesPage.assertFilteredIssuesBySelectedValue(10)

  //Get current url and confirm that correct page size is placed in url
  await expect(page).toHaveURL(new RegExp(`issues/list\\?size=${pageSize2}`))
  await page.waitForTimeout(1000)

  //Select page size '1'
  await issuesPage.clickPageSizeDropdown(PageSize.ten)
  await issuesPage.assertCheckMarkIsVisible()
  await page.waitForTimeout(500)
  await issuesPage.selectPageSizeOption(PageSize.one)
  await page.waitForTimeout(1000)

  //Assert page range after it's selected page size = 1 and assert that 1 issue is displayed
  await issuesPage.assertPagesRange()
  const pageSize3 = await issuesPage.assertFilteredIssuesBySelectedValue(1)

  //Get current url and confirm that correct page size is placed in url
  await expect(page).toHaveURL(new RegExp(`issues/list\\?size=${pageSize3}`))
  await page.waitForTimeout(500)
})

test("Test Sorting with Issues table columns", async () => {

  //Click on table header and sort by issue title in ascending order
  await issuesPage.clickOnIssuesTableHeader("Issue")
  await issuesPage.assertSortArrowIsVisible()
  await issuesPage.assertRowsAreSortedByColumn(10, 'asc', 0)

  //Get current url and confirm that it's visible that issues are sorted by title in ascending order
  await expect(page).toHaveURL(new RegExp(`issues/list\\?orderBy=title&sort=asc`))
  await page.waitForTimeout(1000)

  //Click again on Issues table header and sort by issue title in descending order
  await issuesPage.clickOnIssuesTableHeader("Issue")
  await page.waitForTimeout(1000)
  await issuesPage.assertSortArrowIsVisible()
  await issuesPage.assertRowsAreSortedByColumn(10, 'desc', 0)

  //Get current url and confirm that it's visible that issues are sorted by title in descending order
  await expect(page).toHaveURL(new RegExp(`issues/list\\?orderBy=title&sort=desc`))
  await page.waitForTimeout(1000)

  //Click on table header and sort by issue Status in ascending order
  await issuesPage.clickOnIssuesTableHeader("Status")
  await page.waitForTimeout(1000)
  await issuesPage.assertSortArrowIsVisible()
  await issuesPage.assertRowsAreSortedByColumn(10, 'asc', 1)

  //Get current url and confirm that it's visible that issues are sorted by Status in ascending order
  await expect(page).toHaveURL(new RegExp(`issues/list\\?orderBy=status&sort=asc`))
  await page.waitForTimeout(1000)

  //Click on table header and sort by issue Status in descending order
  await issuesPage.clickOnIssuesTableHeader("Status")
  await page.waitForTimeout(1000)
  await issuesPage.assertSortArrowIsVisible()
  await issuesPage.assertRowsAreSortedByColumn(10, 'desc', 1)

  //Get current url and confirm that it's visible that issues are sorted by Status in descending order
  await expect(page).toHaveURL(new RegExp(`issues/list\\?orderBy=status&sort=desc`))
  await page.waitForTimeout(1000)

  //Click on table header and sort by issue "Created" in ascending order
  await issuesPage.clickOnIssuesTableHeader("Created")
  await page.waitForTimeout(2000)
  await issuesPage.assertSortArrowIsVisible()
  await issuesPage.assertRowsAreSortedByColumn(10, 'asc', 2)

  //Get current url and confirm that it's visible that issues are sorted by Status in ascending order
  await expect(page).toHaveURL(new RegExp(`issues/list\\?orderBy=createdAt&sort=asc`))
  await page.waitForTimeout(1000)

  //Click on table header and sort by issue "Comments" in descending order
  await issuesPage.clickOnIssuesTableHeader("Comments")
  await issuesPage.assertSortArrowIsVisible()
  await issuesPage.clickOnIssuesTableHeader("Comments")
  await page.waitForTimeout(1000)
  await issuesPage.assertSortArrowIsVisible()
  await issuesPage.assertRowsAreSortedByColumn(10, 'desc', 3)

  //Get current url and confirm that it's visible that issues are sorted by Comments in descending order
  await expect(page).toHaveURL(new RegExp(`issues/list\\?orderBy=comment&sort=desc`))
  await page.waitForTimeout(1000)

  //Click on table header and sort by issue "Comments" in ascending order
  await issuesPage.clickOnIssuesTableHeader("Comments")
  await page.waitForTimeout(1000)
  await issuesPage.assertSortArrowIsVisible()
  await issuesPage.assertRowsAreSortedByColumn(10, 'asc', 3)

  //Get current url and confirm that it's visible that issues are sorted by Comments in ascending order
  await expect(page).toHaveURL(new RegExp(`issues/list\\?orderBy=comment&sort=asc`))
  await page.waitForTimeout(1000)
})
