const axios = require('axios')

module.exports = function getDocumentStream(url, token) {
  const auth = token ? { Authorization: `Bearer ${token}` } : {}
  const userAgent = { 'User-Agent': `eleventy-plugin-sanity` }
  const headers = { ...userAgent, ...auth }

  return axios({
    method: 'get',
    responseType: 'stream',
    url,
    headers
  }).then(res => res.data)
}
