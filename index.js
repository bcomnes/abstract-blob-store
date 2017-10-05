var from = require('from2-array')
var concat = require('concat-stream')
var crypto = require('crypto')

module.exports = MemBlobs

function MemBlobs() {
  if (!(this instanceof MemBlobs)) return new MemBlobs()
  this.data = {}
}

MemBlobs.prototype.createWriteStream = function(opts, cb) {
  if (typeof opts === 'function') return this.createWriteStream(null, opts)
  if (typeof opts === 'string') opts = {key:opts}
  if (!opts) opts = {}
  if (!cb) cb = noop

  var self = this
  return concat(done)
  
  function done(contents) {
    var key = opts.key || crypto.createHash('sha1').update(contents).digest('hex')
    self.data[key] = contents
    cb(null, {key: key, size: contents.length, name: opts.name})
  }
}

MemBlobs.prototype.createReadStream = function(opts) {
  if (typeof opts === 'string') opts = {key:opts}

  var buff = this.data[opts.key]
  var stream
  if (!buff) {
    stream = from([])
    var error = new Error('Blob not found')
    error.notFound = true
    stream.destroy(error)
  } else {
    stream = from([buff])
  }
  return stream
}

MemBlobs.prototype.exists = function(opts, cb) {
  if (typeof opts === 'string') opts = {key:opts}
  cb(null, !!this.data[opts.key])
}

MemBlobs.prototype.remove = function(opts, cb) {
  if (!cb) cb = noop
  delete this.data[opts.key]
  cb()
}

function noop() {}