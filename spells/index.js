let tableData = [];

Papa.parse("/assets/spells.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
        buildTable(results.data);
    }
});

function buildTable(data) {
    let tbody = document.querySelector("#table tbody");

    tbody.innerHTML = "";

    for (let i = 1; i < data.length; i++) {
        let row = "<tr>";

        Object.values(data[i]).forEach(col => {
            row += `<td>${col}</td>`;
        });

        row += "</tr>";
        tbody.innerHTML += row;
    }
}

function filterTable() {
    const filterIds = [
    "Elements", "Name", "Degree", "Cost",
    "Duration", "Time", "Range", "Requirements"
    ];

    const filters = filterIds.map(id =>
        normalize(document.getElementById(id).value)
    );

    const rows = document.querySelectorAll("#table tbody tr");

    rows.forEach(row => {
        const cols = row.querySelectorAll("td");

        let match = true;
        for (let i = 0; i < filters.length; i++) {
            const cellText = normalize(cols[i].textContent);
            const filter = filters[i];

            if (!filter) continue;

            if (i === 7) {
                const terms = filter.split(",").map(t => t.trim()).filter(Boolean);

                const requirementMatch = terms.every(term =>
                    cellText.includes(term)
                );

                if (!requirementMatch) {
                    match = false;
                    break;
                }

            } else {
                if (!cellText.includes(filter)) {
                    match = false;
                    break;
                }
            }
        }

        row.style.display = match ? "" : "none";
  });
}

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")                // split letters and accents
    .replace(/[\u0300-\u036f]/g, ""); // remove accents
}