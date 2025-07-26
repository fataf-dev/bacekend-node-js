const querystring = require('querystring');
const fs = require('fs');
const Player = require('../Model/player');

const Players = function Players(browser) {
  this.browser = browser;

  this.get = function get(playerId) {
    return this.browser.get(`players/${playerId}`).then(this.cast);
  };

  this.create = function create(properties = {}) {
    return this.browser.post(
      'players',
      {},
      properties,
    ).then(this.cast);
  };

  this.search = async function search(parameters = {}) {
    const params = Object.assign({}, parameters);
    const currentPage = (typeof parameters.currentPage !== 'undefined')
      ? parameters.currentPage
      : 1;
    params.pageSize = (typeof parameters.pageSize !== 'undefined')
      ? parameters.pageSize
      : 100;
    params.currentPage = currentPage;
    const allPlayers = [];
    let pagination = {};

    /* eslint-disable no-await-in-loop */
    do {
      const body = await this.browser.get(
        `players?${querystring.stringify(params)}`,
      );

      const players = body.data;
      allPlayers.push(this.castAll(players));

      if (typeof parameters.currentPage !== 'undefined') {
        break;
      }

      ({ pagination } = body);
      pagination.currentPage += 1;
      params.currentPage = pagination.currentPage;
    } while (pagination.pagesTotal >= pagination.currentPage);

    return allPlayers.reduce((players, payersPage) => players.concat(payersPage));
  };

  this.update = function update(playerId, properties = {}) {
    return this.browser.patch(
      `players/${playerId}`,
      {},
      properties,
    ).then(this.cast);
  };

  this.uploadLogo = async function uploadLogo(source, playerId, link = null) {
    if (!fs.existsSync(source)) {
      throw new Error(`${source} must be a readable source file`);
    }

    const length = fs.statSync(source).size;

    if (length <= 0) {
      throw new Error(`${source} is empty`);
    }

    const payload = {};
    if (link !== null) {
      payload.link = link;
    }

    return this.browser.submitMultiPart(
      `players/${playerId}/logo`,
      source,
      payload,
    ).then(this.cast);
  };

  this.deleteLogo = function remove(playerId) {
    return this.browser.delete(`players/${playerId}/logo`).then(({ statusCode }) => statusCode);
  };

  this.delete = function remove(playerId) {
    return this.browser.delete(`players/${playerId}`).then(({ statusCode }) => statusCode);
  };
};

Players.prototype.castAll = function castAll(collection) {
  return collection.map(Players.prototype.cast);
};

Players.prototype.cast = function cast(data) {
  if (!data) {
    return null;
  }

  const player = new Player();
  player.playerId = data.playerId;
  player.shapeMargin = data.shapeMargin;
  player.shapeRadius = data.shapeRadius;
  player.shapeAspect = data.shapeAspect;
  player.shapeBackgroundTop = data.shapeBackgroundTop;
  player.shapeBackgroundBottom = data.shapeBackgroundBottom;
  player.text = data.text;
  player.link = data.link;
  player.linkHover = data.linkHover;
  player.linkActive = data.linkActive;
  player.trackPlayed = data.trackPlayed;
  player.trackUnplayed = data.trackUnplayed;
  player.trackBackground = data.trackBackground;
  player.backgroundTop = data.backgroundTop;
  player.backgroundBottom = data.backgroundBottom;
  player.backgroundText = data.backgroundText;
  player.enableApi = data.enableApi;
  player.enableControls = data.enableControls;
  player.forceAutoplay = data.forceAutoplay;
  player.hideTitle = data.hideTitle;
  player.forceLoop = data.forceLoop;
  if (data.assets !== undefined) {
    player.logo = data.assets;
  }

  return player;
};

module.exports = Players;
