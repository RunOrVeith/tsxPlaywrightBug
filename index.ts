import { chromium } from "playwright";

declare global {
  interface Window {
    example: {foo: () => number};
  }
}

const main = async (): Promise<void> => {
    const browser = await chromium.launch();  
    const context = await browser.newContext();
    await context.addInitScript(() => {
        window.example = { foo: () => 5}
    })
    const page = await context.newPage();
    console.log(await page.evaluate(() => window.example.foo()))
};

if (require.main === module) {
    main().then(() => process.exit(0)).catch(() => process.exit(1));
}
