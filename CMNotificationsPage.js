import { expect } from "@playwright/test";
const path = require('path');

class CMNotificationsPage {
  constructor(page, context) {
    // locators
    this.page = page;
    this.context = context;

    this.notificationsButton = page.locator('//span[contains(text(),"Notifications")]');
    this.titleInput = page.locator('//input[@id="Title"]');
    this.subTitleInput = page.locator('//input[@id="subTitle"]');
    this.messageTextArea = page.locator('//textarea[@id="Message"]');
    this.linkInput = page.locator('//input[@id="Link"]');
    this.authorInput = page.locator('//input[@id="Author"]');
    this.sendButton = page.locator('//button[contains(text(),"Send")]');
    this.msg = page.locator('//span[@class="form-msg--text" and contains(text(),"successfully")]');
    this.targetUsersDropDown = page.locator('div.target-users-menu-wrapper');
    this.targetUsersOptions = page.locator('li.dozen-form-radio-item');
    this.contactsLists = page.locator('div.contact-list-section');

    this.listMangerButton = page.locator('//span[contains(text(),"List Manager")]');
    this.createButton = page.locator('//button[@data-sc-id="CreateButton"]');
    this.createListFromFileButton = page.locator('//div[@data-sc-id="CreateListFromFileRowPanel"]');
    this.fileUploaderInput = page.locator('//input[@class="sc-uploader-fileupload"]');
    this.browseButton = page.locator('//span[@id="browse-button"]');
    this.uploadFileButton = page.locator('//button[@data-sc-id="UploadButton"]');
    this.dropDowns = page.locator('//select');
    this.fileName = page.locator('//input[@name="name"]');
    this.nextButton = page.locator('//button[@data-sc-id="ButtonNext"]');
    this.finishButton = page.locator('//button[@data-sc-id="ButtonFinish"]');
    this.listNameInput = page.locator('//input[@data-sc-id="GeneralInformationNameValue"]');
    this.saveButton = page.locator('//button[@data-sc-id="SaveButton"]');
    this.description = page.locator('//textarea[@data-sc-id="GeneralInformationDescriptionValue"]');

  }

  async goToNotificationPage() {
    await Promise.all([
      this.page.waitForNavigation(),
      this.notificationsButton.click(),
    ]);
  }

  async uploadCsvFile(){
    await Promise.all([
      this.page.waitForNavigation(),
      this.listMangerButton.click()
    ]);
    await this.createButton.waitFor({ state: 'visible'});
    await this.page.waitForLoadState('networkidle');
    await this.createButton.click();
    await this.page.waitForLoadState('networkidle');
    await this.createListFromFileButton.click();
    await this.browseButton.waitFor({ state: 'visible'});
    const relativeFilePath = './Data/Segments.csv';
    const absoluteFilePath = path.resolve(relativeFilePath);
    await this.fileUploaderInput.setInputFiles(absoluteFilePath);
    await this.page.waitForLoadState('networkidle');
    await this.fileName.fill("AutomationCsv"+Math.floor(Math.random() * 10000));
    await this.page.waitForLoadState('networkidle');
    await this.uploadFileButton.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.locator('//input[@type="checkbox"]').first().click();
    await this.page.locator('//input[@type="checkbox"]').last().click();
    await this.dropDowns.nth(0).selectOption({ index: 1 });
    await this.dropDowns.nth(1).selectOption({ index: 2 });
    await this.dropDowns.nth(2).selectOption({ index: 3 });
    await this.dropDowns.nth(3).selectOption({ index: 4 });
    await this.dropDowns.nth(4).selectOption({ index: 5 });
    await this.nextButton.click();
    await this.finishButton.click();
    const listName = "AutomationCsvList"+Math.floor(Math.random() * 10000)
    await this.page.waitForLoadState('networkidle');
    await this.listNameInput.fill(listName);
    await this.page.waitForLoadState('networkidle');
    await this.description.click();
    await this.page.waitForLoadState('networkidle');
    await this.saveButton.click();
    await this.page.getByText('The list has been saved.').waitFor({ state: 'visible'});
    await this.page.locator('a.sc-global-logo').click();
    return listName;
  }

  async sendNotification(options) {
    await this.titleInput.fill(options.Title);
    if (typeof options.SubTitle !== 'undefined') {
      await this.subTitleInput.fill(options.SubTitle);
    }
    if (typeof options.Message !== 'undefined') {
      await this.messageTextArea.fill(options.Message);
    }
    if (typeof options.Author !== 'undefined') {
      await this.authorInput.fill(options.Author);
    }
    if (typeof options.Link !== 'undefined') {
      await this.linkInput.fill(options.Link);
    }

    if (typeof options.Contacts !== 'undefined') {
      await this.page.waitForTimeout(500);
      await this.targetUsersDropDown.click();
      await this.targetUsersOptions.nth(1).click();
      await this.contactsLists.click();
      await this.page.waitForLoadState('networkidle');
      await this.page.getByText(options.Contacts).click();
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(500);
    }


    if (typeof options.Tags !== 'undefined') {
      await this.page.locator("//label[contains(text(),'Select Tags')]").click();
      await this.page.waitForTimeout(500);
      const parts = options.Tags.split('/');
  
      // Loop through each part and click on the corresponding element
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        //------
        var item =  await this.page
                          .locator("//a[@role='treeitem']")
                          .filter({ has: this.page.getByText(part, { exact: true }) })
                          .locator("//parent::li");
        await item.waitFor({state: "visible"});

        var closed = await item.getAttribute('aria-expanded') === 'false';
        if(closed){
          await this.page.waitForTimeout(500);
          await item.locator('.jstree-ocl').click();
        }
        //------
      }
      var leaf =  await this.page
                          .locator("//a[@role='treeitem']")
                          .filter(({ has: this.page.getByText(parts[parts.length-1], { exact: true }) }))
                          .locator(".jstree-checkbox");
      // Retrieve the text of the last part (leaf)
      await leaf.click();
      await this.page.locator("//label[contains(text(),'Select Tags')]").click();
    }
    

    // await this.page.waitForTimeout(3000);
    await this.sendButton.click();
    // await this.page.waitForTimeout(3000);
    await this.msg.waitFor({ state: 'visible', timeout: 60000 });
  }
}
export default CMNotificationsPage;
