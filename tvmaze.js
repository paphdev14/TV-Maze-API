/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
  // console.log(response.data);
  let showData = response.data.map(showObj =>{
    // console.log(showObj.show.name);
    return{
      id: showObj.show.id,
      name: showObj.show.name,
      summary: showObj.show.summary,
      image: showObj.show.image ? showObj.show.image.medium : "https://tinyurl.com/tv-missing"
    }
  });
  return showData;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
       <img class="card-img-top" src="${show.image}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary get-episodes">Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();
  // document.getElementById('episodes-area').style.display = 'none';

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodes(id) {
//   // TODO: get episodes from tvmaze
//   //       you can get this by making GET request to
//   //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
//   const episodeApi = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
//   console.log(episodeApi.data);
//   let episodeIDs = episodeApi.data;
//   let episodes = episodeIDs.map(episode =>{
//     console.log(episode.name);
//     // TODO: return array-of-episode-info, as described in docstring above
//     return{
//       id: episode.id,
//       date: episode.airdate,
//       name: episode.name,
//       season: episode.season,
//       number: episode.number
//     }
//   })
//   return episodes;
// }

// /** Populate episodes list:
//  *     - given list of episodes, add episode to DOM
//  */

// function populateEpisodes(episodes) {
//   const episodesList = document.getElementById('episodes-list');
//   console.log(episodesList);
//   let item = `<li>
//   ${episodes.name}
//   (season ${episodes.season}, episode ${episodes.number})
// </li>`
// episodesList.append(item);
// $("#episodes-area").show();

// }

async function getEpisodes(id) {
  let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  let episodes = response.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));

  return episodes;
}


/** Populate episodes list:
 *     - given list of episodes, add espiodes to DOM
 */

function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();
    
  for (let episode of episodes) {
    let $item = $(
      `<li>
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
      `);

    $episodesList.append($item);
  }

  $("#episodes-area").show();
}


/** Handle display episodes:
 *    - show episodes area
 *    - get list of matching episode and show in epidoes list
 */

const btn = document.querySelector('.get-episodes');
document.getElementById('shows-list').addEventListener('click',  async function handleClick(e){
  // console.log(e.target.parentElement.parentElement.dataset.showId);
  let showID = e.target.parentElement.parentElement.dataset.showId;
  if(e.target.classList.contains('get-episodes')){
    let episode = await getEpisodes(showID);
  //   // console.log(showID);
    populateEpisodes(episode);
  }
})

// populateEpisodes();
// getEpisodes(1767);