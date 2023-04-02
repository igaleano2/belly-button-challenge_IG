// Define the URL for the samples data
var url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Use d3.json to fetch data from the URL
d3.json(url).then(function(data) {
    console.log(data);

    //  names 
  var names = data.names;
  //  metadata 
  var metadata = data.metadata;
  // samples data
  var samples = data.samples;

  // Dropdown menu 
  var dropdown = d3.select("#selDataset");

  // elements dropdown menu 
  samples.forEach(function(sample) {
    var element = dropdown.append("option");// Not sure "option" how it works, is it an attribute of dropdown, or works as "i"?
    element.text(sample.id);
    //console.log(element);
  });

  //function to update plots
  function updatePlots(selectedId) {
  
    // Find the index 
    var index = samples.findIndex(sample => sample.id == selectedId);
  
    // extract the data for the selected sample
    var sample = samples[index];
     //console.log(sample);
    var otuIds = sample.otu_ids;
     //console.log(otuIds);
    var sampleValues = sample.sample_values;
    var otuLabels = sample.otu_labels;
    //console.log(otuLabels);
  
    // horizontal bar chart 
    var trace1 = {
      x: sampleValues.slice(0, 10).reverse(),
      y: otuIds.slice(0, 10).map(id => "OTU " +  id).reverse(), //The graph changes when not added the "OTU" text and can't get the labels right
      type: "bar",
      orientation: "h",
      hovertext: otuLabels.slice(0,  10).reverse(),
    //   text: sampleValues.slice(0, 10).reverse().map(val => val.toFixed(2) + " units"),
    //   marker: {
    //     line: {
    //       width: 5,
    //       color: 'black'
    //     }
    // }
    };
    
    Plotly.newPlot("bar", [trace1]);  

    // bubble chart 
    var trace2 = {
      x: otuIds,
      y: sampleValues,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Portland",
        symbol:"diamond-x"
      },
      text: otuLabels
    };
    
    Plotly.newPlot("bubble", [trace2]);

    // Demographic info panel Metadata
    var selectedMetadata = metadata[index];
    var metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html("");//clean previuos data
    Object.entries(selectedMetadata).forEach(function([key, value]) {
      var p = metadataPanel.append("p");
      p.text(key + ": " + value);
    });
  }

  //  default sample ID calls updatePlots function
  var defaultId = dropdown.property("value");
  updatePlots(defaultId);

  // When dropdown changes calls function to update plots
  function optionChanged() {
    var newId = dropdown.property("value");
    updatePlots(newId);
  }

  // listens for changes in the dropdown menu
  dropdown.on("change", optionChanged);

});
