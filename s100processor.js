function s100Process() {
    const inconsistentResponse = prompt("¿Existen fichas S100 inconsistentes? (responde 'si' o 'no')");
    if (inconsistentResponse.toLowerCase() === "no") {
        analyzeCodes1();
    } else if (inconsistentResponse.toLowerCase() === "si") {
        const number = prompt("Solicitar Número de Fichas Inconsistentes:");
        console.log("Número ingresado:", number);
        if (number === "0") {
            alert("Error: Por favor, ingrese un número válido mayor que cero.");
            return;
        }

        if (inputFile) {
            createInputsForCodes(number);
        } else {
            console.log("Error: No se ha cargado ningún archivo.");
            alert("Por favor, cargue un archivo antes de procesar.");
        }
    }
}

function createInputsForCodes(numberOfCodes) {
    console.log("Creando inputs para", numberOfCodes, "códigos");
    const container = document.createElement('div');
    container.id = "codeInputsContainer";

    const description = document.createElement('p');
    description.textContent = "¿Cuáles son los códigos de las fichas S100 inconsistentes?";
    container.appendChild(description);

    for (let i = 0; i < numberOfCodes; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Código #${i + 1} (8 dígitos)`;
        input.style.margin = '10px';
        input.maxLength = 8;
        input.size = 10;
        container.appendChild(input);
    }

    const button = document.createElement('button');
    button.textContent = 'Procesar';
    button.onclick = analyzeCodes2;
    container.appendChild(button);

    document.body.appendChild(container);
}
// ESTA FUNCION FUNCIONAAAAAAAA
function analyzeCodes1() {
    if (!inputFile) {
        console.log("Error: No se ha cargado ningún archivo.");
        alert("Por favor, cargue un archivo antes de procesar.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function() {
        let content = reader.result;
        let count = 0;

        console.log("Verificando el archivo para cambios de '0' a '1'.");

        // Verificación en el archivo de texto subido
        content = content.replace(/^(R\d{8}.{861})0/gm, (match, p1) => {
            count++;
            return p1 + '1';
        });

        console.log("Cantidad de '0' cambiados por '1':", count);

        // Descarga del archivo modificado
        const newFile = new Blob([content], { type: 'text/plain' });
        compressAndDownloadFile(newFile, "S100_RESPUESTA.dat");
    };
    reader.readAsText(inputFile);
}




function analyzeCodes2() {
    if (!inputFile) {
        console.log("Error: No se ha cargado ningún archivo.");
        alert("Por favor, cargue un archivo antes de procesar.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function() {
        let content = reader.result;
        let count = 0;

        console.log("Verificando el archivo para cambios de '0' a '1'.");

        // Obtener códigos de 8 dígitos ingresados por el usuario
        const codes = Array.from(document.querySelectorAll('input')).map(input => input.value.trim());

        // Verificación en el archivo de texto subido
        content = content.replace(/^(R\d{8}.*|R(?:.*\D|^.{0,869}(?!\d{8})).*)0/gm, (match, p1) => {
            if (!codes.some(code => p1.includes(code))) {
                count++;
                return p1 + '1';
            } else {
                return match; // No se modifica la línea si contiene un código de 8 dígitos
            }
        });

        console.log("Cantidad de '0' cambiados por '1':", count);

        // Descarga del archivo modificado
        const newFile = new Blob([content], { type: 'text/plain' });
        compressAndDownloadFile(newFile, "S100_RESPUESTA.dat");
    };
    reader.readAsText(inputFile);
}





function compressAndDownloadFile(blob, filename) {
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