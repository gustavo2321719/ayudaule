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
        const number = prompt("¿Cuántas fichas FSU son inconsistentes?");
        const numberOfCodes = parseInt(number, 10);
        console.log("Número de fichas FSU inconsistentes:", numberOfCodes);
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
    downloadFile(newFile, "FSU_RESPUESTA.DAT");
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
        input.size = 12;
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
    // Paso 1: Obtener los elementos de entrada
    const container = document.getElementById('fsuCodeInputsContainer');
    const inputs = container.querySelectorAll('input');
    const codes = Array.from(inputs).map(input => input.value.trim());

    // Paso 2: Comprobación de archivo de entrada
    if (!inputFile) {
        console.error("Error: No se ha cargado un archivo.");
        alert("Por favor, cargue un archivo antes de procesar.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function() {
        let content = reader.result;
        console.log("Archivo leído para procesamiento.");

        let removedLines = []; // Paso 7: Registro de líneas eliminadas

        // Paso 4 y 5: Comprobación de contenido y verificación de códigos
        const lines = content.split('\n');
        const filteredLines = lines.filter(line => {
            if (['R', 'E', 'V', 'H', 'F'].includes(line[0])) {
                // Verificar si la línea cumple con la regla adicional
                const codePrefix = line.substring(1, 9);
                return codes.includes(codePrefix);
            } else {
                return true;
            }
        });

        // Paso 7: Registro de líneas eliminadas
        removedLines = lines.filter(line => {
            if (line.startsWith('R')) {
                return !filteredLines.includes(line);
            } else {
                return false;
            }
        });

        // Paso 8: Creación de un nuevo archivo
        const newContent = filteredLines.join('\n');
        const newFile = new Blob([newContent], { type: 'text/plain' });

        // Paso 9: Descarga del archivo procesado
        downloadFile(newFile, "FSU_RESPUESTA.DAT");

        // Paso 7: Mostrar líneas eliminadas en la consola
        console.log("Líneas eliminadas que empiezan por 'R':", removedLines);
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
