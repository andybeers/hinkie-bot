const http = require('http')
const scoreLambda = require('./score')

const server = http.createServer(scoreLambda).listen(3000, () => {
  console.log('server started on port 3000!')
})
