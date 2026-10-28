const form = document.querySelector("#registration-form");
const message = document.querySelector("#form-message");

const fields = {
  fullName: document.querySelector("#full-name"),
  email: document.querySelector("#email"),
  college: document.querySelector("#college"),
  year: document.querySelector("#year"),
  consent: document.querySelector("#consent")
};

const errors = {
  fullName: document.querySelector("#name-error"),
  email: document.querySelector("#email-error"),
  college: document.querySelector("#college-error"),
  year: document.querySelector("#year-error"),
  session: document.querySelector("#session-error"),
  consent: document.querySelector("#consent-error")
};

function setError(key, text, field) {
  errors[key].textContent = text;
  if (field) {
    if (text) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
  }
}

function validateForm() {
  let valid = true;
  const name = fields.fullName.value.trim();
  const email = fields.email.value.trim();
  const college = fields.college.value.trim();
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const selectedSession = form.querySelector('input[name="session"]:checked');

  const checks = [
    ["fullName", name.length >= 2 ? "" : "Enter your full name (at least 2 characters).", fields.fullName],
    ["email", emailLooksValid ? "" : "Enter a valid email address.", fields.email],
    ["college", college ? "" : "Enter your college or institution.", fields.college],
    ["year", fields.year.value ? "" : "Select your study year.", fields.year],
    ["session", selectedSession ? "" : "Choose one session.", null],
    ["consent", fields.consent.checked ? "" : "Please confirm the statement above.", null]
  ];

  for (const [key, error, field] of checks) {
    setError(key, error, field);
    if (error) valid = false;
  }
  return valid;
}

function showMessage(type, title, detail) {
  message.className = `form-message ${type}`;
  message.innerHTML = "";
  const heading = document.createElement("h3");
  heading.textContent = title;
  const paragraph = document.createElement("p");
  paragraph.textContent = detail;
  message.append(heading, paragraph);
  message.hidden = false;
  message.focus();
}

form.addEventListener("input", (event) => {
  const idToKey = {
    "full-name": "fullName",
    email: "email",
    college: "college",
    year: "year"
  };
  const key = idToKey[event.target.id];
  if (key && errors[key].textContent) validateForm();
  if (message.classList.contains("error")) message.hidden = true;
});

form.addEventListener("change", (event) => {
  if (event.target.name === "session" && errors.session.textContent) {
    setError("session", form.querySelector('input[name="session"]:checked') ? "" : "Choose one session.");
  }
  if (event.target.id === "consent" && errors.consent.textContent) {
    setError("consent", fields.consent.checked ? "" : "Please confirm the statement above.");
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  message.hidden = true;

  if (!validateForm()) {
    const firstInvalid = form.querySelector('[aria-invalid="true"]') ||
      form.querySelector('input[name="session"]');
    firstInvalid?.focus();
    showMessage("error", "Check the highlighted fields", "Please correct the errors above before completing the demo registration.");
    return;
  }

  const data = {
    name: fields.fullName.value.trim(),
    email: fields.email.value.trim(),
    college: fields.college.value.trim(),
    year: fields.year.options[fields.year.selectedIndex].text,
    session: form.querySelector('input[name="session"]:checked').value,
    registeredAt: new Date().toISOString()
  };

  // Demo-only behavior: keep the latest successful submission in this browser.
  // This does not send personal data to a server.
  try {
    localStorage.setItem("technova-demo-registration", JSON.stringify(data));
  } catch {
    // The form can still demonstrate validation if browser storage is disabled.
  }

  showMessage(
    "success",
    `You're registered, ${data.name.split(/\s+/)[0]}!`,
    `Your demo selection is ${data.session}. No information was sent to a server. This is a front-end demonstration, not a real event booking.`
  );
});

for (const field of Object.values(fields)) {
  if (field && field.matches("input, select")) {
    field.addEventListener("blur", () => {
      if (field.value || field.checked) validateForm();
    });
  }
}
