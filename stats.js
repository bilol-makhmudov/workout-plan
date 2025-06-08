function buildSeries(logs) {
  const series = {};
  Object.keys(logs).forEach(date => {
    const exs = logs[date].exercises || {};
    Object.keys(exs).forEach(name => {
      const weights = exs[name].filter(w => typeof w === 'number');
      if (weights.length === 0) return;
      const maxW = Math.max(...weights);
      if (!series[name]) series[name] = [];
      series[name].push({ date, weight: maxW });
    });
  });
  Object.values(series).forEach(arr => arr.sort((a,b) => new Date(a.date) - new Date(b.date)));
  return series;
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('stats-container');
  const logs = JSON.parse(localStorage.getItem('workoutLogs') || '{}');
  if (Object.keys(logs).length === 0) {
    container.innerHTML = '<p class="text-center">No logs yet.</p>';
    return;
  }

  const series = buildSeries(logs);
  let idx = 0;
  Object.keys(series).forEach(name => {
    const wrapper = document.createElement('div');
    wrapper.className = 'mb-4';
    wrapper.innerHTML = `<h5 class="mb-2">${name}</h5><canvas id="chart-${idx}"></canvas>`;
    container.appendChild(wrapper);
    const ctx = wrapper.querySelector('canvas').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: series[name].map(p => p.date),
        datasets: [{
          label: 'Weight (kg)',
          data: series[name].map(p => p.weight),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.1,
          fill: false
        }]
      },
      options: {
        scales: {
          y: {
            title: { display: true, text: 'kg' }
          },
          x: {
            title: { display: true, text: 'Date' }
          }
        }
      }
    });
    idx++;
  });
});
