const querystring = require('querystring');
const AnalyticEvent = require('../Model/Analytic/analyticEvent');
const AnalyticSessionEvent = require('../Model/Analytic/analyticSessionEvent');

const AnalyticsSessionEvent = function AnalyticsSessionEvent(browser) {
  this.browser = browser;

  this.get = async function get(sessionId, parameters = {}) {
    const params = Object.assign({}, parameters);
    const currentPage = (typeof parameters.currentPage !== 'undefined')
      ? parameters.currentPage
      : 1;
    params.pageSize = (typeof parameters.pageSize !== 'undefined')
      ? parameters.pageSize
      : 100;

    params.currentPage = currentPage;

    const analyticSessionEvent = new AnalyticSessionEvent();
    analyticSessionEvent.session.sessionId = sessionId;

    let pagination = {};

    /* eslint-disable no-await-in-loop */
    do {
      const body = await this.browser.get(
        `analytics/sessions/${sessionId}/events?${querystring.stringify(params)}`,
      );

      analyticSessionEvent.events = analyticSessionEvent.events.concat(this.castAll(body.data));

      if (typeof parameters.currentPage !== 'undefined') {
        break;
      }

      ({ pagination } = body);
      pagination.currentPage += 1;
      params.currentPage = pagination.currentPage;
    } while (pagination.pagesTotal >= pagination.currentPage);

    return analyticSessionEvent;
  };
};

AnalyticsSessionEvent.prototype.cast = function cast(event) {
  if (!event) {
    return null;
  }
  const analyticEvent = new AnalyticEvent();
  analyticEvent.type = event.type;
  analyticEvent.emittedAt = new Date(event.emittedAt);
  analyticEvent.at = (typeof event.at !== 'undefined') ? event.at : null;
  analyticEvent.from = (typeof event.from !== 'undefined') ? event.from : null;
  analyticEvent.to = (typeof event.to !== 'undefined') ? event.to : null;

  return analyticEvent;
};

AnalyticsSessionEvent.prototype.castAll = function castAll(events) {
  return events.map(event => AnalyticsSessionEvent.prototype.cast(event));
};

module.exports = AnalyticsSessionEvent;
