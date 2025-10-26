let piValues = [];
let alphaValues = [];
let errorValues = [];
let chartPi, chartError;
let animationInterval = null;

function updateSlider(value) {
  document.getElementById("alphaValue").innerText = value;
  drawCircle(value);
}

function calculatePi(alpha) {
  const m = 180 / alpha;
  const h = Math.sin(alpha * Math.PI / 180);
  return m * h;
}

function calculatePiOnce() {
  const alpha = parseFloat(document.getElementById("alphaSlider").value);
  addDataPoint(alpha);
}

function addDataPoint(alpha) {
  const pi = calculatePi(alpha);
  const errorPercent = Math.abs((pi - Math.PI) / Math.PI) * 100;

  alphaValues.push(alpha);
  piValues.push(pi);
  errorValues.push(errorPercent);

  document.getElementById("result").innerText =
    `α = ${alpha.toFixed(1)}° → π ≈ ${pi.toFixed(6)} | Sai số = ${errorPercent.toFixed(3)}%`;

  drawCircle(alpha);
  updateCharts();
}

function autoRunSimulation() {
  if (animationInterval) return;
  resetSimulation();

  let alpha = 60;
  animationInterval = setInterval(() => {
    addDataPoint(alpha);
    alpha -= 1;
    document.getElementById("alphaSlider").value = alpha;
    document.getElementById("alphaValue").innerText = alpha;
    if (alpha < 1) clearInterval(animationInterval), animationInterval = null;
  }, 300);
}

function resetSimulation() {
  piValues = [];
  alphaValues = [];
  errorValues = [];
  if (chartPi) chartPi.destroy();
  if (chartError) chartError.destroy();
  document.getElementById("result").innerText = "";
  clearInterval(animationInterval);
  animationInterval = null;
}

function updateCharts() {
  const ctx1 = document.getElementById("piChart").getContext("2d");
  const ctx2 = document.getElementById("errorChart").getContext("2d");

  if (!chartPi) {
    chartPi = new Chart(ctx1, {
      type: "line",
      data: {
        labels: alphaValues,
        datasets: [
          {
            label: "Giá trị π xấp xỉ",
            data: piValues,
            borderColor: "rgb(37,99,235)",
            backgroundColor: "rgba(37,99,235,0.2)",
            fill: false,
            tension: 0.2
          },
          {
            label: "Giá trị thật π = 3.1416",
            data: alphaValues.map(() => Math.PI),
            borderColor: "rgba(220,38,38,0.7)",
            borderDash: [5, 5],
            pointRadius: 0
          }
        ]
      },
      options: {
        plugins: {
          title: { display: true, text: "So sánh π xấp xỉ và π thật" },
          legend: { position: "bottom" }
        },
        scales: {
          x: { title: { display: true, text: "Góc α (độ)" } },
          y: { title: { display: true, text: "Giá trị π" }, min: 2.5, max: 3.5 }
        }
      }
    });
  } else chartPi.update();

  if (!chartError) {
    chartError = new Chart(ctx2, {
      type: "line",
      data: {
        labels: alphaValues,
        datasets: [{
          label: "Sai số (%)",
          data: errorValues,
          borderColor: "rgb(220,38,38)",
          backgroundColor: "rgba(220,38,38,0.1)",
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        plugins: {
          title: { display: true, text: "Sai số (%) theo góc α" },
          legend: { position: "bottom" }
        },
        scales: {
          x: { title: { display: true, text: "Góc α (độ)" } },
          y: { title: { display: true, text: "Sai số (%)" }, min: 0, max: 20 }
        }
      }
    });
  } else chartError.update();
}

function drawCircle(alpha) {
  const canvas = document.getElementById("circleCanvas");
  const ctx = canvas.getContext("2d");
  const r = 100, cx = 150, cy = 150;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.strokeStyle = "#1E3A8A";
  ctx.lineWidth = 2;
  ctx.stroke();

  const x1 = cx + r;
  const y1 = cy;
  const x2 = cx + r * Math.cos(alpha * Math.PI / 180);
  const y2 = cy - r * Math.sin(alpha * Math.PI / 180);

  // Cung và tam giác
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = "#DC2626";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = "#2563EB";
  ctx.stroke();

  ctx.fillStyle = "#000";
  ctx.font = "14px sans-serif";
  ctx.fillText(`α = ${alpha.toFixed(1)}°`, cx + 20, cy - 10);
}
