const { body } = document
//canvas code
const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')

const width = 700
const height = 500

const screenWidth = window.screen.width
const canvasPosition = screenWidth / 2 - width / 2
const isMobile = window.matchMedia('(max-width: 600px)')

const gameOverDiv = document.createElement('div')

//paddle code
const paddleHeight = 10
const paddleWidth = 50
const paddleDiff = 25
let paddleBottomX = 225
let paddleTopX = 225
let playerMoved = false
let paddleContact = false

//ball code
let ballX = 250
let ballY = 350
const ballRadius = 5

// speed
let speedY
let speedX
let trajectoryX
let computerSpeed

// change Mobile Settings
if (isMobile.matches) {
  speedY = -2
  speedX = speedY
  computerSpeed = 3
} else {
  speedY = -1
  speedX = speedY
  computerSpeed = 5
}

// Score
let playerScore = 0
let computerScore = 0
const winningScore = 5
let isNewGame = true
let isGameOver = true


//generating canvas

const renderCanvas = () => {
    //canvas background
    context.fillStyle = 'black'
    context.fillRect( 0, 0, width, height)

    //paddle color
    context.fillStyle = 'white'

    //player paddle
    context.fillRect(paddleBottomX, height - 20, paddleWidth, paddleHeight)

    //bot paddle
    context.fillRect(paddleTopX, 10, paddleWidth, paddleHeight)


    //ball 
    context.beginPath()
    context.arc(ballX, ballY, ballRadius, 2 * Math.PI, false)
    context.fillStyle = 'white'
    context.fill()

    //score

    context.font = '32px Courier New'
    context.fillText(playerScore, 20, canvas.height / 2 + 50)
    context.fillText(botScore, 20, canvas.height / 2 - 30)


}

const createCanvas = () => {
    canvas.width = width
    canvas.height = height
    body.appendChild(canvas)
    renderCanvas()
}

const botAI = () => {
    if (playerMoved) {
        if (paddleTopX + paddleDiff < ballX) {
            paddleTopX += computerSpeed
        } else {
            paddleTopX -= computerSpeed
        }
    }
}

const ballMove = () => {
    // Vertical Speed
    ballY += - speedY
    // Horizontal Speed
    if (playerMoved && paddleContact) {
        ballX += speedX
    }
}

const ballReset = () => {
    ballX = width / 2
    ballY = height / 2
    speedY = -3
    paddleContact = false
}

const ballBoundaries = () => {
    // Bounce off Left Wall
    if (ballX < 0 && speedX < 0) {
      speedX = -speedX
    }
    // Bounce off Right Wall
    if (ballX > width && speedX > 0) {
      speedX = -speedX
    }
    // Bounce off player paddle (bottom)
    if (ballY > height - paddleDiff) {
      if (ballX > paddleBottomX && ballX < paddleBottomX + paddleWidth) {
        paddleContact = true
        // Add Speed on Hit
        if (playerMoved) {
          speedY -= 1
          // Max Speed
          if (speedY < -5) {
            speedY = -5
            computerSpeed = 6
          }
        }
        speedY = -speedY
        trajectoryX = ballX - (paddleBottomX + paddleDiff)
        speedX = trajectoryX * 0.3
      } else if (ballY > height) {
        // Reset Ball, add to Computer Score
        ballReset()
        botScore++
      }
    }
    // Bounce off computer paddle (top)
    if (ballY < paddleDiff) {
      if (ballX > paddleTopX && ballX < paddleTopX + paddleWidth) {
        // Add Speed on Hit
        if (playerMoved) {
          speedY += 1
          // Max Speed
          if (speedY > 5) {
            speedY = 5
          }
        }
        speedY = -speedY
      } else if (ballY < 0) {
        // Reset Ball, add to Player Score
        ballReset()
        playerScore++
      }
    }
}

const showGameOverMsg = (winner) => {
    //hide canvas
    canvas.hidden = true

    gameOverDiv.textContent = ''
   

    const title = document.createElement('h1')
    title.textContent = `${winner} has won!`

    const playAgainBtn = document.createElement('button')
    playAgainBtn.setAttribute('onclick', 'startGame()')
    playAgainBtn.textContent = 'Play Again'

    gameOverDiv.append(title, playAgainBtn)
    body.appendChild(gameOverDiv)


}

const gameOver = () => {
    if(playerScore === winningScore || botScore === winningScore) {
        isGameOver = true

        const winner = playerScore === winningScore ? 'Player' : 'Bot'
        showGameOverMsg(winner)
    
    }
}   


const animate = () => {
    renderCanvas()
    ballMove()
    ballBoundaries()
    botAI()
    gameOver()
    if (!isGameOver){
        window.requestAnimationFrame(animate)

    }

}

const startGame = () => {
    if (isGameOver && !isNewGame) {
        body.removeChild(gameOverDiv)
        canvas.hidden = false
    }
    isGameOver = false
    isNewGame = false
    playerScore = 0
    botScore = 0
    ballReset()

    createCanvas()
    animate()

    canvas.addEventListener('mousemove', (e) => {
        playerMoved = true
        // Compensate for canvas being centered
        paddleBottomX = e.clientX - canvasPosition - paddleDiff
        if (paddleBottomX < paddleDiff) {
          paddleBottomX = 0
        }
        if (paddleBottomX > width - paddleWidth) {
          paddleBottomX = width - paddleWidth
        }
        // Hide Cursor
        canvas.style.cursor = 'none'
    })
    

}

startGame()