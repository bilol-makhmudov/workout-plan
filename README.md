# Workout Planner

A lightweight client-side web application for managing and viewing personalized workout plans. Create your routine directly in the browser (or upload a `plan.json` file) and the app stores it in your browser's `localStorage`. The workouts are displayed by day with simple navigation controls.

---

## Key Features

* **Client-side only**: No backend or database required.
* **Persistent storage**: Plans saved in `localStorage` across sessions.
* **JSON-based input**: Create or edit your plan directly in the browser.
* **Day-wise navigation**: View routines for each weekday.
* **Static hosting**: Ready for GitHub Pages or any static host.

---

## Usage

1. **Clone the repository**

   ```bash
   git clone <repository_url>
   cd <repository_name>
   ```

2. **Open the app**

   * Open `index.html` in a modern browser.

3. **Create your workout plan**

   * Click **Create a Custom Plan** or open `create.html`.
   * Fill in your exercises and save the plan to your browser.

4. **View today’s workout**

   * Return to `index.html`.
   * The app loads the plan from `localStorage` and displays today’s routine.

5. **Navigate between days**

   * Use the ◀️ and ▶️ buttons to switch days.

---

## JSON Format (`plan.json`)
* **Structure**: Top-level object with string keys `"1"`–`"5"`, each mapping to a daily plan object.

### Day-to-Plan Mapping

| Key | Day       | Notes       |
| --- | --------- | ----------- |
| "0" | Sunday    | Rest day    |
| "1" | Monday    | Workout day |
| "2" | Tuesday   | Workout day |
| "3" | Wednesday | Workout day |
| "4" | Thursday  | Workout day |
| "5" | Friday    | Workout day |
| "6" | Saturday  | Rest day    |

### Daily Plan Object

Each plan object must include:

* `muscle_group` (string): Target muscle group.
* `exercises` (array): List of exercise objects.

### Exercise Object

Each exercise must specify:

* `name` (string)
* `sets` (integer)
* `reps` (string, e.g., "6-8")
* `rest_sec` (integer): Rest time in seconds.
* `superset_with` (string, optional)

### Example `plan.json`

```json
{
  "1": {
    "muscle_group": "Chest",
    "exercises": [
      {
        "name": "Barbell Bench Press",
        "sets": 3,
        "reps": "6-8",
        "superset_with": "Cable Flyes",
        "rest_sec": 75
      },
      {
        "name": "Incline Dumbbell Press",
        "sets": 3,
        "reps": "8-10",
        "rest_sec": 75
      },
      {
        "name": "Cable Flyes",
        "sets": 3,
        "reps": "10-12",
        "rest_sec": 60
      }
    ]
  },
  "2": {
    "muscle_group": "Back",
    "exercises": [
      {
        "name": "Pull-Ups (or Lat Pulldown)",
        "sets": 4,
        "reps": "6-8",
        "superset_with": "Single-Arm Dumbbell Row",
        "rest_sec": 75
      },
      {
        "name": "Barbell Bent-Over Row",
        "sets": 3,
        "reps": "8-10",
        "rest_sec": 75
      },
      {
        "name": "Straight-Arm Pulldown",
        "sets": 3,
        "reps": "12-15",
        "rest_sec": 60
      },
      {
        "name": "Face Pulls",
        "sets": 3,
        "reps": "12-15",
        "rest_sec": 60
      }
    ]
  }
  // Continue entries for "3", "4", "5"
}
```
