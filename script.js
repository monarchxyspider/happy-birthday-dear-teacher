const KEY = "home-energy-manager-static-v1";
const config = window.HEM_CONFIG || { CUSTOM_IMAGES: {} };
const categories = ["Food", "Electricity", "Water", "Transport", "Shopping", "Other"];
const defaultSchedule = {
  morning: "Run high-load appliances before 9:00 AM when possible.",
  afternoon: "Keep cooling efficient; use shade and ventilation first.",
  evening: "Choose one high-load appliance at a time after 6:00 PM.",
  night: "Switch off standby loads before bed.",
};
const defaultAppliances = [
  { id: "fan-1", name: "Fan 1", watts: 75, icon: "◒" },
  { id: "fan-2", name: "Fan 2", watts: 75, icon: "◒" },
  { id: "tv", name: "TCL Medium TV", watts: 100, icon: "▣" },
  { id: "fridge", name: "Old Refrigerator", watts: 180, icon: "▤" },
  { id: "pump", name: "Water Pump", watts: 750, icon: "◉" },
  { id: "cooler", name: "Air Cooler", watts: 180, icon: "≋" },
  { id: "oven", name: "Oven", watts: 1200, icon: "△" },
  { id: "lights", name: "Lights / Bulbs", watts: 60, icon: "○" },
];

let state = loadState();
let now = Date.now();
let activeView = "dashboard";
let charts = {};

function keyFor(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function monthFor(date = new Date()) { return keyFor(date).slice(0, 7); }
function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2)}`; }
function freshState() {
  const date = new Date();
  return {
    settings: {
      monthlyTarget: 170, dailyBudget: 600, tariff: 55,
      startDate: keyFor(new Date(date.getFullYear(), date.getMonth(), 1)),
      fridgeDuty: 42, appliances: structuredClone(defaultAppliances),
      schedule: { ...defaultSchedule },
    },
    events: [], expenses: [],
  };
}
function loadState() {
  try {
    const stored = localStorage.getItem(KEY);
    if (!stored) return freshState();
    const parsed = JSON.parse(stored);
    const fresh = freshState();
    return {
      settings: {
        ...fresh.settings, ...(parsed.settings || {}),
        appliances: parsed.settings?.appliances?.length ? parsed.settings.appliances : fresh.settings.appliances,
        schedule: { ...fresh.settings.schedule, ...(parsed.settings?.schedule || {}) },
      },
      events: Array.isArray(parsed.events) ? parsed.events : [],
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
    };
  } catch { return freshState(); }
}
function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
function hours(event, timestamp = now) { return Math.max(0, ((event.endedAt || timestamp) - event.startedAt) / 3600000); }
function overlap(event, date, timestamp = now) {
  const start = new Date(`${date}T00:00:00`).getTime();
  const end = start + 86400000;
  return Math.max(0, Math.min(event.endedAt || timestamp, end) - Math.max(event.startedAt, start)) / 3600000;
}
function runtime(id, date = keyFor(), timestamp = now) {
  return state.events.filter(e => e.applianceId === id).reduce((sum, e) => sum + overlap(e, date, timestamp), 0);
}
function usage(date = keyFor(), timestamp = now) {
  return state.settings.appliances.reduce((sum, a) => sum + a.watts * runtime(a.id, date, timestamp) / 1000, 0);
}
function monthDates(date = new Date()) {
  const total = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return Array.from({ length: total }, (_, i) => keyFor(new Date(date.getFullYear(), date.getMonth(), i + 1)));
}
function money(value) { return `PKR ${Math.round(value).toLocaleString()}`; }
function kwh(value, digits = 2) { return `${Number(value || 0).toFixed(digits).replace(/\.0+$/, "")} kWh`; }
function duration(value) {
  const mins = Math.max(0, Math.round(value * 60));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`;
}
function dateText(value) {
  return new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" }).format(new Date(`${value}T12:00:00`));
}
function tone(percent) { return percent >= 100 ? "over" : percent >= 75 ? "near" : "safe"; }
function metric(label, value, detail, icon, status = "safe") {
  return `<article class="metric ${status}"><div class="metric-label"><span>${label}</span><i class="metric-icon">${icon}</i></div><div class="metric-value">${value}</div><small>${detail}</small></article>`;
}
function currentOpen(id) { return state.events.find(e => e.applianceId === id && !e.endedAt); }
function update(next) { state = next; save(); render(); }
function applianceById(id) { return state.settings.appliances.find(a => a.id === id); }
function mountView(id) {
  const source = document.getElementById(id);
  const clone = source.cloneNode(true);
  source.remove();
  document.getElementById("app").replaceChildren(clone);
}

