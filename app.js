const API_URL = "http://localhost:3000/events";
const defaultImage = "pictures/download.jpg";

let allEvents = [];

function getImage(image) {
  if (!image) {
    return defaultImage;
  }

  if (image.startsWith("pictures/")) {
    return image;
  }

  return "pictures/" + image;
}

async function loadNavbar() {
  const response = await fetch("nav.html");
  const navbar = await response.text();
  document.getElementById("navbar").innerHTML = navbar;
}

async function getEvents() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Could not fetch events");
  }

  const events = await response.json();
  return events;
}

function showEvents(events) {
  const container = document.getElementById("events-container");
  container.innerHTML = "";

  events.forEach(function (event) {
    const card = document.createElement("div");

    card.className = "card";
    card.innerHTML = `
      <img src="${getImage(event.image)}" class="card-img" alt="${event.title}">
      <div class="card-body">
        <ul>
          <li class="card-title">${event.title}</li>
          <li class="card-date">${event.date}</li>
          <li class="venu">${event.location}</li>
          <li class="card-desc">${event.description}</li>
        </ul>
      </div>
    `;

    container.appendChild(card);
  });
}

async function loadEventsPage() {
  const container = document.getElementById("events-container");

  try {
    allEvents = await getEvents();
    showEvents(allEvents);
  } catch (error) {
    container.innerHTML = "<p>Could not load events. Check JSON Server.</p>";
  }
}

function setupFilter() {
  const filter = document.getElementById("categoryFilter");

  filter.addEventListener("change", function () {
    const selectedCategory = filter.value;

    if (selectedCategory === "") {
      showEvents(allEvents);
    } else {
      const filteredEvents = allEvents.filter(function (event) {
        return event.category === selectedCategory;
      });

      showEvents(filteredEvents);
    }
  });
}

function showFeaturedEvents(events) {
  const container = document.getElementById("featured-events-container");
  container.innerHTML = "";

  const firstThreeEvents = events.slice(0, 3);

  firstThreeEvents.forEach(function (event) {
    const card = document.createElement("article");

    card.className = "featured-event-card";
    card.innerHTML = `
      <img src="${getImage(event.image)}" class="featured-event-img" alt="${event.title}">
      <div class="featured-event-body">
        <h2>${event.title}</h2>
        <p class="featured-event-date">${event.date}</p>
        <p class="featured-event-location">${event.location}</p>
        <p class="featured-event-desc">${event.description}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

async function loadHomePage() {
  const container = document.getElementById("featured-events-container");

  try {
    const events = await getEvents();
    showFeaturedEvents(events);
  } catch (error) {
    container.innerHTML = "<p>Could not load featured events. Check JSON Server.</p>";
  }
}

loadNavbar();

if (document.getElementById("events-container")) {
  loadEventsPage();
  setupFilter();
}

if (document.getElementById("featured-events-container")) {
  loadHomePage();
}


