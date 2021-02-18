/*
 * Author: Abdullah A Almsaeed
 * Date: 4 Jan 2014
 * Description:
 *      This is a demo file used only for the main dashboard (index.html)
 **/

$(function () {

  'use strict'

  //Constant
  var measurePeriod = 30 * 60; //Duration between two measurements, in seconds

  /* jQueryKnob */
  $('.knob').knob()

  // The Calender
  $('#calendar').datetimepicker({
    format: 'L',
    inline: true,
    maxDate: new Date(),
    timepicker: false
  })

  $("#calendar").on("change.datetimepicker", function (e)
  {
    if (e.oldDate !== e.date)
    {
      let a = Math.random() * 10000;
      let w = Math.random() / 2;
      let phi = Math.random() * 2 * Math.PI;
    
      for(var i = 0; i < salesGraphChart.config.data.datasets[0].data.length; i++)
        salesGraphChartData.datasets[0].data[i] = Math.floor(a * (1 + Math.cos(w * i + phi)));
      for(i = 0; i < pieData.datasets[0].data.length; i++)
        pieData.datasets[0].data[i] = Math.floor(Math.random() * 40)

      salesGraphChart.update()
      pieChart.update()
    }
})

  // Donut Chart
  var pieChartCanvas = $('#sales-chart-canvas').get(0).getContext('2d')
  var pieData        = {
    labels: [
        'Power consumption', 
        'Inbound Internet traffic',
        'Outbound Internet traffic'
    ],
    datasets: [
      {
        data: [30,12,20],
        backgroundColor : ['#edce2f', '#2fb555', '#2f97ed'],
      }
    ]
  }
  var pieOptions = {
    maintainAspectRatio : false,
    responsive : true,
  }
  //Create pie or douhnut chart
  // You can switch between pie and douhnut using the method below.
  var pieChart = new Chart(pieChartCanvas, {
    type: 'doughnut',
    data: pieData,
    options: pieOptions      
  });

  // Sales graph chart
  var salesGraphChartCanvas = $('#line-chart').get(0).getContext('2d');
  //$('#revenue-chart').get(0).getContext('2d');

  let numOfMeasurements = Math.ceil(86400 / measurePeriod) + 1;
  let labels = [];
  let data = [];

  let measurementDate = new Date(2000, 1, 1, 0, 0, 0, 0);

  for(let i = 0; i < numOfMeasurements; i++)
  {
    labels.push(measurementDate.toTimeString().substr(0, 5));
    measurementDate.setSeconds(measurementDate.getSeconds() + measurePeriod);
  }

  let a = Math.random() * 10000;
  let w = Math.random() / 2;
  let phi = Math.random() * 2 * Math.PI;

  for(let i = 0; i < labels.length; i++)
    data.push(Math.floor(a * (1 + Math.cos(w * i + phi))));

  var salesGraphChartData = {
    labels  : labels,
    datasets: [
      {
        label               : 'Digital Goods',
        fill                : false,
        borderWidth         : 2,
        lineTension         : 0,
        spanGaps : true,
        borderColor         : '#efefef',
        pointRadius         : 3,
        pointHoverRadius    : 7,
        pointColor          : '#efefef',
        pointBackgroundColor: '#efefef',
        data                : data
      }
    ]
  }

  var salesGraphChartOptions = {
    maintainAspectRatio : false,
    responsive : true,
    legend: {
      display: false,
    },
    scales: {
      xAxes: [{
        ticks : {
          fontColor: '#efefef',
        },
        gridLines : {
          display : false,
          color: '#efefef',
          drawBorder: false,
        }
      }],
      yAxes: [{
        ticks : {
          stepSize: 5000,
          fontColor: '#efefef',
        },
        gridLines : {
          display : true,
          color: '#efefef',
          drawBorder: false,
        }
      }]
    }
  }

  // This will get the first returned node in the jQuery collection.
  var salesGraphChart = new Chart(salesGraphChartCanvas, { 
      type: 'line', 
      data: salesGraphChartData, 
      options: salesGraphChartOptions
    }
  )

})
