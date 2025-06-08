const MUSCLE_GROUPS = [
    'Chest',
    'Back',
    'Legs',
    'Shoulders',
    'Arms',
    'Core',
    'Full Body'
];

document.addEventListener('DOMContentLoaded', () => {
    const daySelect = document.getElementById('day-select');
    const muscleSelect = document.getElementById('muscle-group');
    const exercisesContainer = document.getElementById('exercises');
    const addExerciseBtn = document.getElementById('add-exercise');
    const saveDayBtn = document.getElementById('save-day');
    const savePlanBtn = document.getElementById('save-plan');
    const statusEl = document.getElementById('status');

    const plan = {};

    MUSCLE_GROUPS.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m;
        muscleSelect.appendChild(opt);
    });

    function createExerciseRow(data = {}) {
        const row = document.createElement('div');
        row.className = 'exercise-row';
        row.innerHTML = `
            <input type="text" class="form-control ex-name" placeholder="Name" value="${data.name || ''}" required>
            <input type="number" class="form-control ex-sets" placeholder="Sets" value="${data.sets || ''}" min="1" max="10" required>
            <input type="text" class="form-control ex-reps" placeholder="Reps" value="${data.reps || ''}" pattern="\\d+(?:-\\d+)?" required>
            <input type="number" class="form-control ex-rest" placeholder="Rest" value="${data.rest_sec || ''}" min="0" max="600">
            <input type="text" class="form-control ex-superset" placeholder="Superset" value="${data.superset_with || ''}">
            <button type="button" class="btn btn-danger btn-sm remove-exercise">&times;</button>
        `;
        row.querySelector('.remove-exercise').addEventListener('click', () => row.remove());
        return row;
    }

    function loadDay(day) {
        exercisesContainer.innerHTML = '';
        muscleSelect.querySelectorAll('option').forEach(opt => opt.selected = false);
        if (plan[day]) {
            const muscles = (plan[day].muscle_group || '').split(/,\s*/);
            Array.from(muscleSelect.options).forEach(opt => {
                if (muscles.includes(opt.value)) opt.selected = true;
            });
            plan[day].exercises.forEach(ex => {
                exercisesContainer.appendChild(createExerciseRow(ex));
            });
        }
    }

    addExerciseBtn.addEventListener('click', () => {
        exercisesContainer.appendChild(createExerciseRow());
    });

    daySelect.addEventListener('change', e => loadDay(e.target.value));

    saveDayBtn.addEventListener('click', () => {
        const day = daySelect.value;
        const muscleVals = Array.from(muscleSelect.selectedOptions).map(o => o.value);
        const muscle = muscleVals.join(', ');
        const rows = exercisesContainer.querySelectorAll('.exercise-row');
        const exercises = [];
        rows.forEach(row => {
            const name = row.querySelector('.ex-name').value.trim();
            const sets = parseInt(row.querySelector('.ex-sets').value, 10);
            const reps = row.querySelector('.ex-reps').value.trim();
            const rest = parseInt(row.querySelector('.ex-rest').value, 10);
            const superset = row.querySelector('.ex-superset').value.trim();
            if (name && !isNaN(sets) && sets >= 1 && sets <= 10 && reps && /^\d+(?:-\d+)?$/.test(reps)) {
                const ex = { name, sets, reps };
                if (!isNaN(rest) && rest >= 0 && rest <= 600) ex.rest_sec = rest;
                if (superset) ex.superset_with = superset;
                exercises.push(ex);
            }
        });
        if (muscle && exercises.length) {
            plan[day] = { muscle_group: muscle, exercises };
            statusEl.textContent = `Saved ${daySelect.options[daySelect.selectedIndex].text}`;
            statusEl.className = 'status-success';
        } else {
            statusEl.textContent = 'Enter a muscle group and at least one exercise.';
            statusEl.className = 'status-error';
        }
    });

    savePlanBtn.addEventListener('click', () => {
        if (Object.keys(plan).length === 0) {
            statusEl.textContent = 'Add at least one day before saving.';
            statusEl.className = 'status-error';
            return;
        }
        localStorage.setItem('workoutPlan', JSON.stringify(plan));
        statusEl.textContent = 'Plan saved! Return to the main page.';
        statusEl.className = 'status-success';
    });

    loadDay(daySelect.value);
});
