const fs = require('fs');
const electron = require('electron')

let appVersion = "0.1.0"
let linePeriod = 60 * 60; //In seconds
let barPeriod = 3 * 60 * 60; //In seconds
let netWiredEnergy = 4.29*10e-11; //kWh per byte
let netWirelessEnergy = 1.52*10e-11; //kWh per byte
let co2PerEnergy = 80; //g per kWh (France)

let graphs = [];
let pages = [];
let activePage = null;
let activeDay = null;
let dayData = null;

$(initInterface); // Execute main when the page is loaded

function initInterface()
{
  initStaticComponents();

  createLineGraph("power-graph", true, 2000, ["Electrical (W)", "Download (W)", "Upload (W)"], updatePowerGraph, ["#ebbf31", "#28de23", "#8f24b3"]);
  createBarGraph("co2-graph", true, 2000, ["Electrical (g)", "Download (g)", "Upload (g)"], updateCo2Graph, ["#ebbf31", "#28de23", "#8f24b3"]);
  createDoughnutGraph("source-graph", true, ["Electrical power", "Download", "Upload"], updateSourceGraph, ["#edce2f", "#2fb555", "#2f97ed"], "#666666");
  
  createLineGraph("electrical-power-graph", false, 2000, ["Power (W)"], updateElectricalPowerGraph, [], "#1F2D3D");
  createBarGraph("energy-graph", true, 2000, ["Energy (Wh)"], updateEnergyGraph, ["#3471e3"]);
  createBarGraph("electrical-co2-graph", true, 2000, ["CO₂ emissions (g)"], updateElectricalCo2Graph);

  createLineGraph("network-graph", true, 2000, ["Download (kB/s)", "Upload (kB/s)"], updateNetworkGraph, ["#28de23", "#8f24b3"]);
  createBarGraph("data-graph", true, 2000, ["Downloaded (mB)", "Uploaded (mB)"], updateDataGraph, ["#28de23", "#8f24b3"]);
  createBarGraph("internet-co2-graph", true, 2000, ["Download (g)", "Upload (g)"], updateInternetCo2Graph, ["#2fb555", "#2f97ed"]);

  selectDay(new Date());

  
  let overview = createPage("Overview", "overview");
  let electrical = createPage("Electrical power", "electrical");
  let internet = createPage("Internet traffic", "internet");

  addToPage(overview, "power-card");
  addToPage(overview, "co2-card");
  addToPage(overview, "source-card");
  addToPage(overview, "computer-card");
  
  addToPage(electrical, "electrical-power-card");
  addToPage(electrical, "energy-card");
  addToPage(electrical, "electrical-co2-card");

  addToPage(internet, "network-card");
  addToPage(internet, "data-card");
  addToPage(internet, "internet-co2-card");

  addWebLink("report", "https://github.com/NitramAnaip/deCo2me/issues/new");

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

  fs.readFile(`./../../data/global.json`, 'utf8' , (err, data) => {
    let computerInfo = "Unknown";

    if (err)
    {
      console.error(`Unable to read global JSON file: ${err}`);
    }
    else
    {
      try
      {
        let global = JSON.parse(data);
        computerInfo = `${global.computerManufacturer} ${global.computerModel}`;
      }
      catch(error)
      {
        console.error("Unable to parse global JSON file");
      }
    }

    $("#computer").get(0).textContent = computerInfo;
  })
}


/** Graph data updaters **/

function updatePowerGraph(data)
{
  let power = [];
  let downPower = [];
  let upPower = [];
  let period = linePeriod;

  data.labels = getTimeLabels(period);

  if(dayData != null)
  {
    let newData = resampleData([dayData.power, dayData.netDownWired, dayData.netDownWireless, dayData.netUpWired, dayData.netUpWireless], period, [true, false, false, false, false]);
    power = newData[0];

    for(let i = 0; i < newData[0].length; i++)
    {
      downPower.push((newData[1][i] * netWiredEnergy + newData[2][i] * netWirelessEnergy) * 1000 / (period / 3600)); //in W
      upPower.push((newData[2][i] * netWiredEnergy + newData[3][i] * netWirelessEnergy) * 1000 / (period / 3600)); //in W
    }
  }

  data.datasets[0].data = power;
  data.datasets[1].data = downPower;
  data.datasets[2].data = upPower;
}

