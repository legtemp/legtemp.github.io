gsap.registerPlugin(ScrollTrigger);

// 1. Hero Reveal (Buttery Smooth Entrance)
window.addEventListener('DOMContentLoaded', () => {
    // Initial states for better animation
    gsap.set(".hero-title", { y: 60, opacity: 0, scale: 0.95 });
    gsap.set(".hero-subtitle", { y: 30, opacity: 0 });
    gsap.set(".hero-btns", { y: 20, opacity: 0 });

    const tl = gsap.timeline();

    tl.to(".hero-title", {
        duration: 1.5,
        y: 0,
        opacity: 1,
        scale: 1,
        ease: "expo.out"
    })
        .to(".hero-subtitle", {
            duration: 1.2,
            y: 0,
            opacity: 0.8,
            ease: "expo.out"
        }, "-=1.1");

    if (document.querySelector(".hero-btns")) {
        tl.to(".hero-btns", {
            duration: 1,
            y: 0,
            opacity: 1,
            ease: "power3.out"
        }, "-=0.8");
    }

    if (document.querySelector(".search-container")) {
        tl.to(".search-container", {
            duration: 1,
            y: 0,
            opacity: 1,
            ease: "power3.out"
        }, "-=0.8");
    }
});

// 2. Feature Cards Entrance (Staggered)
if (document.querySelector("#features")) {
    gsap.set(".feature-wrapper", { opacity: 0, y: 50 });
    gsap.to(".feature-wrapper", {
        scrollTrigger: {
            trigger: "#features",
            start: "top 75%",
        },
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: "power4.out"
    });
}



// 3. Team Section Animation
gsap.set(".team-wrapper", { opacity: 0, scale: 0.8, y: 30 });
gsap.to(".team-wrapper", {
    scrollTrigger: {
        trigger: "#team",
        start: "top 80%",
    },
    opacity: 1,
    scale: 1,
    y: 0,
    stagger: 0.2,
    duration: 1.2,
    ease: "back.out(2)"
});

// Mouse Glow Helper Function
function attachMouseGlow(cards) {
    cards.forEach(card => {
        card.addEventListener("mousemove", e => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / card.clientWidth) * 100;
            const y = ((e.clientY - rect.top) / card.clientHeight) * 100;
            card.style.setProperty("--mouse-x", `${x}%`);
            card.style.setProperty("--mouse-y", `${y}%`);
        });
    });
}

// 4. Interactive Mouse Glow Logic (Runs statically for index.html elements)
const staticCards = document.querySelectorAll(".feature-card");
attachMouseGlow(staticCards);

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.glass-nav');
    if (window.scrollY > 50) {
        nav.style.background = "rgba(5, 5, 5, 0.9)";
        nav.style.padding = "10px 0";
    } else {
        nav.style.background = "rgba(5, 5, 5, 0.6)";
        nav.style.padding = "20px 0";
    }
});

// Dynamic Device Loading & Filtering
const deviceListContainer = document.getElementById("deviceList");
const searchInput = document.getElementById("deviceSearch");
const noResults = document.getElementById("noResults");

if (deviceListContainer) {
    fetch('devices.json')
        .then(response => response.json())
        .then(devices => {
            deviceListContainer.innerHTML = ''; // Clear loading content

            devices.forEach(device => {
                const searchName = `${device.name} ${device.codename}`.toLowerCase();
                const statusHtml = device.status === "Official"
                    ? `<span class="badge bg-success bg-opacity-10 text-success border border-success">Official</span>`
                    : `<span class="badge bg-warning bg-opacity-10 text-warning border border-warning">Unofficial</span>`;

                const cardHTML = `
                <div class="col-md-6 col-lg-4 device-item" data-name="${searchName}" style="opacity: 0; transform: translateY(50px);">
                    <div class="feature-card h-100 p-4">
                        <div class="glow"></div>
                        <div class="content position-relative z-1">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <h4 class="mb-1 fw-bold">${device.name}</h4>
                                    <span class="badge bg-darker border border-secondary text-secondary">${device.codename}</span>
                                </div>
                                ${statusHtml}
                            </div>
                            <p class="text-secondary small mb-4">Maintainer: ${device.maintainer}<br>Last Updated: ${device.lastUpdated}</p>
                            <a href="${device.downloadLink}" class="btn btn-outline-light w-100 rounded-pill">Download ROM</a>
                        </div>
                    </div>
                </div>`;
                deviceListContainer.insertAdjacentHTML('beforeend', cardHTML);
            });

            // Re-attach Mouse Glow to New Cards
            const newCards = document.querySelectorAll(".device-item .feature-card");
            attachMouseGlow(newCards);

            // Animate New Cards in with GSAP
            gsap.to(".device-item", {
                scrollTrigger: {
                    trigger: "#devices-section",
                    start: "top 85%",
                },
                opacity: 1,
                y: 0,
                stagger: 0.1,
                duration: 1,
                ease: "power3.out"
            });

            // Re-setup Search filter after rendering
            setupSearchFilter();
        })
        .catch(err => console.error("Could not load devices.json", err));
}

function setupSearchFilter() {
    if (!searchInput) return;
    const deviceItems = document.querySelectorAll(".device-item");

    searchInput.addEventListener("input", function () {
        const query = this.value.toLowerCase().trim();
        let visibleCount = 0;

        deviceItems.forEach(item => {
            const name = item.getAttribute("data-name");
            if (name.includes(query)) {
                item.style.display = "block";
                visibleCount++;
            } else {
                item.style.display = "none";
            }
        });

        if (visibleCount === 0) {
            noResults.classList.remove("d-none");
        } else {
            noResults.classList.add("d-none");
        }

        ScrollTrigger.refresh();
    });
}