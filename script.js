let board = ['', '', '', '', '', '', '', '', '']
let currentPlayer = ''
let gameActive = false
let isFirstMoveByUser = true // Initialize as true
let chosenSymbol = ''

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

const cells = document.querySelectorAll('.cell')
const statusDisplay = document.getElementById('status')
const symbolButtons = document.querySelectorAll('.symbol-buttons button')
const winnerPopup = document.getElementById('winnerPopup')
const winnerMessage = document.getElementById('winnerMessage')
const startButton = document.getElementById('startButton') // Added reference to Start Game button

function chooseSymbol (symbol) {
  chosenSymbol = symbol
  currentPlayer = chosenSymbol
  statusDisplay.innerText = `Your turn (${chosenSymbol})`
  symbolButtons.forEach(button => {
    button.disabled = true
    button.classList.add('disabled')
  })
}

function startGame () {
  if (chosenSymbol === '') {
    alert('Please choose a symbol first!')
    return
  }

  gameActive = true
  isFirstMoveByUser = Math.random() < 0.5 // Randomly decide who starts
  if (!isFirstMoveByUser) {
    currentPlayer = chosenSymbol === 'X' ? 'O' : 'X'
    statusDisplay.innerText = `Computer's turn (${currentPlayer})`
    setTimeout(computerMove, 1000) // Delay computer move slightly for better visibility
  } else {
    statusDisplay.innerText = `Your turn (${chosenSymbol})`
  }

  startButton.disabled = true // Disable Start Game button after starting
}

function cellClicked (cellIndex) {
  if (!gameActive || board[cellIndex] !== '') return

  board[cellIndex] = currentPlayer
  cells[cellIndex].innerText = currentPlayer
  handleResultValidation()

  if (gameActive) {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X'
    if (currentPlayer !== chosenSymbol) {
      statusDisplay.innerText = `Computer's turn (${currentPlayer})`
      setTimeout(computerMove, 1000) // Delay computer move slightly for better visibility
    } else {
      statusDisplay.innerText = `Your turn (${chosenSymbol})`
    }
  }
}

function computerMove () {
  let emptyCells = board.reduce((acc, cell, index) => {
    if (cell === '') acc.push(index)
    return acc
  }, [])

  let randomIndex = Math.floor(Math.random() * emptyCells.length)
  cellClicked(emptyCells[randomIndex])
}

function handleResultValidation () {
  let roundWon = false
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i]
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true
      break
    }
  }

  if (roundWon) {
    let winner = currentPlayer === chosenSymbol ? 'You' : 'The Computer'
    showWinnerPopup(`${winner} have won!`)
    gameActive = false
    startButton.disabled = false // Enable Start Game button on game end
    return
  }

  let roundDraw = !board.includes('')
  if (roundDraw) {
    showWinnerPopup(`It's a draw!`)
    gameActive = false
    startButton.disabled = false // Enable Start Game button on game end
    return
  }
}

function showWinnerPopup (message) {
  winnerMessage.innerText = message
  winnerPopup.classList.add('active')
}

function closePopup () {
  winnerPopup.classList.remove('active')
  resetGame()
}

function resetGame () {
  board = ['', '', '', '', '', '', '', '', '']
  isFirstMoveByUser = Math.random() < 0.5
  gameActive = false
  chosenSymbol = ''
  currentPlayer = ''
  symbolButtons.forEach(button => {
    button.disabled = false
    button.classList.remove('disabled')
  })
  statusDisplay.innerText = 'Choose your symbol!'
  cells.forEach(cell => (cell.innerText = ''))
  startButton.disabled = false // Enable Start Game button on game reset
}
