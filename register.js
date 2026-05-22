 
 
 fetch("nav.html")
        .then((response) => response.text())
        .then((data) => {
          document.getElementById("navbar").innerHTML = data;
        });

        // fee update
        function updateFee() {
         const eventDropdown=document.getElementById("event");  
        const feeInput=document.getElementById("eventFee");
  // defining fee for each event
  const fee={
    tech:"500 PKR",
    cultural:"300 PKR",
    sports:"350 PKR",
    AnnualDinner:"2000 PKR"
  };
// for select
  const selectedEvent=eventDropdown.value;

// for update
feeInput.value=fee[selectedEvent] || "";
        }
        const form=document.getElementById("reg-form");
        const fullNameInput=document.getElementById("fullName");
        const eventSelect=document.getElementById("event");
        const rollNOInput=document.getElementById("rollNo");
        const emailInput=document.getElementById("email");

        form.addEventListener("submit",function (e){
          e.preventDefault();
          if (!validateForm()) {
            return;
          }
         const Registration ={
          rollNo:rollNOInput.value.trim(),
          fullName:fullNameInput.value.trim(),
          event:eventSelect.value,
          email:emailInput.value.trim()
         };
         // now save in local storage
         const savedRegistrations=JSON.parse(localStorage.getItem("registrations")) || [];
         const Registrations=Array.isArray(savedRegistrations) ? savedRegistrations : [savedRegistrations];
         Registrations.push(Registration);
         localStorage.setItem("registrations",JSON.stringify(Registrations));
         alert("Registration successful!");
         form.reset();
                 });

        function validateForm(){
          let isValid=true;
          // remove old error msg before checking, prevent duplication or outdated errors
          clearError(rollNOInput, "err-rollNo");
          clearError(fullNameInput, "err-fullName");
          clearError(emailInput, "err-email");
          clearError(eventSelect, "err-event");

          if (!rollNOInput.value.trim()){
            showError(rollNOInput, "err-rollNo", "Roll number is required.");
            isValid=false;
          }

          if (!fullNameInput.value.trim()){
            showError(fullNameInput, "err-fullName", "Full name is required.");
            isValid=false;
          }

          const emailValue=emailInput.value.trim();
          if (!emailValue){
            showError(emailInput, "err-email", "Email address is required.");
            isValid=false;
          }

          if (!eventSelect.value){
            showError(eventSelect, "err-event", "Please choose an event.");
            isValid=false;
          }

          return isValid;
        }

   
function showError(input, errorId, message) {
  input.style.border = "2px solid red"; // highlight field
  document.getElementById(errorId).innerText = message; // show error text
}

function clearError(input, errorId) {
  input.style.border = ""; // remove red border
  document.getElementById(errorId).innerText = ""; // clear error text
}

        