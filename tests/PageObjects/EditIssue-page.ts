import { Page } from "@playwright/test";
import CreateNewIssuePage from "./CreateNewIssue-page";

export default class EditIssuePage extends CreateNewIssuePage {

  constructor(page: Page) {
    super(page)
  }
}