// Hamburger Menu Toggle
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
	hamburger.classList.toggle("active");
	navLinks.classList.toggle("active");
});

// Close menu when clicking on a link
navLinks.querySelectorAll("a").forEach((link) => {
	link.addEventListener("click", () => {
		hamburger.classList.remove("active");
		navLinks.classList.remove("active");
	});
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
	if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
		hamburger.classList.remove("active");
		navLinks.classList.remove("active");
	}
});