function render() {
  document.querySelectorAll("[data-view]").forEach(button => {
    button.classList.toggle("active", button.dataset.view === activeView);
  });
  const app = document.getElementById("app");
  if (activeView === "dashboard") {
    app.innerHTML = document.getElementById("dashboardTemplate").innerHTML;
    renderDashboard();
  } else if (activeView === "history") {
    mountView("viewHistory");
    renderHistory();
  } else if (activeView === "schedule") {
    mountView("viewSchedule");
    renderSchedule();
  } else if (activeView === "expenses") {
    mountView("viewExpenses");
    renderExpenses();
  } else {
    mountView("viewSettings");
    renderSettings();
  }
  wireCommon();
}
function wireCommon() {
  document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => {
    activeView = button.dataset.view;
    document.getElementById("mobileNav").classList.remove("open");
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }));
  document.getElementById("menuButton")?.addEventListener("click", () => document.getElementById("mobileNav").classList.toggle("open"));
}
function renderDashboard() {
  const date = new Date();
  const today = keyFor(date);
  const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const dayNumber = date.getDate();
  const monthUsage = monthDates(date).slice(0, dayNumber).reduce((sum, d) => sum + usage(d), 0);
  const todayUsage = usage(today);
  const average = monthUsage / dayNumber;
  const projected = average * days;
  const remaining = Math.max(0, state.settings.monthlyTarget - monthUsage);
  const percent = monthUsage / state.settings.monthlyTarget * 100;
  const status = tone(percent);
  const dailyTarget = state.settings.monthlyTarget / days;
  const todayExpenses = state.expenses.filter(e => e.date === today);
  const monthExpenses = state.expenses.filter(e => e.date.startsWith(monthFor(date)));
  const spent = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
  document.getElementById("heroDate").textContent = date.toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" });
  document.getElementById("heroMessage").textContent = status === "safe" ? "Your home is pacing beautifully this month. Keep the small wins coming." : status === "near" ? "You are getting close to the monthly line. A few mindful switches can help." : "The estimate is over target. Let’s reset the pace from today.";
  document.getElementById("hero").className = `hero ${status}`;
  document.getElementById("monthPercent").textContent = `${percent.toFixed(0)}%`;
  document.getElementById("monthProgress").style.width = `${Math.min(100, Math.max(2, percent))}%`;
  document.getElementById("monthProgress").className = status;
  document.getElementById("monthUsage").textContent = kwh(monthUsage, 1);
  document.getElementById("targetLabel").textContent = state.settings.monthlyTarget;
  document.getElementById("metrics").innerHTML =
    metric("Today’s estimate", kwh(todayUsage), `${dailyTarget.toFixed(1)} kWh daily target`, "∿", tone(todayUsage / dailyTarget * 100)) +
    metric("Units remaining", kwh(remaining, 1), `through ${days - dayNumber} days`, "◌", status) +
    metric("Average used / day", kwh(average), `recommended ${dailyTarget.toFixed(1)} kWh`, "⌁", tone(average / dailyTarget * 100)) +
    metric("Projected month", kwh(projected, 1), `${(projected - state.settings.monthlyTarget).toFixed(1)} vs target`, "↗", tone(projected / state.settings.monthlyTarget * 100));
  document.getElementById("expenseSummary").innerHTML =
    `<div class="mini-stat ${tone(spent / state.settings.dailyBudget * 100)}"><small>Spent</small><b>${money(spent)}</b></div>
     <div class="mini-stat"><small>Remaining</small><b>${money(Math.max(0, state.settings.dailyBudget - spent))}</b></div>
     <div class="mini-stat"><small>Month</small><b>${money(monthExpenses.reduce((sum, e) => sum + e.amount, 0))}</b></div>`;
  document.getElementById("expenseProgress").style.width = `${Math.min(100, spent / state.settings.dailyBudget * 100)}%`;
  document.getElementById("expenseProgress").className = tone(spent / state.settings.dailyBudget * 100);
  const active = state.events.filter(e => !e.endedAt).length;
  document.getElementById("activeCount").textContent = active;
  document.getElementById("activeLabel").textContent = active === 1 ? "appliance is running" : "appliances are running";
  document.getElementById("seeAppliances").addEventListener("click", () => document.getElementById("appliances-section").scrollIntoView({ behavior: "smooth" }));
  document.querySelector("[data-view='expenses']")?.addEventListener("click", () => { activeView = "expenses"; render(); });
  document.getElementById("appliances").innerHTML = state.settings.appliances.map(renderAppliance).join("");
  document.querySelectorAll("[data-toggle]").forEach(button => button.addEventListener("click", () => toggleAppliance(button.dataset.toggle)));
  document.querySelectorAll("[data-edit]").forEach(button => button.addEventListener("click", () => editAppliance(button.dataset.edit)));
  document.querySelectorAll("[data-action]").forEach(button => button.addEventListener("click", () => quickAction(button.dataset.action)));
}
function renderAppliance(appliance) {
  const open = currentOpen(appliance.id);
  const run = runtime(appliance.id);
  const todayKwh = appliance.watts * run / 1000;
  const events = state.events.filter(e => e.applianceId === appliance.id).slice(-3).reverse();
  return `<article class="appliance ${open ? "running" : ""}">
    ${open ? '<span class="running-badge">Running</span>' : ""}
    <div class="appliance-head"><div class="appliance-title"><span class="appliance-icon">${appliance.icon}</span><div><h3>${escapeHtml(appliance.name)}</h3><small>${appliance.watts} watts</small></div></div><button class="edit-button" data-edit="${appliance.id}" aria-label="Edit appliance">✎</button></div>
    <div class="appliance-stats"><div><small>Live</small><b>${open ? duration(runtime(appliance.id)) : "Off"}</b></div><div><small>Today</small><b>${duration(run)}</b></div><div><small>Est. kWh</small><b>${todayKwh.toFixed(2)}</b></div></div>
    <button class="toggle-button ${open ? "off" : ""}" data-toggle="${appliance.id}">${open ? "TURN OFF" : "TURN ON"}</button>
    <details class="events"><summary>View recent events</summary>${events.length ? events.map(e => `<div class="event-row"><span>${new Date(e.startedAt).toLocaleDateString("en",{month:"short",day:"numeric"})}</span><b>${duration(overlap(e,keyFor()))}</b></div>`).join("") : '<div class="event-row"><span>No events logged yet</span></div>'}</details>
  </article>`;
}
function toggleAppliance(id) {
  const open = currentOpen(id);
  state.events = open ? state.events.map(e => e.id === open.id ? { ...e, endedAt: now } : e) : [...state.events, { id: uid(), applianceId: id, startedAt: now }];
  save(); render();
}
function editAppliance(id) {
  const appliance = applianceById(id);
  const name = prompt("Appliance name:", appliance.name);
  if (name === null) return;
  const watts = Number(prompt("Wattage in watts:", appliance.watts));
  if (!name.trim() || !watts || watts < 1) return alert("Please enter a valid name and wattage.");
  appliance.name = name.trim(); appliance.watts = watts; update(state);
}
function quickAction(action) {
  if (action === "pump30" || action === "pump40") addTimed("pump", action === "pump30" ? 30 : 40, "quick action");
  if (action === "oven") {
    const choice = prompt("Enter oven minutes, or type fridge for a 24-hour refrigerator estimate:", "30");
    if (choice === null) return;
    if (choice.toLowerCase() === "fridge") {
      const fridge = applianceById("fridge");
      addTimed("fridge", 1440 * state.settings.fridgeDuty / 100, "24-hour duty cycle");
    } else if (Number(choice) > 0) addTimed("oven", Number(choice), "quick action");
  }
}
function addTimed(applianceId, minutes, source) {
  state.events.push({ id: uid(), applianceId, startedAt: now - minutes * 60000, endedAt: now, source });
  update(state);
}

