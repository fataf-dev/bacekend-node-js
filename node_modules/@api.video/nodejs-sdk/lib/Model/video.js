class Video {
  constructor() {
    this.videoId = null;
    this.title = null;
    this.description = null;
    this.public = null;
    this.panoramic = null;
    this.mp4Support = null;
    this.tags = [];
    this.metadata = [];
    this.source = [];
    this.assets = {};
    this.publishedAt = null;
  }
}

module.exports = Video;
