const axios = require('axios');

class SportsManagerClient {
    async fetchFixturesByCompetitionId(competitionId) {
        const url = `https://admin.sportsmanager.ie/dataFeed/index.php?feedType=fixture&type=competition_fixtures_results&competition_id=${competitionId}`;
        return axios
            .get(url)
            .then(result => {
                return result.data.data;
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                console.log(`SportsManagerClient.fetchFixturesByCompetitionId(${competitionId})`);
            });
    }

    async summarizeCompetition(competitionId) {
        const url = `https://admin.sportsmanager.ie/dataFeed/index.php?feedType=fixture&type=competition_fixtures&competition_id=${competitionId}`;
        const teams = new Set();
        const competition = {
            competition_id: '',
            competition_name: '',
            competition_short_name: '',
            competition_year: '',
            teams: [],
            fixtures: [],
            featureCount: 0,
        }
        
        await axios
            .get(url)
            .then(result => {
                result.data.data.forEach(fixture => {
                    competition.featureCount++;
                    competition.competition_id = fixture.competitionId;
                    competition.competition_name = fixture.competitionName;
                    competition.competition_short_name = fixture.competitionShortName
                    competition.competition_year = fixture.compYear;
                    teams.add(fixture.homeTeam);
                    teams.add(fixture.awayTeam);
                    competition.fixtures.push({
                        id: fixture.fixtureId,
                        date: new Date(fixture.fixtureDate*1000),
                        homeTeam: fixture.homeTeam,
                        awayTeam: fixture.awayTeam,
                        venue: fixture.venue
                    })
                })
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                console.log(`SportsManagerClient.fetchFixturesByCompetitionId(${competitionId})`);
            });

        teams.forEach(teamName => {
            competition.teams.push(teamName);
        });

        return competition;
    }
}

const sportsManagerClient = new SportsManagerClient();
module.exports = sportsManagerClient;
