var client = new elasticsearch.Client({
  host: '128.84.8.214:9200',
  log: 'trace'
});

client.ping({
  requestTimeout: 30000,
}, function (error) {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});

// For search page, index.html

function doSearch(manualSearch) {
  // Clear out all current cards
  var results = document.getElementById("results");
  var cNode = results.cloneNode(false);
  results.parentNode.replaceChild(cNode ,results);

  // Call Elastic Search
  results = document.getElementById("results");
  var searchTerms = manualSearch || document.getElementById("search").value;
  client.search({
    index: "watermarks",
    q: searchTerms
  }).then( (response) => {
    // For each hit, draw a card
    response.hits.hits.forEach( (hit) => {
      var cell = document.createElement("div");
      cell.className = "mdl-cell mdl-cell--4-col";

      var card = document.createElement("div");
      card.className = "demo-card-image mdl-card mdl-shadow--2dp";
      card.style = `background: url('images/sources/${hit._source.source_image_url}') center / cover;`;
      card.onclick = doView;
      card.dataset.esId = hit._id;
      cell.appendChild(card);

      var cardTitle = document.createElement("div");
      cardTitle.className = "mdl-card__title mdl-card--expand";
      card.appendChild(cardTitle);

      var cardActions = document.createElement("div");
      cardActions.className = "mdl-card__actions";
      card.appendChild(cardActions);

      var cardImageName = document.createElement("span");
      cardImageName.className = "demo-card-image__filename";
      cardImageName.innerText = hit._source.title;
      cardActions.appendChild(cardImageName);

      results.appendChild(cell);
    });
  });
}

function submitSearch(evt) {
  evt.preventDefault();
  doSearch();
}

function doView(evt) {
  window.location.href = `view.html/${evt.currentTarget.dataset.esId}`;
}

var searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", submitSearch, false);
doSearch("*");