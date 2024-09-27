import { chromium } from "playwright";

declare global {
    interface Window {
        playwright: {
            generateLocator(element: Element): string;
        }
    }
  }

const getPageContent = ({firstButtonVisible}:{firstButtonVisible: boolean}): string => {
    const style = firstButtonVisible ? "": 'style="display: none;"'
return `
<div>
    <button
        name="senddata"
        ${style}
        >
        <span>Agree to all</span>
    </button>
    <button
        name="senddata"
    >
        <span>Agree to all</span>
    </button>
</div>

`
}


const main = async (): Promise<void> => {
    const browser = await chromium.launch({headless: false});  
    const context = await browser.newContext({});

    const pageWithButtonVisible = await context.newPage();
    await pageWithButtonVisible.setContent(getPageContent({firstButtonVisible: true}))

    const generatedLocatorsVisible = await pageWithButtonVisible.evaluate(() => {
        const buttons = window.document.querySelectorAll("button")
        return [...buttons].map((button) => window.playwright.generateLocator(button))
    })

    console.log("visible", {generatedLocatorsVisible})

    const pageWithButtonInvisible = await context.newPage();
    await pageWithButtonInvisible.setContent(getPageContent({firstButtonVisible: false}))

    const generatedLocatorsInvisible = await pageWithButtonInvisible.evaluate(() => {
        const buttons = window.document.querySelectorAll("button")
        return [...buttons].map((button) => window.playwright.generateLocator(button))
    })

    console.log("invisible", {generatedLocatorsInvisible})

    /*
    visible {
  generatedLocatorsVisible: [
    "getByRole('button', { name: 'Agree to all' }).first()",
    "getByRole('button', { name: 'Agree to all' }).nth(1)"
  ]
}
invisible {
  generatedLocatorsInvisible: [
    `locator('button[name="senddata"]').first()`,
    "getByRole('button', { name: 'Agree to all' })"
  ]
    */

  const pageWithButtonStyleLoading = await context.newPage();
  await pageWithButtonStyleLoading.setContent(getPageContent({firstButtonVisible: true}))
  await setTimeout(() => pageWithButtonStyleLoading.evaluate(() => {
    const firstButton = window.document.querySelector("button");
    if (firstButton){
        firstButton.style.display = "none"
    }
  }), 50)

  await pageWithButtonStyleLoading.getByRole('button', { name: 'Agree to all' }).click()


};

if (require.main === module) {
    main().then(() => process.exit(0)).catch((error) => {console.log(error); process.exit(1)});
}
