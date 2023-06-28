/* eslint-disable class-methods-use-this */

const Type = {
  Center: 'dozen-notifications',
  Menu: 'dozen-notifications dozen-notifications-panel',
};

const Tab = {
  All: 'All',
  Unread: 'Unread',
};

/* const Category = {
  Recent: 'Recent',
  Earlier: 'Earlier',
}; */

const Data = {
  Title: 'item.title',
  Author: 'item.author',
  SubTitle: 'item.subtitle',
  Summary: 'item.body',
  Date: 'moment.utc(item.createdOn).local().fromNow()',
  Unread: 'unread',
};

/* const Action = {
  MarkAsRead: 'Mark as read',
  Clear: 'Clear',
}; */

class CDNotificationsPage {
  constructor(page, context) {
    // locators
    this.page = page;
    this.context = context;

    this.NotificationsMenu = page.locator('//div[@class="dozen-menu-sticky-menu"]');
    this.ActiveTab = page.locator('//nav[@class="dozen-notifications-tab-nav"]/a[contains(text(),"All")][@class="active-tab"]');

    this.NotificationCenter = page.locator('//div[@class="dozen-notifications"]');

    /// //////////////////////////////////////////////////

    this.bell = page.locator('div.notifications-bell');
     this.viewFullNotifications = page.locator('//div[contains(@class,"dozen-notification-viewFullPage")]/a[contains(text(),"View full notifications page")]');
    //this.viewFullNotifications = page.locator('div:nth-child(2) > div > div > div.dozen-notifications-section-wrapper > div > div');

    this.notificationsThreeDots = page.locator('//div[@class="dozen-notifications-header-menu-toggle"]');
    this.markAllAsRead = page.locator('//div[@class="dozen-notifications-header-menu-item"]/span[contains(text(),"Mark all as read")]');
    this.SeeMore = page.locator('//div[contains(@class,"dozen-notifications-header-menu-item")]/a[contains(text(),"See more")]');
    this.Clear = page.locator('//span[contains(text(),"Clear")]');

    this.clickOnUnreadTab = page.locator('//div[@class="dozen-notifications-header-left-section"]//nav/a[contains(text(),"Unread")]');
    this.clickOnAllTab = page.locator('//div[@class="dozen-notifications-header-left-section"]//nav/a[contains(text(),"All")]');
    // this.recentNotifications = page.locator('//div[@class="dozen-notifications-category"]/h3[text()="Recent"]/..//..');

    this.allTabString = '//div[@x-show="tab === \'All\'"]';
    this.unreadTabString = '//div[@x-show="tab === \'Unread\'"]';

    this.notificationsList = page.locator('//ul/li[1]');

    this.notificationElement = page.locator('//div[contains(@class,"dozen-notifications-list-item-wrapper")]');
    this.notificationCheckbox = page.locator('//input[@class="notification-checkbox"]');
    this.notificationAuthor = page.locator('//div[@class="dozen-notifications-list-item-author"and span="shaimaa"]');
    // this.notificationLink = page.locator('//a[contains(@href,"https://www.google.com/")]');
    this.notificationTitle = page.locator('//span[contains(@class,"dozen-notifications-list-item-title")and text()="Auto"]');
    this.notificationSubTitle = page.locator('//span[contains(@class,"dozen-notifications-list-item-subTitle")and text()="Sub Title"]');
    this.notificationMessage = page.locator('//span[contains(@class,"dozen-notifications-list-item-summary")and text()="Message"]');
    this.notificationDate = page.locator('//span[contains(@class,"dozen-notifications-list-item-date")and text()="an hour ago"]');
    this.unreadDot = page.locator('//li[contains(@class,"dozen-notifications-list-item unread")]');

    this.searchInput = page.locator('//input[@placeholder="Search"]');
    this.filterByAuthor = page.locator('//div[contains(@class,"choices__item choices__item--selectable")][contains(text(),"Filter by Author")]');
    this.seachInFilter = page.locator('//div[contains(@class,"choices__list choices__list--dropdown")]/input');
    this.clearFilter = page.locator('//div[contains(@class,"mt-1 flex rounded-md shadow-sm")]/button');
    this.filterListItem = page.locator('//div[contains(@role,"listbox")]//div[contains(@data-value,"Add New Notification")]');
    this.notificationLinkmarkAsRead = page.locator('//div[contains(@class,"dozen-notifications-actionBtn")and span[contains(text(),"Mark as read")]]');
    this.clearNotifications = page.locator('//div[contains(@class,"dozen-notifications-actionBtn")and span[contains(text(),"Clear")]]');

    // this.selectAllCheckbox = page.locator('//h3[text()="Select all"]//preceding-sibling::input');//div[contains(@class,"dozen-notifications-selectAll-wrapper")]/input
    this.recentCheckbox = page.locator('//h3[text()="Recent"]//preceding-sibling::input');
    this.earlierCheckbox = page.locator('//h3[text()="Earlier"]//preceding-sibling::input');

    this.noNotificationMsgCenter = page.locator(`${this.getTypeXpath(Type.Center)}//nav[@class="dozen-notifications-tab-nav"]/../div[not(@class)]`);
    this.noNotificationMsgMenu = page.locator(this.getTypeXpath(Type.Menu) + this.getTabXpath(Type.Menu, Tab.All));
    this.noNotificationMsgMenuUnread = page.locator(this.getTypeXpath(Type.Menu) + this.getTabXpath(Type.Menu, Tab.Unread));
    
    this.headerMsg = page.locator('p.dozen-header-announcement-p');
    this.paginationButtons = page.locator('//button[@x-text="i"]');
  }

