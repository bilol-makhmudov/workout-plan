const DAY_TO_PLAN = {
  0: '7',
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6'
};

function dayIndex(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  return d.getDay();
}

document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('log-date');
  const container = document.getElementById('log-container');
  const saveBtn = document.getElementById('save-log');
  const statusEl = document.getElementById('log-status');

  const plan = JSON.parse(localStorage.getItem('workoutPlan') || '{}');

  function render(dateStr) {
    container.innerHTML = '';
    const idx = dayIndex(dateStr);
    if (idx === null) return;
    const planKey = DAY_TO_PLAN[idx];
    if (!plan || !plan[planKey]) {
      container.innerHTML = '<p class="text-center">No plan for this day.</p>';
      return;
    }
    const { exercises } = plan[planKey];
    exercises.forEach(ex => {
      const exDiv = document.createElement('div');
      exDiv.className = 'log-exercise mt-3';
      exDiv.innerHTML = `<h5>${ex.name}</h5>`;
      for (let i = 1; i <= ex.sets; i++) {
        exDiv.innerHTML += `
            <div class="input-group input-group-sm mb-1">
                <span class="input-group-text">Set ${i}</span>
                <input type="number" class="form-control weight-input" data-ex="${ex.name}" data-set="${i}" min="0" step="0.5">
                <span class="input-group-text">kg</span>
            </div>`;
      }
      container.appendChild(exDiv);
    });

    const logs = JSON.parse(localStorage.getItem('workoutLogs') || '{}');
    const entry = logs[dateStr];
    if (entry && entry.exercises) {
      container.querySelectorAll('.weight-input').forEach(input => {
        const ex = input.dataset.ex;
        const setNum = parseInt(input.dataset.set, 10) - 1;
        if (entry.exercises[ex] && entry.exercises[ex][setNum] != null) {
          input.value = entry.exercises[ex][setNum];
        }
      });
    }
  }

  const today = new Date();
  dateInput.valueAsDate = today;
  render(dateInput.value);

  dateInput.addEventListener('change', () => render(dateInput.value));

  saveBtn.addEventListener('click', () => {
    const dateStr = dateInput.value;
    if (!dateStr) return;
    const logs = JSON.parse(localStorage.getItem('workoutLogs') || '{}');
    const idx = dayIndex(dateStr);
    const exInputs = container.querySelectorAll('.weight-input');
    const exercises = {};
    exInputs.forEach(input => {
      const ex = input.dataset.ex;
      const setNum = parseInt(input.dataset.set, 10) - 1;
      if (!exercises[ex]) exercises[ex] = [];
      const val = parseFloat(input.value);
      if (!isNaN(val)) exercises[ex][setNum] = val;
    });
    logs[dateStr] = { dayIndex: idx, exercises };
    localStorage.setItem('workoutLogs', JSON.stringify(logs));
    statusEl.textContent = 'Log saved!';
    statusEl.className = 'status-success';
  });
});