function renderHistory() {
  const selected = document.getElementById("historyDate");
  selected.value = keyFor();
  selected.addEventListener("change", renderHistory);
  const date = selected.value;
  const dates = monthDates(new Date(`${date}T12:00:00`));
  const dayUsage = usage(date);
  const dayExpenses = state.expenses.filter(e => e.date === date).reduce((sum, e) => sum + e.amount, 0);
  document.getElementById("historyMetrics").innerHTML = metric("Electricity", kwh(dayUsage), "estimated usage", "⚡") + metric("Expenses", money(dayExpenses), `${state.expenses.filter(e => e.date === date).length} entries`, "¤") + metric("Estimated cost", money(dayUsage * state.settings.tariff), `at PKR ${state.settings.tariff}/unit`, "▤");
  document.getElementById("applianceChartLabel").textContent = `Runtime on ${dateText(date)}`;
  document.getElementById("dayDetailTitle").textContent = dateText(date);
  document.getElementById("dayDetailUsage").textContent = kwh(dayUsage);
  document.getElementById("dayDetail").innerHTML = state.settings.appliances.map(a => `<div class="detail-row"><b>${escapeHtml(a.name)}</b><span class="mono">${duration(runtime(a.id, date))}</span><span class="kwh">${kwh(a.watts * runtime(a.id, date) / 1000)}</span></div>`).join("");
  drawChart("electricityChart", "line", dates.map(d => d.slice(8)), dates.map(d => Number(usage(d).toFixed(2))), "kWh", "#176653");
  drawChart("expenseChart", "bar", dates.map(d => d.slice(8)), dates.map(d => state.expenses.filter(e => e.date === d).reduce((sum, e) => sum + e.amount, 0)), "PKR", "#e8a62d");
  drawChart("trendChart", "line", dates.map(d => d.slice(8)), dates.map(d => Number(usage(d).toFixed(2))), "kWh", "#df7b3b");
  const active = state.settings.appliances.filter(a => runtime(a.id, date) > 0);
  drawChart("applianceChart", "bar", active.map(a => a.name.replace("Old ","").replace("TCL Medium ","")), active.map(a => Number((a.watts * runtime(a.id, date) / 1000).toFixed(2))), "kWh", "#176653", true);
}
function drawChart(id, type, labels, data, label, color, horizontal = false) {
  if (charts[id]) charts[id].destroy();
  const canvas = document.getElementById(id);
  if (!canvas || typeof Chart === "undefined") return;
  charts[id] = new Chart(canvas, { type, data: { labels, datasets: [{ label, data, borderColor: color, backgroundColor: `${color}30`, borderWidth: 2, fill: type === "line", tension: .3, borderRadius: 5 }] }, options: { responsive: true, maintainAspectRatio: false, indexAxis: horizontal ? "y" : "x", plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: "#ece8df" } } } } });
}

