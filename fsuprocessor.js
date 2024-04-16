
function fsuProcess() {
    const response = prompt("¿Existen fichas FSU inconsistentes? Escriba 'si' o 'no' (revisar esta información en la página sigof)");
    if (response.toLowerCase() === "no") {
        if (inputFile) {
            processNoInconsistencies();
        } else {
            alert("Por favor, cargue un archivo antes de procesar.");
        }
    } else if (response.toLowerCase() === "si") {
        const number = prompt("¿Cuántas fichas FSU son consistentes?");
        const numberOfCodes = parseInt(number, 10);
        if (isNaN(numberOfCodes) || numberOfCodes <= 0) {
            alert("Por favor, ingrese un número válido mayor que cero.");
            return;
        }
        createInputsForFSUCodes(numberOfCodes);
    } else {
        alert("Por favor, ingrese 'si' o 'no'.");
    }
}

function processNoInconsistencies() {
    const modifiedContent = "R\nE\nV\nH\nF";
    const newFile = new Blob([modifiedContent], { type: 'text/plain' });
    downloadFile(newFile, "FSU_RESPUESTA.dat");
}


function createInputsForFSUCodes(numberOfCodes) {
    const container = document.createElement('div');
    container.id = "fsuCodeInputsContainer";
    for (let i = 0; i < numberOfCodes; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Código FSU #${i + 1} (8 dígitos)`;
        input.style.margin = '10px';
        input.maxLength = 8;
        input.size = 10;
        container.appendChild(input);
    }
    const button = document.createElement('button');
    button.textContent = 'Analizar';
    button.onclick = analyzeFSUCodes;
    container.appendChild(button);
    
    document.body.appendChild(container);
}

function analyzeFSUCodes() {
    const container = document.getElementById('fsuCodeInputsContainer');
    const inputs = container.querySelectorAll('input');
    const codes = Array.from(inputs).map(input => input.value.trim());

    if (!inputFile) {
        alert("Por favor, cargue un archivo antes de procesar.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function() {
        let content = reader.result;

        codes.forEach(code => {
            if (code.match(/^\d{8}$/)) { // Verifica si el código tiene 8 dígitos
                const regex = new RegExp("^.*" + code + ".*$", "gm");
                content = content.replace(regex, ""); // Elimina las líneas que contienen el código
            }
        });

        const newFile = new Blob([content], { type: 'text/plain' });
        downloadFile(newFile, "FSU_RESPUESTA.dat");
    };
    reader.readAsText(inputFile);
}

function downloadFile(blob, filename) {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
