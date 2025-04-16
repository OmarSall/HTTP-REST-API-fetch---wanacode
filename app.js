const API_URL = "http://localhost:3000";

Promise.all([
    fetch(`${API_URL}/users`).then(response => response.json()),
    fetch(`${API_URL}/companies`).then(response => response.json())
])
.then(([users, companies]) => {
    // Group users by companyId
    const companyMap = {};

    users.forEach(user => {
        const companyUri = user.uris.company;
        const companyId = companyUri.split("/").pop();

        if (!companyMap[companyId]) {
            companyMap[companyId] = [];
        }
        companyMap[companyId].push(user);
    });

    // Add user count to companies
    companies.forEach(company => {
        const companyId = company.uri.toString().split("/").pop();
        company.userCount = companyMap[companyId]?.length || 0;
    });

    // sort companies by user count
    companies.sort((companyA, companyB) => companyA.userCount - companyB.userCount);

    renderCompanyTable(companies, companyMap);
})
.catch(error => {
    console.error("Error loading data:", error);
});

function renderCompanyTable(companies, companyMap) {
    const container = document.getElementById("company-table-container");
    const table = document.createElement("table");
    table.className = "table table-bordered table-striped";

    const tableHeader = document.createElement("thead");
    tableHeader.innerHTML = `
        <tr>
          <th>Company Name</th>
          <th>Number of users</th>
          <th>Actions</th>
        </tr>
    `;
    table.appendChild(tableHeader);

    const tableBody = document.createElement("tbody");

    companies.forEach(company => {
        const tableRow = document.createElement("tr");
        const companyId = company.uri.toString().split("/").pop();
        tableRow.innerHTML = `
        <td>${company.name || "Unknown"}</td>
        <td>${company.userCount}</td>
        <td>
        <button class="btn btn-primary btn-sm" data-company="${companyId}">Show Users</button>
        </td>
        `;
        tableBody.appendChild(tableRow);

        // Hidden row for users
        const usersRow = document.createElement("tr");
        usersRow.classList.add("d-none");
        usersRow.id = `users-row-${companyId}`;
        const usersCell = document.createElement("td");
        usersCell.colSpan = 3;
        usersCell.innerHTML = createUserList(companyMap[companyId] || []);
        usersRow.appendChild(usersCell);
        tableBody.append(usersRow);
    });

    table.appendChild(tableBody);
    container.appendChild(table);

    // click events for button
    container.querySelectorAll("button[data-company]").forEach(button => {
        button.addEventListener("click", () => {
            const companyId = button.getAttribute("data-company");
            const userRow = document.getElementById(`users-row-${companyId}`);
            userRow.classList.toggle("d-none");
        });
    });
}

function createUserList(users) {
    if (users.length === 0) {
        return "<p>No users found.</p>"
    }
    return `
            <ul class="list-group">
                ${users.map(user => `<li class="list-group-item">${user.name} - ${user.email}</li>`).join("")}
            </ul>
            `;
}