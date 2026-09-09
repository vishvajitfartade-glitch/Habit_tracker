# 🔥 StreakTrack – Daily Streak Tracker

StreakTrack is a simple and responsive web application that helps users
track their daily task completion and maintain consecutive-day streaks.

The project is built using HTML5, CSS3, and Vanilla JavaScript.
It uses the browser's LocalStorage API to save completion data.

---

## 🚀 Live Demo

Add your deployed project link here:

https://your-project-link.com

---

## 📌 Project Overview

The main goal of StreakTrack is to provide an easy way to:

- Track daily task completion
- Calculate consecutive-day streaks
- Track the best streak
- View completed days on a calendar
- Store data using LocalStorage
- Display recent activity
- Automatically update the daily view after midnight

---

## ✨ Features

### 🔥 Current Streak

The application calculates the current streak by checking whether
completed dates are consecutive.

### 📅 Calendar

A monthly calendar displays:

- Completed days
- Today's date
- Previous month
- Next month

### ✅ Daily Completion

Users can click the **Complete Today** button to mark the current day
as completed.

The same button can also be used to remove today's completion.

### 🏆 Best Streak

The application calculates the longest consecutive completion streak
from all stored completion dates.

### 💾 LocalStorage

Completion data is stored in the browser using:

```javascript
localStorage
