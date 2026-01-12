/**
 * TheSportsDB API Types
 * Type definitions for all TheSportsDB API responses
 */

export interface League {
  idLeague: string
  strLeague: string
  strSport: string
  strLeagueAlternate: string
}

export interface LeaguesResponse {
  leagues: League[]
}

export interface Season {
  strSeason: string
  strBadge?: string
}

export interface SeasonsWithBadgeResponse {
  seasons: Season[]
}

export interface Team {
  idTeam: string
  strTeam: string
  strTeamBadge: string
  strLeague: string
  strStadium: string
  intFormedYear: string
  strDescriptionEN: string
}

export interface TeamsResponse {
  teams: Team[]
}

export interface Player {
  idPlayer: string
  strPlayer: string
  strTeam: string
  strPosition: string
  strThumb: string
  dateBorn: string
}

export interface PlayersResponse {
  player: Player[]
}

export interface Event {
  idEvent: string
  strEvent: string
  strHomeTeam: string
  strAwayTeam: string
  intHomeScore: string
  intAwayScore: string
  dateEvent: string
  strTime: string
  strThumb: string
}

export interface EventsResponse {
  events: Event[]
}

export interface Standing {
  idStanding: string
  intRank: string
  idTeam: string
  strTeam: string
  strTeamBadge: string
  idLeague: string
  strLeague: string
  strSeason: string
  strForm: string
  strDescription: string
  intPlayed: string
  intWin: string
  intDraw: string
  intLoss: string
  intGoalsFor: string
  intGoalsAgainst: string
  intGoalDifference: string
  intPoints: string
  dateUpdated: string
}

export interface StandingsResponse {
  table: Standing[]
}
