// ==UserScript==
// @name         iconfont 一键复制 SVG 
// @version      1.9.11
// @author       liteyais
// @WeChat       liteyais
// @homepage     https://github.com/liteyais
// @description  适用于 iconfont 快速复制 SVG/PNG，支持图标尺寸设置，支持图标库下载直链SVG，支持单色图标颜色自定义
// @match        https://www.iconfont.cn/*
// ==/UserScript==

(async function () {
    "use strict";

    if (typeof Swal === "undefined") {
        await new Promise((resolve) => {
            const check = setInterval(() => {
                if (typeof Swal !== "undefined") {
                    clearInterval(check);
                    resolve();
                }
            }, 100);
        });
    }

    // 头部图标 Base64（20x20 PNG）
    const HEADER_ICON_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAU1QTFRFAAAAEGBoEGBoC2BlDGBoDWBmDGBnDGBmDGBmDGBmDGBnDGBnDGBmDWBnDWBmDGBm/////+/v8PX1/9/f3enqofb/lu39h97/WfH/hNrsVej1/5+feND/eM//pMPGT9/sAP/qa8P+AfvrS9bjAvXojbS3ab/KAu7lRs3ZBObrWrT+/3h4QcTPBtvrCNTvwoiJW7HDdqapA9jJTKf/GcHtCcjuOLS/Bc3AC8Hu+F9fELntTKK3FLbbPZn5BcK3MqmzXpaaE7HPD6jzEqjNLZ+pEZnzEZ3FCKapHYv5JJee/zg4QoePEpa1JI2WFn7uFIymGXj6EYPNMX2CFYWOGWz6+iIiFXHUFXarKnR5E3uHG2D1FXJ6wigpC3R3HlD8G2pwEGiWDWx3GVLUDmdv/wEBIEH+FlSy4QwNrCEjDmB4hTAzZzxAE1WbNk9VDGBmWSs69QAAABB0Uk5TABAgMEBQZn+AkKe/z9/f75/7wJUAAANdSURBVHjajZVrW9pIGIYDIueQoJZl3a1Q0SJbZdEFFqn1wEGxyKEGl4QsEZxoS0uf//9x3yEJudb12qvPp8zLnXvegZlB+G88q6te4QeyIgEICC/GHw37nGdvTN/f07Ac+0JR9y1MgZjNRpFKJjd1ycub8IVIz7AERXZxqQFSeNUTQDlJybCoxxeWwLSbi6koLPXoFYvVS40BaCQXKQNEXVaLRQUkdxJCvchzAz1pp4FelZfqCNlQRAoIHnHKqydTPeWAmxo74eBU9HpChAgr0BDzrqJHRQ37yWVSjL/cg98Xwxi0Mkk5HSMQwQUVzwhYZh9K8QThEMZHY76eII6y1wC0OjoW4bZ5MwVwtXMKv7BQptMkBbMbdKMApEunuXChpOcsFff4GhyIP5S5jixc6ChpyKjFsmNtaMnNBtifaQoXusr0dk6BrkNfOM+Asg4lS3VL6Cq3d7K5K4ZbaJucawPsIpfd2XaEPAHgiLDcQf4EhQI6mTJuE9BK+YMcoadAwOHa92OO5Ut1vH1VAIh7BaVSyhN6MFbPLXIF5/IWrg7ypUqljkIi8fP7t4lEAkq1UiJpDxvyOXwExtQNWW6zUqlSrV6i8JMdDGtVQiukkdfuI3yLbcmy/Dt61Wqt1sT7X3lev35DYI1QDXdxWd4lZRAk/MX8hjpxzVnnjZUCPjWbtdoNvprHpERICN+T8KP5GXqz2WpN2G9Whui2Ws3m9LtpmqRUw0JEJZBGX/Gp1e3+hd4fPB8w6RM5xBf6aF2WbyNCmIN3NPzOuv3+YMI+8AwxGvT7XcaFJgFqRAhhTZbf0fALhoPB6AGTFjc9jUaDwQSfTdPp0YddWY4vlBiNDOMJw34XMAxjNMI3Kt/RzFv8ixRVUq4fm+bfmBvG4wyYzBjmj4YxU4/vPr6L85nFxVk9lCnx9fghHh7nKHegpxp4enyguawcWvsnaJH8B5jN+bHZpz15jflMtcuHCDr7Ud1a45U2iLNzBpxv8OKuipB7/oHbtgroe8ll9nS7SD4nHhEdRek0LMxFG1TsQBTceCU6Ky8mpYvef9+eeuYlLqNLK8/uWdFdh5syRJtz441ALz/rUUHE+9IFLRKaWTZ3pkHyP2dcFEy5pigMiAY9//OX4A9HJUCKhf3PmvsHWSAMql/Uff4AAAAASUVORK5CYII=";

    // 自定义下载图标（新白色和绿色）
    const DOWNLOAD_ICON_WHITE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTE3IDIwLjI1YS43NS43NSAwIDAgMSAwIDEuNUg3YS43NS43NSAwIDAgMSAwLTEuNXptLTQtMTdhLjc1Ljc1IDAgMCAxIDAgMS41SDQuNWEuNzUuNzUgMCAwIDAtLjc1Ljc1djExYzAgLjQxNC4zMzYuNzUuNzUuNzVoMTVhLjc1Ljc1IDAgMCAwIC43NS0uNzV2LTNhLjc1Ljc1IDAgMCAxIDEuNSAwdjNhMi4yNSAyLjI1IDAgMCAxLTIuMjUgMi4yNWgtMTVhMi4yNSAyLjI1IDAgMCAxLTIuMjUtMi4yNXYtMTFBMi4yNSAyLjI1IDAgMCAxIDQuNSAzLjI1em01LjUgMGEuNzUuNzUgMCAwIDEgLjc1Ljc1djQuMTlsMS4yMi0xLjIyYS43NS43NSAwIDEgMSAxLjA2IDEuMDZsLTIuNSAyLjVhLjcuNyAwIDAgMS0uMTYuMTE4cS0uMDQxLjAyNS0uMDg0LjA0NC0uMDQ4LjAyLS4wOTkuMDMtLjAxOS4wMDctLjAzOS4wMTItLjAwNy4wMDItLjAxNi4wMDNhLjguOCAwIDAgMS0uMjY1IDBsLS4wMTYtLjAwM3EtLjAyLS4wMDUtLjA0LS4wMTEtLjA1LS4wMTItLjA5OC0uMDMtLjA0NC0uMDItLjA4My0uMDQ1YS44LjggMCAwIDEtLjE2LS4xMThsLTIuNS0yLjVhLjc1Ljc1IDAgMSAxIDEuMDYtMS4wNmwxLjIyIDEuMjJWNGEuNzUuNzUgMCAwIDEgLjc1LS43NSIvPjwvc3ZnPg==";
    const DOWNLOAD_ICON_GREEN = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwRjlFNSIgZD0iTTE3IDIwLjI1YS43NS43NSAwIDAgMSAwIDEuNUg3YS43NS43NSAwIDAgMSAwLTEuNXptLTQtMTdhLjc1Ljc1IDAgMCAxIDAgMS41SDQuNWEuNzUuNzUgMCAwIDAtLjc1Ljc1djExYzAgLjQxNC4zMzYuNzUuNzUuNzVoMTVhLjc1Ljc1IDAgMCAwIC43NS0uNzV2LTNhLjc1Ljc1IDAgMCAxIDEuNSAwdjNhMi4yNSAyLjI1IDAgMCAxLTIuMjUgMi4yNWgtMTVhMi4yNSAyLjI1IDAgMCAxLTIuMjUtMi4yNXYtMTFBMi4yNSAyLjI1IDAgMCAxIDQuNSAzLjI1em01LjUgMGEuNzUuNzUgMCAwIDEgLjc1Ljc1djQuMTlsMS4yMi0xLjIyYS43NS43NSAwIDEgMSAxLjA2IDEuMDZsLTIuNSAyLjVhLjcuNyAwIDAgMS0uMTYuMTE4cS0uMDQxLjAyNS0uMDg0LjA0NC0uMDQ4LjAyLS4wOTkuMDMtLjAxOS4wMDctLjAzOS4wMTItLjAwNy4wMDItLjAxNi4wMDNhLjguOCAwIDAgMS0uMjY1IDBsLS4wMTYtLjAwM3EtLjAyLS4wMDUtLjA0LS4wMTEtLjA1LS4wMTItLjA5OC0uMDMtLjA0NC0uMDItLjA4My0uMDQ1YS44LjggMCAwIDEtLjE2LS4xMThsLTIuNS0yLjVhLjc1Ljc1IDAgMSAxIDEuMDYtMS4wNmwxLjIyIDEuMjJWNGEuNzUuNzUgMCAwIDEgLjc1LS43NSIvPjwvc3ZnPg==";

    // 设置弹窗 HTML（新布局：头部、内容、作者），包含自定义拾色器
    const SCRIPT_SETTINGS_POPUP = `
<dialog id="iconfont-ext-settings-popup">
  <div class="popup-header">
    <div class="header-left">
      <img class="plugin-icon" src="${HEADER_ICON_BASE64}" alt="icon" style="width:20px;height:20px;">
      <span class="popup-title">iconfont 一键复制 SVG </span>
    </div>
    <button class="popup-close" id="popup-close-btn">&times;</button>
  </div>
  <div class="popup-content">
    <div class="setting-row">
      <label class="setting-label">图标尺寸设置</label>
      <input name="icon_size" type="number" max="5000" min="4" class="setting-input" value="24">
    </div>
    <div class="setting-row">
      <label class="setting-label">单色图标颜色设置</label>
      <div class="color-picker-container setting-input">
        <div class="color-square" id="monochrome-color-square" style="background-color: #000000;"></div>
        <input type="text" id="monochrome-color-input" class="color-hex-input" placeholder="输入色值" maxlength="7" value="">
      </div>
    </div>
    <div class="setting-row">
      <label class="setting-label">插画尺寸设置</label>
      <input name="illustration_size" type="number" max="5000" min="4" class="setting-input" value="500">
    </div>
    <div class="setting-row">
      <label class="setting-label">复制格式选择</label>
      <div class="setting-options">
        <label><input type="radio" name="format" value="svg" class="format-radio" checked> SVG</label>
        <label><input type="radio" name="format" value="png" class="format-radio"> PNG</label>
      </div>
    </div>
    <div class="setting-row">
      <label class="setting-label">图标/插画列表优化</label>
      <label class="switch">
        <input type="checkbox" id="layout-switch">
        <span class="slider round"></span>
      </label>
    </div>
    <div class="setting-row">
      <label class="setting-label">图标下载直链</label>
      <label class="switch">
        <input type="checkbox" id="direct-download-switch">
        <span class="slider round"></span>
      </label>
    </div>
    <div class="setting-row">
      <button id="dialog-confirm" class="save-btn">保存</button>
    </div>
  </div>
  <div class="popup-footer">
    <span class="footer-left">by liteyais</span>
    <div class="footer-right">
      <a id="bilibili-link" href="#" target="_blank" class="social-link">
        <svg width="20" height="20" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#FF5CA1"/>
          <path d="M735.104 446.144c3.648 0 18.24-3.648 18.24-3.648l7.36 54.848-14.656 3.712c0-7.36-10.944-51.2-10.944-54.912z m29.248-7.296l7.296 58.496h21.952c-3.648-21.888-10.944-58.496-10.944-58.496h-18.304z m-14.656 80.448s32.96-7.296 43.904-3.648c7.296 21.952 18.304 146.304 18.304 149.952-7.36 0-32.96 3.648-32.96 3.648-3.648-7.296-29.248-142.592-29.248-149.952zM870.4 446.144h18.304c0 3.712 3.648 54.912 0 54.912h-14.656c0-3.712-3.648-51.2-3.648-54.912z m25.6 0v58.56h21.952V446.08c-7.296 0-14.656-3.648-21.952 0z m-21.952 76.8s32.896-3.648 43.904 0c3.648 25.6 3.648 146.304 3.648 149.952h-32.896c0-7.296-14.656-146.24-14.656-149.952z m-76.8-149.888c18.304 98.688 32.896 270.592 36.608 281.6h32.896c-14.656-106.112-25.6-277.952-25.6-281.6-3.648-7.36-43.904 0-43.904 0z m-43.904 237.696c-3.648-29.248-102.4-58.496-160.896-51.2 0 0-7.296-62.208-10.944-120.704-3.648-51.2 0-102.4 0-109.696-3.648-3.648-43.904 18.304-65.856 25.6 0 0 25.6 109.696 43.904 340.096 0 0 29.248 3.648 80.448-7.296 58.496-11.008 117.056-40.256 113.344-76.8z m-120.64 47.552l-11.008-62.208c3.648 0 54.848 18.304 62.208 21.952 0 3.648-51.2 40.256-51.2 40.256zM318.08 446.08c3.712 0 18.304-3.648 18.304-3.648l7.296 54.848c-3.648 0-14.592 3.712-14.592 3.712 0-7.36-11.008-51.2-11.008-54.912z m29.312-7.296l7.296 58.496h21.952c-3.648-21.888-7.36-58.496-7.36-58.496H347.52zM332.8 519.296s32.896-7.296 43.904-3.648C384 537.6 394.88 661.952 394.88 665.6c-7.296 0-32.896 3.648-32.896 3.648C358.4 661.952 332.8 526.72 332.8 519.296z m120.704-73.152h18.24c0 3.712 3.712 54.912 0 54.912h-14.592c0-3.712-3.648-51.2-3.648-54.912z m29.248 0v58.56h21.952V446.08c-7.36 0-14.656-3.648-21.952 0z m-25.6 76.8s32.896-3.648 43.904 0c3.648 25.6 3.648 146.304 3.648 149.952H471.68c0-7.296-14.592-146.24-14.592-149.952z m-76.8-149.888c18.304 98.688 32.896 270.592 36.544 281.6h32.96a7558.016 7558.016 0 0 1-21.952-285.312c-7.36-3.648-47.552 3.712-47.552 3.712z m-43.904 237.696c-3.648-29.248-102.4-58.496-160.896-51.2 0 0-7.296-62.208-11.008-120.704-3.648-51.2 0-102.4 0-109.696-3.648-3.648-43.84 18.304-65.792 25.6 0 0 25.6 109.696 43.904 340.096 0 0 29.248 3.648 80.448-7.296 51.2-11.008 120.64-40.256 113.344-76.8z m-120.704 47.552l-7.296-62.208c3.648 0 54.848 18.304 62.208 21.952-3.712 3.648-54.912 40.256-54.912 40.256z" fill="#FFFFFF"/>
        </svg>
      </a>
      <a id="github-link" href="#" target="_blank" class="social-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#333"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 8.49.5.09.68-.21.68-.48 0-.24-.01-.88-.01-1.73-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48C19.13 20.17 22 16.42 22 12c0-5.52-4.48-10-10-10z"/></svg>
      </a>
    </div>
  </div>
  <!-- 自定义拾色器面板 -->
  <div id="custom-color-picker" style="display: none; position: absolute; background: white; border: 1px solid #ccc; border-radius: 16px; padding: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000; width: 180px; top:2px; left:2px;">
    <canvas id="sv-canvas" width="200" height="200" style="width:100%; height:100%; display: block; margin: 0 auto; cursor: crosshair; border-radius: 8px;"></canvas>
    <div style="margin-top: 10px; display: flex; align-items: center; gap: 10px;">
      <div id="hue-slider" style="flex: 1; height: 16px; background: linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red); border-radius: 200px; cursor: pointer;"></div>
      <div id="selected-color-preview" style="width: 16px; height: 16px; border-radius: 4px; "></div>
    </div>
    <div style="margin-top: 10px; display: flex; gap: 8px;">
      <input type="text" id="custom-color-hex" placeholder="#RRGGBB" maxlength="7" style="flex: 1; padding: 4px; border: 1px solid #000; border-radius: 8px; font-size: 12px; width: 100%;">
      <button id="custom-color-apply" style="padding: 4px 8px; font-size: 12px;border-radius: 8px;outline: none; border: 1px solid #000;">应用</button>
    </div>
  </div>
  <style>
    dialog#iconfont-ext-settings-popup {
      position: fixed;
      top: 20px;
      right: 20px;
      left: auto;
      bottom: auto;
      width: 360px;
      border: none;
      border-radius: 16px;
      box-sizing: border-box;
      box-shadow: 0 20px 35px -8px rgba(0,0,0,0.2);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.90);
      backdrop-filter: blur(16px);
    }
    dialog#iconfont-ext-settings-popup::backdrop {
      background: transparent !important;
      backdrop-filter: none !important;
    }
    .popup-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 48px;
      padding: 0 16px;
      border-bottom: 1px solid #eee;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .plugin-icon {
      width: 20px;
      height: 20px;
    }
    .popup-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
    .popup-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #999;
      padding: 0;
      outline: none;
      border: none;
      line-height: 1;
      transition: color 0.2s;
    }
    .popup-content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      padding: 16px;
    }
    .setting-row {
      display: flex;
      align-items: center;
      align-self: stretch;
      justify-content: space-between;
      height: 32px;
    }
    .setting-label {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }
    .setting-input {
      width: 110px;
      padding: 8px 0;
      border: 1px solid #333;
      border-radius: 8px;
      font-size: 14px;
      text-align: center;
    }
    .setting-input:focus {
      outline: none;
      border-color: #020202;
      box-shadow: 0 0 0 2px rgb(0 0 0 / 20%);
    }
    .color-picker-container:focus-within {
        border-color: #020202;
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
        outline: none;
    }
    .color-picker-container {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 8px;
      width: 112px;
      box-sizing: border-box;
      text-align: left;
      background: #fff;
    }
    .color-square {
      width: 16px;
      height: 16px;
      border-radius: 4px;
      cursor: pointer;
      flex-shrink: 0;
      border: 1px solid #ddd;
    }
    .color-hex-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: 14px;
      font-family: monospace;
      padding: 8px 0;
      min-width: 0;
    }
    .setting-options {
      display: flex;
      gap: 16px;
    }
    .setting-options label {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      color: #333;
      cursor: pointer;
    }
    .format-radio {
      width: 16px;
      height: 16px;
      margin: 0;
      accent-color: #333;
    }
    .switch {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
    }
    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ddd;
      transition: .3s;
      border-radius: 24px;
    }
    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .3s;
      border-radius: 50%;
    }
    input:checked + .slider {
      background-color: #333;
    }
    input:checked + .slider:before {
      transform: translateX(20px);
    }
    .save-btn {
      width: 100%;
      border: none;
      font-weight: 500;
      border-radius: 8px;
      background: #222;
      color: #fff;
      font-size: 13px;
      padding: 12px;
      cursor: pointer;
      box-shadow: 0 6px 16px rgba(17, 24, 39, 0.2);
      transition: transform 0.08s ease, box-shadow 0.2s ease, background 0.15s ease;
    }
    .save-btn:hover {
      background: #000;
      box-shadow: 0 6px 16px rgba(17, 24, 39, 0.2);
    }
    .save-btn:active {
      transform: scale(0.98);
    }
    .popup-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      border-bottom: 1px solid #eee;
      font-size: 13px;
      color: #ccc;
      box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.04) inset;
    }
    .footer-right {
      display: flex;
      gap: 12px;
    }
    .social-link {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
      opacity: 0.6;
      transition: opacity 0.2s;
    }
    .social-link:hover {
      opacity: 1;
    }
    .hidden {
      display: none;
    }
  </style>
</dialog>
    `;

    const IS_FIREFOX = navigator.userAgent.includes("Firefox");
    const SMALL_DELAY = 200;
    const XML = new XMLSerializer();
    const OUT_FMTS = ["svg", "png"];

    const ICON_WHITE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTMuNSAxNC43NWEuNzUuNzUgMCAwIDAgLjc1LS43NVYyLjc1SDE0YS43NS43NSAwIDAgMCAwLTEuNUgzLjVhLjc1Ljc1IDAgMCAwLS43NS43NXYxMmMwIC40MTQuMzM2Ljc1Ljc1Ljc1bTExLjUgOGEuNzUuNzUgMCAwIDAgLjU1My0uMjQzbDUuNS02QS43NS43NSAwIDAgMCAyMS4yNSAxNlY1YS43NS43NSAwIDAgMC0uNzUtLjc1aC0xNGEuNzUuNzUgMCAwIDAtLjc1Ljc1djE3YzAgLjQxNC4zMzYuNzUuNzUuNzV6bS03Ljc1LTE3aDEyLjV2OS41SDE1YS43NS43NSAwIDAgMC0uNzUuNzV2NS4yNWgtN3ptOC41IDExaDMuMDQ1bC0zLjA0NSAzLjMyMnoiLz48L3N2Zz4=";
    const ICON_GREEN = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwRjlFNSIgZD0iTTMuNSAxNC43NWEuNzUuNzUgMCAwIDAgLjc1LS43NVYyLjc1SDE0YS43NS43NSAwIDAgMCAwLTEuNUgzLjVhLjc1Ljc1IDAgMCAwLS43NS43NXYxMmMwIC40MTQuMzM2Ljc1Ljc1Ljc1bTExLjUgOGEuNzUuNzUgMCAwIDAgLjU1My0uMjQzbDUuNS02QS43NS43NSAwIDAgMCAyMS4yNSAxNlY1YS43NS43NSAwIDAgMC0uNzUtLjc1aC0xNGEuNzUuNzUgMCAwIDAtLjc1Ljc1djE3YzAgLjQxNC4zMzYuNzUuNzUuNzV6bS03Ljc1LTE3aDEyLjV2OS41SDE1YS43NS43NSAwIDAgMC0uNzUuNzV2NS4yNWgtN3ptOC41IDExaDMuMDQ1bC0zLjA0NSAzLjMyMnoiLz48L3N2Zz4=";

    // 配置结构
    let currentConfig = { iconSize: 24, illustrationSize: 500, format: "svg", layoutEnabled: true, directDownload: false, monochromeColor: "" };
    let layoutLink = null;

    const LAYOUT_CSS_URL = chrome.runtime.getURL("layout.css");

    async function loadConfig() {
        const result = await chrome.storage.local.get(["icon_size", "illustration_size", "out_fmt", "layout_enabled", "direct_download", "monochrome_color"]);
        currentConfig.iconSize = result.icon_size ?? 24;
        currentConfig.illustrationSize = result.illustration_size ?? 500;
        currentConfig.format = result.out_fmt ?? "svg";
        if (currentConfig.iconSize < 4 || currentConfig.iconSize > 5000) currentConfig.iconSize = 24;
        if (currentConfig.illustrationSize < 4 || currentConfig.illustrationSize > 5000) currentConfig.illustrationSize = 500;
        if (!OUT_FMTS.includes(currentConfig.format)) currentConfig.format = "svg";
        currentConfig.layoutEnabled = result.layout_enabled ?? true;
        currentConfig.directDownload = result.direct_download ?? false;
        let color = result.monochrome_color ?? "";
        if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) color = "";
        currentConfig.monochromeColor = color;
    }

    async function saveConfig(iconSize, illustrationSize, format, layoutEnabled, directDownload, monochromeColor) {
        if (monochromeColor && !/^#[0-9A-Fa-f]{6}$/.test(monochromeColor)) monochromeColor = "";
        await chrome.storage.local.set({
            icon_size: iconSize,
            illustration_size: illustrationSize,
            out_fmt: format,
            layout_enabled: layoutEnabled,
            direct_download: directDownload,
            monochrome_color: monochromeColor
        });
        currentConfig.iconSize = iconSize;
        currentConfig.illustrationSize = illustrationSize;
        currentConfig.format = format;
        currentConfig.layoutEnabled = layoutEnabled;
        currentConfig.directDownload = directDownload;
        currentConfig.monochromeColor = monochromeColor;
        toggleLayoutCSS(layoutEnabled);
        applyDownloadIconsStyle(directDownload);
    }

    function replaceSvgColors(svgString) {
        const targetColor = currentConfig.monochromeColor;
        if (!targetColor || targetColor === "") return svgString;
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgString, "image/svg+xml");
        const svgElem = doc.documentElement;
        if (svgElem.tagName !== "svg") return svgString;

        const colorSet = new Set();
        const elementsWithColor = [];
        
        function traverse(element) {
            const fill = element.getAttribute("fill");
            const stroke = element.getAttribute("stroke");
            if (fill && fill !== "none" && fill !== "transparent") {
                colorSet.add(fill);
                elementsWithColor.push({ el: element, attr: "fill", value: fill });
            }
            if (stroke && stroke !== "none" && stroke !== "transparent") {
                colorSet.add(stroke);
                elementsWithColor.push({ el: element, attr: "stroke", value: stroke });
            }
            for (let i = 0; i < element.children.length; i++) {
                traverse(element.children[i]);
            }
        }
        traverse(svgElem);
        
        if (colorSet.size > 1) return svgString;
        
        for (const item of elementsWithColor) {
            item.el.setAttribute(item.attr, targetColor);
        }
        
        if (elementsWithColor.length === 0) {
            const allGraphics = svgElem.querySelectorAll("path, circle, rect, ellipse, polygon, polyline, line");
            for (const graphic of allGraphics) {
                if (!graphic.hasAttribute("fill") && !graphic.hasAttribute("stroke")) {
                    graphic.setAttribute("fill", targetColor);
                }
            }
        }
        
        return new XMLSerializer().serializeToString(svgElem);
    }

    function toggleLayoutCSS(enable) {
        const existingLinks = document.querySelectorAll('link#iconfont-layout-css, link[href*="layout.css"]');
        existingLinks.forEach(link => link.remove());
        layoutLink = null;
        if (enable) {
            const url = LAYOUT_CSS_URL + (LAYOUT_CSS_URL.includes('?') ? '&' : '?') + 't=' + Date.now();
            layoutLink = document.createElement("link");
            layoutLink.rel = "stylesheet";
            layoutLink.type = "text/css";
            layoutLink.href = url;
            layoutLink.id = "iconfont-layout-css";
            document.head.appendChild(layoutLink);
        }
    }

    function applyDownloadIconsStyle(enable) {
        const btns = $(".icon-xiazai");
        btns.forEach(btn => {
            const card = btn.closest("li");
            const isIconCard = card && card.querySelector("svg");
            if (!isIconCard) return;
            if (enable) {
                btn.classList.add("custom-download");
                btn.style.backgroundImage = `url('${DOWNLOAD_ICON_WHITE}')`;
                btn.style.backgroundSize = "30px";
                btn.style.backgroundRepeat = "no-repeat";
                btn.style.backgroundPosition = "center";
                btn.style.fontSize = "0";
                btn.style.color = "transparent";
                if (!btn.hasAttribute("data-original-title")) {
                    btn.setAttribute("data-original-title", btn.getAttribute("title") || "下载");
                }
                btn.setAttribute("title", "下载svg到本地");
            } else {
                btn.classList.remove("custom-download");
                btn.style.backgroundImage = "";
                btn.style.backgroundSize = "";
                btn.style.backgroundRepeat = "";
                btn.style.backgroundPosition = "";
                btn.style.fontSize = "";
                btn.style.color = "";
                const originalTitle = btn.getAttribute("data-original-title");
                if (originalTitle) {
                    btn.setAttribute("title", originalTitle);
                } else {
                    btn.setAttribute("title", "下载");
                }
            }
        });
    }

    function addUniformButtonStyles() {
        if (document.getElementById("uniform-button-styles")) return;
        
        // 检测 3d 图标库页面，添加类名以便样式排除
        const url = location.href;
        if (url.includes("/illustrations_3d/")) {
            document.body.classList.add("page-illustrations-3d");
        }
        if (url.includes("/illustrations/") && !url.includes("_3d")) {
            document.body.classList.add("page-illustrations");
        }
        
        const style = document.createElement("style");
        style.id = "uniform-button-styles";
        style.textContent = `

            /*======01-图标列表======-外框*/
            .page-collection-detail-wrap > .collection-detail > ul.block-icon-list > li > div.icon-cover{
                height: 100px !important;
            }
            .page-collection-detail-wrap > .collection-detail > ul.block-icon-list > li > div.icon-cover >span{
                height: 50px !important;
            }

            /*======02-插画列表========*/
            .block-mixo-list  li  div.icon-cover {
                height: 50px !important;
            }
            .block-mixo-list  li  div.icon-cover > span.cover-item{
                height: 100% !important;
            }

            /*======插画搜索结果======*/
            .page-search-container.illustration-detail > .block-icon-list.block-svg-list > li > div.icon-cover  {
                height: 50px !important;
                width: 100%;
            }
            .page-search-container.illustration-detail > .block-icon-list.block-svg-list > li >  div.icon-cover > span.cover-item {
                flex: 1 !important;
                height: 100% !important;
            }
            /*======图标搜索结果======*/
            .page-search-container > .block-icon-list > li:hover > div.icon-cover {
                display: grid;
                width: 100px;
                height: 100px;
                line-height: 50px;
            } 
                

            /* ======一键复制按钮背景图大小调整====== */
            .icon-cover .svg-copy {
                background-size: 22px !important;
                background-position: center !important;
            }
            /*====== 下载直链按钮背景图大小调整====== */
            .icon-xiazai.custom-download {
                background-size: 22px !important;
            }

            
        `;
        document.head.appendChild(style);
    }

    function addDownloadIconStyles() {
        if (document.getElementById("download-icon-styles")) return;
        const style = document.createElement("style");
        style.id = "download-icon-styles";
        style.textContent = `
            .icon-xiazai.custom-download {
                background-repeat: no-repeat !important;
                background-position: center !important;
                font-size: 0 !important;
                color: transparent !important;
            }
            .icon-xiazai.custom-download:hover {
                background-image: url('${DOWNLOAD_ICON_GREEN}') !important;
            }
        `;
        document.head.appendChild(style);
    }

    function show_msg(text = "复制成功，可以粘贴咯~", status = "success") {
        Swal.fire({
            text,
            toast: true,
            timer: 2000,
            showConfirmButton: false,
            icon: status,
            position: "top",
            width: 248,
            customClass: { popup: "copy-popup", htmlContainer: "copy-container" }
        });
        if (!document.getElementById("swal-toast-width-fix")) {
            const style = document.createElement('style');
            style.id = "swal-toast-width-fix";
            style.textContent = '.swal2-toast { width: 248px !important; border-radius:12px; } .swal2-html-container { font-size: 14px !important; }';
            document.head.appendChild(style);
        }
    }

    function alert_error(text, title = null) {
        Swal.fire({ icon: "error", title, text });
    }

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    function getIconName(card) {
        const nameSpan = card.querySelector(".icon-name span");
        if (nameSpan && nameSpan.innerText) return nameSpan.innerText.trim();
        const nameDiv = card.querySelector(".icon-name");
        if (nameDiv && nameDiv.innerText) return nameDiv.innerText.trim();
        return null;
    }

    async function downloadSvg(svgStr, filename = "icon.svg") {
        const finalSvgStr = replaceSvgColors(svgStr);
        const safeFilename = filename.replace(/[\\/:*?"<>|]/g, '_');
        const blob = new Blob([finalSvgStr], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = safeFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        show_msg("下载成功", "success");
    }

    function svgToStr(svg) {
        svg.setAttribute("width", currentConfig.iconSize);
        svg.setAttribute("height", currentConfig.iconSize);
        return XML.serializeToString(svg);
    }

    function $(selector, context = document) {
        return [...context.querySelectorAll(selector)];
    }

    async function $$(selector, context = document) {
        for (let i = 0; i < 10; i++) {
            let elems = [...context.querySelectorAll(selector)];
            if (elems.length) return elems;
            await sleep(200);
        }
        return [];
    }

    async function copy_blobs(blobs) {
        const bundle = {};
        for (const blob of blobs) {
            if (IS_FIREFOX && blob.type === "image/svg+xml") continue;
            bundle[blob.type] = blob;
        }
        const item = new ClipboardItem(bundle);
        try {
            await navigator.clipboard.write([item]);
            show_msg();
        } catch (err) {
            console.error(err);
            show_msg("复制到剪贴板失败！", "error");
        }
    }

    async function svg_to_png(svgStr) {
        const img = new Image();
        const svgBlob = new Blob([svgStr], { type: "image/svg+xml" });
        const url = URL.createObjectURL(svgBlob);
        img.src = url;
        const canvas = document.createElement("canvas");
        const size = currentConfig.iconSize;
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "transparent";
        ctx.fillRect(0, 0, size, size);
        await new Promise(resolve => { img.onload = resolve; });
        ctx.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(url);
        return new Promise(resolve => canvas.toBlob(resolve));
    }

    async function copy_svg_to_aim_fmt(svgStr, isIllustration = false) {
        let finalSvgStr = svgStr;
        if (!isIllustration) {
            finalSvgStr = replaceSvgColors(svgStr);
        }
        
        if (currentConfig.format === "svg") {
            const blobs = [
                new Blob([finalSvgStr], { type: "text/plain" }),
                new Blob([finalSvgStr], { type: "image/svg+xml" })
            ];
            await copy_blobs(blobs);
        } else {
            let pngBlob;
            if (isIllustration) {
                const originalIconSize = currentConfig.iconSize;
                currentConfig.iconSize = currentConfig.illustrationSize;
                pngBlob = await svg_to_png(finalSvgStr);
                currentConfig.iconSize = originalIconSize;
            } else {
                pngBlob = await svg_to_png(finalSvgStr);
            }
            await copy_blobs([pngBlob]);
        }
    }

    async function downloadIconFromCard(card) {
        const svgElem = card.querySelector("svg");
        if (svgElem) {
            let svgStr = svgToStr(svgElem.cloneNode(true));
            svgStr = replaceSvgColors(svgStr);
            const iconName = getIconName(card);
            const filename = iconName ? `${iconName}.svg` : `icon_${Date.now()}.svg`;
            await downloadSvg(svgStr, filename);
            return true;
        }
        return false;
    }

    async function onNativeDownloadClick(event) {
        if (!currentConfig.directDownload) return;
        const target = event.target.closest(".icon-xiazai");
        if (!target) return;
        const card = target.closest("li");
        if (!card) return;
        const svgElem = card.querySelector("svg");
        if (!svgElem) return;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        await downloadIconFromCard(card);
    }

    function bindNativeDownloadButtons() {
        const downloadBtns = $(".icon-xiazai");
        for (const btn of downloadBtns) {
            if (btn.hasAttribute("data-direct-download-bound")) continue;
            btn.addEventListener("click", onNativeDownloadClick, true);
            btn.setAttribute("data-direct-download-bound", "true");
        }
        applyDownloadIconsStyle(currentConfig.directDownload);
    }

    let hideObserver = null;
    function startHideObserver() {
        if (hideObserver) hideObserver.disconnect();
        hideObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if ((node.id && node.id.startsWith("dlg_")) ||
                            (node.className && typeof node.className === 'string' && 
                             (node.className.includes("mask_dlg_") || node.className.includes("mp-e2e-mask")))) {
                            node.style.setProperty('display', 'none', 'important');
                        }
                        if (node.querySelector) {
                            const dialogs = node.querySelectorAll('[id*="dlg_"]');
                            const masks = node.querySelectorAll('[class*="mask_dlg_"], .mp-e2e-mask');
                            dialogs.forEach(d => d.style.setProperty('display', 'none', 'important'));
                            masks.forEach(m => m.style.setProperty('display', 'none', 'important'));
                        }
                    }
                }
            }
        });
        hideObserver.observe(document.body, { childList: true, subtree: true });
    }

    function stopHideObserver() {
        if (hideObserver) {
            hideObserver.disconnect();
            hideObserver = null;
        }
    }

    async function copyInPopup(card) {
        const icon = card.querySelector(".svg-copy");
        if (icon) icon.classList.add("disabled");
        startHideObserver();
        const existingDialogs = $("[id*='dlg_']");
        const existingMasks = $("[class*='mask_dlg_'], .mp-e2e-mask");
        [...existingDialogs, ...existingMasks].forEach(el => {
            if (el) el.style.setProperty('display', 'none', 'important');
        });
        for (const dlg of existingDialogs) {
            const closeBtn = dlg.querySelector(".mp-e2e-dialog-close");
            if (closeBtn) closeBtn.click();
        }
        await sleep(100);
        const download = card.querySelector("[title='下载'], [title='Download']");
        if (download) download.click();
        let popup = null;
        for (let i = 0; i < 20; i++) {
            await sleep(100);
            const dialogs = $("[id*='dlg_']");
            popup = dialogs.find(d => d.id?.startsWith("dlg_"));
            if (popup) break;
        }
        if (!popup) {
            alert_error("无法打开下载弹窗", "错误");
            if (icon) icon.classList.remove("disabled");
            stopHideObserver();
            return;
        }
        popup.style.setProperty('display', 'none', 'important');
        let imgElem = null;
        for (let i = 0; i < 20; i++) {
            imgElem = popup.querySelector("img.tbackground");
            if (imgElem && imgElem.src) break;
            await sleep(100);
        }
        if (!imgElem || !imgElem.src) {
            alert_error("未找到 SVG 图片地址", "复制失败");
            const closeBtn = popup.querySelector(".mp-e2e-dialog-close");
            if (closeBtn) closeBtn.click();
            if (icon) icon.classList.remove("disabled");
            stopHideObserver();
            return;
        }
        const svgUrl = imgElem.src;
        let svgText = "";
        try {
            const response = await fetch(svgUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            svgText = await response.text();
        } catch (err) {
            console.error(err);
            alert_error("获取 SVG 代码失败，可能网络问题", "复制失败");
            const closeBtn = popup.querySelector(".mp-e2e-dialog-close");
            if (closeBtn) closeBtn.click();
            if (icon) icon.classList.remove("disabled");
            stopHideObserver();
            return;
        }
        const closeBtn = popup.querySelector(".mp-e2e-dialog-close");
        if (closeBtn) closeBtn.click();
        stopHideObserver();
        if (!svgText) {
            alert_error("获取到的 SVG 为空", "复制失败");
            if (icon) icon.classList.remove("disabled");
            return;
        }
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");
        const svgElem = doc.documentElement;
        if (svgElem && svgElem.tagName === "svg") {
            svgElem.setAttribute("width", currentConfig.illustrationSize);
            svgElem.setAttribute("height", currentConfig.illustrationSize);
            svgText = new XMLSerializer().serializeToString(svgElem);
        }
        await copy_svg_to_aim_fmt(svgText, true);
        if (icon) icon.classList.remove("disabled");
    }

    async function onCopyIconClick(event) {
        const card = event.target.closest("li");
        if (!card) return;
        const svgElem = card.querySelector("svg");
        if (!svgElem) {
            await copyInPopup(card);
            return;
        }
        let svgStr = svgToStr(svgElem.cloneNode(true));
        svgStr = replaceSvgColors(svgStr);
        await copy_svg_to_aim_fmt(svgStr, false);
    }

    function shouldAddCopyButtons() {
        const url = location.href;
        if (url.includes("/illustrations_3d/")) return false;
        if (url.includes("/lotties/")) return false;
        return true;
    }

    function addCopyIcons() {
        if (!shouldAddCopyButtons()) return;
        const cards = $(".block-icon-list > li");
        if (!cards.length) return;
        cards.forEach(card => {
            if (card.querySelector(".svg-copy")) return;
            const coverDiv = card.querySelector(".icon-cover");
            if (!coverDiv) return;
            const copyBtn = document.createElement("span");
            copyBtn.className = "cover-item svg-copy";
            copyBtn.title = `复制 ${currentConfig.format.toUpperCase()}`;
            copyBtn.style.cssText = `
                display: inline-block;
                background-image: url('${ICON_WHITE}');
                background-size: 30px;
                background-repeat: no-repeat;
                background-position: center;
                cursor: pointer;
                vertical-align: middle;
                outline: none;
                user-select: none;
                -webkit-tap-highlight-color: transparent;
            `;
            copyBtn.addEventListener("mouseenter", () => {
                copyBtn.style.backgroundImage = `url('${ICON_GREEN}')`;
            });
            copyBtn.addEventListener("mouseleave", () => {
                copyBtn.style.backgroundImage = `url('${ICON_WHITE}')`;
            });
            copyBtn.addEventListener("click", onCopyIconClick, true);
            coverDiv.appendChild(copyBtn);
        });
        bindNativeDownloadButtons();
    }

    function updateAllTitles() {
        if (!shouldAddCopyButtons()) return;
        const icons = $(".svg-copy");
        icons.forEach(icon => { icon.title = `复制 ${currentConfig.format.toUpperCase()}`; });
    }

    // 拾色器相关函数
    function initColorPicker(svCanvas, hueSlider, preview, onColorChange) {
        let hue = 0;
        let svCanvasSize = 200;
        let ctx = svCanvas.getContext('2d');
        let isDraggingSV = false;
        let isDraggingHue = false;

        function drawSVCanvas() {
            for (let x = 0; x <= svCanvasSize; x++) {
                let s = x / svCanvasSize;
                for (let y = 0; y <= svCanvasSize; y++) {
                    let v = 1 - (y / svCanvasSize);
                    let rgb = hsvToRgb(hue, s, v);
                    ctx.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        }

        function hsvToRgb(h, s, v) {
            h = (h % 360) / 360;
            let r, g, b;
            let i = Math.floor(h * 6);
            let f = h * 6 - i;
            let p = v * (1 - s);
            let q = v * (1 - f * s);
            let t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0: r = v; g = t; b = p; break;
                case 1: r = q; g = v; b = p; break;
                case 2: r = p; g = v; b = t; break;
                case 3: r = p; g = q; b = v; break;
                case 4: r = t; g = p; b = v; break;
                default: r = v; g = p; b = q; break;
            }
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }

        function rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
        }

        function getColorFromSV(x, y) {
            let s = Math.min(1, Math.max(0, x / svCanvasSize));
            let v = Math.min(1, Math.max(0, 1 - (y / svCanvasSize)));
            let rgb = hsvToRgb(hue, s, v);
            return rgbToHex(rgb[0], rgb[1], rgb[2]);
        }

        function getColorFromHue(clientX, rect) {
            let x = Math.min(rect.width, Math.max(0, clientX - rect.left));
            let hueVal = (x / rect.width) * 360;
            return Math.min(360, Math.max(0, hueVal));
        }

        function updateColorFromSV(x, y) {
            let color = getColorFromSV(x, y);
            if (preview) preview.style.backgroundColor = color;
            if (onColorChange) onColorChange(color);
        }

        function updateColorFromHue(clientX, rect) {
            hue = getColorFromHue(clientX, rect);
            drawSVCanvas();
            // 从当前画布中心获取颜色（可选）
            let centerX = svCanvasSize / 2, centerY = svCanvasSize / 2;
            let color = getColorFromSV(centerX, centerY);
            if (preview) preview.style.backgroundColor = color;
            if (onColorChange) onColorChange(color);
        }

        // 鼠标事件
        svCanvas.addEventListener('mousedown', (e) => {
            isDraggingSV = true;
            const rect = svCanvas.getBoundingClientRect();
            const scaleX = svCanvasSize / rect.width;
            const scaleY = svCanvasSize / rect.height;
            let x = (e.clientX - rect.left) * scaleX;
            let y = (e.clientY - rect.top) * scaleY;
            x = Math.min(svCanvasSize, Math.max(0, x));
            y = Math.min(svCanvasSize, Math.max(0, y));
            updateColorFromSV(x, y);
            e.preventDefault();
        });
        window.addEventListener('mousemove', (e) => {
            if (isDraggingSV) {
                const rect = svCanvas.getBoundingClientRect();
                const scaleX = svCanvasSize / rect.width;
                const scaleY = svCanvasSize / rect.height;
                let x = (e.clientX - rect.left) * scaleX;
                let y = (e.clientY - rect.top) * scaleY;
                x = Math.min(svCanvasSize, Math.max(0, x));
                y = Math.min(svCanvasSize, Math.max(0, y));
                updateColorFromSV(x, y);
                e.preventDefault();
            }
        });
        window.addEventListener('mouseup', () => { isDraggingSV = false; });

        hueSlider.addEventListener('mousedown', (e) => {
            isDraggingHue = true;
            const rect = hueSlider.getBoundingClientRect();
            updateColorFromHue(e.clientX, rect);
            e.preventDefault();
        });
        window.addEventListener('mousemove', (e) => {
            if (isDraggingHue) {
                const rect = hueSlider.getBoundingClientRect();
                updateColorFromHue(e.clientX, rect);
                e.preventDefault();
            }
        });
        window.addEventListener('mouseup', () => { isDraggingHue = false; });

        // 初始化
        drawSVCanvas();
        // 设置默认颜色（如果已有配置）
        if (currentConfig.monochromeColor) {
            let hex = currentConfig.monochromeColor;
            let rgb = hexToRgb(hex);
            if (rgb) {
                let hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
                hue = hsv.h;
                drawSVCanvas();
                let x = hsv.s * svCanvasSize;
                let y = (1 - hsv.v) * svCanvasSize;
                updateColorFromSV(x, y);
            }
        }
    }

    function hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function rgbToHsv(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, v = max;
        let d = max - min;
        s = max === 0 ? 0 : d / max;
        if (max === min) {
            h = 0;
        } else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: h * 360, s: s, v: v };
    }

    async function showSettingsDialog() {
        let popup = document.getElementById("iconfont-ext-settings-popup");
        if (!popup) {
            document.body.insertAdjacentHTML("beforeend", SCRIPT_SETTINGS_POPUP);
            popup = document.getElementById("iconfont-ext-settings-popup");
        }
        const iconSizeInput = popup.querySelector('input[name="icon_size"]');
        const illustrationSizeInput = popup.querySelector('input[name="illustration_size"]');
        const radioSvg = popup.querySelector('input[value="svg"]');
        const radioPng = popup.querySelector('input[value="png"]');
        const layoutSwitch = popup.querySelector('#layout-switch');
        const directDownloadSwitch = popup.querySelector('#direct-download-switch');
        const monochromeColorSquare = popup.querySelector('#monochrome-color-square');
        const monochromeColorInput = popup.querySelector('#monochrome-color-input');
        const colorPickerPanel = popup.querySelector('#custom-color-picker');
        const svCanvas = popup.querySelector('#sv-canvas');
        const hueSlider = popup.querySelector('#hue-slider');
        const previewDiv = popup.querySelector('#selected-color-preview');
        const customHexInput = popup.querySelector('#custom-color-hex');
        const customApplyBtn = popup.querySelector('#custom-color-apply');
        const saveBtn = popup.querySelector('#dialog-confirm');
        const closeBtn = popup.querySelector('#popup-close-btn');

        if (!iconSizeInput) {
            console.error("未找到图标尺寸输入框");
            return;
        }

        iconSizeInput.value = currentConfig.iconSize;
        illustrationSizeInput.value = currentConfig.illustrationSize;
        if (currentConfig.format === "svg") radioSvg.checked = true;
        else radioPng.checked = true;
        layoutSwitch.checked = currentConfig.layoutEnabled;
        directDownloadSwitch.checked = currentConfig.directDownload;
        monochromeColorInput.value = currentConfig.monochromeColor;
        if (monochromeColorSquare) monochromeColorSquare.style.backgroundColor = currentConfig.monochromeColor || "#000000";

        // 更新颜色的函数（同步到输入框和方块）
        const updateColorUI = (color) => {
            let hexColor = color;
            if (!hexColor.startsWith("#")) hexColor = "#" + hexColor;
            if (!/^#[0-9A-Fa-f]{6}$/.test(hexColor)) hexColor = "#000000";
            monochromeColorInput.value = hexColor;
            if (monochromeColorSquare) monochromeColorSquare.style.backgroundColor = hexColor;
            if (previewDiv) previewDiv.style.backgroundColor = hexColor;
            if (customHexInput) customHexInput.value = hexColor;
        };

        // 显示/隐藏拾色器
        const showPicker = (show) => {
            if (show) {
                if (colorPickerPanel) {
                    const rect = monochromeColorSquare.getBoundingClientRect();
                    const dialogRect = popup.getBoundingClientRect();
                    colorPickerPanel.style.display = "block";
                    // 初始化拾色器（如果尚未初始化）
                    if (svCanvas && !svCanvas._initialized) {
                        initColorPicker(svCanvas, hueSlider, previewDiv, (color) => {
                            updateColorUI(color);
                        });
                        svCanvas._initialized = true;
                    }
                    // 点击外部关闭
                    const closePicker = (e) => {
                        if (!colorPickerPanel.contains(e.target) && e.target !== monochromeColorSquare) {
                            colorPickerPanel.style.display = "none";
                            document.removeEventListener("click", closePicker);
                        }
                    };
                    setTimeout(() => document.addEventListener("click", closePicker), 0);
                }
            } else {
                if (colorPickerPanel) colorPickerPanel.style.display = "none";
            }
        };

        // 点击方块显示拾色器
        if (monochromeColorSquare) {
            monochromeColorSquare.addEventListener("click", (e) => {
                e.stopPropagation();
                showPicker(true);
            });
        }

        // 自定义颜色应用按钮
        if (customApplyBtn && customHexInput) {
            customApplyBtn.addEventListener("click", () => {
                let val = customHexInput.value.trim();
                if (!val.startsWith("#")) val = "#" + val;
                if (/^#[0-9A-Fa-f]{6}$/i.test(val)) {
                    updateColorUI(val);
                    showPicker(false);
                } else if (/^#[0-9A-Fa-f]{3}$/i.test(val)) {
                    const r = val[1], g = val[2], b = val[3];
                    const full = "#" + r + r + g + g + b + b;
                    updateColorUI(full);
                    showPicker(false);
                } else {
                    show_msg("颜色格式无效，请输入6位十六进制色值", "warning");
                }
            });
        }

        // 手动输入颜色时实时同步方块颜色
        monochromeColorInput.addEventListener("input", (e) => {
            let val = e.target.value;
            if (!val.startsWith("#")) val = "#" + val;
            if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                if (monochromeColorSquare) monochromeColorSquare.style.backgroundColor = val;
            } else if (/^#[0-9A-Fa-f]{3}$/.test(val)) {
                const r = val[1], g = val[2], b = val[3];
                const full = "#" + r + r + g + g + b + b;
                if (monochromeColorSquare) monochromeColorSquare.style.backgroundColor = full;
            }
        });

        const bilibiliLink = popup.querySelector('#bilibili-link');
        const githubLink = popup.querySelector('#github-link');
        if (bilibiliLink) bilibiliLink.href = "https://space.bilibili.com/38300981";
        if (githubLink) githubLink.href = "https://github.com/liteyais";

        const dialog = popup;
        const closeHandler = () => dialog.close();
        const confirmHandler = async () => {
            let newIconSize = parseInt(iconSizeInput.value, 10);
            if (isNaN(newIconSize) || newIconSize < 4) newIconSize = 24;
            if (newIconSize > 5000) newIconSize = 5000;
            let newIllustrationSize = parseInt(illustrationSizeInput.value, 10);
            if (isNaN(newIllustrationSize) || newIllustrationSize < 4) newIllustrationSize = 500;
            if (newIllustrationSize > 5000) newIllustrationSize = 5000;
            const newFormat = radioSvg.checked ? "svg" : "png";
            const newLayoutEnabled = layoutSwitch.checked;
            const newDirectDownload = directDownloadSwitch.checked;
            let newMonochromeColor = monochromeColorInput.value.trim();
            if (newMonochromeColor !== "") {
                if (!newMonochromeColor.startsWith("#")) newMonochromeColor = "#" + newMonochromeColor;
                if (!/^#[0-9A-Fa-f]{6}$/.test(newMonochromeColor)) {
                    show_msg("颜色格式无效，已清除", "warning");
                    newMonochromeColor = "";
                }
            }
            await saveConfig(newIconSize, newIllustrationSize, newFormat, newLayoutEnabled, newDirectDownload, newMonochromeColor);
            updateAllTitles();
            show_msg("插件设置成功~", "success");
            dialog.close();
        };

        saveBtn.onclick = confirmHandler;
        closeBtn.onclick = closeHandler;
        dialog.showModal();
        await new Promise(r => { dialog.addEventListener("close", r, { once: true }); });
        saveBtn.onclick = null;
        closeBtn.onclick = null;
    }

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "openSettings") {
            showSettingsDialog().catch(console.error);
            sendResponse({ success: true });
        }
        return true;
    });

    function addExtStyles() {
        const styleId = "iconfont-ext-styles";
        if (document.getElementById(styleId)) return;
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
            .svg-copy.disabled { opacity: 0.4; pointer-events: none; }
            .force-hide { visibility: hidden !important; }
            .copy-popup { top: 60px !important; }
        `;
        document.head.appendChild(style);
    }

    function observeForIcons() {
        if ($(".block-icon-list > li").length) {
            addCopyIcons();
        }
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    const addedNodes = mutation.addedNodes;
                    for (const node of addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.matches && node.matches('.block-icon-list > li')) {
                                addCopyIcons();
                                break;
                            }
                            if (node.querySelector && node.querySelector('.block-icon-list > li')) {
                                addCopyIcons();
                                break;
                            }
                        }
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        const mainElem = document.querySelector("#magix_vf_main");
        if (mainElem) {
            const mainObserver = new MutationObserver(() => {
                addCopyIcons();
            });
            mainObserver.observe(mainElem, { childList: true, subtree: true });
        }
        const bodyObserver = new MutationObserver(() => {
            bindNativeDownloadButtons();
        });
        bodyObserver.observe(document.body, { childList: true, subtree: true });
    }

    async function init() {
        await loadConfig();
        addExtStyles();
        addUniformButtonStyles();
        addDownloadIconStyles();
        toggleLayoutCSS(currentConfig.layoutEnabled);
        observeForIcons();
        bindNativeDownloadButtons();
        applyDownloadIconsStyle(currentConfig.directDownload);
        window.addEventListener("popstate", () => setTimeout(() => {
            addCopyIcons();
            bindNativeDownloadButtons();
        }, 200));
        console.log("content script 初始化完成");
    }
    init();
})();