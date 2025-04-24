import test, { expect, Page } from "@playwright/test";
import PageContext from "./Context/context";
import IssuesPage from "./PageObjects/Issues-page";
import IssueIdPage from "./PageObjects/IssueId-page";
import { prisma } from "@/prisma/client";
import NavigationBar from "./PageObjects/NavigationBar";

let page: Page
let pageContext: PageContext
const pageUrl = "http://localhost:3000/issues/list"
let navigationBar: NavigationBar
let issuesPage: IssuesPage
let issueIdPage: IssueIdPage

test.beforeAll(async () => {
  pageContext = new PageContext()
  await pageContext.initialize()
  page = pageContext.page
})

test.beforeEach(async () => {
  navigationBar = new NavigationBar(page)
  issuesPage = new IssuesPage(page)
  issueIdPage = new IssueIdPage(page)
  await page.goto(pageUrl)
  expect(page).toHaveURL(/issues\/list/)
  await page.waitForTimeout(2000)
})


test('Check issue elements on Issue id page are visible and have correct content', async () => {

  //Get data of issue table row which will be clicked
  const tableData = await issuesPage.getTableRowData(1)
  const issueTitle = (await tableData[0].innerText()).toString()
  const issueStatus = (await tableData[1].innerText()).toString()
  const createdAt = (await tableData[2].innerText())

  const issue = await prisma.issue.findFirst({ where: { title: issueTitle } })
  const description = issue?.description
  const id = issue?.id

  //Click on table row and go on Issue id page
  await issuesPage.clickOnTableRow(1)
  expect(page).toHaveURL(`http://localhost:3000/issues/${id}`)
  await page.waitForTimeout(1000)

  //Assert that Issue id page is opened and assert issue title,status,date and description
  await issueIdPage.assertIssueTitle(issueTitle)
  await issueIdPage.assertIssueStatus(issueStatus)
  await issueIdPage.assertDate(createdAt)
  await issueIdPage.assertIssueDescription(description!)
  await page.waitForTimeout(1000)

  //Assert and click on Edit button and assert that Edit issue page is opened
  await issueIdPage.assertAndClickOnButton("Edit issues")
  expect(page).toHaveURL(`http://localhost:3000/issues/Edit/${id}`)
  await page.waitForTimeout(1000)

  //Go back on Issue id page and assert and click on Delete button
  await navigationBar.clickOnBackButton()
  await issueIdPage.assertAndClickOnButton("Delete Issue")
  await page.waitForTimeout(1000)
})

test('Check status change via Status dropdown on Issue page', async () => {

  //Get data of issue table row which will be clicked
  const tableData = await issuesPage.getTableRowData(1)
  const issueStatus = (await tableData[1].innerText()).toString()

  //Click on table row and go on Issue id page
  await issuesPage.clickOnTableRow(1)
  await page.waitForTimeout(500)

  //Click on Status dropdown and select new status
  await issueIdPage.clickOnStatusDropdown(issueStatus)
  const selectedStatus = await issueIdPage.selectStatus(0)
  await page.waitForTimeout(1000)

  //Assert that status is changed
  await issueIdPage.assertIssueStatus(selectedStatus)
  await page.waitForTimeout(500)

  //Click again on Status dropdown and select new status
  await issueIdPage.clickOnStatusDropdown(selectedStatus)
  const selectedStatus2 = await issueIdPage.selectStatus(1)
  await page.waitForTimeout(500)

  //Assert that status is changed
  await issueIdPage.assertIssueStatus(selectedStatus2)
  await page.waitForTimeout(500)

  //Go back on Issue list, find this issue and check that correct changed status is displayed
  await navigationBar.clickOnLink("Issues")
  const tableData2 = await issuesPage.getTableRowData(1)
  const issueStatus2 = (await tableData2[1].innerText()).toString()
  expect(issueStatus2).toContain(selectedStatus2)
  await page.waitForTimeout(500)
})

