document.addEventListener('DOMContentLoaded', () => {
    const daySelect = document.getElementById('day-select');
    const muscleInput = document.getElementById('muscle-group');
    const exercisesContainer = document.getElementById('exercises');
    const addExerciseBtn = document.getElementById('add-exercise');
    const saveDayBtn = document.getElementById('save-day');
    const savePlanBtn = document.getElementById('save-plan');
    const statusEl = document.getElementById('status');

    const plan = {};

    function createExerciseRow(data = {}) {
        const row = document.createElement('div');
        row.className = 'exercise-row';
        row.innerHTML = `
            <input type="text" class="ex-name" placeholder="Name" value="${data.name || ''}">
            <input type="number" class="ex-sets" placeholder="Sets" value="${data.sets || ''}">
            <input type="text" class="ex-reps" placeholder="Reps" value="${data.reps || ''}">
            <input type="number" class="ex-rest" placeholder="Rest" value="${data.rest_sec || ''}">
            <input type="text" class="ex-superset" placeholder="Superset" value="${data.superset_with || ''}">
            <button type="button" class="remove-exercise">&times;</button>
        `;
        row.querySelector('.remove-exercise').addEventListener('click', () => row.remove());
        return row;
    }

    function loadDay(day) {
        exercisesContainer.innerHTML = '';
        muscleInput.value = '';
        if (plan[day]) {
            muscleInput.value = plan[day].muscle_group || '';
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
        const muscle = muscleInput.value.trim();
        const rows = exercisesContainer.querySelectorAll('.exercise-row');
        const exercises = [];
        rows.forEach(row => {
            const name = row.querySelector('.ex-name').value.trim();
            const sets = parseInt(row.querySelector('.ex-sets').value, 10);
            const reps = row.querySelector('.ex-reps').value.trim();
            const rest = parseInt(row.querySelector('.ex-rest').value, 10);
            const superset = row.querySelector('.ex-superset').value.trim();
            if (name && sets && reps) {
                const ex = { name, sets, reps };
                if (!isNaN(rest)) ex.rest_sec = rest;
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
