let map;
let markers = [];

// מידע על חופים בעולם לפי אזורים
const worldBeaches = {
  europe: [
    { name: "🇬🇷 סנטוריני, יוון", lat: 36.3932, lng: 25.4615 },
    { name: "🇪🇸 איביזה, ספרד", lat: 38.9067, lng: 1.4206 },
    { name: "🇮🇹 אמלפי, איטליה", lat: 40.6344, lng: 14.6026 },
  ],
  asia: [
    { name: "🇹🇭 פוקט, תאילנד", lat: 7.8804, lng: 98.3923 },
    { name: "🇲🇻 מלדיביים", lat: 3.2028, lng: 73.2207 },
    { name: "🇵🇭 בורקאי, פיליפינים", lat: 11.9674, lng: 121.9247 },
  ],
  americas: [
    { name: "🇧🇷 קופקבנה, ברזיל", lat: -22.9714, lng: -43.1823 },
    { name: "🇺🇸 וויקיקי, הוואי", lat: 21.2793, lng: -157.8292 },
    { name: "🇲🇽 קנקון, מקסיקו", lat: 21.1619, lng: -86.8515 },
  ],
  oceania: [
    { name: "🇦🇺 בונדי ביץ', אוסטרליה", lat: -33.8915, lng: 151.2767 },
    { name: "🇳🇿 מאונט מאונגנוי, ניו זילנד", lat: -37.6333, lng: 176.1833 },
    { name: "🇫🇯 נאדי, פי'י", lat: -17.7765, lng: 177.4356 },
  ],
};

// פונקציית resize מתוקנת
function resizeMap() {
  if (map) {
    requestAnimationFrame(() => {
      map.invalidateSize();
    });
  }
}

function initMap() {
  const mapElement = document.getElementById("worldMap");
  if (!mapElement) {
    console.error("Map element not found");
    return;
  }

  try {
    // הגדרת גובה המפה לפני אתחול
    const containerWidth = mapElement.offsetWidth;
    const mapHeight = (containerWidth * 9) / 16; // שמירה על יחס 16:9
    mapElement.style.height = `${mapHeight}px`;

    requestAnimationFrame(() => {
      map = L.map("worldMap", {
        center: [31.7683, 35.2137],
        zoom: 8,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: true,
        scrollWheelZoom: true,
        // הגדרות נוספות למניעת layout shifts
        fadeAnimation: false,
        markerZoomAnimation: false,
        transform3DLimit: 100,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      initMapListeners();
      resizeMap();
    });
  } catch (error) {
    console.error("Error initializing map:", error);
  }
}

// פונקציה נפרדת לאתחול המאזינים
function initMapListeners() {
  document.querySelectorAll(".view-on-map").forEach((button) => {
    button.addEventListener("click", () => {
      const lat = parseFloat(button.dataset.lat);
      const lng = parseFloat(button.dataset.lng);
      showLocationOnMap(lat, lng);
    });
  });
}

// Lazy load map functionality
function lazyLoadMap() {
  if ("IntersectionObserver" in window) {
    const mapObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          initMap();
          mapObserver.unobserve(entry.target);
        }
      });
    });

    const mapElement = document.getElementById("worldMap");
    if (mapElement) {
      mapObserver.observe(mapElement);
    }
  } else {
    // Fallback for older browsers
    setTimeout(initMap, 1000);
  }
}

// Initialize only necessary features on load
document.addEventListener("DOMContentLoaded", () => {
  // Load map only when needed
  lazyLoadMap();

  // Use passive event listeners
  window.addEventListener("scroll", () => {}, { passive: true });

  // Throttle resize events
  let resizeTimeout;
  window.addEventListener(
    "resize",
    () => {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(() => {
          resizeMap();
          resizeTimeout = null;
        }, 100);
      }
    },
    { passive: true }
  );
});

function showLocationOnMap(lat, lng) {
  // ניקוי סמנים קיימים
  markers.forEach((marker) => map.removeLayer(marker));
  markers = [];

  // הוספת סמן חדש
  const marker = L.marker([lat, lng]).addTo(map);
  markers.push(marker);

  // יצירת חלון קופץ
  const popupContent = `
        <div class="beach-info" dir="rtl">
            <h5>מידע על החוף</h5>
            <p>טמפרטורה ממוצעת: ${Math.round(20 + Math.random() * 10)}°C</p>
            <p>עונה מומלצת: ${getRecommendedSeason(lat)}</p>
            <button onclick="getBeachDetails(${lat}, ${lng})" class="btn btn-sm btn-info">
                פרטים נוספים
            </button>
        </div>
    `;

  marker.bindPopup(popupContent).openPopup();
  map.setView([lat, lng], 12);
}

function getBeachDetails(lat, lng) {
  // שימוש בשירות Nominatim של OpenStreetMap
  fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=he`
  )
    .then((response) => response.json())
    .then((data) => {
      showBeachDetailsModal(data);
    })
    .catch((error) => console.error("Error fetching beach details:", error));
}

function showBeachDetailsModal(place) {
  const modalHtml = `
        <div class="modal fade" id="beachDetailsModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${place.display_name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>כתובת: ${place.display_name}</p>
                        <p>סוג: ${place.type || "חוף"}</p>
                        <p>מדינה: ${place.address.country || ""}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);
  const modal = new bootstrap.Modal(
    document.getElementById("beachDetailsModal")
  );
  modal.show();

  document
    .getElementById("beachDetailsModal")
    .addEventListener("hidden.bs.modal", function () {
      this.remove();
    });
}

function updateBeachList(region) {
  const beachList = document.getElementById("beachList");
  if (!region) {
    beachList.innerHTML = "";
    return;
  }

  const beaches = worldBeaches[region];
  beachList.innerHTML = beaches
    .map(
      (beach) => `
        <div class="destination">
            <span>${beach.name}</span>
            <button class="btn btn-sm btn-info view-on-map" 
                    data-lat="${beach.lat}" 
                    data-lng="${beach.lng}">
                הצג במפה
            </button>
        </div>
    `
    )
    .join("");

  // הוספת מאזיני לחיצה לכפתורים החדשים
  beachList.querySelectorAll(".view-on-map").forEach((button) => {
    button.addEventListener("click", () => {
      const lat = parseFloat(button.dataset.lat);
      const lng = parseFloat(button.dataset.lng);
      showLocationOnMap(lat, lng);
    });
  });
}

function getRecommendedSeason(lat) {
  // המרת קו רוחב למספר חיובי לחישוב פשוט יותר
  const absLat = Math.abs(lat);

  // חישוב העונה המומלצת לפי קו הרוחב
  if (absLat < 23.5) {
    // אזור טרופי
    return "כל השנה";
  } else if (absLat < 45) {
    // אזור סובטרופי
    return lat >= 0 ? "אביב-קיץ" : "סתיו-חורף";
  } else {
    // אזור ממוזג
    return lat >= 0 ? "קיץ" : "חורף";
  }
}

// הוספת טיפול ב-resize למניעת layout shifts
window.addEventListener(
  "resize",
  () => {
    const mapElement = document.getElementById("worldMap");
    if (mapElement && map) {
      const containerWidth = mapElement.offsetWidth;
      const mapHeight = (containerWidth * 9) / 16;
      mapElement.style.height = `${mapHeight}px`;
      map.invalidateSize();
    }
  },
  { passive: true }
);
