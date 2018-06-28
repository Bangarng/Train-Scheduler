









//Start flipclock
var clock;
clock = $('.clock').FlipClock({
    clockFace: 'TwelveHourClock'
});

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAJvGLFYBT4VuQICdPWcWwZYksWtndmZfk",
    authDomain: "btm-train-scheduler.firebaseapp.com",
    databaseURL: "https://btm-train-scheduler.firebaseio.com",
    projectId: "btm-train-scheduler",
    storageBucket: "btm-train-scheduler.appspot.com",
    messagingSenderId: "111640507626"
  };
  firebase.initializeApp(config);

var trainDatabase = firebase.database();

//create variables
var trainName = "";
var trainDest = "";
var trainTime = "";
var trainFreq = "";
//moment time conversion
var currentTime = "";


$("#add-train").on("click", function(event) {
    event.preventDefault();
    alert("clicked");
    console.log("Clicked");

    //Get form inputs
    trainName = $("#name-input").val().trim();
    trainDest = $("#dest-input").val().trim();
    trainTime = $("#first-time-input").val().trim();
    trainFreq = $("#freq-input").val().trim();
    //moment variables
    currentTime = moment();

    console.log("Variables");
    console.log(trainName + ", " + trainDest + ", " + trainTime + ", " + trainFreq + ", " + currentTime);
    
    // Code for the push
    trainDatabase.ref().push({
        name: trainName,
        destination: trainDest,
        time: trainTime,
        frequency: trainFreq,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});

    // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
    trainDatabase.ref().on("child_added", function(childSnapshot) {
      
        // Log everything that's coming out of snapshot
        console.log(childSnapshot.val().name);
        console.log(childSnapshot.val().name);
        console.log(childSnapshot.val().email);
        console.log(childSnapshot.val().age);
        console.log(childSnapshot.val().comment);
        console.log(childSnapshot.val().joinDate);
        
        // full list of items to the well
       /* $("#full-member-list").append("<div class='well'><span class='member-name'> " + childSnapshot.val().name +
          " </span><span class='member-email'> " + childSnapshot.val().email +
            " </span><span class='member-age'> " + childSnapshot.val().age +
              " </span><span class='member-comment'> " + childSnapshot.val().comment + " </span></div>");
              */
        // Handle the errors
      }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });

/***************************************/
/***************************************/
      var dataRef = firebase.database();

//initial values
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = "";
var nextTrain = "";
var nextTrainFormatted = "";
var firstTimeConverted = "";
var currentTime = "";
var diffTime = "";
var tRemainder = "";
var minutesTillTrain = "";


$(document).ready(function() {

     $("#add-train").on("click", function() {
     	event.preventDefault();

     	trainName = $('#name-input').val().trim();
     	destination = $('#destination-input').val().trim();
     	firstTrainTime = $('#first-train-time-input').val().trim();
     	frequency = $('#frequency-input').val().trim();
        firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
         currentTime = moment();
         
         diffTime = moment().diff(moment(firstTimeConverted), "minutes");
         tRemainder = diffTime % frequency;
         minutesTillTrain = frequency - tRemainder;
         nextTrain = moment().add(minutesTillTrain, "minutes");
         nextTrainFormatted = moment(nextTrain).format("hh:mm");

     	// Code for the push
     	dataRef.ref().push({
     	trainName: trainName,
     	destination: destination,
     	firstTrainTime: firstTrainTime,  
     	frequency: frequency,
        nextTrainFormatted: nextTrainFormatted,
        minutesTillTrain: minutesTillTrain
             // dateAdded: firebase.database.ServerValue.TIMESTAMP
     	});

        trainName = $('#name-input').val().trim();
     	destination = $('#destination-input').val().trim();
     	firstTrainTime = $('#first-train-time-input').val().trim();
     	frequency = $('#frequency-input').val().trim();

     	return false;
     });
     dataRef.ref().on("child_added", function(childSnapshot) {

     // Log everything that's coming out of snapshot
      console.log(childSnapshot.val().trainName);
      console.log(childSnapshot.val().destination);
      console.log(childSnapshot.val().frequency);
      console.log(childSnapshot.val().nextTrainFormatted);
      console.log(childSnapshot.val().minutesTillTrain);

	// full list of items to the well
		$('.train-schedule').append("<tr class='table-row' id=" + "'" + childSnapshot.val() + "'" + ">" +
               "<td class='col-xs-3'>" + childSnapshot.val().trainName +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().destination +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().frequency +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().nextTrainFormatted + // Next Arrival Formula ()
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().minutesTillTrain + // Minutes Away Formula
               "</td>" +
               "<td class='col-xs-1'>" + "<input type='submit' value='remove train' class='remove-train btn btn-primary btn-sm'>" + "</td>" +
          "</tr>");

// Handles the errors
}, function(errorObject){
	console.log("Errors handled: " + errorObject.code)
});
