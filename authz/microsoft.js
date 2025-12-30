function isAuthorized(decoded, request, unauthorized, internalServerError, config) {
  return request;
}

function getSubject(decoded) {
  return decoded.payload.upn || decoded.payload.sub;
}

exports.isAuthorized = isAuthorized;
exports.getSubject = getSubject;
