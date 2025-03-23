document.addEventListener("DOMContentLoaded", function () {
  updateSummary();
  loadPatientDropdown();
});

function updateSummary() {
  let patients = JSON.parse(localStorage.getItem("patients")) || [];
  let monthFilter = document.getElementById("monthFilter").value;
  let dateFilter = document.getElementById("dateFilter").value;
  let recordsTable = document.getElementById("recordsTable");
  recordsTable.innerHTML = "";

  patients.forEach((patient, patientIndex) => {
    patient.visits.forEach((visit, visitIndex) => {
      let visitDate = new Date(visit.date);
      let visitMonth = visitDate.toISOString().slice(0, 7);

      if (
        (monthFilter && visitMonth !== monthFilter) ||
        (dateFilter && visit.date !== dateFilter)
      ) {
        return;
      }

      let row = `<tr>
                  <td contenteditable="true" onblur="editRecord(${patientIndex}, ${visitIndex}, 'date', this.textContent)">${visit.date}</td>
                  <td>${patient.name}</td>
                  <td contenteditable="true" onblur="editRecord(${patientIndex}, ${visitIndex}, 'problem', this.textContent)">${visit.problem}</td>
                  <td contenteditable="true" onblur="editRecord(${patientIndex}, ${visitIndex}, 'feesPaid', this.textContent)">${visit.feesPaid}</td>
                  <td><button onclick="deleteRecord(${patientIndex}, ${visitIndex})">Delete</button></td>
              </tr>`;
      recordsTable.innerHTML += row;
    });
  });
}

function editRecord(patientIndex, visitIndex, field, newValue) {
  let patients = JSON.parse(localStorage.getItem("patients")) || [];
  patients[patientIndex].visits[visitIndex][field] = newValue;
  localStorage.setItem("patients", JSON.stringify(patients));
  updateSummary();
  loadPatientDropdown();
}

function deleteRecord(patientIndex, visitIndex) {
  let patients = JSON.parse(localStorage.getItem("patients")) || [];
  patients[patientIndex].visits.splice(visitIndex, 1);

  if (patients[patientIndex].visits.length === 0) {
    patients.splice(patientIndex, 1);
  }

  localStorage.setItem("patients", JSON.stringify(patients));
  updateSummary();
  loadPatientDropdown();
}

function showPatientDropdown() {
  let dropdown = document.getElementById("patientDropdown");
  dropdown.style.display = "block";
}

function loadPatientDropdown() {
  let patients = JSON.parse(localStorage.getItem("patients")) || [];
  let dropdown = document.getElementById("patientDropdown");
  dropdown.innerHTML = "<option value=''>Select Patient</option>";

  patients.forEach((patient) => {
    let option = document.createElement("option");
    option.value = patient.name;
    option.textContent = patient.name;
    dropdown.appendChild(option);
  });
}

function showPatientDetails() {
  let selectedPatient = document.getElementById("patientDropdown").value;
  let patients = JSON.parse(localStorage.getItem("patients")) || [];
  let patientTable = document.getElementById("patientTable");
  let patientDetails = document.getElementById("patientDetails");
  patientDetails.innerHTML = "";

  let patient = patients.find((p) => p.name === selectedPatient);
  if (patient) {
    patient.visits.forEach((visit) => {
      let visitDate = new Date(visit.date);
      let visitMonth = visitDate.toISOString().slice(0, 7);
      let row = `<tr>
                  <td>${visit.date}</td>
                  <td>${visitMonth}</td>
                  <td>${visit.problem}</td>
                  <td>${visit.feesPaid}</td>
              </tr>`;
      patientDetails.innerHTML += row;
    });
    patientTable.style.display = "block";
  }
}
