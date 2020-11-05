const logger = require('./logger')
const fs = require('fs')
const p = require('path')
const homedir = process.env.HOME || require('os').homedir()
const dbPath = p.join(homedir, '.todo')
const db = {
  read(path = dbPath) {
    logger.debug('read db')
    return new Promise((resolve, reject) => {
        fs.readFile(path, {flag: 'a+'}, (error, data) => {
          if (error) {
            if (error.code === 'EPERM') {
              logger.error('can not write db file')
            }
            return reject(error)
          }
          let list
          try {
            list = JSON.parse(data.toString())
          } catch (error2) {
            logger.error('json parse error')
            list = []
          }
          resolve(list)
        })
      }
    )
  },
  write(list, path = dbPath) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, JSON.stringify(list) + '\n', (error) => {
        if (error) {
          return reject(error)
        }
        resolve()
      })
    })
  }
}
module.exports = db

function createDatabase() {
  logger.debug('create db')
  const defaultContent = JSON.stringify({})
  return new Promise((resolve, reject) => {
    fs.writeFile(dbPath, defaultContent, (err) => {
      if (err) reject(err)
      else resolve(defaultContent)
    })
  })
}

function onCreateDatabaseError(err) {
  logger.debug(`can not create ${dbPath}`)
  throw err
}