const { contextBridge, ipcRenderer } = require("electron");
const Ant = require("ant-plus");

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  // // タイマーで数字を変える
  // setInterval(() => {
  //   replaceText("hb_count", Math.floor(Math.random() * (140 - 70) + 70));
  // }, 500);

  //ant+用処理
  const stick = new Ant.GarminStick2();
  const sensor = new Ant.HeartRateSensor(stick);

  //起動時イベント
  stick.on("Stick startup", function () {
    //センサーを起動
    sensor.attach(0, 0);
  });

  //終了時イベント
  stick.on("shutdown", () => {
    console.log("Stick shutdown");
  });

  //心拍イベント
  sensor.on("hbData", function (data) {
    //心拍数を表示
    replaceText("hb_count", data.ComputedHeartRate);
  });

  //装着時イベント
  sensor.on("attached", () => {
    console.log("Stick attached");
  });

  //ant+USBドングルを認識
  if (!stick.open()) {
    console.log("Stick not found!");
  }
});

contextBridge.exposeInMainWorld("myAPI", {
  send: (data) => {
    ipcRenderer.invoke("msg_render_to_main", data);
  },
  test: () => {
    ipcRenderer.invoke("test_render_to_main");
  },
});
