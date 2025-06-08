document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('logs-container');
  const logs = JSON.parse(localStorage.getItem('workoutLogs') || '{}');
  if (Object.keys(logs).length === 0) {
    container.innerHTML = '<p class="text-center">No logs recorded.</p>';
    return;
  }
  const table = document.createElement('table');
  table.className = 'table table-sm';
  table.innerHTML = '<thead><tr><th>Date</th><th>Exercise</th><th>Set</th><th>Weight (kg)</th></tr></thead><tbody></tbody>';
  const tbody = table.querySelector('tbody');
  Object.keys(logs).sort().forEach(date => {
    const exs = logs[date].exercises || {};
    Object.keys(exs).forEach(name => {
      exs[name].forEach((w, idx) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${date}</td><td>${name}</td><td>${idx + 1}</td><td>${w ?? ''}</td>`;
        tbody.appendChild(row);
      });
    });
  });
  container.appendChild(table);
});
