import crypto from 'crypto'
import readlineSync from 'readline-sync'

let startValues = process.argv.slice(2)

class startGame {
  constructor() {
    if (startValues.length < 3 || startValues.length % 2 == 0) {
      console.log('Please enter an odd number of arguments, no less than 3 (e.g. rock paper scissors)')
      return
    }
  
    let numberOfDuplicates = 0
    startValues.forEach(value => {
      if (startValues.indexOf(value) !== startValues.lastIndexOf(value)) numberOfDuplicates += 1
    })

    if (numberOfDuplicates > 0) {
      console.log('You have entered duplicate arguments, please enter at least three unique arguments (e.g. rock paper scissors)')
      return
    }
    new getHMACKey()
    new doComputersStep()
    new getHMAC()
    new createMenu()
    new doUserStep()
  }
}

let key
let computerStep

class getHMACKey {
  constructor() {
    key = crypto.randomBytes(32).toString('hex')
  }
}

class doComputersStep {
  constructor() {
    let computerStepNumber = Math.round(1 - 0.5 + Math.random() * (startValues.length - 1 + 1))
    computerStep = startValues[computerStepNumber - 1]
  }
}

class getHMAC {
  constructor() {
    let newKey = key + computerStep

    let HMAC = crypto.createHash('sha256').update(newKey).digest('hex')
    console.log(`HMAC: ${HMAC}`)
  }
}

class createMenu {
  constructor() {
    console.log('Available moves:')
    startValues.forEach(val => {
      console.log(`${startValues.indexOf(val)+1} - ${val}`)
    })
    console.log('0 - exit')
    console.log('? - help')
  }
}

let userStep

class doUserStep {
  constructor() {
    let userStepNumber = readlineSync.question('Enter your move: ');
    userStep = startValues[userStepNumber - 1]
  
    if (userStepNumber > 0 && userStepNumber <= startValues.length) {
      console.log(`Your move: ${userStep}`)
      console.log(`Computer move: ${computerStep}`)
      new findWinner()
    } else if (userStepNumber == 0) {
      return
    } else if (userStepNumber == '?') {
      new createTable()
      new createMenu()
      new doUserStep()
    } else {
      new createMenu()
      new doUserStep()
    }
  }
}

class findWinner {
  constructor() {
    if (computerStep == userStep) {
      console.log('Draw!')
    } else if ((userStep > computerStep && userStep - computerStep <= startValues.length / 2) || (userStep < computerStep && computerStep - userStep > startValues.length / 2)) {
      console.log('You win!') 
    } else {
      console.log('You lose!') 
    }
    console.log(`HMAC key: ${key}`)
  }
}

class createTable {
  constructor() {
    let table = []
    let computerPart = ['PC/US'].concat(startValues)
    table.push(computerPart)
  
    let userPart = []

    startValues.forEach(i => {
      userPart = [i]

      computerPart.forEach(x => {

        if (x == 'PC/US')  return

        if (startValues.indexOf(x) == startValues.indexOf(i)) {
          userPart.push('draw') 
        } else if ((startValues.indexOf(i) > startValues.indexOf(x) && startValues.indexOf(i) - startValues.indexOf(x) <= startValues.length / 2) || (startValues.indexOf(i) < startValues.indexOf(x) && startValues.indexOf(x) - startValues.indexOf(i) > startValues.length / 2)) {
          userPart.push('wone')
        } else {
          userPart.push('lose')
        }
      })
      table.push(userPart)
    })
    console.table(table)
  }
}

new startGame()