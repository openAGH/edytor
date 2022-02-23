let OutputFileFinder
const Path = require('path')
const _ = require('lodash')
const { spawn } = require('child_process')
const logger = require('logger-sharelatex')

module.exports = OutputFileFinder = {
  findOutputFiles(resources, directory, callback) {
    const incomingResources = new Set(resources.map(resource => resource.path))

    OutputFileFinder._getAllFiles(directory, function (error, allFiles) {
      if (allFiles == null) {
        allFiles = []
      }
      if (error) {
        logger.err({ err: error }, 'error finding all output files')
        return callback(error)
      }
      const outputFiles = []
      for (const file of allFiles) {
        if (
          !incomingResources.has(file) ||
          file.match(/\.(png|jpeg|jpg|eps|jbig2|jp2|j2k|jpf|jpm|jpg2|j2c|jpc|jpx|mj2|pdf|svg)$/i) // OPENAGH: makes images visible as output files, it is neccessery from HTML perspective due to proper img src attribute
        ) {
          outputFiles.push({
            path: file,
            type: Path.extname(file).replace(/^\./, '') || undefined,
          })
        }
      }
      callback(null, outputFiles, allFiles)
    })
  },

  _getAllFiles(directory, callback) {
    callback = _.once(callback)
    // don't include clsi-specific files/directories in the output list
    const EXCLUDE_DIRS = [
      '-name',
      '.cache',
      '-o',
      '-name',
      '.archive',
      '-o',
      '-name',
      '.project-*',
    ]
    const args = [
      directory,
      '(',
      ...EXCLUDE_DIRS,
      ')',
      '-prune',
      '-o',
      '-type',
      'f',
      '-print',
    ]
    logger.log({ args }, 'running find command')

    const proc = spawn('find', args)
    let stdout = ''
    proc.stdout.setEncoding('utf8').on('data', chunk => (stdout += chunk))
    proc.on('error', callback)
    proc.on('close', function (code) {
      if (code !== 0) {
        logger.warn(
          { directory, code },
          "find returned error, directory likely doesn't exist"
        )
        return callback(null, [])
      }
      let fileList = stdout.trim().split('\n')
      fileList = fileList.map(function (file) {
        // Strip leading directory
        return Path.relative(directory, file)
      })
      callback(null, fileList)
    })
  },
}
