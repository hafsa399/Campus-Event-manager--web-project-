const EVENTS_API = "http://localhost:3000/events";
const REGISTRATIONS_API = "http://localhost:3000/registrations";

const eventForm = document.getElementById("eventForm");
const eventIdInput = document.getElementById("eventId");
const titleInput = document.getElementById("title");
const dateInput = document.getElementById("date");
const locationInput = document.getElementById("location");
const categoryInput = document.getElementById("category");
const imageInput = document.getElementById("image");
const descriptionInput = document.getElementById("description");
const eventMessage = document.getElementById("eventMessage");
const saveEventBtn = document.getElementById("saveEventBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

let eventsList = [];
let registrationsList = [];

async function loadNavbar() {
  const response = await fetch("nav.html");
  const data = await response.text();
  document.getElementById("navbar").innerHTML = data;
}

async function getEvents() {
  const response = await fetch(EVENTS_API);

  if (!response.ok) {
    throw new Error("Failed to load events");
  }

  eventsList = await response.json();
  showEvents();
  showStats();
}

async function getRegistrations() {
  const response = await fetch(REGISTRATIONS_API);

  if (!response.ok) {
    throw new Error("Failed to load registrations");
  }

  registrationsList = await response.json();
  showRegistrations();
  showStats();
}

function showStats() {
  document.getElementById("totalEvents").textContent = eventsList.length;
  document.getElementById("totalRegistrations").textContent = registrationsList.length;

  const techEvents = eventsList.filter(function (event) {
    return event.category === "tech";
  });

  document.getElementById("techEvents").textContent = techEvents.length;
}

function showEvents() {
  const tableBody = document.querySelector("#eventsTable tbody");
  tableBody.innerHTML = "";

  eventsList.forEach(function (event) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${event.title || ""}</td>
      <td>${event.date || ""}</td>
      <td>${event.category || ""}</td>
      <td>${event.location || ""}</td>
      <td>
        <button type="button" class="edit-event-btn" data-id="${event.id}">Edit</button>
        <button type="button" class="delete-btn delete-event-btn" data-id="${event.id}">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

function showRegistrations() {
  const tableBody = document.querySelector("#registrationsTable tbody");
  tableBody.innerHTML = "";

  registrationsList.forEach(function (reg) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${reg.rollNo || ""}</td>
      <td>${reg.fullName || ""}</td>
      <td>${reg.event || ""}</td>
      <td>${reg.email || ""}</td>
      <td>
        <button type="button" class="delete-btn delete-registration-btn" data-id="${reg.id}">
          Delete
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

function getFormData() {
  return {
    title: titleInput.value.trim(),
    date: dateInput.value,
    location: locationInput.value.trim(),
    category: categoryInput.value,
    image: imageInput.value.trim(),
    description: descriptionInput.value.trim(),
  };
}

function validateEvent(event) {
  if (!event.title || !event.date || !event.location || !event.category || !event.description) {
    eventMessage.textContent = "Please fill title, date, location, category, and description.";
    eventMessage.style.color = "red";
    return false;
  }

  return true;
}

function resetForm() {
  eventForm.reset();
  eventIdInput.value = "";
  saveEventBtn.textContent = "Add Event";
  eventMessage.textContent = "";
}

async function saveEvent(event) {
  const editingId = eventIdInput.value;
  const method = editingId ? "PATCH" : "POST";
  const url = editingId ? `${EVENTS_API}/${editingId}` : EVENTS_API;

  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    throw new Error("Could not save event");
  }
}

eventForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const event = getFormData();

  if (!validateEvent(event)) {
    return;
  }

  try {
    await saveEvent(event);
    eventMessage.textContent = eventIdInput.value ? "Event updated successfully." : "Event added successfully.";
    eventMessage.style.color = "green";
    resetForm();
    getEvents();
  } catch (error) {
    eventMessage.textContent = "Could not save event. Check JSON Server.";
    eventMessage.style.color = "red";
  }
});

function startEditEvent(id) {
  const event = eventsList.find(function (item) {
    return String(item.id) === String(id);
  });

  if (!event) {
    return;
  }

  eventIdInput.value = event.id;
  titleInput.value = event.title || "";
  dateInput.value = event.date || "";
  locationInput.value = event.location || "";
  categoryInput.value = event.category || "";
  imageInput.value = event.image || "";
  descriptionInput.value = event.description || "";
  saveEventBtn.textContent = "Update Event";
  eventMessage.textContent = "Editing selected event.";
  eventMessage.style.color = "rgb(237, 225, 254)";
}

async function deleteEvent(id) {
  const confirmDelete = confirm("Are you sure you want to delete this event?");

  if (!confirmDelete) {
    return;
  }

  const response = await fetch(`${EVENTS_API}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Could not delete event");
  }

  getEvents();
}

async function deleteRegistration(id) {
  const confirmDelete = confirm("Are you sure you want to delete this registration?");

  if (!confirmDelete) {
    return;
  }

  const response = await fetch(`${REGISTRATIONS_API}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Could not delete registration");
  }

  getRegistrations();
}

document.addEventListener("click", async function (event) {
  try {
    if (event.target.matches(".edit-event-btn")) {
      startEditEvent(event.target.dataset.id);
    }

    if (event.target.matches(".delete-event-btn")) {
      await deleteEvent(event.target.dataset.id);
    }

    if (event.target.matches(".delete-registration-btn")) {
      await deleteRegistration(event.target.dataset.id);
    }
  } catch (error) {
    eventMessage.textContent = "Action failed. Check JSON Server.";
    eventMessage.style.color = "red";
  }
});

cancelEditBtn.addEventListener("click", resetForm);

loadNavbar();
getEvents();
getRegistrations();
