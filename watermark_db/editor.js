var client = new elasticsearch.Client({
  host: '128.84.9.40:9200',
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

// Handy functions

function editBox(section, fieldName, labelText, entry) {
  var textFieldOuter = document.createElement("div");
  textFieldOuter.className = "mdl-textfield mdl-js-textfield mdl-textfield--floating-label";

  var textFieldInput = document.createElement("input");
  textFieldInput.className = "mdl-textfield__input";
  textFieldInput.type = "text";
  textFieldInput.id = fieldName;
  textFieldInput.value = entry[fieldName];
  textFieldOuter.appendChild(textFieldInput);

  var textFieldLabel = document.createElement("label");
  textFieldLabel.className = "mdl-textfield__label";
  textFieldLabel.for = fieldName;
  textFieldLabel.textContent = labelText;
  textFieldOuter.appendChild(textFieldLabel);

  var section = document.getElementById(section);
  section.appendChild(textFieldOuter);
  section.appendChild( document.createElement("br"));
}

// Extract id from url
var thisUrl = window.location.href;
var id = thisUrl.split("/").pop();

// TODO: Don't do this if new
client.get({
  index: "watermarks",
  type: 'doc',
  id
}).then( (resp) => {
  var entry = resp._source;
  document.getElementById("title").textContent = entry.title;

  editBox("watermark_information", "watermark_number", "Number", entry);
  editBox("watermark_information", "watermark_source", "Source", entry);
  editBox("watermark_information", "image_url", "Image URL", entry);

});

