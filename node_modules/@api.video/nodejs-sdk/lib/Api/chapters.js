const querystring = require('querystring');
const fs = require('fs');
const path = require('path');
const Chapter = require('../Model/chapter');

const Chapters = function Chapters(browser) {
  this.browser = browser;

  this.get = function get(videoId, language) {
    return this.browser.get(
      `videos/${videoId}/chapters/${language}`,
    ).then(this.cast);
  };

  this.getAll = async function getAll(videoId) {
    const params = { currentPage: 1, pageSize: 100 };
    const allChapters = [];
    let pagination = {};

    /* eslint-disable no-await-in-loop */
    do {
      const body = await this.browser.get(
        `videos/${videoId}/chapters?${querystring.stringify(params)}`,
      );

      const chapters = body.data;
      allChapters.push(this.castAll(chapters));

      ({ pagination } = body);
      pagination.currentPage += 1;
      params.currentPage = pagination.currentPage;
    } while (pagination.pagesTotal >= pagination.currentPage);

    return allChapters.reduce((players, payersPage) => players.concat(payersPage));
  };

  this.upload = function upload(source, properties = {}) {
    if (!fs.existsSync(source)) {
      throw new Error(`${source} must be a readable source file`);
    }

    if (typeof properties.videoId === 'undefined') {
      throw new Error('"videoId" property must be set for upload chapter.');
    }

    if (typeof properties.language === 'undefined') {
      throw new Error('"language" property must be set for upload chapter.');
    }

    const { videoId } = properties;
    const { language } = properties;

    const length = fs.statSync(source).size;

    if (length <= 0) {
      throw new Error(`${source} is empty`);
    }

    return this.browser.submit(
      `videos/${videoId}/chapters/${language}`,
      source,
      path.basename(source),
    ).then(this.cast);
  };

  this.delete = function remove(videoId, language) {
    return this.browser.delete(
      `videos/${videoId}/chapters/${language}`,
    ).then(({ statusCode }) => statusCode);
  };
};

Chapters.prototype.castAll = function castAll(collection) {
  return collection.map(Chapters.prototype.cast);
};

Chapters.prototype.cast = function cast(data) {
  if (!data) {
    return null;
  }
  const chapter = new Chapter();
  chapter.uri = data.uri;
  chapter.src = data.src;
  chapter.language = data.language;

  return chapter;
};

module.exports = Chapters;
