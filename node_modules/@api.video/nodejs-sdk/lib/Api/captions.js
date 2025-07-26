const querystring = require('querystring');
const fs = require('fs');
const path = require('path');
const Caption = require('../Model/caption');

const Captions = function Captions(browser) {
  this.browser = browser;

  this.get = function get(videoId, language) {
    return this.browser.get(
      `videos/${videoId}/captions/${language}`,
    ).then(this.cast);
  };

  this.getAll = async function getAll(videoId) {
    const params = { currentPage: 1, pageSize: 100 };
    const allCaptions = [];
    let pagination = {};

    /* eslint-disable no-await-in-loop */
    do {
      const body = await this.browser.get(
        `videos/${videoId}/captions?${querystring.stringify(params)}`,
      );

      const captions = body.data;
      allCaptions.push(this.castAll(captions));

      ({ pagination } = body);
      pagination.currentPage += 1;
      params.currentPage = pagination.currentPage;
    } while (pagination.pagesTotal >= pagination.currentPage);

    return allCaptions.reduce((players, payersPage) => players.concat(payersPage));
  };

  this.upload = function upload(source, properties = {}) {
    if (!fs.existsSync(source)) {
      throw new Error(`${source} must be a readable source file`);
    }

    if (typeof properties.videoId === 'undefined') {
      throw new Error('"videoId" property must be set for upload caption.');
    }

    if (typeof properties.language === 'undefined') {
      throw new Error('"language" property must be set for upload caption.');
    }

    const { videoId } = properties;
    const { language } = properties;

    const length = fs.statSync(source).size;

    if (length <= 0) {
      throw new Error(`${source} is empty`);
    }

    return this.browser.submit(
      `videos/${videoId}/captions/${language}`,
      source,
      path.basename(source),
    ).then(this.cast);
  };

  this.updateDefault = function updateDefault(videoId, language, isDefault) {
    return this.browser.patch(
      `videos/${videoId}/captions/${language}`,
      {},
      { default: isDefault },
    ).then(this.cast);
  };

  this.delete = function remove(videoId, language) {
    return this.browser.delete(
      `videos/${videoId}/captions/${language}`,
    ).then(({ statusCode }) => statusCode);
  };
};

Captions.prototype.castAll = function castAll(collection) {
  return collection.map(Captions.prototype.cast);
};

Captions.prototype.cast = function cast(data) {
  if (!data) {
    return null;
  }
  const caption = new Caption();
  caption.uri = data.uri;
  caption.src = data.src;
  caption.srclang = data.srclang;
  caption.default = data.default;

  return caption;
};

module.exports = Captions;
