const puppeteer = require("puppeteer");
const chai = require("chai");
const { expect } = require("chai");

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
describe("Wykonanie transakcji na nowym koncie użytkownika", () => {
  it("Rejestracja nowego użytkownika", async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto("http://localhost:3000/");
    await page.goto("http://localhost:3000/signup");
    await page.waitForSelector("h1[data-test=signup-title]");
    const signupTitle = await page.$eval(
      "h1[data-test=signup-title",
      (element) => element.textContent
    );
    await expect(signupTitle).to.equal("Sign Up");
    const urlSignUp = await page.evaluate(() => location.href);
    await expect(urlSignUp).to.contain("/signup");
    const firstNameInput = await page.waitForSelector("#firstName");
    await firstNameInput.focus();
    await page.keyboard.type("Mateusz");
    const lastNameInput = await page.waitForSelector("#lastName");
    await lastNameInput.focus();
    await page.keyboard.type("Gut");
    const usernameInput = await page.waitForSelector("#username");
    await usernameInput.focus();
    await page.keyboard.type("GutMat");
    const passwordInput = await page.waitForSelector("#password");
    await passwordInput.focus();
    await page.keyboard.type("Test123$%");
    const confirmPasswordInput = await page.waitForSelector("#confirmPassword");
    await confirmPasswordInput.focus();
    await page.keyboard.type("Test123$%");
    await page.waitForSelector(
      "button[data-test=signup-submit]:not([disabled])"
    );
    await page.$eval(
      "button[data-test=signup-submit]:not([disabled])",
      (button) => button.click()
    );
    await page.waitForSelector("button[data-test=signin-submit]");
    const signinButtonText = await page.$eval(
      "button[data-test=signin-submit]",
      (element) => element.textContent
    );
    await expect(signinButtonText).to.equal("Sign In");
    const urlSignIn = await page.evaluate(() => location.href);
    await expect(urlSignIn).to.contain("/signin");

    // Logowanie nowo założonego użytkownika do aplikacji
    const usernameInputSignIn = await page.waitForSelector("#username");
    await usernameInputSignIn.focus();
    await page.keyboard.type("GutMat");
    const passwordInputSignIn = await page.waitForSelector("#password");
    await passwordInputSignIn.focus();
    await page.keyboard.type("Test123$%");
    await page.$eval(
      "button[data-test=signin-submit]:not([disabled])",
      (button) => button.click()
    );

    // Wprowadzenie danych nowego użytkownika na ekranie startowym
    await page.waitForSelector("div[data-test=user-onboarding-dialog]", {
      visible: true,
    });
    const onboardingDialogTitle = await page.$eval(
      "div[data-test=user-onboarding-dialog-title]",
      (element) => element.textContent
    );
    await expect(onboardingDialogTitle).to.equal(
      "Get Started with Real World App"
    );
    await page.$eval(
      "button[data-test=user-onboarding-next]:not([disabled])",
      (button) => button.click()
    );
    const secondOnboardingTitle = await page.$eval(
      "div[data-test=user-onboarding-dialog-title]",
      (element) => element.textContent
    );
    await expect(secondOnboardingTitle).to.equal("Create Bank Account");
    const bankNameInput = await page.waitForSelector(
      "#bankaccount-bankName-input"
    );
    await bankNameInput.focus();
    await page.keyboard.type("Narodowy Bank Polski");
    const routingNumberInput = await page.waitForSelector(
      "#bankaccount-routingNumber-input"
    );
    await routingNumberInput.focus();
    await page.keyboard.type("123456789");
    const accountNumberInput = await page.waitForSelector(
      "#bankaccount-accountNumber-input"
    );
    await accountNumberInput.focus();
    await page.keyboard.type("987654321");
    const saveButtonText = await page.$eval(
      "button[data-test=bankaccount-submit]",
      (element) => element.textContent
    );
    await expect(saveButtonText).to.equal("Save");
    await page.$eval(
      "button[data-test=bankaccount-submit]:not([disabled])",
      (button) => button.click()
    );
    const finishOnboardingTitle = await page.$eval(
      "div[data-test=user-onboarding-dialog-title]",
      (element) => element.textContent
    );
    await expect(finishOnboardingTitle).to.equal("Finished");
    const finishButtonText = await page.$eval(
      "button[data-test=user-onboarding-next]",
      (element) => element.textContent
    );
    await expect(finishButtonText).to.equal("Done");
    await page.$eval(
      "button[data-test=user-onboarding-next]:not([disabled])",
      (button) => button.click()
    );
    // // const removedOnboardingDialog = await page.$(
    // //   "data-test=user-onboarding-dialog"
    // // );
    // // await expect(removedOnboardingDialog).to.equal(null);

    // Dodanie nowej transakcji
    await page.waitForSelector("h6[data-test=sidenav-username]", {
      visible: true,
    });
    const navUsernameText = await page.$eval(
      "h6[data-test=sidenav-username]",
      (element) => element.textContent
    );
    await expect(navUsernameText).to.contain("GutMat");
    await page.$eval("a[data-test=nav-top-new-transaction]", (link) =>
      link.click()
    );
    const urlNewTransaction = await page.evaluate(() => location.href);
    await expect(urlNewTransaction).to.contain("/transaction/new");
    await page.$eval("li.MuiListItem-root", (el) => el.click());
    const amountInput = await page.waitForSelector("#amount");
    await amountInput.focus();
    await page.keyboard.type("100");
    const transactionDescriptionInput = await page.waitForSelector(
      "#transaction-create-description-input"
    );
    await transactionDescriptionInput.focus();
    await page.keyboard.type("Pożyczka");
    await page.$eval(
      "button[data-test=transaction-create-submit-request]:not([disabled])",
      (link) => link.click()
    );
    const successAlertText = await page.$eval(
      "div[data-test=alert-bar-success]",
      (element) => element.textContent
    );
    await expect(successAlertText).to.contain("Transaction Submitted!");
    await delay(2000);
    await browser.close();
  });
});
