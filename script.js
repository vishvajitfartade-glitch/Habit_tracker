/* =========================================
   STREAK TRACKER
   ========================================= */

let completedDates =
    JSON.parse(localStorage.getItem("completedDates")) || [];

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();


/* =========================================
   DATE FUNCTIONS
   ========================================= */

function getDateKey(date) {
    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function getTodayKey() {
    return getDateKey(new Date());
}


/* =========================================
   SAVE DATA
   ========================================= */

function saveData() {

    localStorage.setItem(
        "completedDates",
        JSON.stringify(completedDates)
    );
}


/* =========================================
   TODAY
   ========================================= */

function updateToday() {

    const today = new Date();

    document.getElementById("todayDate").textContent =
        today.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
}


/* =========================================
   COMPLETE TODAY
   ========================================= */

function toggleToday() {

    const todayKey = getTodayKey();

    const index = completedDates.indexOf(todayKey);

    if (index === -1) {

        completedDates.push(todayKey);

    } else {

        completedDates.splice(index, 1);
    }

    saveData();

    updateDashboard();
}


/* =========================================
   CURRENT STREAK
   ========================================= */

function calculateCurrentStreak() {

    if (completedDates.length === 0) {
        return 0;
    }

    const dates = completedDates
        .map(date => new Date(date + "T00:00:00"))
        .sort((a, b) => b - a);

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const latest = dates[0];

    const differenceFromToday =
        Math.round(
            (today - latest) /
            (1000 * 60 * 60 * 24)
        );

    /*
       If the latest completion is older than yesterday,
       current streak is zero.
    */

    if (differenceFromToday > 1) {
        return 0;
    }

    let streak = 1;

    for (let i = 0; i < dates.length - 1; i++) {

        const difference =
            Math.round(
                (dates[i] - dates[i + 1]) /
                (1000 * 60 * 60 * 24)
            );

        if (difference === 1) {

            streak++;

        } else {

            break;
        }
    }

    return streak;
}


/* =========================================
   BEST STREAK
   ========================================= */

function calculateBestStreak() {

    if (completedDates.length === 0) {
        return 0;
    }

    const dates = completedDates
        .map(date => new Date(date + "T00:00:00"))
        .sort((a, b) => a - b);

    let best = 1;
    let current = 1;

    for (let i = 1; i < dates.length; i++) {

        const difference =
            Math.round(
                (dates[i] - dates[i - 1]) /
                (1000 * 60 * 60 * 24)
            );

        if (difference === 1) {

            current++;

            if (current > best) {
                best = current;
            }

        } else {

            current = 1;
        }
    }

    return best;
}


/* =========================================
   UPDATE DASHBOARD
   ========================================= */

function updateDashboard() {

    const todayKey = getTodayKey();

    const isCompleted =
        completedDates.includes(todayKey);

    const currentStreak =
        calculateCurrentStreak();

    const bestStreak =
        calculateBestStreak();

    document.getElementById(
        "currentStreak"
    ).textContent = currentStreak;

    document.getElementById(
        "completedDays"
    ).textContent = completedDates.length;

    document.getElementById(
        "totalDays"
    ).textContent = getDaysSinceStart();

    document.getElementById(
        "bestStreak"
    ).textContent = bestStreak;


    /* Button */

    const button =
        document.getElementById("completeBtn");

    const status =
        document.getElementById("goalStatus");

    if (isCompleted) {

        button.textContent =
            "✓ Completed Today";

        button.classList.add("completed");

        status.textContent =
            "Completed";

        status.classList.add("done");

    } else {

        button.textContent =
            "✓ Complete Today";

        button.classList.remove("completed");

        status.textContent =
            "Not completed";

        status.classList.remove("done");
    }


    /* Streak message */

    const message =
        document.getElementById("streakMessage");

    if (currentStreak === 0) {

        message.textContent =
            "Start your streak today!";

    } else if (currentStreak === 1) {

        message.textContent =
            "Great start! Keep going tomorrow.";

    } else if (currentStreak < 7) {

        message.textContent =
            "You're building a strong habit!";

    } else {

        message.textContent =
            "Amazing! Keep your streak alive! 🔥";
    }


    renderCalendar();
    renderHistory();
}


/* =========================================
   TOTAL DAYS
   ========================================= */

function getDaysSinceStart() {

    if (completedDates.length === 0) {
        return 0;
    }

    const dates = completedDates
        .map(date => new Date(date + "T00:00:00"));

    const firstDate =
        new Date(
            Math.min(...dates)
        );

    const today =
        new Date();

    today.setHours(0, 0, 0, 0);

    return Math.floor(
        (today - firstDate) /
        (1000 * 60 * 60 * 24)
    ) + 1;
}


/* =========================================
   CALENDAR
   ========================================= */

function renderCalendar() {

    const calendar =
        document.getElementById("calendar");

    const monthTitle =
        document.getElementById("monthTitle");

    calendar.innerHTML = "";


    const firstDay =
        new Date(
            currentYear,
            currentMonth,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            currentYear,
            currentMonth + 1,
            0
        ).getDate();


    monthTitle.textContent =
        new Date(
            currentYear,
            currentMonth
        ).toLocaleDateString(
            "en-IN",
            {
                month: "long",
                year: "numeric"
            }
        );


    /* Empty cells */

    for (let i = 0; i < firstDay; i++) {

        const empty =
            document.createElement("div");

        empty.classList.add("day", "empty");

        calendar.appendChild(empty);
    }


    /* Days */

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const date =
            new Date(
                currentYear,
                currentMonth,
                day
            );

        const dateKey =
            getDateKey(date);

        const element =
            document.createElement("div");

        element.classList.add("day");

        element.textContent = day;


        /* Completed */

        if (
            completedDates.includes(dateKey)
        ) {

            element.classList.add(
                "completed"
            );
        }


        /* Today */

        if (
            dateKey === getTodayKey()
        ) {

            element.classList.add(
                "today"
            );
        }


        calendar.appendChild(element);
    }
}


