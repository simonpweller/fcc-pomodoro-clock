(function () {
  let sessionLength = 25;
  let breakLength = 5;
  let remainingSeconds = sessionLength * 60;
  let countDownTimer;
  let isBreak = false;
  let counterRunning = false;

  document.querySelector("#time-left").textContent = formatTime(
    remainingSeconds
  );

  document.querySelector("#start_stop").addEventListener("click", toggleTimer);
  document.querySelector("#controls").addEventListener("click", changeTimes);
  document.querySelector("#reset").addEventListener("click", reset);

  render();

  function toggleTimer() {
    counterRunning ? stopTimer() : startTimer();
  }

  function stopTimer() {
    clearInterval(countDownTimer);
    counterRunning = false;
  }

  function startTimer() {
    countDownTimer = setInterval(countDown, 1000);
    counterRunning = true;
  }

  function countDown() {
    remainingSeconds--;

    if (remainingSeconds < 0) {
      document.querySelector("#beep").play();
      switchMode();
    }
    render();
  }

  function reset() {
    stopTimer();
    const beep = document.querySelector("#beep");
    beep.pause();
    beep.currentTime = 0;
    breakLength = 5;
    sessionLength = 25;
    if (isBreak) {
      switchMode();
    } else {
      remainingSeconds = sessionLength * 60;
    }
    render();
  }

  function render() {
    document.querySelector("#break-length").textContent = breakLength;
    document.querySelector("#session-length").textContent = sessionLength;

    document.querySelector("#timer-label").textContent = isBreak
      ? "Break!"
      : "Session";

    const totalSeconds = isBreak ? breakLength * 60 : sessionLength * 60;
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
      if (isBreak) {
        remainingSeconds = breakLength * 60;
      } else {
        remainingSeconds = sessionLength * 60;
      }

      render();
    }
  }

  function switchMode() {
    isBreak = !isBreak;
    remainingSeconds = isBreak ? breakLength * 60 : sessionLength * 60;
  }

  function getFillColor() {
    return isBreak ? "red" : "green";
  }
})();
