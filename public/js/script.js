// Dummy data for demo
const companies = [
    { name: "Google", role: "Software Engineer", email: "hr@google.com", match: "92%" },
    { name: "Microsoft", role: "Frontend Developer", email: "careers@microsoft.com", match: "88%" },
    { name: "Amazon", role: "Backend Developer", email: "jobs@amazon.com", match: "85%" }
]

// Load table on dashboard
if (document.getElementById("companyTable")) {
    loadCompanies()
}

function loadCompanies() {
    const table = document.getElementById("companyTable")
    table.innerHTML = ""
    companies.forEach(company => {
        table.innerHTML += `
            <tr>
                <td>${company.name}</td>
                <td>${company.role}</td>
                <td>${company.email}</td>
                <td><span class="badge bg-success">${company.match}</span></td>
            </tr>
        `
    })
}

// Search filter
function filterCompanies() {
    const search = document.getElementById("searchInput").value.toLowerCase()
    const rows = document.querySelectorAll("#companyTable tr")

    rows.forEach(row => {
        const text = row.innerText.toLowerCase()
        row.style.display = text.includes(search) ? "" : "none"
    })
}



// Trigger file upload
function triggerUpload() {
    document.getElementById("resumeUpload").click();
}

// Dummy Login
function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (email && password) {
        localStorage.setItem("user", email);
        window.location.href = "dashboard.html";
    } else {
        alert("Please enter credentials");
    }
}

// Dummy Register
function register() {
    alert("Registration Successful! Please Login.");
    window.location.href = "login.html";
}