function updateCo2Graph(data)
{
  let powerCo2 = [];
  let downPowerCo2 = [];
  let upPowerCo2 = [];
  let period = barPeriod;

  data.labels = getTimeLabels(period);

  if(dayData != null)
  {
    let newData = resampleData([dayData.power, dayData.netDownWired, dayData.netDownWireless, dayData.netUpWired, dayData.netUpWireless], period, [true, false, false, false, false]);
  
    for(let i = 0; i < newData[0].length; i++)
    {
      powerCo2.push(newData[0][i] / 1000 * (period / 3600) * co2PerEnergy); //in g
      downPowerCo2.push((newData[1][i] * netWiredEnergy + newData[2][i] * netWirelessEnergy) * co2PerEnergy); //in g
      upPowerCo2.push((newData[3][i] * netWiredEnergy + newData[4][i] * netWirelessEnergy) * co2PerEnergy); //in g
    }
  }

  data.datasets[0].data = powerCo2;
  data.datasets[1].data = downPowerCo2;
  data.datasets[2].data = upPowerCo2;
}

function updateSourceGraph(data)
{
  let gData = [];

  if(dayData != null)
  {
    let averagePeriod = dayData.timestamps.length >= 2 ? (dayData.timestamps[dayData.timestamps.length - 1] - dayData.timestamps[0]) / (dayData.timestamps.length - 1) : undefined; //in s

    gData = [0, 0, 0];
  
    for(let i = 0; i < dayData.power.length; i++)
    {
      gData[0] += dayData.power[i] / 1000 * (averagePeriod / 3600) * co2PerEnergy; //in g
      gData[1] += (dayData.netDownWired[i] * netWiredEnergy + dayData.netDownWireless[i] * netWirelessEnergy) * co2PerEnergy; //in g
      gData[2] += (dayData.netUpWired[i] * netWiredEnergy + dayData.netUpWireless[i] * netWirelessEnergy) * co2PerEnergy; //in g
    }
  }

  data.datasets[0].data = gData;
}

function updateElectricalPowerGraph(data)
{
  let power = [];
  let period = linePeriod;

  data.labels = getTimeLabels(period);

  if(dayData != null)
    power = resampleData([dayData.power], period, [true])[0];

  data.datasets[0].data = power;
}

function updateEnergyGraph(data)
{
  let energy = [];
  let period = barPeriod;

  data.labels = getTimeLabels(period);

  if(dayData != null)
  {
    let newData = resampleData([dayData.power], period, [true])[0];

    for(let i = 0; i < newData.length; i++)
      energy.push(newData[i] * (period / 3600)); //in wH
  }

  data.datasets[0].data = energy;
}

function updateElectricalCo2Graph(data)
{
  let powerCo2 = [];
  let period = barPeriod;

  data.labels = getTimeLabels(period);

  if(dayData != null)
  {
    let newData = resampleData([dayData.power], period, [true])[0];
  
    for(let i = 0; i < newData.length; i++)
      powerCo2.push(newData[i] / 1000 * (period / 3600) * co2PerEnergy); //in g
  }

  data.datasets[0].data = powerCo2;
}

function updateNetworkGraph(data)
{
  let down = [];
  let up = [];
  let period = linePeriod;

  data.labels = getTimeLabels(period);

  if(dayData != null)
  {
    let newData = resampleData([dayData.netDownWired, dayData.netDownWireless, dayData.netUpWired, dayData.netUpWireless], period, [false, false, false, false]);
    power = newData[0];

    for(let i = 0; i < newData[0].length; i++)
    {
      down.push((newData[1][i] + newData[2][i]) / 1000 / period); //in kB/s
      up.push((newData[2][i] + newData[3][i]) / 1000 / period); //in kB/s
    }
  }

  data.datasets[0].data = down;
  data.datasets[1].data = up;
}

function updateDataGraph(data)
{
  let down = [];
  let up = [];
  let period = barPeriod;

  data.labels = getTimeLabels(period);

  if(dayData != null)
  {
    let newData = resampleData([dayData.netDownWired, dayData.netDownWireless, dayData.netUpWired, dayData.netUpWireless], period, [false, false, false, false]);
    power = newData[0];

    for(let i = 0; i < newData[0].length; i++)
    {
      down.push((newData[1][i] + newData[2][i]) / 1000000); //in MB
      up.push((newData[2][i] + newData[3][i]) / 1000000); //in MB
    }
  }

  data.datasets[0].data = down;
  data.datasets[1].data = up;
}

