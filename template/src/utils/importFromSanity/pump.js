const pumpIt = require('pump')

module.exports = function pump(streams) {
  return new Promise((resolve, reject) =>
    pumpIt(streams, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  )
}
