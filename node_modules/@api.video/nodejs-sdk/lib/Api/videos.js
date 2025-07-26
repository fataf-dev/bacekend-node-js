const fs = require('fs');
const util = require('util');
const path = require('path');
const querystring = require('querystring');
const Video = require('../Model/video');
const VideoStatus = require('../Model/videoStatus');
const IngestStatus = require('../Model/ingestStatus');
const EncodingStatus = require('../Model/encodingStatus');

const Videos = function Videos(browser) {
  this.browser = browser;
  this.chunkSize = 64 * 1024 * 1024;

  this.get = function get(videoId) {
    return this.browser.get(`videos/${videoId}`).then(this.cast);
  };

  this.getStatus = async function getStatus(videoId) {
    return this.browser.get(`videos/${videoId}/status`).then(this.castStatus);
  };

  this.create = function create(title, properties = {}) {
    return this.browser.post(
      'videos',
      {},
      Object.assign(properties, { title }),
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
    const allVideos = [];
    let pagination = {};

    /* eslint-disable no-await-in-loop */
    do {
      const body = await this.browser.get(
        `videos?${querystring.stringify(params)}`,
      );

      const videos = body.data;
      allVideos.push(this.castAll(videos));

      if (typeof parameters.currentPage !== 'undefined') {
        break;
      }

      ({ pagination } = body);
      pagination.currentPage += 1;
      params.currentPage = pagination.currentPage;
    } while (pagination.pagesTotal >= pagination.currentPage);

    return allVideos.reduce((videos, videosPage) => videos.concat(videosPage));
  };

  this.download = async function download(source, title, properties = {}) {
    const parameters = properties;
    parameters.source = source;

    return this.create(title, parameters);
  };

  this.upload = async function upload(source, properties = {}, videoId = null) {
    let slug = videoId;
    const parameters = properties;
    if (!fs.existsSync(source)) {
      throw new Error(`${source} must be a readable source file`);
    }

    const fileName = path.basename(source);

    if (slug === null) {
      if (typeof parameters.title === 'undefined') {
        parameters.title = fileName;
      }

      const video = await this.create(parameters.title, parameters);
      slug = video.videoId;
    }

    const length = fs.statSync(source).size;

    if (length <= 0) {
      throw new Error(`${source} is empty`);
    }

    // Upload in a single request when file is small enough
    if (this.chunkSize > length) {
      return this.browser.submit(
        `videos/${slug}/source`,
        source,
        fileName,
      ).then(this.cast);
    }

    const file = fs.openSync(source, 'r');
    const read = util.promisify(fs.read);
    const buf = Buffer.alloc(this.chunkSize);
    let uploadChunkSize = this.chunkSize;
    let lastBody;
    for (let offset = 0; offset < length; offset += this.chunkSize) {
      // default the upload size to be as large as possible.
      uploadChunkSize = this.chunkSize;
      // BUT,if we are on the last chunk to be uploaded, the uploaded chunk must be
      // reduced to match the reamining bytes in the file
      if (offset + uploadChunkSize > length) {
        uploadChunkSize = length - offset;
      }
      await read(file, buf, 0, uploadChunkSize, offset);
      console.log(`Uploading ${offset}-${offset + uploadChunkSize}...`);
      lastBody = await this.browser.submit(
        `videos/${slug}/source`,
        buf,
        fileName,
        {
          'Content-Range': `bytes ${offset}-${offset + uploadChunkSize - 1}/${length}`,
        },
      ).catch((error) => {
        fs.closeSync(file);
        throw new Error(error.message);
      });
    }

    fs.closeSync(file);

    return this.cast(lastBody);
  };

  this.uploadThumbnail = async function uploadThumbnail(source, videoId) {
    if (!fs.existsSync(source)) {
      throw new Error(`${source} must be a readable source file`);
    }

    const length = fs.statSync(source).size;

    if (length <= 0) {
      throw new Error(`${source} is empty`);
    }

    return this.browser.submit(
      `videos/${videoId}/thumbnail`,
      source,
      path.basename(source),
    ).then(this.cast);
  };

  this.update = function update(videoId, properties = {}) {
    return this.browser.patch(
      `videos/${videoId}`,
      {},
      properties,
    ).then(this.cast);
  };

  this.makePublic = function makePublic(videoId) {
    return this.browser.patch(
      `videos/${videoId}`,
      {},
      { public: true },
    ).then(this.cast);
  };

  this.makePrivate = function makePrivate(videoId) {
    return this.browser.patch(
      `videos/${videoId}`,
      {},
      { public: false },
    ).then(this.cast);
  };

  this.updateThumbnailWithTimecode = function updateThumbnailWithTimecode(
    videoId, timecode,
  ) {
    if (!timecode) {
      throw new Error('Timecode is empty');
    }
    return this.browser.patch(
      `videos/${videoId}/thumbnail`,
      {},
      { timecode },
    ).then(this.cast);
  };

  this.delete = async function remove(videoId) {
    return this.browser.delete(`videos/${videoId}`).then(({ statusCode }) => statusCode);
  };
};

Videos.prototype.castAll = function castAll(collection) {
  return collection.map(Videos.prototype.cast);
};

Videos.prototype.cast = function cast(data) {
  if (!data) {
    return null;
  }

  const video = new Video();
  video.videoId = data.videoId;
  video.title = data.title;
  video.description = data.description;
  video.public = data.public;
  video.panoramic = data.panoramic;
  video.mp4Support = data.mp4Support;
  video.tags = data.tags;
  video.metadata = data.metadata;
  video.source = data.source;
  video.publishedAt = data.publishedAt;
  video.assets = data.assets;

  return video;
};

Videos.prototype.castStatus = function cast(data) {
  if (!data) {
    return null;
  }

  const ingestStatus = new IngestStatus();
  ingestStatus.status = data.ingest.status;
  ingestStatus.filesize = data.ingest.filesize;
  ingestStatus.receivedBytes = data.ingest.receivedBytes;


  const encodingStatus = new EncodingStatus();
  encodingStatus.playable = data.encoding.playable;
  encodingStatus.qualities = data.encoding.qualities;
  encodingStatus.metadata = data.encoding.metadata;

  const videoStatus = new VideoStatus();
  videoStatus.ingest = ingestStatus;
  videoStatus.encoding = encodingStatus;

  return videoStatus;
};

module.exports = Videos;
