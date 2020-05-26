(function () {
  const $ = document.querySelector.bind(document);

  let sessionLength = 25;
  let breakLength = 5;
  let remainingSeconds = sessionLength * 60;
  let countDownTimer;
  let isBreak = false;
  let counterRunning = false;

  const beep = $("#beep");

  $("#start_stop").addEventListener("click", toggleTimer);
  $("#controls").addEventListener("click", changeTimes);
  $("#reset").addEventListener("click", reset);

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
      beep.play();
      switchMode();
    }
    render();
  }

  function reset() {
    stopTimer();
    beep.pause();
    beep.currentTime = 0;
    breakLength = 5;
    sessionLength = 25;
    isBreak = false;
    remainingSeconds = sessionLength * 60;
    render();
  }

  function render() {
    $("#break-length").textContent = breakLength;
    $("#session-length").textContent = sessionLength;
    $("#timer-label").textContent = isBreak ? "Break!" : "Session";
    $("#time-left").textContent = formatTime(remainingSeconds);
    $("#timer").style.background = getBackgroundGradient();
  }

  function getBackgroundGradient() {
    const totalSeconds = isBreak ? breakLength * 60 : sessionLength * 60;
    const percent = Math.round((1 - remainingSeconds / totalSeconds) * 100);
    return `linear-gradient(to top,${getFillColor()},${getFillColor()} ${percent}%,#333333 ${percent}%)`;
  }

  function formatTime(seconds) {
    const formattedMinutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const formattedSeconds = (seconds % 60).toString().padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  function changeTimes(e) {
    if (counterRunning || e.target.nodeName !== "BUTTON") {
      return;
    }

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

    remainingSeconds = isBreak ? breakLength * 60 : sessionLength * 60;

    render();
  }

  function switchMode() {
    isBreak = !isBreak;
    remainingSeconds = isBreak ? breakLength * 60 : sessionLength * 60;
  }

  function getFillColor() {
    return isBreak ? "red" : "green";
  }
})();
