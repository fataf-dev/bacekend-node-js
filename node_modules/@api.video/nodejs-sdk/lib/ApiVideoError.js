class ApiVideoError extends Error {
  constructor(response) {
    const { statusCode, body: problemDetails } = response;

    super(problemDetails.title);

    this.problemDetails = problemDetails;
    this.code = statusCode;

    Error.captureStackTrace(this, ApiVideoError);
  }
}

module.exports = ApiVideoError;