  async clickOnNotificationBell() {
    await this.page.waitForLoadState('networkidle');
    await this.bell.click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToNotificationPage() {
    await Promise.all([
      this.page.waitForNavigation(),
      this.viewFullNotifications.click()
    ]);    
  }

  getTypeXpath(type) {
    return `//div[@class="${type}"]`;
  }

  getTabXpath(type, tab) {
    if (type.includes(Type.Menu)) {
      return `//div[contains(@x-show,"'${tab}'")]`;
    }
    return `//nav[@class="dozen-notifications-tab-nav"]/a[@class="active-tab" and text()="${tab}"]/../..//template[contains(@x-if,"showSelectionWarningMessage")]//following-sibling::div`;
  }

  getCategoryXpath(category) {
    return `//div[@class="dozen-notifications-category"]/h3[text()="${category}"]/../..`;
  }

  getNotificationXpath() {
    return '//li[contains(@class,"dozen-notifications-list-item")]';
  }

  getFullNotificationXpath(type, tab, category, index) {
    return `(${this.getTypeXpath(type)}${this.getTabXpath(type, tab)}${this.getCategoryXpath(category)}${this.getNotificationXpath()})[${index}]`;
  }

  async getNotificationData(type, tab, category, data, index) { // Done
    if (data.toString().includes('unread')) {
      const unread = await this.page.locator(this.getFullNotificationXpath(type, tab, category, index));
      const unreadClass = await unread.getAttribute('class');

      if (unreadClass.toString().includes('unread')) {
        return true;
      }
      return false;
    }
    const notificationData = await this.page.locator(`${this.getFullNotificationXpath(type, tab, category, index)}//span[@x-text="${data}"]`);
    return notificationData.innerText();
  }

  async notificationIsVisible(type, tab, category, index) { // Done
    const notificationElement = await this.page.locator(this.getFullNotificationXpath(type, tab, category, index));
    const isVisible = await notificationElement.isVisible();
    return isVisible;
  }

  async getNotificationElement(type, tab, category, index) { // Done
    const notificationElement = await this.page.locator(this.getFullNotificationXpath(type, tab, category, index));
    return notificationElement;
  }

  async clickOnNotification(type, tab, category, index) { // Done
    await this.page.locator(`${this.getFullNotificationXpath(type, tab, category, index)}//span[@x-text="${Data.Title}"]`).click();
  }

  async clickOnTab(type, tab) { // Done
    await this.page.locator(`${this.getTypeXpath(type)}//nav/a[text()="${tab}"]`).click();
  }

  async selectAll(tab, category) { // Done
    if (typeof category === 'undefined') {
      const selectAllCheckbox = await this.page.locator('//div[@class="dozen-notifications-selectAll-wrapper"]//input');
      await selectAllCheckbox.check();
    } else {
      const selectCategoryCheckbox = await this.page.locator(`${this.getTabXpath(Type.Center, tab) + this.getCategoryXpath(category)}//h3//preceding-sibling::input`);
      await selectCategoryCheckbox.check();
    }
  }

  async checkNotification(type, tab, category, index) { // Done
    const checkNotification = await this.page.locator(`${this.getFullNotificationXpath(type, tab, category, index)}//input[@class="notification-checkbox"]`);
    await checkNotification.check();
  }

  async searchInNotification(text) {
    const searchInNotification = await this.page.locator('//div[@class="dz-advsearchbox"]//input[@class="dz-advsearchbox-input"]');
    await searchInNotification.type(text);
    await this.page.waitForTimeout(1000);
  }

  async clearSearch() {
    const searchInNotification = await this.page.locator('//div[@class="dz-advsearchbox"]//input[@class="dz-advsearchbox-input"]');
    await searchInNotification.fill('');
    await this.page.waitForTimeout(1000);
  }

  async filterAuthor(authorName) {
    const filterByAuthor = await this.page.locator('//div[@class="choices__item choices__item--selectable"]');
    await filterByAuthor.click();
    const searchInAuthorInput = await this.page.locator('//div/div[contains(@class,"choices")]/div[contains(@class,"choices__list")]/input');
    await searchInAuthorInput.type(authorName);
    await this.page.keyboard.press('Enter');
  }

  async clearFilter2() {
    const clearFilter = await this.page.locator('//div[contains(@class,"mt-1 flex rounded-md shadow-sm")]/button');
    await clearFilter.click();
  }

  async clickActionOnSelectedNotifcations(type, action) { // Done
    const clickActionOnSelectedNotifcations = await this.page.locator(`${this.getTypeXpath(type)}//div[contains(@class,"dozen-notifications-actionBtn")]//span[text()="${action}"]`);
    await clickActionOnSelectedNotifcations.click();
    await this.page.waitForTimeout(4000);
  }

  async getNotificationsNumber(type, tab, category) {
    await this.page.waitForTimeout(2000);
    let getNotificationsNumber;
    if (typeof category === 'undefined') {
      getNotificationsNumber = await this.page.locator(this.getTypeXpath(type) + this.getTabXpath(type, tab)
                              + this.getNotificationXpath());
    } else {
      getNotificationsNumber = await this.page.locator(this.getTypeXpath(type) + this.getTabXpath(type, tab)
                              + this.getCategoryXpath(category) + this.getNotificationXpath());
    }

    return getNotificationsNumber.count();
  }

  async makeThePageActive(){
    await this.hideTab();
    await this.hideTab(false);
  }

   async hideTab(hide = true) {
    await this.page.evaluate((hide) => {
      Object.defineProperty(document, 'visibilityState', { value: hide ? 'hidden' : 'visible', writable: true })
      Object.defineProperty(document, 'hidden', { value: hide, writable: true })
      document.dispatchEvent(new Event('visibilitychange'))
    }, hide)
  }

   async getCounter() {
    await this.page.waitForTimeout(1000);
    const bellSelector = 'div.notifications-bell';
    const bellHandle = await this.page.waitForSelector(bellSelector);
    const bellContent = await bellHandle.evaluateHandle((bell) => {
      const style = window.getComputedStyle(bell, '::before');
      return style.getPropertyValue('content');
    });
    var contentValue = await bellContent.jsonValue();
    var cleanString = contentValue.replace(/[|&;$%@"<>()+,]/g, "");
    return cleanString;
  } 
}
export default CDNotificationsPage;
