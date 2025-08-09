let startPauseBtn = document.getElementById("startPause");
let lapBtn = document.getElementById("lap");
let resetBtn = document.getElementById("reset");
let display = document.getElementById("display");
let lapsList = document.getElementById("laps");

let timer = null;
let isRunning = false;
let startTime = 0;
let elapsedTime = 0;
let lapCount = 0;
let lastLapTime = 0;
let lapDurations = [];

// Format: HH:MM:SS:MS
function formatTime(ms) {
    let totalSeconds = Math.floor(ms / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
    let milliseconds = Math.floor((ms % 1000) / 10);

    return (
        String(hours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0") + ":" +
        String(milliseconds).padStart(2, "0")
    );
}

startPauseBtn.addEventListener("click", () => {
    if (!isRunning) {
        // Start
        startTime = Date.now() - elapsedTime;
        timer = setInterval(() => {
            display.textContent = formatTime(Date.now() - startTime);
        }, 10);
        startPauseBtn.textContent = "Pause";
        isRunning = true;
    } else {
        // Pause
        clearInterval(timer);
        elapsedTime = Date.now() - startTime;
        startPauseBtn.textContent = "Start";
        isRunning = false;
    }
});

resetBtn.addEventListener("click", () => {
    clearInterval(timer);
    isRunning = false;
    elapsedTime = 0;
    lapCount = 0;
    lastLapTime = 0;
    lapDurations = [];
    display.textContent = "00:00:00:00";
    startPauseBtn.textContent = "Start";
    lapsList.innerHTML = "";
});

lapBtn.addEventListener("click", () => {
    if (!isRunning) return;

    lapCount++;
    let totalElapsed = Date.now() - startTime;
    let lapDuration = totalElapsed - lastLapTime;
    lastLapTime = totalElapsed;

    lapDurations.push(lapDuration);

    let li = document.createElement("li");
    li.textContent = `Lap ${lapCount} → Total: ${formatTime(totalElapsed)} | Lap: ${formatTime(lapDuration)}`;
    li.style.opacity = "0";
    li.style.transform = "translateX(-20px)";
    lapsList.appendChild(li);

    // Animate in
    setTimeout(() => {
        li.style.transition = "all 0.3s ease";
        li.style.opacity = "1";
        li.style.transform = "translateX(0)";
    }, 10);

    // Highlight fastest/slowest
    let minTime = Math.min(...lapDurations);
    let maxTime = Math.max(...lapDurations);
    [...lapsList.children].forEach((lapItem, index) => {
        lapItem.style.color = "#fff"; // reset
        if (lapDurations[index] === minTime) {
            lapItem.style.color = "lightgreen";
        }
        if (lapDurations[index] === maxTime) {
            lapItem.style.color = "tomato";
        }
    });
});