test('Check Users dropdown on Issue page and confirm that after user is assigned, status is changed to "In Progress"', async () => {

  await prisma.issue.create({ data: { title: "Luka title11111", description: "New issue description" } })
  await page.waitForTimeout(2000)

  //Go on last Issues page and click on single right arrow button
  await issuesPage.clickOnPaginationButton(3)
  await page.waitForTimeout(1000)


  //Click on the last table row and go on Issue id page
  await issuesPage.clickOnTableRow()
  await page.waitForTimeout(500)

  //Click on Users dropdown and assignee Issue or unassign it and confirm that Status is automatically "In Progress"
  await issueIdPage.clickOnStatusDropdown("Unassigned")
  const selectedUser = await issueIdPage.selectStatus(0)
  await issueIdPage.assertIssueStatus("In Progress")
  await page.waitForTimeout(1000)

  //Click again on Users dropdown and select "Unassigned" 
  await issueIdPage.clickOnStatusDropdown(selectedUser)
  await issueIdPage.selectStatus(0)
  await issueIdPage.assertIssueStatus("In Progress")
  await page.waitForTimeout(500)
})

test('Check Delete issues button on Issue page and check its functionality and CANCEL and DELETE buttons after DELETE confirmation dropdown is opened', async () => {

  await prisma.issue.create({ data: { title: "Luka title11111", description: "New issue description" } })
  await page.waitForTimeout(2000)

  //Go on last Issues page and click on single right arrow button
  await issuesPage.clickOnPaginationButton(3)
  await page.waitForTimeout(1000)

  //Click on the last table row and go on Issue id page
  await issuesPage.clickOnTableRow()
  await page.waitForTimeout(1500)

  //Click on Delete button and assert that Delete confirmation dropdown is opened
  await issueIdPage.assertAndClickOnButton("Delete Issue")
  await page.waitForTimeout(1000)

  //Assert that Delete confirmation dropdown is opened and assert its content and click on CANCEL button
  await issueIdPage.assertDeleteConfirmationDropdownAndClickOnButtons('Cancel')
  await page.waitForTimeout(500)

  //Assert that Delete confirmation dropdown is opened and assert its content and click on DELETE button
  await issueIdPage.assertAndClickOnButton("Delete Issue")
  await page.waitForTimeout(1000)
  await issueIdPage.assertDeleteConfirmationDropdownAndClickOnButtons('Delete issue')
  await issueIdPage.assertSuccessToast('Issue is successfully deleted')
  await page.waitForTimeout(1500)

  //Confirm that issue is deleted and user is rendered back on /issues/list page
  expect(page).toHaveURL(/issues\/list/)
  await page.waitForTimeout(500)
})

test('Check Add comment functionality on Issue id page and check Comment box validation messages', async () => {

  //Go on last Issues page and click on single right arrow button
  await issuesPage.clickOnPaginationButton(3)
  await page.waitForTimeout(1000)

  //Click on the last table row and go on Issue id page
  await issuesPage.clickOnTableRow()
  await page.waitForTimeout(1500)

  //Add one valid comment
  const comment = await issueIdPage.addComment("This is a new comment")
  await page.waitForTimeout(2000)

  //Assert that comment is added and visible on Issue id page
  await issueIdPage.assertAddedComment(comment)

  //Go on Issues list and find this issue with this added comment
  await navigationBar.clickOnLink("Issues")
  await issuesPage.clickOnPaginationButton(3)
  await page.waitForTimeout(1000)
  const commentData = (await (await issuesPage.getAddedCommentOnLastCreatedIssue()).innerText()).toString()
  expect(commentData).toContain(comment)
  await page.waitForTimeout(500)

  //Go again on the last created issue and then assert comment validation messages
  await issuesPage.clickOnTableRow()
  await page.waitForTimeout(1500)

  //Click on Add comment button without populating Comment box and assert validation message
  await issueIdPage.addComment("")
  await issueIdPage.assertCommentValidationMessage("Comment is required, at least one character!")
  await page.waitForTimeout(1000)

  //Add comment wizh more than 255 characters and assert validation message
  await issueIdPage.addComment('Luka'.repeat(255))
  await issueIdPage.assertCommentValidationMessage("You exceed the number of characters!")
  await page.waitForTimeout(1000)
})
