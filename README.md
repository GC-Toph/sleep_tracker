# Sleep Protocol Tracker

## 使用

双击 `index.html` 即可打开，不需要本地服务器。

## 修改协议天数：21 / 28 / 30 天

打开 `data.js`，只改：

```js
meta: {
  dayCount: 28,
  sectionSize: 7,
  // ...
}
```

`sectionSize: 7` 表示每 7 天增加一条视觉分隔线。若不需要，设置为 `0`。

## 修改主表列

打开 `data.js`，直接编辑 `columns` 数组。增加、删除、排序列都无需修改 `app.js`。

支持的 `inputType`：

- `checkbox`
- `time`（24h `HH:MM`）
- `number`
- `text`
- `rating`
- `day`（仅 Day 序号）

## 修改底部说明

编辑 `footerPanels`。支持三种形式：

- `steps`：有序步骤
- `checklist`：可勾选清单
- `bullets`：普通项目符号

## 打印 / PDF

页面右上角点击“打印 / 导出 PDF”。

建议：

- 纸张：A4
- 方向：横向
- 缩放：默认 / 100%
- CSS 已指定 8mm 页边距

## 数据保存

填写内容保存在当前浏览器的 `localStorage`。

- 刷新后仍保留；
- `dayCount` 从 30 改成 21 时，第 22–30 天暂时隐藏但不会主动删除；
- 改回 30 后仍可显示；
- “清空当前数据”会删除当前保存的数据。
