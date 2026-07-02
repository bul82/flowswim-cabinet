const tg = window.Telegram?.WebApp;
const roleButtons = document.querySelectorAll(".role-button");
const roleViews = document.querySelectorAll(".role-view");
const tabs = document.querySelectorAll(".tab");
const toast = document.querySelector(".toast");
const parentForm = document.querySelector(".parent-list");
const saveParentsButton = document.querySelector("#saveParents");
const confirmVisitButton = document.querySelector("#confirmVisit");

const parentStorageKey = "flowswim-parent-profile";
const roleStorageKey = "flowswim-active-role";

function applyTelegramTheme() {
  if (!tg) return;

  tg.ready();
  tg.expand();

  const params = tg.themeParams || {};
  if (params.bg_color) document.documentElement.style.setProperty("--bg", params.bg_color);
  if (params.text_color) document.documentElement.style.setProperty("--text", params.text_color);
  if (params.hint_color) document.documentElement.style.setProperty("--muted", params.hint_color);
  if (params.button_color) document.documentElement.style.setProperty("--accent", params.button_color);
  if (params.secondary_bg_color) document.documentElement.style.setProperty("--surface-muted", params.secondary_bg_color);

  tg.MainButton.onClick(() => showToast("Действие подготовлено"));
}

function setMainButton(role, tabId) {
  if (!tg) return;

  if (role === "student" && tabId === "student-overview") {
    tg.MainButton.setText("Написать тренеру");
    tg.MainButton.show();
    return;
  }

  if (role === "coach" && tabId === "coach-today") {
    tg.MainButton.setText("Отметить посещаемость");
    tg.MainButton.show();
    return;
  }

  tg.MainButton.hide();
}

function switchRole(role) {
  roleButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.role === role));
  roleViews.forEach((view) => view.classList.toggle("is-active", view.dataset.roleView === role));
  localStorage.setItem(roleStorageKey, role);

  const activeTab = document.querySelector(`[data-role-view="${role}"] .tab.is-active`);
  setMainButton(role, activeTab?.dataset.tab);
  tg?.HapticFeedback?.selectionChanged();
}

function switchTab(tabId) {
  const tab = document.querySelector(`[data-tab="${tabId}"]`);
  if (!tab) return;

  const group = tab.closest("[data-tabs]")?.dataset.tabs;
  document.querySelectorAll(`[data-tabs="${group}"] .tab`).forEach((item) => {
    item.classList.toggle("is-active", item.dataset.tab === tabId);
  });
  document.querySelectorAll(`[data-panel-group="${group}"]`).forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === tabId);
  });

  setMainButton(group, tabId);
  tg?.HapticFeedback?.selectionChanged();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function saveParents() {
  const formData = new FormData(parentForm);
  const values = Object.fromEntries(formData.entries());
  localStorage.setItem(parentStorageKey, JSON.stringify(values));
  showToast("Контакты родителей сохранены");
  tg?.HapticFeedback?.notificationOccurred("success");
}

function restoreParents() {
  const saved = localStorage.getItem(parentStorageKey);
  if (!saved) return;

  const values = JSON.parse(saved);
  Object.entries(values).forEach(([name, value]) => {
    const input = parentForm.elements[name];
    if (input) input.value = value;
  });
}

roleButtons.forEach((button) => {
  button.addEventListener("click", () => switchRole(button.dataset.role));
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => switchTab(tab.dataset.tab));
});

saveParentsButton.addEventListener("click", saveParents);

confirmVisitButton.addEventListener("click", () => {
  showToast("Тренер увидит отметку о посещении");
  tg?.HapticFeedback?.impactOccurred("light");
});

document.querySelectorAll(".coach-session .small-button").forEach((button) => {
  button.addEventListener("click", () => showToast("Открыта отметка группы"));
});

restoreParents();
applyTelegramTheme();
switchRole(localStorage.getItem(roleStorageKey) || "student");
