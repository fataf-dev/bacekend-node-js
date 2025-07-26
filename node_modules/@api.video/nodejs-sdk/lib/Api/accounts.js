const Account = require('../Model/account');
const Quota = require('../Model/quota');

const Accounts = function Accounts(browser) {
  this.browser = browser;

  /**
   * @deprecated
   */
  this.get = function get() {
    return this.browser.get(
      'account',
    ).then(this.cast);
  };
};

Accounts.prototype.cast = function cast(data) {
  if (!data) {
    return null;
  }
  const account = new Account();
  const quota = new Quota();
  quota.quotaUsed = data.quota.quotaUsed;
  quota.quotaRemaining = data.quota.quotaRemaining;
  quota.quotaTotal = data.quota.quotaTotal;

  account.quota = quota;
  account.features = data.features;

  return account;
};

module.exports = Accounts;
