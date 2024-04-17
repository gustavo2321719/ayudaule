function fsuProcess() {
    const response = prompt("¿Existen fichas FSU inconsistentes? Escriba 'si' o 'no' (revisar esta información en la página sigof)");
    console.log("Respuesta del usuario:", response);
    if (response.toLowerCase() === "no") {
        if (inputFile) {
            console.log("Procesando sin inconsistencias...");
            processNoInconsistencies();
        } else {
            console.error("Error: No se ha cargado un archivo.");
            alert("Por favor, cargue un archivo antes de procesar.");
        }
    } else if (response.toLowerCase() === "si") {
        const number = prompt("¿Cuántas fichas FSU son consistentes?");
        const numberOfCodes = parseInt(number, 10);
        console.log("Número de fichas FSU consistentes:", numberOfCodes);
        if (isNaN(numberOfCodes) || numberOfCodes <= 0) {
            console.error("Error: Número inválido ingresado.");
            alert("Por favor, ingrese un número válido mayor que cero.");
            return;
        }
        createInputsForFSUCodes(numberOfCodes);
    } else {
        console.error("Entrada inválida.");
        alert("Por favor, ingrese 'si' o 'no'.");
    }
}

function processNoInconsistencies() {
    const modifiedContent = "R\nE\nV\nH\nF";
    const newFile = new Blob([modifiedContent], { type: 'text/plain' });
    console.log("Archivo modificado sin inconsistencias creado.");
    downloadFile(newFile, "FSU_RESPUESTA.dat");
}

function createInputsForFSUCodes(numberOfCodes) {
    const container = document.createElement('div');
    container.id = "fsuCodeInputsContainer";
    console.log("Creando inputs para códigos FSU.");
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
    console.log("Contenedor de códigos FSU agregado al cuerpo del documento.");
}

function analyzeFSUCodes() {
    const container = document.getElementById('fsuCodeInputsContainer');
    const inputs = container.querySelectorAll('input');
    const codes = Array.from(inputs).map(input => input.value.trim());
    console.log("Códigos FSU para análisis:", codes);
    
    if (!inputFile) {
        console.error("Error: No se ha cargado un archivo.");
        alert("Por favor, cargue un archivo antes de procesar.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function() {
        let content = reader.result;
        console.log("Archivo leído para procesamiento.");
        
        codes.forEach(code => {
            if (code.match(/^\d{8}$/)) {
                const regex = new RegExp("^.*" + code + ".*$", "gm");
                content = content.replace(regex, ""); // Elimina las líneas que contienen el código
            }
        });

        const newFile = new Blob([content], { type: 'text/plain' });
        console.log("Archivo procesado con códigos FSU eliminados.");
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
    console.log("Archivo descargado:", filename);
}