function renderSchedule() {
  const slots = [["morning","Morning","6:00 — 11:00"],["afternoon","Afternoon","11:00 — 17:00"],["evening","Evening","17:00 — 22:00"],["night","Night","22:00 — 6:00"]];
  document.getElementById("scheduleCards").innerHTML = slots.map(([key,label,time]) => `<article class="schedule-card"><h2>${label}</h2><small>${time}</small><textarea data-schedule="${key}">${escapeHtml(state.settings.schedule[key])}</textarea></article>`).join("");
  document.getElementById("saveSchedule").addEventListener("click", () => { slots.forEach(([key]) => state.settings.schedule[key] = document.querySelector(`[data-schedule="${key}"]`).value); update(state); alert("Schedule saved on this device."); });
  document.getElementById("resetSchedule").addEventListener("click", () => { slots.forEach(([key]) => document.querySelector(`[data-schedule="${key}"]`).value = defaultSchedule[key]); });
}

function renderExpenses() {
  const today = keyFor(), month = monthFor();
  const todayItems = state.expenses.filter(e => e.date === today);
  const monthItems = state.expenses.filter(e => e.date.startsWith(month));
  const spent = todayItems.reduce((sum, e) => sum + e.amount, 0);
  const total = monthItems.reduce((sum, e) => sum + e.amount, 0);
  const tracked = new Set(monthItems.map(e => e.date)).size;
  document.getElementById("expenseMetrics").innerHTML = metric("Today's spent", money(spent), `of ${money(state.settings.dailyBudget)} budget`, "¤", tone(spent / state.settings.dailyBudget * 100)) + metric("Today's remaining", money(Math.max(0, state.settings.dailyBudget - spent)), "available today", "✓") + metric("Monthly spending", money(total), "all categories", "▤") + metric("Days tracked", tracked, "this month", "◷");
  document.getElementById("expenseDate").value = today;
  document.getElementById("expenseForm").addEventListener("submit", e => { e.preventDefault(); const amount = Number(document.getElementById("expenseAmount").value); if (!amount) return; state.expenses.unshift({ id: uid(), amount, category: document.getElementById("expenseCategory").value, note: document.getElementById("expenseNote").value.trim(), date: document.getElementById("expenseDate").value }); update(state); });
  document.getElementById("monthExpenseTotal").textContent = money(total);
  document.getElementById("expenseCountLabel").textContent = monthItems.length ? `${monthItems.length} entries across ${tracked} days` : "No entries yet";
  document.getElementById("expenseList").innerHTML = monthItems.length ? monthItems.slice(0, 20).map(e => `<div class="expense-row"><div><b>${escapeHtml(e.note || e.category)}</b><small>${e.category} · ${dateText(e.date)}</small></div><strong class="mono">${money(e.amount)}</strong><button class="delete-expense" data-delete-expense="${e.id}">×</button></div>`).join("") : '<div class="empty-state">Your spending log is clear. Add your first household expense to see summaries here.</div>';
  document.querySelectorAll("[data-delete-expense]").forEach(button => button.addEventListener("click", () => { state.expenses = state.expenses.filter(e => e.id !== button.dataset.deleteExpense); update(state); }));
  document.getElementById("categorySummary").innerHTML = categories.map(category => `<div class="category-item"><b>•</b><span>${category}</span><strong>${money(monthItems.filter(e => e.category === category).reduce((sum,e) => sum + e.amount, 0))}</strong></div>`).join("");
}

