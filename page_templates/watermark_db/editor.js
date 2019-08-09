var client = new elasticsearch.Client({
  host: '128.84.8.214:9200',
  // log: 'trace'
});

// Handy functions

function fillIn(fieldName, entry) {
  var textFieldInput = document.getElementById(fieldName);
  // If you don't do this, the label won't float.
  textFieldInput.parentElement.MaterialTextfield.change( entry[fieldName]);
}

// Extract id from url
var thisUrl = window.location.href;
var thisUrl = new URL(window.location.href);
var urlParams = new URLSearchParams(window.location.search);

var id = thisUrl.pathname.split("/").pop();
var fromId = id;
if (id === 'new') {
  fromId = urlParams.has("like") ? urlParams.get("like") : undefined;
}

var allFields = [
  "watermark_source", "source_image_url", "title", "creation_site", "inventor", "date_of_original_work", "bartsch_classification",
  "bartsch_state", "new_hollstein_classification", "new_hollstein_state", "other_catalogue_number", "subject",
  "owner", "credit_line", "inventory_number", "paper_type", "paper_measurements", "paper_size",
  "paper_presumed_origin", "paper_mill", "paper_maker", "watermark_side", "watermark_image_creator",
  "watermark_image_date", "watermark_image_type", "watermark_image_url", "watermark_description",
  "watermark_hinterding_classification", "watermark_iph_classification", "watermark_briquet_description",
  "watermark_briquet_number", "watermark_measurements", "watermark_location_on_sheet", "watermark_twinmark",
  "watermark_equivalent_groups", "watermark_proposed_date", "watermark_dating_deduction_basis", "notes",
];

document.getElementById("watermark_number").focus();

if (fromId) {
  client.get({
    index: "watermarks",
    type: '_doc',
    id: fromId
  }).then( (resp) => {
    var entry = resp._source;
    document.getElementById("mainTitle").textContent = id==="new" ? "Copy of " + entry.title : entry.title;

    if (id !== 'new') {
      fillIn("watermark_number", entry);
      document.getElementById("watermark_number").disabled = true;
      document.getElementById("watermark_source").focus();
    }
    allFields.forEach((fld) => fillIn(fld, entry) );
  });
}

function submitSave(evt) {
  evt.preventDefault();

  var saveId = document.getElementById("watermark_number").value;
  var entry = { watermark_number: saveId };
  allFields.forEach((fld) => entry[fld] = document.getElementById(fld).value );
  var saveTask;
  if (id === "new") {
    // TODO: Make sure it doesn't exist
    saveTask = client.create({
      index: "watermarks",
      type: "doc",
      id: saveId ,
      body: entry
    });
  } else {
    entry[document_number] = id;
    saveTask = client.update({
      index: "watermarks",
      type: "doc",
      id,
      body: {doc: entry}
    })
  }

  saveTask.then( (resp) => {
    window.location.href = `../index.html`;
  });
}

var searchForm = document.getElementById("entry-form");
searchForm.addEventListener("submit", submitSave, false);
