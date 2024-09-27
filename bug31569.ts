import { chromium } from "playwright";

declare global {
  interface Window {
    example: {foo:  () => number};
    __name: (func: Function)=> Function 
  }
}

const main = async (): Promise<void> => {
    const browser = await chromium.launch({headless: false});  
    const context = await browser.newContext({});
    await context.addInitScript(() => {
      window.__name = (func) => func;
        window.example = { foo: () => {
            const getNumber = () => 5
            return getNumber()
        }}
    })
    const page = await context.newPage();
    // await page.waitForTimeout(100000)
    console.log(await page.evaluate(() => window.example.foo()))
};

if (require.main === module) {
    main().then(() => process.exit(0)).catch(() => process.exit(1));
}
