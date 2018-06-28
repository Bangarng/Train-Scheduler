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
var firstTrainTime = "";
var trainFreq = "";
var nextTrain = "";
var trainItemCount = 0;
//moment time conversion
var currentTime = "";
var convertFirstTime = "";
var nextTrainFormatted = "";
var timeDiff = "";
var timeRemainder = "";
var minTilTrain = "";

$("#add-train").on("click", function(event) {
    event.preventDefault();

    //Get form inputs
    trainName = $("#name-input").val().trim();
    trainDest = $("#dest-input").val().trim();
    firstTrainTime = $("#first-time-input").val().trim();
    trainFreq = $("#freq-input").val().trim();
    //moment variables
    currentTime = moment();
    convertedFirstTime = moment(firstTrainTime, "hh:mm").subtract(1, "years");
         
    diffTime = moment().diff(moment(convertedFirstTime), "minutes");
    tRemainder = diffTime % trainFreq;
    minutesTillTrain = trainFreq - tRemainder;
    nextTrain = moment().add(minutesTillTrain, "minutes");
    nextTrainFormatted = moment(nextTrain).format("hh:mm");

    // Code for the push
    trainDatabase.ref().push({
    trainName: trainName,
    destination: trainDest,
    firstTrainTime: firstTrainTime,  
    frequency: trainFreq,
    nextTrainFormatted: nextTrainFormatted,
    minutesTillTrain: minutesTillTrain
            // dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    console.log(trainName + ", " + trainDest + ", " + firstTrainTime + ", " + trainFreq + ", " + currentTime + ", " + convertedFirstTime);

    clearEntries();
});

    // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
    trainDatabase.ref().on("child_added", function(childSnapshot) {
      
        //Log everything that's coming out of snapshot
        console.log("Firebase Train Data");
        console.log(childSnapshot.val().trainName);
        console.log(childSnapshot.val().destination);
        console.log(childSnapshot.val().firstTrainTime);
        console.log(childSnapshot.val().frequency);
        console.log(childSnapshot.val().nextTrainFormatted);
        console.log(childSnapshot.val().minutesTilTrain);
        
        //add items to the table with remove item box

        var trainInfo = $('<tr>');
        trainInfo.attr("id", "item-" + trainItemCount);
        var trainDetail = 
        "<td class=''>" + childSnapshot.val().trainName + "</td>" +
        "<td class=''>" + childSnapshot.val().destination + "</td>" +
        "<td class=''>" + childSnapshot.val().frequency + "</td>" + 
        "<td class=''>" + childSnapshot.val().nextTrainFormatted + "</td>" +
        "<td class=''>" + childSnapshot.val().minutesTillTrain + "</td>" +

        "<td class=''></td>";
        trainInfo.append(trainDetail);

        var removeTrain = $('<button class="remove-train-button btn">');
        removeTrain.attr("data-train-number", trainItemCount);
        removeTrain.append("Remove Train");

        trainInfo = trainInfo.append(removeTrain);

        $('#train-schedules').append(trainInfo);

        // Add to the trainItemCount
        trainItemCount++;
              
        // Handle the errors
      }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });

    //Clear form inputs    
    function clearEntries() {
        $("#name-input").val("");
        $("#dest-input").val("");
        $("#first-time-input").val("");
        $("#freq-input").val("");
    }

    //Remove Train
    $(document.body).on("click", ".remove-train-button", function() {

        // Get the number of the button from its data attribute and hold in a variable called  toDoNumber.
        var trainItemCount = $(this).attr("data-train-number");
  
        // Select and Remove the specific <p> element that previously held the to do item number.
        $("#item-" + trainItemCount).remove();
      });