const tg = window.Telegram?.WebApp;
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-panel");
const toast = document.querySelector(".toast");
const parentForm = document.querySelector(".parent-list");
const saveParentsButton = document.querySelector("#saveParents");

const storageKey = "flowswim-parent-profile";

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

  tg.MainButton.setText("Записаться к тренеру");
  tg.MainButton.onClick(() => showToast("Заявка тренеру подготовлена"));
}

function switchTab(tabId) {
  tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.tab === tabId));
  panels.forEach((panel) => panel.classList.toggle("is-active", panel.id === tabId));

  if (tg) {
    if (tabId === "overview") {
      tg.MainButton.show();
    } else {
      tg.MainButton.hide();
    }
    tg.HapticFeedback?.selectionChanged();
  }
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
  localStorage.setItem(storageKey, JSON.stringify(values));
  showToast("Контакты родителей сохранены");
  tg?.HapticFeedback?.notificationOccurred("success");
}

function restoreParents() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return;

  const values = JSON.parse(saved);
  Object.entries(values).forEach(([name, value]) => {
    const input = parentForm.elements[name];
    if (input) input.value = value;
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => switchTab(tab.dataset.tab));
});

saveParentsButton.addEventListener("click", saveParents);

document.querySelector(".primary-button").addEventListener("click", () => {
  showToast("Тренер увидит отметку о посещении");
  tg?.HapticFeedback?.impactOccurred("light");
});

restoreParents();
applyTelegramTheme();
switchTab("overview");