function updateInternetCo2Graph(data)
{
  let downPowerCo2 = [];
  let upPowerCo2 = [];
  let period = barPeriod;

  data.labels = getTimeLabels(period);

  if(dayData != null)
  {
    let newData = resampleData([dayData.netDownWired, dayData.netDownWireless, dayData.netUpWired, dayData.netUpWireless], period, [false, false, false, false]);
  
    for(let i = 0; i < newData[0].length; i++)
    {
      downPowerCo2.push((newData[0][i] * netWiredEnergy + newData[1][i] * netWirelessEnergy) * co2PerEnergy); //in g
      upPowerCo2.push((newData[2][i] * netWiredEnergy + newData[3][i] * netWirelessEnergy) * co2PerEnergy); //in g
    }
  }

  data.datasets[0].data = downPowerCo2;
  data.datasets[1].data = upPowerCo2;
}

function resampleData(data, period, mean)
{
  let nextPoint = getTime(activeDay, 0, 0, 0);
  let newData = [];
  let counter = [];
  let measureCount = 0;

  for(let j = 0; j < data.length; j++)
  {
    newData.push([]);
    counter.push(0);
  }

  nextPoint.setSeconds(nextPoint.getSeconds() + period);

  for(let i = 0; i <= dayData.timestamps.length; i++)
  {
    let addPoint = false;

    if(i < dayData.timestamps.length)
    {
      let measureDate = new Date(dayData.timestamps[i] * 1000);
      console.log(measureDate.toTimeString() + " ; " + nextPoint.toTimeString());

      if(measureDate < nextPoint)
      {
        for(let j = 0; j < data.length; j++)
          counter[j] += data[j][i]; //Adding the data measured within a time period
        measureCount++;
      }
      else addPoint = true;
    }
    else if(measureCount > 0) //Adding the remaining data after the iteration is finished
      addPoint = true;
    
    if(addPoint)
    {
      for(let j = 0; j < data.length; j++)
      {
        newData[j].push(measureCount > 0 ? (mean[j] ? counter[j] / measureCount : counter[j]) : undefined);
        counter[j] = 0;
      }

      measureCount = 0;
      nextPoint.setSeconds(nextPoint.getSeconds() + period);
    }
  }

  return newData;
}

function getTimeLabels(period)
{
  let numOfMeasurements = Math.ceil(86400 / period);
  let labels = [];
  let date = getTime(new Date(), 0, 0, 0); //Any day has 24h, so the date actually doesn't matter

  for(let i = 0; i < numOfMeasurements; i++)
  {
    labels.push(date.toTimeString().substr(0, 5));
    date.setSeconds(date.getSeconds() + period);
  }
  
  return labels;
}



/** Calendar **/

function onDateChanged(e)
{
  if(e.oldDate !== e.date)
    selectDay(new Date(e.date));
}

function selectDay(date)
{
  activeDay = date;

  fs.readFile(`./../../data/${formatDate(date)}.json`, 'utf8' , (err, data) => {
    if (err)
    {
      console.error(`Unable to read JSON file: ${err}`);
      dayData = null;
    }
    else
    {
      try
      {
        dayData = JSON.parse(data);
      }
      catch(error)
      {
        console.error(`Unable to parse JSON file: ./../../data/${formatDate(date)}.json\n${error}`);
        dayData = null;
      }
    }

    updateAllGraphs(dayData);
  })
}


/** Graph management **/

function updateAllGraphs()
{
  graphs.forEach((graph) => {
    updateGraph(graph);
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
          fontColor: graphColor
        },
        gridLines : {
          display : false,
          color: graphColor,
          drawBorder: false
        }
      }],
      yAxes: [{
        ticks : {
          stepSize: step,
          fontColor: graphColor,
          beginAtZero: true
        },
        gridLines : {
          display : true,
          color: graphColor,
          drawBorder: false
        }
      }]
    }
  }

  return options;
}

function updateGraph(graph)
{
  graph.dataUpdater(graph.data); //dataUpdater is a variable of the type 'function'
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


/** Date & Time **/

function formatDate(date)
{
  month = '' + (date.getMonth() + 1),
  day = '' + date.getDate(),
  year = date.getFullYear();

  if (month.length < 2) 
    month = '0' + month;
  if (day.length < 2) 
    day = '0' + day;

  return [year, month, day].join('-');
}

function getTime(day, hours, minutes, seconds)
{
  date = new Date(+day);
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);
  date.setMilliseconds(0);

  return date;
}


/** Web Links **/

function addWebLink(linkId, url)
{
  let link = $(`#${linkId}`).get(0);
  link.onclick = () => onWebLinkClick(link, url);
}

function onWebLinkClick(link, url)
{
  electron.shell.openExternal(url)
  link.blur();
}