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
        nav.classList.add('nav-scrolled');
        nav.style.padding = "10px 0";
    } else {
        nav.classList.remove('nav-scrolled');
        nav.style.padding = "20px 0";
    }
});

// Dynamic Device Loading & Filtering
const deviceListContainer = document.getElementById("deviceList");
const searchInput = document.getElementById("deviceSearch");
const noResults = document.getElementById("noResults");

if (deviceListContainer) {
    fetch('https://raw.githubusercontent.com/legtemp/ota/refs/heads/main/devices.json')
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
                                    <h4 class="mb-1 theme-text">${device.name}</h4>
                                    <span class="badge bg-darker border border-secondary theme-text">${device.codename}</span>
                                </div>
                                ${statusHtml}
                            </div>
                            <p class="text-secondary small mb-4">Maintainer: ${device.maintainer}<br>Last Updated: ${device.lastUpdated}</p>
                            <button onclick="openDownloadModal('${device.name}', '${device.codename}', '${device.downloadLink}')" class="btn btn-outline-light w-100 rounded-pill">Get Builds</button>
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

// Download Modal Logic
function openDownloadModal(name, codename, link) {
    const modalDeviceName = document.getElementById('modalDeviceName');
    const btnGapps = document.getElementById('btnGapps');
    const btnVanilla = document.getElementById('btnVanilla');
    const btnChangelogGapps = document.getElementById('btnChangelogGapps');
    const btnChangelogVanilla = document.getElementById('btnChangelogVanilla');

    if (modalDeviceName && btnGapps) {
        modalDeviceName.textContent = codename.toUpperCase();

        btnGapps.href = link + "?build=gapps";
        btnVanilla.href = link + "?build=vanilla";

        btnChangelogGapps.onclick = () => loadChangelog(name, codename, 'gapps');
        btnChangelogVanilla.onclick = () => loadChangelog(name, codename, 'vanilla');

        const downloadModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('downloadModal'));
        downloadModal.show();
    }
}

function loadChangelog(name, codename, type) {
    const changelogDeviceName = document.getElementById('changelogDeviceName');
    const changelogContent = document.getElementById('changelogContent');
    const changelogLoading = document.getElementById('changelogLoading');

    changelogDeviceName.textContent = `${codename.toUpperCase()} (${type.toUpperCase()})`;
    changelogContent.classList.add('d-none');
    changelogLoading.classList.remove('d-none');

    // Fetch changelog text
    const fetchUrl = `https://raw.githubusercontent.com/legtemp/ota/refs/heads/main/changelogs/changelog_${codename}-${type}.txt`;

    fetch(fetchUrl)
        .then(response => {
            if (!response.ok) throw new Error('Not found');
            return response.text();
        })
        .then(text => {
            changelogContent.textContent = text;
            changelogLoading.classList.add('d-none');
            changelogContent.classList.remove('d-none');
        })
        .catch(err => {
            changelogContent.textContent = `Error: Changelog file for ${codename} (${type}) could not be found.\n\nPlease ensure 'changelog_${codename}-${type}.txt' is available in the root directory.`;
            changelogLoading.classList.add('d-none');
            changelogContent.classList.remove('d-none');
        });
}

// 5. Center Focus Gallery Effect (Simpler, cleaner)
const screenshots = document.querySelectorAll('.marquee-content img');

if (screenshots.length > 0) {
    // Scroll to the middle of the gallery on page load
    window.addEventListener('load', () => {
        const marqueeContainer = document.querySelector('.marquee-content');
        if (marqueeContainer && screenshots.length > 2) {
            const middleIndex = Math.floor(screenshots.length / 2);
            // Instantly snap to the middle screenshot on load
            screenshots[middleIndex].scrollIntoView({ inline: 'center' });
        }
    });

    const updateGalleryFocus = () => {
        const centerX = window.innerWidth / 2;

        screenshots.forEach(img => {
            const rect = img.getBoundingClientRect();

            // Optimization: skip if completely off-screen
            if (rect.right < 0 || rect.left > window.innerWidth) {
                img.style.transform = `scale(0.85)`;
                img.style.opacity = "0.4";
                return;
            }

            const imgCenterX = rect.left + rect.width / 2;
            const distance = Math.abs(centerX - imgCenterX);

            // Controls how wide the 'focus' area is before falling off completely
            const maxDistance = window.innerWidth / 1.5;

            // Calculate scale: 1.1 at center, 0.85 at edges
            let scale = 1.1 - (distance / maxDistance) * 0.25;
            scale = Math.max(0.85, Math.min(1.1, scale));

            // Calculate opacity: 1 at center, 0.4 at edges
            let opacity = 1 - (distance / maxDistance) * 0.6;
            opacity = Math.max(0.4, Math.min(1, opacity));

            // Calculate blur: 0px at center, 8px at edges
            let blur = (distance / maxDistance) * 8;
            blur = Math.max(0, Math.min(8, blur));

            // Apply transform dynamically without triggering transition stutters
            img.style.transform = `scale(${scale})`;
            img.style.opacity = opacity;
            img.style.filter = `blur(${blur}px)`;
        });

        requestAnimationFrame(updateGalleryFocus);
    };

    // Add click to focus functionality
    screenshots.forEach(img => {
        // Set cursor to pointer so users know it's clickable
        img.style.cursor = "pointer";
        img.addEventListener('click', () => {
            img.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });
    });

    // Start animation loop
    updateGalleryFocus();
}
