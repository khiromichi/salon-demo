"use strict";
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
const dialog = document.querySelector("#reservation-dialog");
const form = document.querySelector("#reservation-form");
const service = document.querySelector("#service");
const confirmation = document.querySelector("#booking-confirmation");
const estimates = {
  cut: { time: "約60分", price: "¥6,600（税込）" },
  color: { time: "約120〜150分", price: "¥15,400〜（税込）" },
  care: { time: "約90分", price: "¥11,000〜（税込）" },
  consult: { time: "メニューによりご案内", price: "ご相談後にお見積もり" }
};
let lastTrigger;
function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "メニューを開く");
  navigation.classList.remove("is-open");
}
menuToggle.addEventListener("click", () => {
  const opening = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(opening));
  menuToggle.setAttribute("aria-label", opening ? "メニューを閉じる" : "メニューを開く");
  navigation.classList.toggle("is-open", opening);
});
navigation.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
document.addEventListener("click", event => { if (!event.target.closest(".header")) closeMenu(); });
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") { closeMenu(); menuToggle.focus(); }
});
window.matchMedia("(min-width: 701px)").addEventListener("change", closeMenu);
function updateEstimate() {
  const estimate = estimates[service.value];
  document.querySelector("#estimate-time").textContent = estimate.time;
  document.querySelector("#estimate-price").textContent = estimate.price;
}
service.addEventListener("change", updateEstimate);
document.querySelectorAll("[data-reservation]").forEach(button => {
  button.addEventListener("click", () => {
    lastTrigger = button;
    closeMenu();
    form.reset(); updateEstimate();
    form.hidden = false; confirmation.hidden = true;
    dialog.showModal(); document.body.classList.add("modal-open");
  });
});
document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener("close", () => { document.body.classList.remove("modal-open"); lastTrigger?.focus(); });
form.addEventListener("submit", event => {
  event.preventDefault();
  const estimate = estimates[service.value];
  document.querySelector("#confirmation-detail").textContent = `${service.selectedOptions[0].textContent} / ${estimate.time} / ${estimate.price}`;
  form.hidden = true; confirmation.hidden = false;
  document.querySelector("#booking-back").focus();
});
document.querySelector("#booking-back").addEventListener("click", () => { confirmation.hidden = true; form.hidden = false; service.focus(); });
