(() => {
  "use strict";

  const DATA = window.SLEEP_TRACKER_DATA;
  if (!DATA) {
    throw new Error("SLEEP_TRACKER_DATA 未加载。请确认 data.js 在 app.js 之前引入。");
  }

  const DAY_COUNT = positiveInteger(DATA.meta.dayCount, 30);
  const SECTION_SIZE = nonNegativeInteger(DATA.meta.sectionSize, 7);
  const state = loadState();

  function positiveInteger(value, fallback) {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
  }

  function nonNegativeInteger(value, fallback) {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
  }

  function resolveTemplate(value) {
    if (value === null || value === undefined) return "";
    return String(value).replaceAll("{days}", String(DAY_COUNT));
  }

  function emptyState() {
    const rows = {};
    for (let day = 1; day <= DAY_COUNT; day += 1) {
      rows[day] = {};
    }
    return {
      rows,
      footerChecks: {}
    };
  }

  function loadState() {
    const fallback = emptyState();
    try {
      const raw = localStorage.getItem(DATA.meta.storageKey);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return {
        ...fallback,
        rows: { ...fallback.rows, ...(parsed.rows || {}) },
        footerChecks: { ...fallback.footerChecks, ...(parsed.footerChecks || {}) }
      };
    } catch (error) {
      console.warn("无法读取本地数据，将使用空白状态。", error);
      return fallback;
    }
  }

  function saveState() {
    localStorage.setItem(DATA.meta.storageKey, JSON.stringify(state));
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  // 强制使用 24 小时制 HH:MM，不依赖浏览器/系统区域设置。
  function normalize24Hour(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return "";

    let hours;
    let minutes;

    if (/^\d{3,4}$/.test(raw)) {
      const padded = raw.padStart(4, "0");
      hours = Number(padded.slice(0, 2));
      minutes = Number(padded.slice(2, 4));
    } else {
      const match = raw.match(/^(\d{1,2}):([0-5]?\d)$/);
      if (!match) return null;
      hours = Number(match[1]);
      minutes = Number(match[2]);
    }

    if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }

  function makeTime24Input(def, value, onChange) {
    const input = document.createElement("input");
    input.className = "cell-input time24-input";
    input.type = "text";
    input.inputMode = "numeric";
    input.autocomplete = "off";
    input.maxLength = 5;
    input.placeholder = def.placeholder || "HH:MM";
    input.pattern = "(?:[01]\\d|2[0-3]):[0-5]\\d";
    input.value = value ?? def.defaultValue ?? "";

    input.addEventListener("input", () => {
      input.classList.remove("invalid-time");
      input.removeAttribute("aria-invalid");
      onChange(input.value);
    });

    input.addEventListener("blur", () => {
      const normalized = normalize24Hour(input.value);
      if (normalized === null) {
        input.classList.add("invalid-time");
        input.setAttribute("aria-invalid", "true");
        return;
      }
      input.classList.remove("invalid-time");
      input.removeAttribute("aria-invalid");
      input.value = normalized;
      onChange(normalized);
    });

    return input;
  }

  function makeInput(def, value, onChange) {
    if (def.inputType === "checkbox") {
      const label = el("label", "checkbox-wrap");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = Boolean(value);
      input.addEventListener("change", () => onChange(input.checked));
      const mark = el("span", "print-checkmark", def.printMark || "✓");
      label.append(input, mark);
      return label;
    }

    if (def.inputType === "rating") {
      const select = document.createElement("select");
      select.className = "cell-input rating-input";
      const blank = document.createElement("option");
      blank.value = "";
      blank.textContent = "";
      select.appendChild(blank);
      for (let n = def.min || 1; n <= (def.max || 5); n += 1) {
        const option = document.createElement("option");
        option.value = String(n);
        option.textContent = String(n);
        select.appendChild(option);
      }
      select.value = value ?? "";
      select.addEventListener("change", () => onChange(select.value));
      return select;
    }

    if (def.inputType === "time") {
      return makeTime24Input(def, value, onChange);
    }

    const input = document.createElement("input");
    input.className = "cell-input";
    input.type = def.inputType === "number" ? "number" : "text";
    if (def.min !== undefined) input.min = def.min;
    if (def.max !== undefined) input.max = def.max;
    if (def.step !== undefined) input.step = def.step;
    if (def.placeholder !== undefined) input.placeholder = resolveTemplate(def.placeholder);
    input.value = value ?? def.defaultValue ?? "";
    input.addEventListener("input", () => onChange(input.value));
    return input;
  }

  function renderHeader() {
    const root = document.getElementById("tracker-header");
    root.innerHTML = "";

    const titleRow = el("div", "title-row");
    const titleBlock = el("div", "title-block");
    const title = resolveTemplate(DATA.meta.title);
    titleBlock.append(el("h1", "tracker-title", title));
    document.title = `${title} · ${DAY_COUNT} Days`;

    const actions = el("div", "actions no-print");
    const printButton = el("button", "btn", "打印 / 导出 PDF");
    printButton.type = "button";
    printButton.addEventListener("click", () => window.print());

    const clearButton = el("button", "btn btn-secondary", "清空当前数据");
    clearButton.type = "button";
    clearButton.addEventListener("click", () => {
      if (!window.confirm("确定清空当前浏览器中保存的这轮协议数据吗？")) return;
      localStorage.removeItem(DATA.meta.storageKey);
      window.location.reload();
    });

    actions.append(printButton, clearButton);
    titleRow.append(titleBlock, actions);
    root.appendChild(titleRow);
  }

  function renderTable() {
    const section = document.getElementById("tracker-table-section");
    section.innerHTML = "";

    const wrap = el("div", "table-wrap");
    const table = document.createElement("table");
    table.className = "tracker-table";

    const colgroup = document.createElement("colgroup");
    DATA.columns.forEach((column) => {
      const col = document.createElement("col");
      if (column.width) col.style.width = column.width;
      colgroup.appendChild(col);
    });
    table.appendChild(colgroup);

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    DATA.columns.forEach((column) => {
      const th = document.createElement("th");
      const label = el("div", "th-label", resolveTemplate(column.label));
      const sublabel = el("div", "th-sublabel", resolveTemplate(column.sublabel || ""));
      th.append(label, sublabel);
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    for (let day = 1; day <= DAY_COUNT; day += 1) {
      const tr = document.createElement("tr");
      if (SECTION_SIZE > 0 && day > 1 && (day - 1) % SECTION_SIZE === 0) {
        tr.classList.add("week-break");
      }

      DATA.columns.forEach((column) => {
        const td = document.createElement("td");
        if (column.inputType === "day") {
          td.textContent = day;
          td.className = "day-cell";
        } else {
          const current = state.rows[day]?.[column.id] ?? "";
          const input = makeInput(column, current, (next) => {
            if (!state.rows[day]) state.rows[day] = {};
            state.rows[day][column.id] = next;
            saveState();
          });
          td.appendChild(input);
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    wrap.appendChild(table);
    section.appendChild(wrap);
  }

  function renderFooterPanels() {
    const root = document.getElementById("tracker-footer-panels");
    root.innerHTML = "";

    const panelGrid = el("div", "footer-grid");

    DATA.footerPanels.forEach((panel) => {
      const card = el("article", "info-card");
      card.append(el("h2", "card-title", resolveTemplate(panel.title)));

      if (panel.type === "checklist") {
        const list = el("div", "checklist");
        panel.items.forEach((item, index) => {
          const label = el("label", "footer-check-row");
          const input = document.createElement("input");
          input.type = "checkbox";
          const key = `${panel.id}-${index}`;
          input.checked = Boolean(state.footerChecks[key]);
          input.addEventListener("change", () => {
            state.footerChecks[key] = input.checked;
            saveState();
          });
          label.append(input, el("span", "footer-check-mark", "✓"), el("span", "", resolveTemplate(item)));
          list.appendChild(label);
        });
        card.appendChild(list);
      } else if (panel.type === "steps") {
        const ordered = document.createElement("ol");
        ordered.className = "steps-list";
        panel.items.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = resolveTemplate(item);
          ordered.appendChild(li);
        });
        card.appendChild(ordered);
      } else {
        const ul = document.createElement("ul");
        ul.className = "bullet-list";
        panel.items.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = resolveTemplate(item);
          ul.appendChild(li);
        });
        card.appendChild(ul);
      }

      panelGrid.appendChild(card);
    });

    root.appendChild(panelGrid);
  }

  function render() {
    renderHeader();
    renderTable();
    renderFooterPanels();
  }

  render();
})();
