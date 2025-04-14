import test, { expect, Page } from "@playwright/test";
import PageContext from "./Context/context";
import IssuesPage from "./PageObjects/Issues-page";
import CreateNewIssuePage from "./PageObjects/CreateNewIssue-page";
import { prisma } from "@/prisma/client";

let page: Page
let pageContext: PageContext
const pageUrl = "http://localhost:3000/issues/list"
let issuesPage: IssuesPage
let createNewIssuePage: CreateNewIssuePage

test.beforeAll(async () => {
  pageContext = new PageContext()
  await pageContext.initialize()
  page = pageContext.page
})

test.beforeEach(async () => {
  issuesPage = new IssuesPage(page)
  createNewIssuePage = new CreateNewIssuePage(page)
  await page.goto(pageUrl)
  expect(page).toHaveURL(/issues\/list/)
  await page.waitForTimeout(1000)
  await issuesPage.clickOnCreateNewIssueButton('Create New Issue')
  await page.waitForTimeout(500)
  expect(page).toHaveURL('http://localhost:3000/issues/new')
  await page.waitForTimeout(500)
})

test.afterEach(async () => {
  const issue = await prisma.issue.findFirst({ orderBy: { createdAt: 'desc' }, take: 1 })
  await page.waitForTimeout(1000)
  const id = issue?.id
  await prisma.issue.delete({ where: { id } })
})


test('Checks "Create new issue" page elements, and then create new issue and find that created issue', async () => {

  //Fill all required fields
  await createNewIssuePage.assertAndFillTitleField('Luka title11111')
  await page.waitForTimeout(500)
  await createNewIssuePage.assertAndFillDescriptionField('New issue description')

  //Click on Submit button and create a new issue
  await createNewIssuePage.assertAndClickOnSubmitButton("Submit New Issue")
  await createNewIssuePage.assertSuccessToast('Issue is successfully created')
  await page.waitForTimeout(1500)

  //Click on Double right arrows and then find last created issue and assert it's values
  await issuesPage.clickOnPaginationButton(3)
  await issuesPage.assertLastCreatedIssueOnIssuesPage("Luka title11111")
  await page.waitForTimeout(1000)
})

test('Check fields validations on Create new Issue page', async () => {

  //On Create new issue page click on Submit button and confirm that issue cannot be created and validation messages are displayed
  await createNewIssuePage.assertAndClickOnSubmitButton("Submit New Issue")
  await createNewIssuePage.assertFieldValidationMessage("Title is required")
  await createNewIssuePage.assertFieldValidationMessage("Description is required")
  await page.waitForTimeout(500)

  //Add some text on Title field and then assert again validation messages visibility
  await createNewIssuePage.assertAndFillTitleField("Luka new title")
  await createNewIssuePage.assertValidationNotVisible("Title is required")
  await createNewIssuePage.assertFieldValidationMessage("Description is required")
  await page.waitForTimeout(500)

  //Add some text on Description field and then assert again validation messages visibility
  await createNewIssuePage.assertAndFillDescriptionField("luka new descr")
  await createNewIssuePage.assertValidationNotVisible("Description is required")
  await createNewIssuePage.assertValidationNotVisible("Title is required")
  await page.waitForTimeout(500)

  //add large title and check is correct validation message displayed
  await createNewIssuePage.assertAndFillTitleField("AAAAAbbb".repeat(255))
  await createNewIssuePage.assertFieldValidationMessage('Title must contain at most 255 character(s)')
  await page.waitForTimeout(500)

  //Clear title field and add allowed number of character and also fill descriptino field and finally create new issue
  await createNewIssuePage.clearTitleField()
  await createNewIssuePage.assertAndFillTitleField("LukaTitle _ _ 1997")
  await createNewIssuePage.assertAndFillDescriptionField('New issue description')
  await createNewIssuePage.assertAndClickOnSubmitButton("Submit New Issue")
  await createNewIssuePage.assertSuccessToast('Issue is successfully created')
  await page.waitForTimeout(1000)

  //Click on Double right arrows and then find last created issue and assert it's values
  await issuesPage.clickOnPaginationButton(3)
  await issuesPage.assertLastCreatedIssueOnIssuesPage("LukaTitle _ _ 1997")
  await page.waitForTimeout(1000)
})
