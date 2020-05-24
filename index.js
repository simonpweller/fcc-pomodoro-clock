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

  document.querySelector("#time-left").textContent = formattedTime;
  document.querySelector("#break-length").textContent = breakLength;
  document.querySelector("#session-length").textContent = sessionLength;

  document.querySelector("#start_stop").addEventListener("click", startTimer);
  document.querySelector("#controls").addEventListener("click", changeTimes);
  document.querySelector("#reset").addEventListener("click", reset);

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
    document
      .querySelector("#start_stop")
      .removeEventListener("click", startTimer);
    document.querySelector("#start_stop").addEventListener("click", stopTimer);
  }

  function stopTimer() {
    clearInterval(countDownTimer);

    counterRunning = false;

    // Toggle event listeners
    document
      .querySelector("#start_stop")
      .removeEventListener("click", stopTimer);
    document.querySelector("#start_stop").addEventListener("click", startTimer);
  }

  function reset() {
    stopTimer();
    const beep = document.querySelector("#beep");
    beep.pause();
    beep.currentTime = 0;
    breakLength = 5;
    sessionLength = 25;
    if (currentMode === "Break!") {
      switchMode();
    } else {
      totalSeconds = sessionLength * 60;
      remainingSeconds = totalSeconds;
    }
    document.querySelector("#break-length").textContent = breakLength;
    document.querySelector("#session-length").textContent = sessionLength;
    render();
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
    document.querySelector("#time-left").textContent = formattedTime;
  }

  function formatTime(seconds) {
    var minutesToShow = Math.floor(seconds / 60);
    if (minutesToShow < 10) {
      minutesToShow = "0" + minutesToShow;
    }
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
        case "break-decrement":
          if (breakLength > 1) {
            breakLength--;
          }
          break;
        case "break-increment":
          if (breakLength < 60) {
            breakLength++;
          }
          break;
        case "session-decrement":
          if (sessionLength > 1) {
            sessionLength--;
          }
          break;
        case "session-increment":
          if (sessionLength < 60) {
            sessionLength++;
          }
      }

      //update timer;
      if (currentMode === "Session") {
        totalSeconds = sessionLength * 60;
        remainingSeconds = totalSeconds;
      } else {
        totalSeconds = breakLength * 60;
        remainingSeconds = totalSeconds;
      }

      document.querySelector("#break-length").textContent = breakLength;
      document.querySelector("#session-length").textContent = sessionLength;

      render();
    }
  }

  function switchMode() {
    document.querySelector("#beep").play();
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
    document.querySelector("#timer-label").textContent = currentMode;
    render();
  }
})();
