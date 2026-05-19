let tableData = [];

Papa.parse("/assets/spells.csv", {
    download: true,
    header: false,
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

            if (i == 0){
                const terms = filter.split(",").map(t => t.trim()).filter(Boolean);

                const elementMatch = terms.some(term =>
                    cellText.includes(term)
                );

                if (!elementMatch) {
                    match = false;
                    break;
                }

            }

            else if (i === 2) {
                if (!compareNumber(cellText, filter)){
                    match = false;
                    break;
                }
            }

            else if (i === 7) {
                const terms = filter.split(",").map(t => t.trim()).filter(Boolean);

                const requirementMatch = terms.every(term =>
                    cellText.includes(term)
                );

                if (!requirementMatch) {
                    match = false;
                    break;
                }

            }
            
            else {
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
    .normalize("NFD")                
    .replace(/[\u0300-\u036f]/g, "");
}

function compareNumber(cellValue, filterValue) {
    const num = parseFloat(cellValue);

    if (isNaN(num)) return false;

    filterValue = filterValue.trim();

    if (filterValue.startsWith(">=")) {
        return num >= parseFloat(filterValue.slice(2));
    }
    if (filterValue.startsWith("<=")) {
        return num <= parseFloat(filterValue.slice(2));
    }
    if (filterValue.startsWith(">")) {
        return num > parseFloat(filterValue.slice(1));
    }
    if (filterValue.startsWith("<")) {
        return num < parseFloat(filterValue.slice(1));
    }
    if (filterValue.startsWith("=")) {
        return num === parseFloat(filterValue.slice(1));
    }

    return num === parseFloat(filterValue);
}