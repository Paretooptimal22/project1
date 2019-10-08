let mood = ``
let list = []
let newList = []
let favList = []
let favorited = false

//generates a new list of 10 songs from the array of  'list'
const randomList = _ => {
  for (let i = 0; i < 10; i++) {
    let newsong = list[Math.floor(Math.random() * list.length)]
    if(newList.indexOf(newsong) === -1)
    newList.push(newsong)
  }
  console.log(newList)
}

//renders 'newList' array of songs on page with dataset values
const renderList = _ => {
  for (let i = 0; i < newList.length; i++) {
    let trackList = document.createElement(`ul`)
    trackList.innerHTML = `
          <a href="#info" class="collection-item">
          Artist: <span>${newList[i].name}</span>
          <br>
          Song: <span>${newList[i].song}</span></a>
          <a data-target="info" class= "btn-small modal-trigger moreInfo waves-effect waves-light"
           data-artist="${newList[i].name}" 
           data-song="${newList[i].song}">More</a>
          `
    document.getElementById(`main-container`).append(trackList)
  }
}

let header = () => {
  let title = document.createElement(`div`)
  // title.id = `moodTitle`
  title.className = `row center`
  if (mood === `sad`) {
    mood = `gloom`
  } else if (mood === `hardcore`) {
    mood = `aggro`
  } else if (mood === `indie`) {
    mood = `wild`
  } else if (mood === `edm`) {
    mood = `amped`
  } else if (mood === `classical`) {
    mood = `classy`
  }
  title.innerHTML = `
  <h4 id="moodTitle">${mood.toUpperCase()}</h4>`
  document.getElementById(`main-container`).append(title)
}

//onclick of moodBtn, a fetch request is made to grab 50 songs relating to that mood
document.addEventListener(`click`, event => {
  if (event.target.className === `moodBtn`) {
    mood = event.target.id
    let url = ` https://ws.audioscrobbler.com/2.0/?method=tag.getTopTracks&tag=${mood}&api_key=94d64342e57a2bf09615e32fc90ca58f&format=json`

    //loading animation
    setTimeout(() => {
      document.getElementById('main-container').innerHTML = `
        <p id="loading">Generating Your Playlist</p>
         <div class="progress">
            <div class="indeterminate"></div>
            </div>  
        `
    }, 100)
    fetch(url)
      .then(r => r.json())
      .then(data => {
        //puts the artist and song title into an object and pushes that object into array 'list'
        for (let i = 0; i < 50; i++) {
          list.push({ 'name': data.tracks.track[i].artist.name, 'song': data.tracks.track[i].name })
        }
        randomList()
        //manufactured load time
        setTimeout(() => {
          document.getElementById('main-container').innerHTML = ``
          header()
          renderList()
        }, 1200);
      })
      .catch(e => console.log(e))
  }
})



// event listener for getting lyrics once you click "INFO" button
document.addEventListener(`click`, event => {
  if (event.target.className.includes(`btn-small`)) {
    // Initialize Modal
    M.Modal.init(document.querySelectorAll(`.modal`), {})
    // opens modal
    M.Modal.getInstance(document.getElementById(`info`)).open()
    let artistName = event.target.dataset.artist
    let songTitle = event.target.dataset.song
    // displays artist & song in modal
    document.getElementById(`artistName`).innerHTML = artistName
    document.getElementById(`trackName`).innerHTML = songTitle
    document.getElementById(`modalInfo`).innerHTML = ``
    favorited = false
if (favorited === false){
  document.getElementById('favorite').innerHTML = 'favorite_border'
}
    // gets the lyrics
    fetch(`https://api.lyrics.ovh/v1/${artistName}/${songTitle}`)
      .then(r => r.json())
      .then(data => {

         document.getElementById(`showLyric`).addEventListener(`click`, event => {
          document.getElementById(`modalInfo`).innerHTML = data.lyrics
        })
      })
      .catch(e => console.log(e))
    // fetch request to get preview &info
    fetch(`https://quinton-spotify-api.herokuapp.com/search?t=track&q=${songTitle}`)
      .then(r => r.json())
      .then(data => {
        // this filteres the data we get back from spotify and make sures that the artist name is = artistname `clicked`
        let infoFiltered = data.filter(artist => {
          let response = false
          artist.artists.forEach(data => {
            if (artistName.toLowerCase() === data.name.toLowerCase()) {
              response = true
            }
          })
          return response
        })
        let preview = infoFiltered[0].preview_url
        // event listener for preview 

        document.getElementById(`showPreview`).addEventListener(`click`, event => {
          if (preview === null) {
            document.getElementById(`modalInfo`).textContent = `Sorry! No Preview Available!`
          } else {
            document.getElementById(`modalInfo`).innerHTML = `
              <div class="video-container">
              <iframe width="853" height="480" src="${preview}" frameborder="0" allowfullscreen></iframe>
              </div>`
          }
        })

        // event listener for info card
        document.getElementById(`showInfo`).addEventListener(`click`, event => {
          document.getElementById(`modalInfo`).innerHTML = ` 
          <div class="row">
            <div class="col s12 m7">
              <div class="card">
                <div class="card-image">
                  <img src=" ${infoFiltered[0].album.images[0].url}">
                </div>
              <div class="card-content">
                <p>Album: ${infoFiltered[0].album.name}</p>
                <p>Released: ${infoFiltered[0].album.release_date}</p>
              </div>
            </div>
          </div>
        </div>`
        })
      })
      .catch(e => console.log(e))
  }
})
// favorite selection
let faveArr = []
let faveSong = ``
document.getElementById('favorite').addEventListener('click', event => {
  if (favorited === false) {
    favorited = true
    event.target.innerHTML = `favorite`
    let faveSong = document.getElementById(`trackName`).textContent
    faveArr.push(faveSong)
    console.log(faveArr)
  } else if (favorited === true) {
    favorited = false
    event.target.innerHTML = `favorite_border`
  }
})
  
  localStorage.setItem(`favoriteSong`, faveArr)
  
  // event.preventDefault()
  // let song = document.getElementById('trackName').value
  // localStorage.setItem('song', trackName)
  // console.log(localStorage.setItem('song', trackName))
  // document.getElementById('trackName').value = ' '
  // localStorage.setItem('song', JSON.stringify(song))

