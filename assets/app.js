$(document).ready(function() {
var config = {
    apiKey: "AIzaSyCjZIX6GpinF2PWBRUI0VtWeHwB8w4nfeM",
    authDomain: "train-times-2ce01.firebaseapp.com",
    databaseURL:"https://train-times-2ce01.firebaseio.com/",
    projectId: "train-times-2ce01"
  };
  firebase.initializeApp(config);
var url = "train-times-2ce01.firebaseapp.com";
var database = firebase.database();

var name ='';
var destination = '';
var firstTrainTime = '';
var frequency = '';
var nextTrain = '';
var nextTrainFormatted = '';
var minutesAway = '';
var firstTimeConverted = '';
var currentTime = '';
var diffTime = '';
var tRemainder = '';
var minutesTillTrain = '';
var keyHolder = '';
var getKey = '';
//capture button click
$("#submit").on("click", function() {

//link variable to rel html val 
    name = $('#inputTrainName').val().trim();
    destination = $('#inputDestination').val().trim();
    time = $('#inputFirstTrain').val().trim();
    frequency = $('#inputTrainFrequency').val().trim();

//PUSH ENTRIES TO FIREBASE
    database.ref().push({
        name: name,
        destination : destination,
        time : time,
        frequency : frequency,
        timeAdded: firebase.database.ServerValue.TIMESTAMP
});
    //Do not refresh
    $("input").val('');
         return false;
});
//ON CLICK CHILD ADDED FUNCTION
database.ref().on("child_added", function(childSnapshot) {
    var name = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var time = childSnapshot.val().time;
    var freq = childSnapshot.val().frequency;
console.log("Name: "+name);
console.log("Dest: "+destination);
console.log("Time"+time);
console.log("frequency"+frequency);

//CONVERT TIME
var freq = parseInt(freq);

//CURRENT TIME 
    currentTime = moment();
    console.log("Current Time: "+ moment().format('HH:mm'))
    firstTimeConverted = moment(childSnapshot.val().time,'HH:mm').subtract(1, "years");
    console.log("First Time converted: "+firstTimeConverted);
    var trainTime = moment(firstTimeConverted).format('HH:mm');
    console.log("Train Time: " + trainTime);

//Difference
    var tConverted = moment(trainTime, 'HH:mm').subtract(1,'years');
    var tDifference = moment().diff(moment(tConverted),'minutes');
    console.log("time difference: "+tDifference);

//REMAINDER
    var tRemainder = tDifference % freq;
    console.log("Time remaining: "+tRemainder);
    
//Mins till next train
    var minsAway = freq - tRemainder;
    console.log ("Mins till next train: "+minsAway);

//Next Train
    var nextTrain = moment().add(minsAway, 'minutes');
    console.log("Arrival Time: "+moment(nextTrain).format('HH:mm A'));

//Table Data
    //Append to display 
$('#currentTime').text(currentTime.format("YYYY-MM-DD HH:mm"))

$('#trainInfo').append(
		"<tr><td id='nameDisplay'>" + childSnapshot.val().name +
		"</td><td id='destDisplay'>" + childSnapshot.val().destination +
		"</td><td id='freqDisplay'>" + childSnapshot.val().frequency +
		"</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") +
		"</td><td id='awayDisplay'>" + minsAway  + ' minutes until arrival' + "</td></tr>");
 },

// Handle the errors
function(errorObject){
	console.log("Errors handled: " + errorObject.code)
});
});