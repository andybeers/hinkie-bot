'use-strict'
const url = require('url')
const axios = require('axios')

const teamIdMap = {
  blazers: 25,
  portland: 25,
  philadelphia: 23,
  sixers: 23,
  '76ers': 23,
  test: 7,
}

module.exports = (req, res) => {
  const { query } = url.parse(req.url, true)
  const { team = 'sixers' } = query
  const teamId = teamIdMap[team] || 23

  const apiUrl = `https://www.balldontlie.io/api/v1/games?team_ids[]=${teamId}&dates[]=2019-03-14`

  axios
    .get(apiUrl)
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

      res.end(
        `The score is: ${home_team.name}: ${home_team_score} -- ${
          visitor_team.name
        }: ${visitor_team_score}`,
      )
    })
    .catch(() => res.end('We goofed'))
}
