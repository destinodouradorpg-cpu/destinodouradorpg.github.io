const menu_btn = document.getElementById("menu-button");
const menu = document.getElementById("menu");

menu_btn.addEventListener("click", () => {
  menu.classList.toggle("active");
  menu_btn.classList.toggle("active");
});