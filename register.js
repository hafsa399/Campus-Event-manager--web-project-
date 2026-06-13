
// fee update
function updateFee() {
  const eventDropdown = document.getElementById("event");
  const feeInput = document.getElementById("eventFee");

  const fee = {
    tech: "500 PKR",
    cultural: "300 PKR",
    sports: "350 PKR",
    AnnualDinner: "2000 PKR",
  };

  const selectedEvent = eventDropdown.value;
  feeInput.value = fee[selectedEvent] || "";
}

const form = document.getElementById("reg-form");
const fullNameInput = document.getElementById("fullName");
const eventSelect = document.getElementById("event");
const rollNOInput = document.getElementById("rollNo");
const emailInput = document.getElementById("email");
const formMessage = document.getElementById("form-message");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  formMessage.textContent = "";

  if (!validateForm()) {
    return;
  }

  const registration = {
    rollNo: rollNOInput.value.trim(),
    fullName: fullNameInput.value.trim(),
    event: eventSelect.value,
    email: emailInput.value.trim(),
  };

  try {
    const response = await fetch("http://localhost:3000/registrations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registration),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    formMessage.textContent = "Registration successful!";
    formMessage.style.color = "green";
    form.reset();
  } catch (error) {
    formMessage.textContent = "Could not save registration. Make sure JSON Server is running.";
    formMessage.style.color = "red";
  }
});

function validateForm() {
  let isValid = true;

  clearError(rollNOInput, "err-rollNo");
  clearError(fullNameInput, "err-fullName");
  clearError(emailInput, "err-email");
  clearError(eventSelect, "err-event");

  if (!rollNOInput.value.trim()) {
    showError(rollNOInput, "err-rollNo", "Roll number is required.");
    isValid = false;
  }

  if (!fullNameInput.value.trim()) {
    showError(fullNameInput, "err-fullName", "Full name is required.");
    isValid = false;
  }

  const emailValue = emailInput.value.trim();
  if (!emailValue) {
    showError(emailInput, "err-email", "Email address is required.");
    isValid = false;
  }

  if (!eventSelect.value) {
    showError(eventSelect, "err-event", "Please choose an event.");
    isValid = false;
  }

  return isValid;
}
// for error handling 
function showError(inputE1, errorId, message){
  inputE1.classList.add("input-error");
  const span = document.getElementById(errorId);
  span.textContent = message;
  span.classList.add("visible");

}

function clearError(inputE1, errorId){
  inputE1.classList.remove("input-error");
  const span = document.getElementById(errorId);
  span.textContent = "";
  span.classList.remove("visible");

}