
// Declare some const elements
const nameTextBox = document.getElementById('name-input');
const officeTextBox = document.getElementById('office-input');
const beginTextBox = document.getElementById('begin-input');
const endTextBox = document.getElementById('end-input');
const regTextBox = document.getElementById('reg-input');
const titelTextBox = document.getElementById('title-input');
const createGraphBtn = document.getElementById('createChartBtn')
const reportBtn = document.getElementById('reportBtn');
const settingBtn = document.getElementById('settingBtn');
const settingDiv = document.getElementById('setting-div');

// Declare some variables
var nameValue;
var officeValue;
var beginValue;
var endValue;
var url;

// URL of the JSON file
const domain = "https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data";
const timeSeries = "/timeseries?";
const timeZone = "CST6CDT";

// Function for Report btn before getting the graph
function reportBtnClicked() {
  alert("First create the graph in order to get the report.")
}

function toggleSettingvisibility() {
  console.log(settingDiv.classList)
  let haveHidden = false;
  settingDiv.classList.forEach((value) => {
    if (value == 'hidden') {
      haveHidden = true;
    }
  })
  
  if (haveHidden) {
    settingDiv.classList.remove('hidden');
    settingBtn.classList.add('pressed')
  } else {
    settingDiv.classList.add('hidden');
    settingBtn.classList.remove('pressed')
  }
}

// Adding functionality to the buttons
settingBtn.addEventListener('click', toggleSettingvisibility);
reportBtn.addEventListener('click', reportBtnClicked);
createGraphBtn.addEventListener('mousedown', function () {
  createGraphBtn.classList.toggle('pressed')
});

createGraphBtn.addEventListener('mouseup', function () {
  createGraphBtn.classList.toggle('pressed')
});

reportBtn.addEventListener('mousedown', function () {
  reportBtn.classList.toggle('pressed')
});

reportBtn.addEventListener('mouseup', function () {
  reportBtn.classList.toggle('pressed')
});


