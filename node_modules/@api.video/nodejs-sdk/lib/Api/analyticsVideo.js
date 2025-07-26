const querystring = require('querystring');
const AnalyticVideo = require('../Model/Analytic/analyticVideo');
const AnalyticData = require('../Model/Analytic/analyticData');

const AnalyticsVideo = function AnalyticsVideo(browser) {
  this.browser = browser;

  this.get = async function get(videoId, period = null) {
    const parameters = { currentPage: 1, pageSize: 100 };
    if (period) {
      parameters.period = period;
    }

    const allAnalytics = [];
    let pagination = {};

    /* eslint-disable no-await-in-loop */
    do {
      const body = await this.browser.get(
        `analytics/videos/${videoId}?${querystring.stringify(parameters)}`,
      );

      const analytics = body.data;
      allAnalytics.push(this.castAll(analytics));

      ({ pagination } = body);
      pagination.currentPage += 1;
      parameters.currentPage = pagination.currentPage;
    } while (pagination.pagesTotal >= pagination.currentPage);

    const analyticVideo = new AnalyticVideo();
    analyticVideo.videoId = videoId;
    analyticVideo.period = parameters.period;
    analyticVideo.data = allAnalytics.reduce(
      (analytics, analyticsPage) => analytics.concat(analyticsPage),
    );

    return analyticVideo;
  };

  /**
   * @deprecated searching all analytics isn't possible in current API version
   */
  this.search = async function search(parameters = {}) {
    const params = Object.assign({ pageSize: 100, currentPage: 1 }, parameters);
    await this.browser.get(`/analytics/videos?${querystring.stringify(params)}`);
    return [];
  };
};

AnalyticsVideo.prototype.castAll = function castAll(collection) {
  return collection.map(AnalyticsVideo.prototype.cast);
};

AnalyticsVideo.prototype.cast = function cast(data) {
  if (!data) {
    return null;
  }

  const analyticData = new AnalyticData();
  // Build Analytic Session
  analyticData.session.sessionId = data.session.sessionId;
  analyticData.session.loadedAt = new Date(data.session.loadedAt);
  analyticData.session.endedAt = new Date(data.session.endedAt);
  analyticData.session.metadata = data.session.metadata;

  // Build Analytic Location
  analyticData.location.country = data.location.country;
  analyticData.location.city = data.location.city;

  // Build Analytic Referer
  analyticData.referer.url = data.referrer.url;
  analyticData.referer.medium = data.referrer.medium;
  analyticData.referer.source = data.referrer.source;
  analyticData.referer.search_term = data.referrer.searchTerm;

  // Build Analytic Device
  analyticData.device.type = data.device.type;
  analyticData.device.vendor = data.device.vendor;
  analyticData.device.model = data.device.model;

  // Build Analytic Os
  analyticData.os.name = data.os.name;
  analyticData.os.shortname = data.os.shortname;
  analyticData.os.version = data.os.version;

  // Build Analytic Client
  analyticData.client.type = data.client.type;
  analyticData.client.name = data.client.name;
  analyticData.client.version = data.client.version;

  return analyticData;
};

module.exports = AnalyticsVideo;
