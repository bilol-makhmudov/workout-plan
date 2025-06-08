const DAY_TO_PLAN = {
  0: "7",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5", 
  6: "6" 
};

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let currentDay = new Date().getDay();

const titleEl = document.getElementById("day-title");
const muscleGroupEl = document.getElementById("muscle-group");
const containerEl = document.getElementById("workout-container");
const prevBtn = document.getElementById("prev-day");
const nextBtn = document.getElementById("next-day");

let workoutsCache = null;

function createExerciseEl({ name, sets, reps, rest_sec, superset_with }, dayIdx) {
  const wrapper = document.createElement("div");
  wrapper.className = "exercise";

  const header = document.createElement("div");
  header.className = "exercise-header";
  header.innerHTML = `<h3 class="exercise-name">${name}</h3>`;

  const details = document.createElement("div");
  details.className = "exercise-details";
  details.innerHTML = `
      <p class="sets-reps"><i class="fas fa-dumbbell"></i> ${sets}×${reps}</p>
      <p class="rest"><i class="fas fa-clock"></i> Rest ${rest_sec}s</p>
      ${superset_with ? `<p class="superset"><i class="fas fa-arrows-alt-h"></i> Superset: ${superset_with}</p>` : ""}
  `;

  wrapper.append(header, details);
  wrapper.addEventListener('click', () => {
    const url = new URL('log.html', window.location.href);
    url.searchParams.set('day', dayIdx);
    url.searchParams.set('exercise', name);
    window.location.href = url.toString();
  });
  return wrapper;
}

function renderWorkout(dayIndex) {
  containerEl.innerHTML = "";

  const dayName = DAYS[dayIndex];
  titleEl.textContent = `${dayName}'s Workout`;

  if (!workoutsCache) {
       muscleGroupEl.textContent = "";
       containerEl.innerHTML = `<div class="info-message" style="text-align: center; color: #3498db; margin-top: 20px;">
                                   <p>No workout plan found.</p>
                                   <p>Please <a href="create.html" style="color: #3498db; font-weight: bold;">create a plan</a> to get started.</p>
                                </div>`;
       return; // Exit the function
  }

  const planKey = DAY_TO_PLAN[dayIndex];
  if (!planKey || !workoutsCache?.[planKey]) {
      muscleGroupEl.textContent = `Rest Day (${dayName})`;
      containerEl.innerHTML = `
          <div class="rest-day">
              <i class="fas fa-couch"></i>
              <p>It's important to rest and recover.</p>
          </div>
      `;
      return;
  }

  const { muscle_group, exercises } = workoutsCache[planKey];
  muscleGroupEl.textContent = `Target: ${muscle_group}`;

  const fragment = document.createDocumentFragment();
  exercises.forEach(ex => {
      fragment.appendChild(createExerciseEl(ex, dayIndex));
  });
  containerEl.appendChild(fragment);
}

function init() {
  [prevBtn, nextBtn].forEach(btn => btn.disabled = true);

  try {
      const savedPlan = localStorage.getItem('workoutPlan');

      if (savedPlan) {
          console.log("Loading workout plan from localStorage.");
          try {
              workoutsCache = JSON.parse(savedPlan);
              if (typeof workoutsCache !== 'object' || workoutsCache === null || Object.keys(workoutsCache).length === 0) {
                   throw new Error("Invalid data structure or empty object in localStorage.");
              }
               console.log("Workout plan loaded successfully from localStorage.");
          } catch (parseError) {
              console.error("Error parsing workout plan from localStorage:", parseError);
              localStorage.removeItem('workoutPlan');
              workoutsCache = null;
               console.log("Corrupt localStorage data removed.");
          }
      } else {
           console.log("No saved plan found in localStorage.");
           workoutsCache = null;
      }

      renderWorkout(currentDay);

  } catch (err) {
      console.error("An unexpected error occurred during initialization:", err);
      titleEl.textContent = "Application Error";
      muscleGroupEl.textContent = "";
      containerEl.innerHTML = `<div class="error-message" style="text-align: center; color: #e74c3c; margin-top: 20px;">
                                  <p>An unexpected error occurred.</p>
                                  <p>Please try clearing your browser's local storage or <a href="create.html" style="color: #e74c3c; font-weight: bold;">create a plan</a>.</p>
                               </div>`;
  } finally {
      [prevBtn, nextBtn].forEach(btn => btn.disabled = false);
  }

  prevBtn.addEventListener("click", () => {
      currentDay = (currentDay + 6) % 7;
      renderWorkout(currentDay);
  });

  nextBtn.addEventListener("click", () => {
      currentDay = (currentDay + 1) % 7;
      renderWorkout(currentDay);
  });
}

document.addEventListener("DOMContentLoaded", init);
