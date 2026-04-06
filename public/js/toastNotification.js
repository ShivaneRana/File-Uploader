const toastNotification = document.querySelector(".toast-notification");
const toastMessage = document.querySelector(".toast-message");
let timerCount = null;
const countdown = 5000;

document.addEventListener("DOMContentLoaded", (e) => {
	showToast();
	timerCount = setTimeout(() => {
		hideToast();
	}, countdown);
});

toastNotification.addEventListener("click", (e) => {
	hideToast();
});

function showToast() {
	toastNotification.classList.remove("hide-toast");
	toastNotification.classList.add("show-toast");
}

function hideToast() {
	clearTimeout(timerCount);
	toastNotification.classList.remove("show-toast");
	toastNotification.classList.add("hide-toast");
}
