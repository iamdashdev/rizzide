gsap.registerPlugin(ScrollTrigger);

const text = "Find me a house near where I work";
const input = document.getElementById("searchInput");
const btn = document.getElementById("sendBtn");
const btnText = document.querySelector(".btn-text");
const spinner = document.querySelector(".spinner");

const tl = gsap.timeline();
const cursor = document.getElementById("virtualCursor");

const getPos = (el) => {
	const rect = el.getBoundingClientRect();
	return {
		x: rect.left + rect.width / 2,
		y: rect.top + rect.height / 2
	};
};

// Initialize cursor position
gsap.set(cursor, {
	x: window.innerWidth + 50,
	y: window.innerHeight / 2
});

// Entrance animations
tl.from(".hero-title", {
	x: -30,
	opacity: 0,
	duration: 0.8,
	ease: "power3.out"
})
	.from(
		".hero-description",
		{ x: -30, opacity: 0, duration: 0.8, ease: "power3.out" },
		"-=0.6"
	)
	.to(
		".center-ui",
		{ x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
		"-=0.6"
	)

	// Move cursor to input
	.to(cursor, { opacity: 1, duration: 0.3 })
	.to(cursor, {
		x: () => getPos(searchInput).x,
		y: () => getPos(searchInput).y,
		duration: 0.8,
		ease: "power2.inOut"
	})

	// Typing effect
	.add(() => {
		input.value = "";
		btnText.style.display = "inline";
		spinner.style.display = "none";
	})
	.to(
		{},
		{
			duration: 2,
			onUpdate: function () {
				const progress = Math.floor(this.progress() * text.length);
				input.value = text.substring(0, progress);
			}
		}
	)

	// Move cursor to button
	.to(cursor, {
		x: () => getPos(btn).x,
		y: () => getPos(btn).y,
		duration: 0.6,
		ease: "power2.inOut"
	})

	// Click animation
	.to(cursor, { scale: 0.8, duration: 0.1 })
	.to(btn, { scale: 0.98, duration: 0.1 }, "<")
	.to(cursor, { scale: 1, duration: 0.1 })
	.to(btn, { scale: 1, duration: 0.1 }, "<")

	// Button loading state
	.to(btnText, { opacity: 0, duration: 0.2 })
	.add(() => {
		btnText.style.display = "none";
		spinner.style.display = "block";
	})
	.to(spinner, { duration: 1 })

	// Fade out cursor
	.to(cursor, { opacity: 0, x: "+=20", duration: 0.5 })

	// Map Entrance
	.to(
		"#mapContainer",
		{
			opacity: 1,
			y: 0,
			duration: 1.5,
			ease: "power4.out",
			pointerEvents: "all"
		},
		"-=0.3"
	)
	.to(
		".mobile-map-image",
		{
			opacity: 1,
			y: 0,
			duration: 1.5,
			ease: "power4.out"
		},
		"<"
	)

	// Connection Lines & Cards
	.add(() => {
		const hero = document.querySelector(".hero");
		const map = document.getElementById("mapContainer");
		const card1 = document.getElementById("card1");
		const card2 = document.getElementById("card2");
		const line1 = document.getElementById("line1");
		const line2 = document.getElementById("line2");
		const maskPath1 = document.getElementById("maskPath1");
		const maskPath2 = document.getElementById("maskPath2");

		/**
		 * CUSTOMIZE LINE APPEARANCE:
		 * - To change source points: Adjust {x, y} in updateLine calls (0.5 is center).
		 * - To change bend position: Adjust bendPixels (pixels before the card it bends).
		 * - To change dots: Edit .dotted-line in style.css (stroke-dasharray).
		 */
		const updateLine = (
			line,
			maskPath,
			startEl,
			endEl,
			startOffset,
			bendPixels = 50
		) => {
			const heroRect = hero.getBoundingClientRect();
			const startRect = startEl.getBoundingClientRect();
			const endRect = endEl.getBoundingClientRect();

			// Map start point (Relative to hero)
			const startX =
				startRect.left - heroRect.left + startRect.width * startOffset.x;
			const startY =
				startRect.top - heroRect.top + startRect.height * startOffset.y;

			// Card end point (Relative to hero)
			const endX = endRect.left - heroRect.left;
			const endY = endRect.top - heroRect.top + endRect.height / 2;

			/**
			 * Implement "----------\" shape (Horizontal then bend)
			 */
			const midX = endX - bendPixels;
			const pathData = `M ${startX} ${startY} L ${midX} ${startY} L ${endX} ${endY}`;

			// Apply path to both visible dotted line and the animation mask
			line.setAttribute("d", pathData);
			maskPath.setAttribute("d", pathData);

			const length = maskPath.getTotalLength();
			maskPath.style.strokeDasharray = length;
			maskPath.style.strokeDashoffset = length;
		};

		// Define connections
		updateLine(line1, maskPath1, map, card1, { x: 0.4, y: 0.6 }, 80);
		updateLine(line2, maskPath2, map, card2, { x: 0.6, y: 0.5 }, 60);
	})
	.to("#maskPath1", { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" })
	.to(
		"#card1",
		{ opacity: 1, x: 0, duration: 0.5, ease: "back.out(1.7)" },
		"-=0.5"
	)
	.to(
		"#maskPath2",
		{ strokeDashoffset: 0, duration: 1, ease: "power2.inOut" },
		"-=0.3"
	)
	.to(
		"#card2",
		{ opacity: 1, x: 0, duration: 0.5, ease: "back.out(1.7)" },
		"-=0.5"
	)
	.to(input, { value: "", duration: 0.2 }) // Clear input
	.add(() => {
		// Reset button state
		btnText.style.display = "inline";
		btnText.style.opacity = "1";
		spinner.style.display = "none";
	})
	.set(".follow-up-card", { display: "flex" })
	.to(".follow-up-card", {
		opacity: 1,
		y: 0,
		duration: 0.8,
		ease: "power3.out"
	})
	.to(".container_mouse", {
		opacity: 1,
		duration: 1,
		ease: "power2.out"
	});

// Features Reveal Animation
gsap.to(".bento-item", {
	scrollTrigger: {
		trigger: ".bento-grid",
		start: "top 80%", // Start animation when top of grid is 80% down the viewport
		toggleActions: "play none none none"
	},
	opacity: 1,
	y: 0,
	duration: 1,
	stagger: 0.15,
	ease: "power4.out"
});

// Subtle parallax for grid items
gsap.utils.toArray(".bento-item").forEach((item) => {
	gsap.to(item, {
		scrollTrigger: {
			trigger: item,
			start: "top bottom",
			end: "bottom top",
			scrub: true
		},
		y: -20,
		ease: "none"
	});
});

// Tech Section Reveal
gsap.from(".tech-header", {
	scrollTrigger: {
		trigger: ".tech-section",
		start: "top 70%",
		toggleActions: "play none none none"
	},
	opacity: 0,
	y: 50,
	duration: 1.2,
	ease: "power4.out"
});

gsap.to(".tech-pillar", {
	scrollTrigger: {
		trigger: ".tech-pillars",
		start: "top 70%",
		toggleActions: "play none none none"
	},
	opacity: 1,
	y: 0,
	duration: 1,
	stagger: 0.3,
	ease: "power3.out"
});

// Parallax for pillar visuals
gsap.utils.toArray(".pillar-visual").forEach((visual) => {
	gsap.to(visual, {
		scrollTrigger: {
			trigger: visual,
			start: "top bottom",
			end: "bottom top",
			scrub: 1
		},
		y: -30,
		ease: "none"
	});
});
