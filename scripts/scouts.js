// WELL DONE YOU FOUND THE NOT SO SECRET PIN CODE ALGORITHM!
var PIN = "pass"
var SEED = 100;

var stationID = document.location.search.split('=')[1];
if (stationID) document.getElementById('codingStationOrdinal').innerText = stationID;

// window.requestFullscreen;

function checkItem (el, last) {
  // alert(el.alt);

  // DO NOT ALLOW UN-CHECKING
  if (!el.checked) {
    el.checked = true;
    return;
  }

  // PROMPT FOR AND CHECK PIN
  var inputPIN = prompt('Ask your micro:bit instructor to enter their PIN to authorise this completed activity.');
  if (inputPIN != PIN + (SEED - parseInt(el.alt)).toString()) {
    el.checked = false;
    return;
  }

  // PLAY AFFIRMATION SOUND FX
  new Howl( { urls: ['sounds/complete.mp3'] } ).play();
  if (last) {
    new Howl( { urls: ['sounds/success.mp3'] } ).play();
  }
  // alert('Well done!' + '\n\n' + el.title + '\n\n' + 'Activity completed!');

}

var clock;

$(document).ready(function() {

  // Grab the current date
  var currentDate = new Date();

  // Set some date in the past. In this case, it's always been since Jan 1
  var pastDate  = new Date(currentDate.getFullYear(), 0, 1);

  // Calculate the difference in seconds between the future and current date
  var diff = 0;//currentDate.getTime() / 1000 - pastDate.getTime() / 1000;

  // Instantiate a coutdown FlipClock
  clock = $('.clock').FlipClock(diff, {
    clockFace: 'TwentyFourHourClock',
    showSeconds: false
  });
});
