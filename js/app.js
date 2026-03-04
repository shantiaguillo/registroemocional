document.addEventListener("DOMContentLoaded", () => {

const form = document.getElementById("inventoryForm");
const table = document.getElementById("inventoryTable");
const submitBtn = document.getElementById("submitBtn");
const editIndexInput = document.getElementById("editIndex");
const downloadBtn = document.getElementById("downloadBtn");
const darkToggle = document.getElementById("darkToggle");

loadData();
loadDarkMode();

/* =========================
   REGISTRO
========================= */

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const record = {
        sit: sit.value,
        pen: pen.value,
        senfis: senfis.value,
        emo: emo.value,
        ints: ints.value,
        date: date.value
    };

    let data = getData();

    if (editIndexInput.value === "") {
        data.push(record);
    } else {
        data[editIndexInput.value] = record;
        editIndexInput.value = "";
        submitBtn.textContent = "Guardar Registro";
    }

    localStorage.setItem("emotionalRecords", JSON.stringify(data));
    form.reset();
    loadData();
});

function getData() {
    return JSON.parse(localStorage.getItem("emotionalRecords")) || [];
}

function loadData() {
    table.innerHTML = "";
    getData().forEach((record, index) => addRow(record, index));
}

function addRow(record, index) {
    const row = document.createElement("tr");

    [record.sit, record.pen, record.senfis, record.emo].forEach(value => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
    });

    const intensityCell = document.createElement("td");
    intensityCell.textContent = record.ints;
    intensityCell.classList.add(record.ints.toLowerCase());
    row.appendChild(intensityCell);

    const dateCell = document.createElement("td");
    dateCell.textContent = record.date;
    row.appendChild(dateCell);

    const actionCell = document.createElement("td");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.classList.add("edit-btn");
    editBtn.onclick = () => editRecord(index);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Eliminar";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = () => deleteRecord(index);

    actionCell.appendChild(editBtn);
    actionCell.appendChild(deleteBtn);

    row.appendChild(actionCell);
    table.appendChild(row);
}

function editRecord(index) {
    const data = getData();
    const record = data[index];

    sit.value = record.sit;
    pen.value = record.pen;
    senfis.value = record.senfis;
    emo.value = record.emo;
    ints.value = record.ints;
    date.value = record.date;

    editIndexInput.value = index;
    submitBtn.textContent = "Actualizar Registro";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteRecord(index) {
    let data = getData();
    if (confirm("¿Seguro que deseas eliminar este registro? 🌿")) {
        data.splice(index, 1);
        localStorage.setItem("emotionalRecords", JSON.stringify(data));
        loadData();
    }
}

/* =========================
   PDF
========================= */

downloadBtn.addEventListener("click", downloadPDF);

function downloadPDF() {
    const data = getData();

    if (data.length === 0) {
        alert("No hay registros guardados 🌿");
        return;
    }

    // 🔥 Ordenar por fecha (más reciente primero)
    const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Título
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("Historial Emocional Personal", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(11);
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, pageWidth / 2, 28, { align: "center" });

    // Tabla
    const tableColumn = ["Fecha", "Situación", "Pensamiento", "Sensación Física", "Emoción", "Intensidad"];
    
    const tableRows = sortedData.map(r => [
        r.date,
        r.sit,
        r.pen,
        r.senfis,
        r.emo,
        r.ints
    ]);

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: "striped",
        headStyles: { fillColor: [76, 175, 80] },
        styles: { fontSize: 9 },
        didDrawPage: function (data) {
            // 🔥 Footer automático en cada página del PDF
            doc.setFontSize(9);
            doc.text(
                "© Santiago 2026 - Registro Emocional Personal",
                pageWidth / 2,
                pageHeight - 10,
                { align: "center" }
            );
        }
    });

    doc.save("historial_emocional_completo.pdf");
}
   
/* =========================
   MODO OSCURO
========================= */

darkToggle.addEventListener("click", toggleDarkMode);

function toggleDarkMode() {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("darkMode", isDark);

    darkToggle.textContent = isDark
        ? "☀️ Modo Claro"
        : "🌙 Modo Oscuro";
}

function loadDarkMode() {
    const darkSaved = localStorage.getItem("darkMode") === "true";
    if (darkSaved) {
        document.body.classList.add("dark");
        darkToggle.textContent = "☀️ Modo Claro";
    }
}

});
