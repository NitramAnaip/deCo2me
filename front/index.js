let appVersion = "0.1.0"
let linePeriod = 60 * 60; //In seconds
let barPeriod = 3 * 60 * 60; //In seconds
let graphs = [];
let pages = [];
let activePage = null;

$(initInterface); // Execute main when the page is loaded

function initInterface()
{
  initStaticComponents();

  createLineGraph("power-graph", true, 2000, ["Electrical (W)", "Download (W)", "Upload (W)"], (d) => generateRandomTime(d, linePeriod, 3), ["#ebbf31", "#28de23", "#8f24b3"]);
  createBarGraph("co2-graph", true, 2000, ["Electrical (g)", "Download (g)", "Upload (g)"], (d) => generateRandomTime(d, barPeriod, 3), ["#ebbf31", "#28de23", "#8f24b3"]);
  createDoughnutGraph("source-graph", true, ["Electrical power", "Download", "Upload"], (d) => generateRandom(d, 1, 3), ["#edce2f", "#2fb555", "#2f97ed"], "#666666");
  
  createLineGraph("electrical-power-graph", false, 2000, ["Power (W)"], (d) => generateRandomTime(d, linePeriod, 1), [], "#1F2D3D");
  createBarGraph("energy-graph", true, 2000, ["Energy (Wh)"], (d) => generateRandomTime(d, barPeriod, 1), ["#3471e3"]);
  createBarGraph("electrical-co2-graph", true, 2000, ["CO₂ emissions (g)"], (d) => generateRandomTime(d, barPeriod, 1));

  createLineGraph("network-graph", true, 2000, ["Download (kB/s)", "Upload (kB/s)"], (d) => generateRandomTime(d, linePeriod, 2), ["#28de23", "#8f24b3"]);
  createBarGraph("data-graph", true, 2000, ["Downloaded (mB)", "Uploaded (mB)"], (d) => generateRandomTime(d, barPeriod, 2), ["#28de23", "#8f24b3"]);
  createBarGraph("internet-co2-graph", true, 2000, ["CO₂ emissions (g)"], (d) => generateRandomTime(d, barPeriod, 1));

  updateAllGraphs(null);

  
  let overview = createPage("Overview", "overview");
  let electrical = createPage("Electrical power", "electrical");
  let internet = createPage("Internet traffic", "internet");

  addToPage(overview, "power-card");
  addToPage(overview, "co2-card");
  addToPage(overview, "source-card");
  
  addToPage(electrical, "electrical-power-card")
  addToPage(electrical, "energy-card")
  addToPage(electrical, "electrical-co2-card")

  addToPage(internet, "network-card")
  addToPage(internet, "data-card")
  addToPage(internet, "internet-co2-card")

  setActivePage(overview);
}

function initStaticComponents()
{
  $("#version").get(0).textContent = appVersion;

  // The Calender
  let calendar = $("#calendar");
  calendar.datetimepicker({
    format: 'L',
    inline: true,
    maxDate: new Date(),
    timepicker: false
  });
  calendar.on("change.datetimepicker", onDateChanged);
}

function generateRandom(data, dimension, count)
{
  for(let i = 0; i < dimension; i++)
  {
    let randomData = [];
    let a = Math.random() * 10000;
    let w = Math.random() / 2;
    let phi = Math.random() * 2 * Math.PI;

    for(let j = 0; j < count; j++)
      randomData.push(Math.floor(a * (1 + Math.cos(w * j + phi))));

    data.datasets[i].data = randomData;
  }
}

function generateRandomTime(data, measurePeriod, dimension)
{
  let numOfMeasurements = Math.ceil(86400 / measurePeriod) + 1;
  let labels = [];
  let measurementDate = new Date(2000, 1, 1, 0, 0, 0, 0);

  for(let i = 0; i < numOfMeasurements; i++)
  {
    labels.push(measurementDate.toTimeString().substr(0, 5));
    measurementDate.setSeconds(measurementDate.getSeconds() + measurePeriod);
  }

  data.labels = labels;
  generateRandom(data, dimension, labels.length);
}

function onDateChanged(e)
{
  if(e.oldDate !== e.date)
    updateAllGraphs(null);
}


/** Graph management **/

function updateAllGraphs(dayData)
{
  graphs.forEach((graph) => {
    updateGraph(graph, dayData);
  });
}

