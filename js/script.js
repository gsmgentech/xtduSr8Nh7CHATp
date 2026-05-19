const playerInput = document.getElementById('playerInput')
const addPlayerBtn = document.getElementById('addPlayerBtn')
const playersList = document.getElementById('playersList')
const playerCount = document.getElementById('playerCount')

const startBtn = document.getElementById('startBtn')
const rerandomBtn = document.getElementById('rerandomBtn')
const backBtn = document.getElementById('backBtn')
const resetBtn = document.getElementById('resetBtn')

const sidebar = document.getElementById('sidebar')
const main = document.getElementById('main')

const teamA = document.getElementById('teamA')
const teamB = document.getElementById('teamB')

const waitingList = document.getElementById('waitingList')
const waitingBox = document.getElementById('waitingBox')

const deck = document.getElementById('deck')

let players = JSON.parse(localStorage.getItem('ml_players')) || []

function savePlayers(){
  localStorage.setItem(
    'ml_players',
    JSON.stringify(players)
  )
}

function updateCount(){
  playerCount.textContent =
  `${players.length} Players`
}

function renderPlayers(){

  playersList.innerHTML = ''

  players.forEach((player,index)=>{

    const isNew =
    player.toUpperCase().includes('NEW')

    const isPalo =
    player.toUpperCase().includes('PALO')

    const div = document.createElement('div')

    div.className = 'player'

    div.innerHTML = `
      <div>

        <div class="player-name">
          ${player}
        </div>

        <div class="player-tags">

          ${isNew ? `
            <div class="tag new-tag">
              NEWBIE
            </div>
          ` : ''}

          ${isPalo ? `
            <div class="tag palo-tag">
              PALO
            </div>
          ` : ''}

        </div>

      </div>

      <button
      class="remove-btn"
      onclick="removePlayer(${index})"
      >
      ✕
      </button>
    `

    playersList.appendChild(div)

  })

  updateCount()

}

function removePlayer(index){

  players.splice(index,1)

  savePlayers()

  renderPlayers()

}

window.removePlayer = removePlayer

function addPlayer(){

  const value = playerInput.value.trim()

  if(!value) return

  players.push(value)

  savePlayers()

  renderPlayers()

  playerInput.value = ''

  playerInput.focus()

}

addPlayerBtn.addEventListener('click', addPlayer)

playerInput.addEventListener('keypress', e=>{

  if(e.key === 'Enter'){

    addPlayer()

  }

})

function shuffle(array){

  for(let i=array.length - 1;i>0;i--){

    const j =
    Math.floor(Math.random() * (i + 1))

    ;[array[i],array[j]] =
    [array[j],array[i]]

  }

  return array

}

function hasConflict(team, player){

  const isNew =
  player.toUpperCase().includes('NEW')

  const isPalo =
  player.toUpperCase().includes('PALO')

  const existingNew =
  team.some(p =>
    p.toUpperCase().includes('NEW')
  )

  const existingPalo =
  team.some(p =>
    p.toUpperCase().includes('PALO')
  )

  if(isNew && existingNew){
    return true
  }

  if(isPalo && existingPalo){
    return true
  }

  return false

}

function validTeam(team){

  let newCount = 0
  let paloCount = 0

  team.forEach(player=>{

    if(
      player.toUpperCase().includes('NEW')
    ){
      newCount++
    }

    if(
      player.toUpperCase().includes('PALO')
    ){
      paloCount++
    }

  })

  return (
    newCount <= 1 &&
    paloCount <= 1
  )

}

function buildBalancedTeams(activePlayers){

  for(let tries=0;tries<3000;tries++){

    const shuffled =
    shuffle([...activePlayers])

    const a = []
    const b = []

    shuffled.forEach(player=>{

      if(
        a.length < 5 &&
        !hasConflict(a, player)
      ){

        a.push(player)

      }

      else if(
        b.length < 5 &&
        !hasConflict(b, player)
      ){

        b.push(player)

      }

      else if(a.length < 5){

        a.push(player)

      }

      else if(b.length < 5){

        b.push(player)

      }

    })

    if(
      a.length === 5 &&
      b.length === 5 &&
      validTeam(a) &&
      validTeam(b)
    ){

      return {
        teamA:a,
        teamB:b
      }

    }

  }

  return null

}

function createCard(player,delay){

  const div = document.createElement('div')

  div.className = 'card'

  div.style.animationDelay = `${delay}ms`

  div.innerHTML = `
    <div class="card-name">
      ${player}
    </div>

    <div class="card-role">
      READY FOR BATTLE
    </div>
  `

  return div

}

function createWaiting(player){

  const div = document.createElement('div')

  div.className = 'waiting-player'

  div.textContent = player

  return div

}

function sleep(ms){

  return new Promise(resolve=>setTimeout(resolve,ms))

}

async function generateTeams(){

  if(players.length < 10){

    alert('Minimum 10 players required.')

    return

  }

  sidebar.style.display = 'none'

  main.classList.add('active')

  teamA.innerHTML = ''
  teamB.innerHTML = ''
  waitingList.innerHTML = ''

  deck.classList.add('active')

  await sleep(1800)

  deck.classList.remove('active')

  const shuffled = shuffle([...players])

  const selected =
  shuffled.slice(0,10)

  const waiting =
  shuffled.slice(10)

  const result =
  buildBalancedTeams(selected)

  if(!result){

    alert(
      'Unable to build balanced teams.'
    )

    return

  }

  for(let i=0;i<5;i++){

    const cardA =
    createCard(
      result.teamA[i],
      i * 100
    )

    teamA.appendChild(cardA)

    await sleep(220)

    const cardB =
    createCard(
      result.teamB[i],
      i * 100
    )

    teamB.appendChild(cardB)

    await sleep(220)

  }

  if(waiting.length > 0){

    waitingBox.style.display = 'block'

    waiting.forEach(player=>{

      waitingList.appendChild(
        createWaiting(player)
      )

    })

  }else{

    waitingBox.style.display = 'none'

  }

}

startBtn.addEventListener(
  'click',
  generateTeams
)

rerandomBtn.addEventListener(
  'click',
  generateTeams
)

backBtn.addEventListener('click',()=>{

  sidebar.style.display = 'block'

  main.classList.remove('active')

})

resetBtn.addEventListener('click',()=>{

  players = []

  localStorage.removeItem('ml_players')

  renderPlayers()

  teamA.innerHTML = ''
  teamB.innerHTML = ''
  waitingList.innerHTML = ''

  sidebar.style.display = 'block'

  main.classList.remove('active')

})

window.addEventListener(
  'DOMContentLoaded',
  ()=>{

    renderPlayers()

  }
)