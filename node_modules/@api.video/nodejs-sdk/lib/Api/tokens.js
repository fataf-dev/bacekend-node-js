const Tokens = function Tokens(browser) {
  this.browser = browser;

  this.generate = function generate(ttl = 0) {
    return this.browser.post('upload-tokens', {}, { ttl }).then(this.cast);
  };
};

Tokens.prototype.cast = function cast(data) {
  if (!data) {
    return null;
  }

  return data.token;
};

module.exports = Tokens;
