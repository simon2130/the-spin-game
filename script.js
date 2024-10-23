const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

// Object that stores values of minimum and maximum angle for each number
const rotationValues = [
  { minDegree: 0, maxDegree: 30, value: 2 },    // Excluded
  { minDegree: 31, maxDegree: 90, value: "መስቀል"},   // Number 1
  { minDegree: 91, maxDegree: 150, value: "እንኳን አደረሳችሁ" },  // Number 6
  { minDegree: 151, maxDegree: 210, value: "ስዕል አድህኖ(ትንሹ)" }, // Number 5
  { minDegree: 211, maxDegree: 270, value: "ክር" }, // Number 4
  { minDegree: 271, maxDegree: 330, value: 3 }, // Excluded
  { minDegree: 331, maxDegree: 360, value: 2 }, // Excluded
];

// Draw limits for each number
const drawLimit = {
  1: 3, // Number 1: 3 times
  4: 3, // Number 4: 3 times
  5: 2, // Number 5: 2 times
  6: 5, // Number 6: 5 times
};

// Count the number of draws for each number
const drawCount = {
  1: 0, // Counter for number 1
  4: 0, // Counter for number 4
  5: 0, // Counter for number 5
  6: 0, // Counter for number 6
};

// Size of each piece
const data = [25, 25, 25, 25, 25, 25];

// Background color for each piece
var pieColors = [
  "#8b35bc", "#b163da", "#8b35bc", "#b163da", "#8b35bc", "#b163da"
];

// Create chart
let myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: ["መስቀል", "A4 MDF ስዕል አድህኖ", "ስዕል አድህኖ", "ክር", "ስዕል አድህኖ(ትንሹ)", "እንኳን አደረሳችሁ"],
    datasets: [
      {
        backgroundColor: pieColors,
        data: data,
      },
    ],
  },
  options: {
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      tooltip: false,
      legend: { display: false },
      datalabels: {
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 24 },
      },
    },
  },
});

// Function to check if the game is over
const checkGameOver = () => {
  return Object.keys(drawLimit).every((key) => drawCount[key] >= drawLimit[key]);
};

// Function to display value based on randomAngle
const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    // Skip numbers 2, 3, or any number that has reached its draw limit
    if (i.value === 2 || i.value === 3 || drawCount[i.value] >= drawLimit[i.value]) {
      continue; // Skip this value
    }

    // If the angleValue is between min and max, display the value
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      // Increment the draw count for this number
      drawCount[i.value] += 1;

      // Check if the game is over after updating the count
      if (checkGameOver()) {
        finalValue.innerHTML = `<p>Game Over</p>`;
        spinBtn.disabled = true;
        return; // End the game
      } else {
        finalValue.innerHTML = `<p>Value: ${i.value}</p>`;
      }

      spinBtn.disabled = false;
      break;
    }
  }
};

// Spinner count
let count = 0;
let resultValue = 101; // 100 rotations for animation and last rotation for result

// Start spinning
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  finalValue.innerHTML = `<p>መልካም እድል!</p>`;

  // Generate random degrees but exclude ranges for 2, 3, and numbers that have reached their limits
  let randomDegree;
  do {
    randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  } while (
    (randomDegree >= 0 && randomDegree <= 30) ||   // Exclude range for 2
    (randomDegree >= 331 && randomDegree <= 360) ||// Exclude range for 2
    (randomDegree >= 271 && randomDegree <= 330) ||// Exclude range for 3
    (randomDegree >= 31 && randomDegree <= 90 && drawCount[1] >= drawLimit[1]) ||   // Exclude range for 1 if drawn 30 times
    (randomDegree >= 151 && randomDegree <= 210 && drawCount[5] >= drawLimit[5]) || // Exclude range for 5 if drawn 20 times
    (randomDegree >= 211 && randomDegree <= 270 && drawCount[4] >= drawLimit[4]) || // Exclude range for 4 if drawn 30 times
    (randomDegree >= 91 && randomDegree <= 150 && drawCount[6] >= drawLimit[6])     // Exclude range for 6 if drawn 50 times
  );

  // Interval for rotation animation
  let rotationInterval = window.setInterval(() => {
    myChart.options.rotation = myChart.options.rotation + resultValue;
    myChart.update();

    // If rotation > 360 reset it back to 0
    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      valueGenerator(randomDegree);
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }
  }, 10);
});