// ==== Main funtion to work with the data after getting the data =====
function processData(data) {
  // Get the date from the raw date data
  let rawDateList = getList(data, 0);
  // Empty array to store the date
  let dateList = [];
  // Loop to split the raw date and take just the part we want
  rawDateList.forEach((value, index) => {
    dateList[index] = value.split("T")[0]
  });
  // Get the stage data
  let stageList = getList(data, 1);

  // Set Upper and Lower Limits
  //Check if the reg text box have values
  let upperLimit;
  let lowerLimit;
  if (regTextBox.value) {
    upperLimit = Math.max(...getRegulationLimits());
    lowerLimit = Math.min(...getRegulationLimits());
  } else {
    upperLimit = 412;
    lowerLimit = 406;
  }

  
  // Create List to plot limits
  let upperList = [];
  let lowerList = [];
  dateList.forEach((value, index) => {
    upperList[index] = upperLimit
  });
  dateList.forEach((value, index) => {
    lowerList[index] = lowerLimit
  });

  // Set the elevation for each event
  let elev0_5 = 0.5;
  let elev1_0 = 1.0;
  let elev1_5 = 1.5;
  let elev2_0 = 2.0;

  // Create empty arrays to store each elevation for the plot
  let event0_5 = [];
  let event1_0 = [];
  let event1_5 = [];
  let event2_0 = [];

  // Fill the empty arrays for each event
  let event0_5List = getEvents(stageList=stageList, upperLimit=upperLimit, dateList=dateList, eventFt=elev0_5)
  let event1_0List = getEvents(stageList=stageList, upperLimit=upperLimit, dateList=dateList, eventFt=elev1_0)
  let event1_5List = getEvents(stageList=stageList, upperLimit=upperLimit, dateList=dateList, eventFt=elev1_5)
  let event2_0List = getEvents(stageList=stageList, upperLimit=upperLimit, dateList=dateList, eventFt=elev2_0)

  // Get X and Y values for each event
  let xValues0_5 = event0_5List[1];
  let yValues0_5 = event0_5List[0];
  event0_5[0] = event0_5List[2];
  event0_5[1] = event0_5List[3];

  let xValues1_0 = event1_0List[1];
  let yValues1_0 = event1_0List[0];
  event1_0[0] = event1_0List[2];
  event1_0[1] = event1_0List[3];

  let xValues1_5 = event1_5List[1];
  let yValues1_5 = event1_5List[0];
  event1_5[0] = event1_5List[2];
  event1_5[1] = event1_5List[3];

  let xValues2_0 = event2_0List[1];
  let yValues2_0 = event2_0List[0];
  event2_0[0] = event2_0List[2];
  event2_0[1] = event2_0List[3];

  let tableHeader = ["Event", "Duration", "Start Date", "End Date"];
  let tableRows = [];
  
  // Add rows to the report table
  let tempRow = addRowsToTable(event0_5, "0.5");
  tempRow.forEach((value) => {
    tableRows.push(value)
  })
  tempRow = addRowsToTable(event1_0, "1.0");
  tempRow.forEach((value) => {
    tableRows.push(value)
  })
  tempRow = addRowsToTable(event1_5, "1.5");
  tempRow.forEach((value) => {
    tableRows.push(value)
  })
  tempRow = addRowsToTable(event2_0, "2.0");
  tempRow.forEach((value) => {
    tableRows.push(value)
  })

  let now = new Date();

  let nowList = now.toString().split(' ');

  // Get the first three elements using slice
  let chosenElements = nowList.slice(0, 4);

  // Join the first three elements with a hyphen
  let joinedNow = chosenElements.join(' ');

  let text = "Events Report for " + beginValue.split('-')[0] + "\nDate: " + joinedNow + "\n"

  reportBtn.removeEventListener('click', reportBtnClicked)

  reportBtn.addEventListener('click', function() {
    createTableTextFile(tableRows, tableHeader, text, "Table_Test.txt")
  })


  // Create the custome series for the events
  let event0_5plot = xValues0_5.map((x, i) => ({ x: x, y: yValues0_5[i] }));
  let event1_0plot = xValues1_0.map((x, i) => ({ x: x, y: yValues1_0[i] }));
  let event1_5plot = xValues1_5.map((x, i) => ({ x: x, y: yValues1_5[i] }));
  let event2_0plot = xValues2_0.map((x, i) => ({ x: x, y: yValues2_0[i] }));

  // Change the container properties in the CSS file
  var myDiv = document.getElementById('chartContainer');
  myDiv.classList.add('active-cont');

  // Get Title from title textbox
  let newTitle;
  if (titelTextBox.value) {
    newTitle = titelTextBox.value;
  } else {
    newTitle = "Graph Title";
  }

  createChart(yAxisTitle="Stage[ft]", title=newTitle, xAxisArray=dateList, yAxisArray=stageList,
    upperLimitSerie=upperList, lowerLimitSerie=lowerList, plot0_5=event0_5plot, plot1_0=event1_0plot, 
    plot1_5=event1_5plot, plot2_0=event2_0plot
  );

}

