import test, { expect, Page } from "@playwright/test";
import PageContext from "./Context/context";
import IssuesPage from "./PageObjects/Issues-page";
import IssueIdPage from "./PageObjects/IssueId-page";
import { prisma } from "@/prisma/client";
import NavigationBar from "./PageObjects/NavigationBar";
import EditIssuePage from "./PageObjects/EditIssue-page";

//TODO Add on beforeEach function for issues creation
let page: Page
let pageContext: PageContext
const pageUrl = "http://localhost:3000/issues/list"
let navigationBar: NavigationBar
let issuesPage: IssuesPage
let issueIdPage: IssueIdPage
let editIssuePage: EditIssuePage

test.beforeAll(async () => {
  pageContext = new PageContext()
  await pageContext.initialize()
  page = pageContext.page
})

test.beforeEach(async () => {
  navigationBar = new NavigationBar(page)
  issuesPage = new IssuesPage(page)
  issueIdPage = new IssueIdPage(page)
  editIssuePage = new EditIssuePage(page)
  await page.goto(pageUrl)
  expect(page).toHaveURL(/issues\/list/)
  await page.waitForTimeout(2000)
})


test('Go on Issue page, click on Edit issues button, and then render to Edit issue page and check all elements', async () => {

  //Get data of issue table row which will be clicked
  const tableData = await issuesPage.getTableRowData(0)
  const issueTitle = (await tableData[0].innerText()).toString()

  const issue = await prisma.issue.findFirst({ where: { title: issueTitle } })
  const description = issue?.description.toString()
  const id = issue?.id

  //Click on table row and go on Issue id page
  await issuesPage.clickOnTableRow(0)
  await page.waitForTimeout(1000)
  expect(page).toHaveURL(`http://localhost:3000/issues/${id}`)
  await page.waitForTimeout(1000)

  //Assert that Issue id page is opened and assert issue title,status,date and description
  await issueIdPage.assertIssueTitle(issueTitle)
  await issueIdPage.assertIssueDescription(description!)
  await page.waitForTimeout(1000)

  //Assert and click on Edit button and assert that Edit issue page is opened
  await issueIdPage.assertAndClickOnButton("Edit issues")
  expect(page).toHaveURL(`http://localhost:3000/issues/Edit/${id}`)
  await page.waitForTimeout(1000)

  //Confirm that fields are populated with already existing values of Title and Description
  await editIssuePage.assertAndFillTitleField("New title", issueTitle)
  await editIssuePage.assertAndFillDescriptionField("New description")
  await page.waitForTimeout(1000)

  //After fields are updated, click on Update Issue button
  await editIssuePage.assertAndClickOnSubmitButton('Update issue')
  await editIssuePage.assertSuccessToast('Issue is successfully updated')
  await page.waitForTimeout(500)

  //Confirm that user is redirected on issues/list page
  expect(page).toHaveURL(/issues\/list/)
  await page.waitForTimeout(500)
})

test('Check fields validations on Edit Issue page, and after they are confirmed, update issue and check success toast message after update action', async () => {

  //Click on table row and go on Issue id page
  await issuesPage.clickOnTableRow(0)

  //Click on Edit button and assert that Edit issue page is opened
  await issueIdPage.assertAndClickOnButton("Edit issues")
  await page.waitForTimeout(1000)

  //On Edit issue page clear Title field, click on Update Issue button and check validation message
  await editIssuePage.clearTitleField()
  await editIssuePage.assertAndClickOnSubmitButton('Update issue')
  await editIssuePage.assertFieldValidationMessage("Title is required")

  //Clear also Description field, click on Update issue button and check validation message below both fields
  await editIssuePage.clearDescriptionField()
  await page.waitForTimeout(1000)
  await editIssuePage.assertAndClickOnSubmitButton('Update issue')
  await editIssuePage.assertFieldValidationMessage("Description is required")
  await editIssuePage.assertFieldValidationMessage("Title is required")
  await page.waitForTimeout(1000)

  //Add some text on Title field and then assert again validation messages visibility
  await editIssuePage.assertAndFillTitleField("Luka")
  await editIssuePage.assertValidationNotVisible("Title is required")
  await editIssuePage.assertFieldValidationMessage("Description is required")
  await page.waitForTimeout(500)

  //Populate Description field and then assert again validation messages visibility for both fields
  await editIssuePage.assertAndFillDescriptionField("luka new descr")
  await editIssuePage.assertValidationNotVisible("Description is required")
  await editIssuePage.assertValidationNotVisible("Title is required")
  await page.waitForTimeout(500)

  //add large title and check is correct validation message displayed
  await editIssuePage.assertAndFillTitleField("AAAAAbbb".repeat(255), "Luka")
  await editIssuePage.assertFieldValidationMessage('Title must contain at most 255 character(s)')
  await page.waitForTimeout(500)

  //Clear title field and add allowed number of character and then click on Update issue button and check success toast message
  await editIssuePage.assertAndFillTitleField("Luka -> updated title", "AAAAAbbb".repeat(255))
  await editIssuePage.assertValidationNotVisible("Description is required")
  await editIssuePage.assertValidationNotVisible("Title is required")
  await editIssuePage.assertAndClickOnSubmitButton('Update issue')
  await editIssuePage.assertSuccessToast('Issue is successfully updated')
  await page.waitForTimeout(500)
})