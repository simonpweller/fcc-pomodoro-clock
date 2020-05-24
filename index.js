(function () {
  var sessionLength = 25;
  var breakLength = 5;
  var totalSeconds = sessionLength * 60;
  var remainingSeconds = totalSeconds;
  var formattedTime = formatTime(remainingSeconds);
  var countDownTimer;
  var currentMode = "Session";
  var fillColor = (sessionColor = "green");
  var breakColor = "red";
  var per;
  var counterRunning = false;

  document.querySelector("#remainingTime").textContent = formattedTime;
  document.querySelector("#breakLength").textContent = breakLength;
  document.querySelector("#sessionLength").textContent = sessionLength;

  document.querySelector("#timer").addEventListener("click", startTimer);
  document.querySelector("#controls").addEventListener("click", changeTimes);

  function startTimer() {
    countDownTimer = setInterval(function countDown() {
      remainingSeconds--;

      if (remainingSeconds < 0) {
        switchMode();
      } else {
        render();
      }
    }, 1000);

    counterRunning = true;

    // Toggle event listeners
    document.querySelector("#timer").removeEventListener("click", startTimer);
    document.querySelector("#timer").addEventListener("click", stopTimer);
  }

  function stopTimer() {
    clearInterval(countDownTimer);

    counterRunning = false;

    // Toggle event listeners
    document.querySelector("#timer").removeEventListener("click", stopTimer);
    document.querySelector("#timer").addEventListener("click", startTimer);
  }

  function render() {
    formattedTime = formatTime(remainingSeconds);
    per = Math.round((1 - remainingSeconds / totalSeconds) * 100);

    document.querySelector("#timer").style.backgroundImage =
      "linear-gradient(to top," +
      fillColor +
      "," +
      fillColor +
      " " +
      per +
      "%,#333333 " +
      per +
      "%)";
    document.querySelector("#remainingTime").textContent = formattedTime;
  }

  function formatTime(seconds) {
    var minutesToShow = Math.floor(seconds / 60);
    var secondsToShow = seconds % 60;
    if (secondsToShow < 10) {
      secondsToShow = "0" + secondsToShow;
    }
    return minutesToShow + ":" + secondsToShow;
  }

  function changeTimes(e) {
    // modify sessionLength and breakLength, reset timer;
    var target = e.target;
    var id;

    if (counterRunning === false && target.nodeName === "BUTTON") {
      id = target.id;
      switch (id) {
        case "breakMinus":
          if (breakLength > 1) {
            breakLength--;
          }
          break;
        case "breakPlus":
          breakLength++;
          break;
        case "sessionMinus":
          if (sessionLength > 1) {
            sessionLength--;
          }
          break;
        case "sessionPlus":
          sessionLength++;
      }

      //update timer;
      if (currentMode === "Session") {
        totalSeconds = sessionLength * 60;
        remainingSeconds = totalSeconds;
      } else {
        totalSeconds = breakLength * 60;
        remainingSeconds = totalSeconds;
      }

      document.querySelector("#breakLength").textContent = breakLength;
      document.querySelector("#sessionLength").textContent = sessionLength;

      render();
    }
  }

  function switchMode() {
    if (currentMode === "Session") {
      currentMode = "Break!";
      fillColor = breakColor;
      totalSeconds = breakLength * 60;
    } else {
      currentMode = "Session";
      totalSeconds = sessionLength * 60;
      fillColor = sessionColor;
    }
    remainingSeconds = totalSeconds;
    document.querySelector("#timer > h2:first-child").textContent = currentMode;
    render();
  }
})();
