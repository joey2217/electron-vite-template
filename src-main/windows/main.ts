import { BrowserWindow, dialog } from "electron/main";
import * as path from "node:path";
import { DEV, ROOT } from "../constant";

let win: BrowserWindow = null!;
let quit = false;

function create() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      symbolColor: "#22c55e",
    },
    webPreferences: {
      devTools: DEV,
      preload: path.join(ROOT, "main.preload.cjs"),
      // webSecurity: import.meta.env.PROD,
    },
  });
  win.once("ready-to-show", () => {
    win.show();
    if (DEV) {
      win.webContents.openDevTools({ mode: "bottom" });
    }
  });

  win.on("close", (e) => {
    if (!quit) {
      e.preventDefault();
      dialog
        .showMessageBox({
          type: "question",
          buttons: ["是", "否"],
          title: "退出",
          message: "确定退出?",
        })
        .then((res) => {
          if (res.response === 0) {
            quit = true;
            win.close();
          }
        })
        .catch(() => {
          /** empty */
        });
    }
  });

  if (import.meta.env.DEV) {
    win.loadURL("http://localhost:5000");
  } else {
    win.loadFile(path.join(ROOT, "renderer/index.html"));
  }
}

function focus() {
  if (win) {
    if (win.isMinimized()) {
      win.restore();
    }
    win.show();
    win.focus();
  }
}

function send(channel: string, ...args: unknown[]) {
  win.webContents.send(channel, ...args);
}

function beforeQuit() {
  quit = true;
}

export const mainWindow = {
  create,
  focus,
  send,
  beforeQuit,
};

export default mainWindow;
