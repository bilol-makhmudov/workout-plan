function buildStats(logs) {
  const stats = {};
  Object.values(logs).forEach(entry => {
    const exs = entry.exercises || {};
    Object.keys(exs).forEach(name => {
      exs[name].forEach(w => {
        if (typeof w === 'number') {
          if (!stats[name] || w > stats[name]) stats[name] = w;
        }
      });
    });
  });
  return stats;
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('stats-container');
  const logs = JSON.parse(localStorage.getItem('workoutLogs') || '{}');
  if (Object.keys(logs).length === 0) {
    container.innerHTML = '<p class="text-center">No logs yet.</p>';
    return;
  }
  const stats = buildStats(logs);
  const table = document.createElement('table');
  table.className = 'table table-sm';
  table.innerHTML = '<thead><tr><th>Exercise</th><th>Best (kg)</th></tr></thead><tbody></tbody>';
  const tbody = table.querySelector('tbody');
  Object.keys(stats).forEach(name => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${name}</td><td>${stats[name]}</td>`;
    tbody.appendChild(row);
  });
  container.appendChild(table);
});
