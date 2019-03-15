'use-strict'

const { parse } = require('querystring')
const axios = require('axios')

const teamIdMap = {
  blazers: 25,
  portland: 25,
  philadelphia: 23,
  sixers: 23,
  '76ers': 23,
  test: 7,
}

const baseApiUrl = 'https://www.balldontlie.io/api/v1'

// Promise-wrapped body-parsing function
function bodyParser(request) {
  const FORM_URLENCODED = 'application/x-www-form-urlencoded'

  return new Promise((res, rej) => {
    if (request.headers['content-type'] === FORM_URLENCODED) {
      let body = ''
      request.on('data', chunk => {
        body += chunk.toString()
      })
      request.on('end', () => {
        res(parse(body))
      })
    } else {
      rej(new Error('Wrong content-type'))
    }
  })
}

module.exports = async (req, res) => {
  const { text } = await bodyParser(req)
  const requestTeam = text.split(' ')[0]
  const teamId = teamIdMap[requestTeam] || 23

  const endpoint = `${baseApiUrl}/games?team_ids[]=${teamId}&dates[]=2019-03-14`

  axios
    .get(endpoint)
    .then(({ data }) => {
      if (!data || !data.data || !data.data.length) {
        return res.end('No game found')
      }

      const { data: gamesArray } = data
      const {
        home_team,
        home_team_score,
        visitor_team,
        visitor_team_score,
      } = gamesArray[0]

      const responseObj = {
        response_type: 'in_channel',
        text: `The score is: ${home_team.name}: ${home_team_score} -- ${
          visitor_team.name
        }: ${visitor_team_score}`,
        attachments: [{ text: 'Game is over' }],
      }

      res.writeHead(200, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify(responseObj))
    })
    .catch(() => res.end('We goofed'))
}
