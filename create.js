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
    const muscleMenu = document.getElementById('muscle-group');
    const muscleDropdownBtn = document.getElementById('muscleDropdown');
    const exercisesContainer = document.getElementById('exercises');
    const addExerciseBtn = document.getElementById('add-exercise');
    const saveDayBtn = document.getElementById('save-day');
    const savePlanBtn = document.getElementById('save-plan');
    const statusEl = document.getElementById('status');
    const form = $('#plan-form');

    let selectedMuscles = [];

    const plan = {};
    let exCounter = 0;

    form.validate({
        errorClass: 'is-invalid',
        validClass: 'is-valid',
        onkeyup: function(element) { $(element).valid(); }
    });

    function updateMuscleButton() {
        muscleDropdownBtn.textContent = selectedMuscles.length ? selectedMuscles.join(', ') : 'Select Muscle Groups';
    }

    MUSCLE_GROUPS.forEach(m => {
        const li = document.createElement('li');
        li.innerHTML = `<label class="dropdown-item"><input type="checkbox" value="${m}" class="me-2"> ${m}</label>`;
        muscleMenu.appendChild(li);
    });

    muscleMenu.addEventListener('change', e => {
        if (e.target.type === 'checkbox') {
            const val = e.target.value;
            if (e.target.checked) {
                if (!selectedMuscles.includes(val)) selectedMuscles.push(val);
            } else {
                selectedMuscles = selectedMuscles.filter(v => v !== val);
            }
            updateMuscleButton();
        }
    });

    updateMuscleButton();
    function createExerciseRow(data = {}) {
        exCounter++;
        const row = document.createElement('div');
        row.className = 'exercise-row';
        row.innerHTML = `
            <input type="text" name="ex-name-${exCounter}" class="form-control ex-name" placeholder="Name" value="${data.name || ''}" required>
            <input type="number" name="ex-sets-${exCounter}" class="form-control ex-sets" placeholder="Sets" value="${data.sets || ''}" min="1" max="10" required>
            <input type="text" name="ex-reps-${exCounter}" class="form-control ex-reps" placeholder="Reps" value="${data.reps || ''}" pattern="\\d+(?:-\\d+)?" required>
            <input type="number" name="ex-rest-${exCounter}" class="form-control ex-rest" placeholder="Rest" value="${data.rest_sec || ''}" min="0" max="600">
            <input type="text" name="ex-superset-${exCounter}" class="form-control ex-superset" placeholder="Superset" value="${data.superset_with || ''}">
            <button type="button" class="btn btn-danger btn-sm remove-exercise">&times;</button>
        `;
        row.querySelector('.remove-exercise').addEventListener('click', () => row.remove());
        $(row).find('input').on('input', function(){ $('#plan-form').validate().element(this); });
        return row;
    }

    function loadDay(day) {
        exercisesContainer.innerHTML = '';
        selectedMuscles = [];
        muscleMenu.querySelectorAll('input[type=checkbox]').forEach(cb => {
            cb.checked = false;
        });
        if (plan[day]) {
            const muscles = (plan[day].muscle_group || '').split(/,\s*/);
            muscleMenu.querySelectorAll('input[type=checkbox]').forEach(cb => {
                cb.checked = muscles.includes(cb.value);
                if (cb.checked) selectedMuscles.push(cb.value);
            });
            plan[day].exercises.forEach(ex => {
                exercisesContainer.appendChild(createExerciseRow(ex));
            });
        }
        updateMuscleButton();
    }

    addExerciseBtn.addEventListener('click', () => {
        exercisesContainer.appendChild(createExerciseRow());
    });

    daySelect.addEventListener('change', e => loadDay(e.target.value));

    saveDayBtn.addEventListener('click', () => {
        if (!form.valid()) return;

        const day = daySelect.value;
        const muscle = selectedMuscles.join(', ');
        const rows = exercisesContainer.querySelectorAll('.exercise-row');
        const exercises = [];
        rows.forEach(row => {
            const name = row.querySelector('.ex-name').value.trim();
            const sets = parseInt(row.querySelector('.ex-sets').value, 10);
            const reps = row.querySelector('.ex-reps').value.trim();
            const rest = parseInt(row.querySelector('.ex-rest').value, 10);
            const superset = row.querySelector('.ex-superset').value.trim();
            const ex = { name, sets, reps };
            if (!isNaN(rest)) ex.rest_sec = rest;
            if (superset) ex.superset_with = superset;
            exercises.push(ex);
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
        if (!form.valid()) return;
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
