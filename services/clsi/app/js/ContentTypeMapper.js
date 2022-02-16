/* eslint-disable
    no-unused-vars,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
let ContentTypeMapper
const Path = require('path')

// here we coerce html, css and js to text/plain,
// otherwise choose correct mime type based on file extension,
// falling back to octet-stream
module.exports = ContentTypeMapper = {
  map(path) {
    switch (Path.extname(path)) {
      // OPENAGH: We need to have ability to browse generated HTML
      case '.html':
        return 'text/html'
      case '.txt':
      case '.js':
      case '.css':
      case '.svg':
        return 'text/plain'
      case '.csv':
        return 'text/csv'
      case '.pdf':
        return 'application/pdf'
      case '.png':
        return 'image/png'
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg'
      case '.tiff':
        return 'image/tiff'
      case '.gif':
        return 'image/gif'
      default:
        return 'application/octet-stream'
    }
  },
}
