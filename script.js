const apiUrl = "https://sms-backend-production-8759.up.railway.app/students";

// Get all students and render table
function getAllStudents() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            renderStudents(data);
        });
}


// Add student
document.getElementById("addStudentForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const marks = document.getElementById("marks").value;

    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, marks })
    })
    .then(() => {
        document.getElementById("addStudentForm").reset();
        getAllStudents();
    });
});

// Delete student
function deleteStudent(rollNo) {
    fetch(`${apiUrl}/${rollNo}`, { method: "DELETE" })
        .then(() => getAllStudents());
}

// Edit student (basic prompt)
function editStudent(rollNo) {
    const name = prompt("Enter new name:");
    const marks = prompt("Enter new marks:");
    fetch(`${apiUrl}/${rollNo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, marks })
    })
    .then(() => getAllStudents());
}

// Search by Roll No (binary search endpoint)
function searchByRollNo() {
    const rollNo = document.getElementById("rollSearchInput").value;
    if (!rollNo) return alert("Enter a roll number");

    fetch(`${apiUrl}/search/roll/${rollNo}`)
        .then(res => {
            if (!res.ok) throw new Error("Student not found");
            return res.json();
        })
        .then(student => renderStudents([student]))
        .catch(err => alert(err.message));
}

// Sort by Name (merge sort endpoint)
function sortByName() {
    fetch(`${apiUrl}/sorted/name`)
        .then(res => res.json())
        .then(data => renderStudents(data));
}

// Sort by Marks (merge sort endpoint)
function sortByMarks() {
    fetch(`${apiUrl}/sorted/marks`)
        .then(res => res.json())
        .then(data => renderStudents(data));
}

// Helper function to render table (reuse for search & sort)
function renderStudents(data) {
    const table = document.getElementById("studentsTable");
    table.innerHTML = "";
    data.forEach(student => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.rollNo}</td>
            <td>${student.name}</td>
            <td>${student.marks}</td>
            <td class="actions">
                <button onclick="editStudent(${student.rollNo})">Edit</button>
                <button onclick="deleteStudent(${student.rollNo})">Delete</button>
            </td>
        `;
        table.appendChild(row);
    });
}


// Initial load
getAllStudents();
