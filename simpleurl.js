const redirect = (request) => {
  const location = request.querystring ? `${request.uri}/?${request.querystring}` : `${request.uri}/`

  return {
    status: '301',
    statusDescription: 'Moved Permanently',
    headers: {
      location: [{
        key: 'Location',
        value: location
      }]
    }
  };
}

module.exports.handleIndexes = (uri) => {
  if (uri.endsWith('/')) {
    console.log(`'index.html' appended to request.uri '${uri}': ${uri}index.html`);
    return `${uri}index.html`;
  }

  return uri;
}

module.exports.handleRedirect = (request) => {
  if (!request.uri.endsWith('/') && !request.uri.includes('.')) {
    console.log(`301 redirect ${request.uri} to ${request.uri}/`);
    return redirect(request);
  }
}
