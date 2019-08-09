var client = new elasticsearch.Client({
  host: '128.84.8.214:9200',
  log: 'trace'
});

// Handy functions

function gridLine(labelText, domOrText) {
  var grid = document.createElement("div");
  grid.className = "mdl-grid";

  var label = document.createElement("div");
  label.className = "mdl-cell mdl-cell--2-col";
  label.textContent = labelText;
  grid.appendChild(label);

  var data = document.createElement("div");
  data.className = "mdl-cell mdl-cell--10-col";
  if (domOrText instanceof Element) {
    data.appendChild(domOrText);
  } else {
    var strongCell = document.createElement("strong");
    strongCell.textContent = domOrText;
    data.appendChild(strongCell);
  }

  grid.appendChild(data);
  return grid;
}

// Extract id from url
var thisUrl = window.location.href;
var id = thisUrl.split("/").pop();

client.get({
  index: "watermarks",
  type: '_doc',
  id
}).then( (resp) => {
  var entry = resp._source;
  document.getElementById("title").textContent = entry.title;

  var sourceImage = document.getElementById("sourceImage");
  sourceImage.style.background = `url(../images/sources/${entry.source_image_url}) center / cover`;

  var watermarkImage = document.getElementById("watermarkImage");
  watermarkImage.style.background = `url(../images/watermarks/${entry.watermark_image_url}) center / cover`;

  var tab1 = document.getElementById("tab1");
  tab1.appendChild( gridLine( "ID", `#${entry.watermark_number}, ${entry.watermark_source}`));
  tab1.appendChild( gridLine( "Origin", `${entry.creation_site}, ${entry.inventor}, ${entry.date_of_original_work}`));
  tab1.appendChild( gridLine( "Bartsch/White and Boon", `${entry.bartsch_classification}, ${entry.bartsch_state}`));
  tab1.appendChild( gridLine( "New Hollstein", `${entry.new_hollstein_classification}, ${entry.new_hollstein_state}`));
  if (entry.other_catalogue_number) {
    tab1.appendChild( gridLine( "Other Catalogue", `${entry.other_catalogue_number}`));
  }
  if (entry.subject) {
    tab1.appendChild( gridLine( "Subject", `${entry.subject}`));
  }
  var owner_div = document.createElement("div");
  var strongCell = document.createElement("strong");
  strongCell.textContent = `${entry.owner} Inventory Number ${entry.inventory_number}`;
  owner_div.appendChild(strongCell);
  owner_div.appendChild( document.createElement("br"));
  owner_div.appendChild( document.createTextNode(entry.credit_line));
  tab1.appendChild( gridLine( "Owner", owner_div ) );

  var tab2 = document.getElementById("tab2");
  tab2.appendChild( gridLine( "Type", entry.paper_type ));
  tab2.appendChild( gridLine( "Size", `${entry.paper_size_or_format}, ${entry.paper_measurements}` ));
  tab2.appendChild( gridLine( "Presumed Origin", `${entry.paper_presumed_origin} ${entry.paper_mill} ${entry.paper_maker}` ));

  var tab3 = document.getElementById("tab3");
  tab3.appendChild( gridLine( "Side and Location", `${entry.watermark_side} ${entry.watermark_location_on_sheet}` ));
  tab3.appendChild( gridLine( "Source", `${entry.watermark_image_type}, ${entry.watermark_image_creator}, ${entry.watermark_image_date}` ));
  tab3.appendChild( gridLine( "Description", document.createTextNode(entry.watermark_description) ));
  tab3.appendChild( gridLine( "Hinterding Classification", entry.watermark_hinterding_classification ));
  tab3.appendChild( gridLine( "IPH Classification", entry.watermark_iph_classification ));
  tab3.appendChild( gridLine( "Briquet", `${entry.watermark_briquet_number} ${entry.watermark_briquet_description}` ));
  tab3.appendChild( gridLine( "Measurements", entry.watermark_measurements ));
  tab3.appendChild( gridLine( "Twinmark", entry.watermark_twinmark ));
  tab3.appendChild( gridLine( "Equivalent Groups", entry.watermark_equivalent_groups ));
  var date_div = document.createElement("div");
  var strongCell = document.createElement("strong");
  strongCell.textContent = entry.watermark_proposed_date;
  date_div.appendChild(strongCell);
  date_div.appendChild( document.createElement("br"));
  date_div.appendChild( document.createTextNode(`Based on ${entry.watermark_dating_deduction_basis}`));
  tab3.appendChild( gridLine( "Proposed Date", date_div ) );

  var tab4 = document.getElementById("tab4");
  var notes = document.createElement("p");
  notes.textContent = entry.notes;
  tab4.appendChild(notes);
});

function doAddSimilar(evt) {
  window.location.href = `../editor.html/new?like=${id}`;
}

var addSimilarBtn = document.getElementById("addSimilarBtn");
addSimilarBtn.addEventListener("click", doAddSimilar);

function doEdit(evt) {
  window.location.href = `/watermark_db/editor.html/${id}`;
}

var editBtn = document.getElementById("editBtn");
editBtn.addEventListener("click", doEdit);

function doDelete(evt) {
  if (window.confirm("Do you really want to delete this entry?")) {
    client.delete({
      index: 'watermarks',
      type: 'doc',
      id
    }).then( (resp) => {
      window.location.href = `/watermark_db/index.html`;
    });
  }
}

var delBtn = document.getElementById("delBtn");
delBtn.addEventListener("click", doDelete);