function createLineGraph(componentId, showLegend, step, dataName, dataUpdater, dataColor, graphColor)
{
  let component = $(`#${componentId}`).get(0);
  let canvas = component.getContext('2d');

  if(graphColor == null)
    graphColor = '#efefef';

  let data = {
    labels  : [],
    datasets: []
  }

  for(let i = 0; i < dataName.length; i++)
  {
    let color = dataColor != null && dataColor.length > i ? dataColor[i] : graphColor;

    data.datasets.push({
      label               : dataName[i],
      fill                : false,
      borderWidth         : 2,
      lineTension         : 0,
      spanGaps            : true,
      borderColor         : color,
      pointRadius         : 3,
      pointHoverRadius    : 7,
      pointColor          : color,
      pointBackgroundColor: color,
      data                : []
    });
  }

  let chart = new Chart(canvas, { 
    type: 'line', 
    data: data, 
    options: createGraphOptions(showLegend, step, graphColor)
  });

  let graph = {
    component: component,
    chart: chart,
    data: data,
    dataUpdater: dataUpdater
  }

  graphs.push(graph);
  return graph;
}

function createBarGraph(componentId, showLegend, step, dataName, dataUpdater, dataColor, graphColor)
{
  let component = $(`#${componentId}`).get(0);
  let canvas = component.getContext('2d');

  if(graphColor == null)
    graphColor = '#efefef';

  let data = {
    labels  : [],
    datasets: []
  }

  for(let i = 0; i < dataName.length; i++)
  {
    let color = dataColor != null && dataColor.length > i ? dataColor[i] : graphColor;

    data.datasets.push({
      label               : dataName[i],
      fill                : false,
      borderWidth         : 2,
      lineTension         : 0,
      spanGaps            : true,
      backgroundColor     : color,
      borderColor         : color,
      pointRadius         : false,
      pointColor          : color,
      pointBackgroundColor: color,
      data                : []
    });
  }

  let chart = new Chart(canvas, { 
    type: 'bar', 
    data: data, 
    options: createGraphOptions(showLegend, step, graphColor)
  });

  let graph = {
    component: component,
    chart: chart,
    data: data,
    dataUpdater: dataUpdater
  }

  graphs.push(graph);
  return graph;
}

function createDoughnutGraph(componentId, showLegend, dataName, dataUpdater, dataColor, graphColor)
{
  if(dataName.length != dataColor.length)
  {
    console.error(`Unable to create graph: ${dataName.length} names, ${dataColor.length} colors`);
    return null;
  }

  let component = $(`#${componentId}`).get(0);
  let canvas = component.getContext('2d');

  if(graphColor == null)
    graphColor = '#efefef';

  let data = {
    labels: dataName,
    datasets: [
      {
        data: [],
        backgroundColor : dataColor,
      }
    ]
  }

  let options = createGraphOptions(showLegend, null, graphColor);

  let chart = new Chart(canvas, {
    type: 'doughnut',
    data: data,
    options: options      
  });

  let graph = {
    component: component,
    chart: chart,
    data: data,
    dataUpdater: dataUpdater
  }

  graphs.push(graph);
  return graph;
}

function createGraphOptions(showLegend, step, graphColor)
{
  let options = {
    maintainAspectRatio : false,
    responsive : true,
    legend: {
      display: showLegend,
      labels: {
        fontColor: graphColor
      }
    }
  }

  if(step != null)
  {
    options.scales = {
      xAxes: [{
        ticks : {
          fontColor: graphColor,
        },
        gridLines : {
          display : false,
          color: graphColor,
          drawBorder: false,
        }
      }],
      yAxes: [{
        ticks : {
          stepSize: step,
          fontColor: graphColor,
        },
        gridLines : {
          display : true,
          color: graphColor,
          drawBorder: false,
        }
      }]
    }
  }

  return options;
}

function updateGraph(graph, dayData)
{
  graph.dataUpdater(graph.data, dayData);
  graph.chart.update();
}


/** Page management **/

function createPage(name, linkId)
{
  let link = $(`#${linkId}`).get(0);

  let page = {
    name: name,
    link: link,
    elements: []
  };

  link.onclick = () => onPageLinkClick(page);

  pages.push(page);
  return page;
}

function addToPage(page, componentId)
{
  page.elements.push($(`#${componentId}`).get(0));
}

function setActivePage(page)
{
  if(page != activePage)
  {
    pages.forEach(p => {

      if(p == page)
        p.link.classList.add("active");
      else if(p.link.classList.contains("active"))
        p.link.classList.remove("active");
      
      p.elements.forEach(e => {
        e.hidden = p != page;
      });
    });

    $("#current-menu").get(0).textContent = page.name;
    activePage = page;
  }
}

function onPageLinkClick(page)
{
  setActivePage(page);
  page.link.blur();
}