/* =========================================
   PREVIOUS MONTH
   ========================================= */

function previousMonth() {

    currentMonth--;

    if (currentMonth < 0) {

        currentMonth = 11;
        currentYear--;
    }

    renderCalendar();
}


/* =========================================
   NEXT MONTH
   ========================================= */

function nextMonth() {

    currentMonth++;

    if (currentMonth > 11) {

        currentMonth = 0;
        currentYear++;
    }

    renderCalendar();
}


/* =========================================
   HISTORY
   ========================================= */

function renderHistory() {

    const history =
        document.getElementById("history");

    history.innerHTML = "";


    if (completedDates.length === 0) {

        history.innerHTML =
            `<div class="empty-history">
                No completed days yet.
                Start your streak today! 🚀
            </div>`;

        return;
    }


    const sortedDates =
        [...completedDates]
        .sort()
        .reverse()
        .slice(0, 7);


    sortedDates.forEach(dateString => {

        const date =
            new Date(
                dateString + "T00:00:00"
            );

        const item =
            document.createElement("div");

        item.className =
            "history-item";

        item.innerHTML = `

            <div>
                <div class="history-date">
                    ${date.toLocaleDateString(
                        "en-IN",
                        {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        }
                    )}
                </div>
            </div>

            <div class="history-check">
                ✓ Completed
            </div>

        `;

        history.appendChild(item);
    });
}


/* =========================================
   MIDNIGHT RESET LOGIC
   ========================================= */

/*
   The data is not deleted at midnight.
   Instead, the dashboard automatically
   uses the new date after midnight.

   This ensures that "Today" changes correctly
   without requiring the user to refresh manually.
*/

function scheduleMidnightUpdate() {

    const now = new Date();

    const tomorrow =
        new Date(now);

    tomorrow.setDate(
        tomorrow.getDate() + 1
    );

    tomorrow.setHours(
        0,
        0,
        1,
        0
    );

    const timeUntilMidnight =
        tomorrow - now;

    setTimeout(() => {

        updateDashboard();

        scheduleMidnightUpdate();

    }, timeUntilMidnight);
}


/* =========================================
   INITIALIZE APP
   ========================================= */

updateToday();

updateDashboard();

scheduleMidnightUpdate();