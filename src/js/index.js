let xLength = 61;
let chartBorderColor = "#FF0000";
let chartBorderWidth = 3;
let yMaxLenght = 150;
let yMinLenght = 60;
let backgroundColor = "#0000FF";
let chartXGridDisplay = false;

let config = {
  type: "line",
  data: {
    labels: getLabels(xLength),
    datasets: [
      {
        fill: false,
        data: initChartData(xLength),
        borderColor: chartBorderColor,
        borderWidth: chartBorderWidth,
        lineTension: 0,
        pointRadius: 0,
        pointHoverRadius: 0,
        categoryPercentage: 1.0,
      },
    ],
  },
  options: {
    animations: {
      x: {
        type: "number",
        easing: "liner",
        duration: 200,
      },
      y: {
        type: "number",
        easing: "liner",
        duration: 0,
      },
    },
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: chartXGridDisplay,
          drawBorder: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        position: "right",
        grid: {
          display: true,
          drawBorder: true,
          borderColor: "#000000",
          color: "#000000",
          borderWidth: 3,
          lineWidth: 3,
        },
        ticks: {
          display: true,
          color: "#000000",
          font: {
            size: 26,
          },
        },
        max: yMaxLenght,
        min: yMinLenght,
      },
    },
  },
};

window.onload = function () {
  // チャートの描画
  let ctx = document.getElementById("myChart").getContext("2d");
  window.myLine = new Chart(ctx, config);

  // ブロック要素の高さ設定
  setHeight();

  // イベント設定
  // settingsボタン
  const settings_menu_btn = document.getElementById("settings_menu_btn");
  settings_menu_btn.addEventListener("click", (e) => {
    document.getElementById("menu").classList.toggle("hidden");
    if (settings_menu_btn.textContent == "settings") {
      settings_menu_btn.textContent = "back";
    } else {
      settings_menu_btn.textContent = "settings";
    }
  });

  // 背景色変更
  const bgColor_pick = document.getElementById("bgColor_pick");
  bgColor_pick.addEventListener("change", (e) => {
    document.getElementById("chart_wapper").style.backgroundColor = e.target.value;
  });
  bgColor_pick.value = backgroundColor;

  // x軸表示・非表示
  const chartXGridDisplay_check = document.getElementById("chartXGridDisplay_check");
  chartXGridDisplay_check.addEventListener("change", (e) => {
    window.myLine.options.scales.x.grid.display = e.target.checked;
    console.log(e.target.checked);
  });
  chartXGridDisplay_check.value = chartXGridDisplay;

  // x軸範囲変更
  const chartXLength_input = document.getElementById("chartXLength_input");
  chartXLength_input.addEventListener("change", (e) => {
    window.myLine.data.labels = getLabels(e.target.value);
    window.myLine.data.datasets.forEach((dataset) => {
      dataset.data = initChartData(e.target.value);
    });
    window.myLine.update();
  });
  chartXLength_input.value = xLength;

  // y軸最大値変更
  const chartYMax_input = document.getElementById("chartYMax_input");
  chartYMax_input.addEventListener("input", (e) => {
    document.getElementById("chartYMax_disp").textContent = Math.floor(e.target.value);
  });
  chartYMax_input.addEventListener("change", (e) => {
    window.myLine.options.scales.y.max = Math.floor(e.target.value);
    window.myLine.update();
  });
  chartYMax_input.value = yMaxLenght;

  // y軸最大値変更
  const chartYMin_input = document.getElementById("chartYMin_input");
  chartYMin_input.addEventListener("change", (e) => {
    console.log(e.target.value);
    window.myLine.options.scales.y.min = Math.floor(e.target.value);
    window.myLine.update();
  });
  chartYMin_input.value = yMinLenght;

  // 設定メニューを非表示
  document.getElementById("menu").classList.add("hidden");

  // チャート更新用タイマー
  setInterval(() => {
    nextData(document.getElementById("hb_count").innerHTML);
  }, 200);
  setInterval(() => {
    thump();
  }, 500);
};

// リサイズ時に要素の高さをウインドウに合わせて変更
window.onresize = function () {
  setHeight();
};

// 指定された数でx軸ラベルを設定する
function getLabels(length) {
  let labelVal = [];
  for (i = 0; i < length; i++) {
    labelVal.push(i);
  }
  return labelVal;
}

// チャートデータを初期化（すべて0）
function initChartData(length) {
  let chartVal = [];
  for (i = 0; i < length; i++) {
    chartVal.push(0);
  }
  return chartVal;
}

// チャートにデータを追加する（先頭）
function pushData(num) {
  const data = window.myLine.data;
  if (data.datasets.length > 0) {
    data.labels = getLabels(data.labels.length + 1);
    data.datasets.forEach((dataset) => {
      dataset.data.push(num);
    });
    window.myLine.update();
  }
}

// チャートからデータを削除する（末尾）
function shiftData() {
  const data = window.myLine.data;
  data.labels.shift();
  data.datasets.forEach((dataset) => {
    dataset.data.shift();
  });
  window.myLine.update();
}

// 指定されたデータでチャートを更新する
function nextData(count) {
  pushData(count);
  shiftData();
}

// 心拍数表示に鼓動のアニメーションを行う
async function thump() {
  const hb_count_disp = document.getElementById("hb_count_disp");
  hb_count_disp.classList.add("thump");
  await sleep(100);
  hb_count_disp.classList.remove("thump");
}

// リサイズ時等に高さ調整が必要な要素はここに定義する
function setHeight() {
  document.getElementById("chart_wapper").style.height = window.innerHeight - 25 + "px";
  document.getElementById("menu").style.height = window.innerHeight - 25 + "px";
}

// sleep関数
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// *******************************************************

// ランダム値を取得する（デバッグ用）
function getRandomValue(max, min) {
  return Math.floor(Math.random() * (max - min) + min);
}
