(function () {
  let sessionLength = 25;
  let breakLength = 5;
  let remainingSeconds = sessionLength * 60;
  let countDownTimer;
  let currentMode = "Session";
  let counterRunning = false;

  document.querySelector("#time-left").textContent = formatTime(
    remainingSeconds
  );
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
      remainingSeconds = sessionLength * 60;
    }
    document.querySelector("#break-length").textContent = breakLength;
    document.querySelector("#session-length").textContent = sessionLength;
    render();
  }

  function render() {
    const totalSeconds =
      currentMode === "Session" ? sessionLength * 60 : breakLength * 60;
    const per = Math.round((1 - remainingSeconds / totalSeconds) * 100);

    document.querySelector(
      "#timer"
    ).style.backgroundImage = `linear-gradient(to top,${getFillColor()},${getFillColor()} ${per}%,#333333 ${per}%)`;
    document.querySelector("#time-left").textContent = formatTime(
      remainingSeconds
    );
  }

  function formatTime(seconds) {
    let minutesToShow = Math.floor(seconds / 60);
    if (minutesToShow < 10) {
      minutesToShow = "0" + minutesToShow;
    }
    let secondsToShow = seconds % 60;
    if (secondsToShow < 10) {
      secondsToShow = "0" + secondsToShow;
    }
    return minutesToShow + ":" + secondsToShow;
  }

  function changeTimes(e) {
    // modify sessionLength and breakLength, reset timer;
    if (counterRunning === false && e.target.nodeName === "BUTTON") {
      switch (e.target.id) {
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
        remainingSeconds = sessionLength * 60;
      } else {
        remainingSeconds = breakLength * 60;
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
      remainingSeconds = breakLength * 60;
    } else {
      currentMode = "Session";
      remainingSeconds = sessionLength * 60;
    }
    document.querySelector("#timer-label").textContent = currentMode;
    render();
  }

  function getFillColor() {
    return currentMode === "Session" ? "green" : "red";
  }
})();
