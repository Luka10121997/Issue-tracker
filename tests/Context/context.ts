import { Browser, BrowserContext, chromium, Page } from "@playwright/test";

export default class PageContext {

  private _browser!: Browser
  private _context!: BrowserContext
  private _page!: Page;

  constructor() {
  }

  public async initialize() {
    this._browser = await chromium.launch()
    this._context = await this._browser.newContext({ storageState: './auth.json' })
    this._page = await this._context.newPage()
  }

  public get page() {
    return this._page
  }

  public async destroy() {
    await this._page?.close()
    await this._context?.close()
    await this._browser?.close()
  }
}