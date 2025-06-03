export class Lobby {
  constructor (id) {
    this.id = id
    this.players = []
    this.board = Array(9).fill({ id: null, piece: null })
    this.playerTurn = null
    this.rematch = []
    this.winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]
  }

  addPlayer ({ name, id }) {
    this.players.push({ name, id, piece: this.players.length === 0 ? 'X' : 'O' })
    if (this.players.length === 1) {
      this.playerTurn = this.players[0]
    }
  }

  updateBoard ({ position }) {
    const { id, piece } = this.playerTurn
    this.board[position] = { id, piece }
    this.playerTurn = this.playerTurn.id === this.players[0].id ? this.players[1] : this.players[0]
  }

  resetGame () {
    this.board = Array(9).fill({ id: null, piece: null })
    this.rematch = []
  }

  checkGameResult ({ userId }) {
    console.log(this.playerTurn)
    const userMoves = this.board
      .map((data, index) => {
        return data.id === userId ? index : null
      })
      .filter((data) => data !== null)

    // console.log(userMoves)

    // check for win
    // this.winningCombinations.forEach((combination) => {
    for (const combination of this.winningCombinations) {
      if (combination.every((elm) => userMoves.includes(elm))) {
        return {
          status: 'win',
          winner: this.players.find(player => player.id === userId)
        }
      }
    }

    // check for draw
    if (this.board.every((data) => data.piece)) {
      return {
        status: 'draw'
      }
    }
    return null
  }
}

export class User {
  constructor (name, id) {
    this.name = name
    this.id = id
  }
}
