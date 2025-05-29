export class Lobby {
  constructor (id) {
    this.id = id
    this.players = []
    this.board = Array(9).fill({ playerId: null, piece: null })
    this.playerTurn = null
  }

  addPlayer ({ name, id }) {
    this.players.push({ name, id, piece: this.players.length === 0 ? 'X' : 'O' })
    if (this.players.length === 1) {
      this.playerTurn = this.players[0]
    }
  }

  updateBoard ({ position }) {
    const { playerId, piece } = this.playerTurn
    this.board[position] = { playerId, piece }
    this.playerTurn = this.playerTurn.id === this.players[0].id ? this.players[1] : this.players[0]
  }
}

export class User {
  constructor (name, id) {
    this.name = name
    this.id = id
  }
}