function renderSettings() {
  const s = state.settings;
  document.getElementById("settingTarget").value = s.monthlyTarget; document.getElementById("settingBudget").value = s.dailyBudget; document.getElementById("settingTariff").value = s.tariff; document.getElementById("settingDuty").value = s.fridgeDuty; document.getElementById("settingStartDate").value = s.startDate;
  document.getElementById("settingsForm").addEventListener("submit", e => { e.preventDefault(); s.monthlyTarget = Number(document.getElementById("settingTarget").value); s.dailyBudget = Number(document.getElementById("settingBudget").value); s.tariff = Number(document.getElementById("settingTariff").value); s.fridgeDuty = Number(document.getElementById("settingDuty").value); s.startDate = document.getElementById("settingStartDate").value; update(state); alert("Preferences saved on this device."); });
  document.getElementById("settingsAppliances").innerHTML = s.appliances.map(a => `<div class="setting-row"><b>${a.icon}</b><input data-setting-name="${a.id}" value="${escapeAttribute(a.name)}" aria-label="${a.id} name" /><input type="number" min="1" data-setting-watts="${a.id}" value="${a.watts}" aria-label="${a.id} wattage" /><span>W</span></div>`).join("");
  document.querySelectorAll("[data-setting-name]").forEach(input => input.addEventListener("change", () => { applianceById(input.dataset.settingName).name = input.value.trim() || "Appliance"; save(); }));
  document.querySelectorAll("[data-setting-watts]").forEach(input => input.addEventListener("change", () => { applianceById(input.dataset.settingWatts).watts = Math.max(1, Number(input.value)); save(); }));
  document.getElementById("resetAll").addEventListener("click", () => { if (confirm("Delete all saved household data? This cannot be undone.")) { localStorage.removeItem(KEY); state = freshState(); render(); } });
}

function escapeHtml(value) { return String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[c])); }
function escapeAttribute(value) { return escapeHtml(value); }

setInterval(() => { now = Date.now(); if (activeView === "dashboard" && state.events.some(e => !e.endedAt)) renderDashboard(); }, 1000);
render();