// Function to get the events for that time period
function getEvents(stageList, upperLimit, dateList, eventFt) {
  let tempStage = [];
  let tempDate = [];
  let eventStage = [];
  let eventDate = [];
  let eventDatesStr = []
  let otherEvents = [];
  let otherEventsDates = [];
  let lastIndex = 0;
  let eventsIndex = 0;
  stageList.forEach((value, index) => {
    
    if (value < (upperLimit - eventFt)) {
      tempStage[lastIndex] = upperLimit - eventFt;
      tempDate[lastIndex] = index;
      eventDatesStr[lastIndex] = dateList[index]
      lastIndex += 1;

      if (index + 1 == stageList.length) {
        if (tempStage.length > 30 && tempStage.length > eventStage.length) {
          eventStage = tempStage;
          eventDate = tempDate;
          otherEvents[eventsIndex] = tempStage;
          otherEventsDates[eventsIndex] = eventDatesStr;
          tempStage = [];
          tempDate = [];
          eventDatesStr = [];
          lastIndex = 0;
          eventsIndex += 1;
        } else if (tempStage.length > 30 && tempStage.length < eventStage.length) {
          otherEvents[eventsIndex] = tempStage;
          otherEventsDates[eventsIndex] = eventDatesStr;
          tempStage = [];
          tempDate = [];
          eventDatesStr = [];
          lastIndex = 0;
          eventsIndex += 1;
        } else if (tempStage.length < 30) {
          tempStage = [];
          tempDate = [];
          eventDatesStr = [];
          lastIndex = 0;
        };
      }

    } else {
      if (tempStage.length > 30 && tempStage.length > eventStage.length) {
        eventStage = tempStage;
        eventDate = tempDate;
        otherEvents[eventsIndex] = tempStage;
        otherEventsDates[eventsIndex] = eventDatesStr;
        tempStage = [];
        tempDate = [];
        eventDatesStr = [];
        lastIndex = 0;
        eventsIndex += 1;
      } else if (tempStage.length > 30 && tempStage.length < eventStage.length) {
        otherEvents[eventsIndex] = tempStage;
        otherEventsDates[eventsIndex] = eventDatesStr;
        tempStage = [];
        tempDate = [];
        eventDatesStr = [];
        lastIndex = 0;
        eventsIndex += 1;
      } else if (tempStage.length < 30) {
        tempStage = [];
        tempDate = [];
        eventDatesStr = [];
        lastIndex = 0;
      };
    };
  })
  return [eventStage, eventDate, otherEvents, otherEventsDates]
};

// Function to get the vlues from the list
function getList(list, elemIndex) {
  let newList = []
  list.forEach((value, index) => {
    newList[index] = value[elemIndex]
  });
  return newList
}

// Function to create the Graph
function createChart(yAxisTitle, title, xAxisArray, yAxisArray, lowerLimitSerie, upperLimitSerie, plot0_5, plot1_0, plot1_5, plot2_0) {
  // Data for the chart
  const data = {
      chart: {
          type: 'line'
      },
      title: {
          text: title
      },
      xAxis: {
        categories: xAxisArray,
        tickInterval: 30, // Set the interval to 30
        labels: {
            rotation: -45, // Optional: rotate labels for better readability
            align: 'right'
        }
    },
      yAxis: {
          title: {
              text: yAxisTitle //'Rainfall (mm)'
          }
      },
      series: [
        {
          name: 'Stage',
          data: yAxisArray
        },
        {
          name: 'Upper Limit ' + '[' + upperLimitSerie[0] + ' ft]',
          data: upperLimitSerie,
          dashStyle: 'Dash',
          color: 'grey'
        },
        {
          name: 'Lower Limit ' + '[' + lowerLimitSerie[0] + ' ft]',
          data: lowerLimitSerie,
          dashStyle: 'Dash',
          color: 'grey'
        },
        {
          name: '0.5 ft ' + '[' + plot0_5.length + "]",
          data: plot0_5,
          color: "#277DA1"
        },
        {
          name: '1.0 ft ' + '[' + plot1_0.length + "]",
          data: plot1_0,
          color: '#F94144'
        },
        {
          name: '1.5 ft ' + '[' + plot1_5.length + "]",
          data: plot1_5,
          color: '#43AA8B'
        },
        {
          name: '2.0 ft ' + '[' + plot2_0.length + "]",
          data: plot2_0,
          color: '#F9844A'
        }
      ]
  };

  // Create the chart
  Highcharts.chart('chartContainer', data);
};

// Fetch the JSON file from the URL
createGraphBtn.addEventListener('click', function(){
  
  // Get all the values from the textbox
  nameValue = formatString('name', nameTextBox.value);
  officeValue = officeTextBox.value;
  beginValue = formatString('date', beginTextBox.value);
  endValue = formatString('date', endTextBox.value);

  url = createUrl()
  
  // https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=Sub-Casey%20Fork.Elev.Inst.~1Day.0.datman-rev&office=MVS&begin=2020-06-08T01%3A46%3A23.964Z&end=2021-06-16T17%3A46%3A23.964Z&timezone=CST6CDT"

  if (nameValue && officeValue && beginValue && endValue){
    fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json(); // Parse the JSON from the response
  })
  .then(data => {
    let dataObj = data["time-series"]["time-series"][0]["irregular-interval-values"]["values"];
    //alert(dataObj);
    // Do something with the data
    processData(dataObj);
  })
  .catch(error => {
    // Handle any errors that occurred during the fetch
    console.error('There has been a problem with your fetch operation:', error);
    alert("There was a problem getting the Data.")
  });
  } else {
    alert("Enter values for each text box.")
  }
  
  
})

// Function to create the url
function createUrl() {
  return domain + timeSeries + "name=" + nameValue + "&office=" + officeValue + "&begin=" + beginValue + "&end=" + endValue + "&timezone=" + timeZone
}

// Function to format string
function formatString(textField, stringText) {
  if (textField == "name") {
    let output = stringText.replace(/ /g, '%20');
    return output
  } else if (textField == "date") {
    let output = stringText.replace(/:/g, '%3A');
    output = output.replace(/ /g, "T")
    return output + "Z"
  }
}

// Fix columns lenght
function padString(str, length) {
  return str + ' '.repeat(length - str.length);
}

// Function to download TextFile
function createTableTextFile(data, headers, introText, filename) {
  // Determine the maximum length of each column
  const columnWidths = headers.map((header, index) => {
      return Math.max(header.length, ...data.map(row => row[index].toString().length));
  });

  // Format the headers with padding
  const headerRow = headers.map((header, index) => padString(header, columnWidths[index])).join('  ');

  // Format the data rows with padding
  const dataRows = data.map(row => row.map((cell, index) => padString(cell.toString(), columnWidths[index])).join('  '));

  // Combine the introduction, headers, and data rows
  const tableText = [introText, headerRow, ...dataRows].join('\n');

  // Create a Blob object from the table data
  const blob = new Blob([tableText], { type: 'text/plain' });

  // Create a temporary URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a new anchor element
  const a = document.createElement('a');

  // Set the href and download attributes of the anchor element
  a.href = url;
  a.download = filename;

  // Programmatically trigger a click on the anchor element
  a.click();

  // Revoke the Blob URL
  URL.revokeObjectURL(url);
}

// Add each row to the column
function addRowsToTable(eventList, eventFt) {

  let tempTable = [];
  let tempRow = [];

  // Check if there is at least one event
  if (eventList[0].length > 0) {

    if (eventList[0].length > 1) {
      eventList[0].forEach((value, index) => {
        tempRow.push(eventFt + " ft");
        tempRow.push(value.length);
        tempRow.push(eventList[1][index][0]);
        tempRow.push(eventList[1][index][eventList[1][index].length - 1]);
        tempTable.push(tempRow);
        tempRow = [];
      })
    } else {
      tempRow.push(eventFt + " ft");
      tempRow.push(eventList[0][0].length);
      tempRow.push(eventList[1][0][0]);
      tempRow.push(eventList[1][0][eventList[1][0].length - 1]);
      tempTable.push(tempRow);
      tempRow = [];
    }
    
  };
  return tempTable
}

// FUnction to get settings
function getRegulationLimits() {
  let regLimitvalues = [];
  if (regTextBox.value) {
    let splitText = regTextBox.value.split('-');
    regLimitvalues.push(parseFloat(splitText[0].trim()));
    regLimitvalues.push(parseFloat(splitText[1].trim()));
  };
  return regLimitvalues;
}
