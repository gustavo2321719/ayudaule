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
        input.size = 12;
        container.appendChild(input);
    }

    const button = document.createElement('button');
    button.textContent = 'Procesar';
    button.onclick = function() {
        const codes = Array.from(document.querySelectorAll('input')).map(input => input.value.trim());
        readFileAndProcess(codes);
    };
    container.appendChild(button);

    document.body.appendChild(container);
}

function readFileAndProcess(codes) {
    if (!inputFile) {
        console.log("Error: No se ha cargado ningún archivo.");
        alert("Por favor, cargue un archivo antes de procesar.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function() {
        let content = reader.result;
        // Ordenar las líneas del archivo de texto
        content = ordenarLineas(content);
        // Procesar el texto ordenado
        analyzeCodes2(content, codes);
    };
    reader.readAsText(inputFile);
}

function analyzeCodes2(content, codes) {
    let count = 0;
    console.log("Verificando el archivo para cambios de '0' a '1'.");

    // Ordenar las líneas del archivo de texto
    content = ordenarLineas(content);

    // Verificación en el archivo de texto subido
    content = content.replace(/^(R\d{8}.*|R(?!.*\d{8}).{861})0/gm, (match, p1) => {
        if (!codes.some(code => p1.includes(code))) {
            count++;
            return p1 + '1';
        } else {
            return match; // No se modifica la línea si contiene un código de 8 dígitos
        }
    });

    console.log("Cantidad de '0' cambiados por '1':", count);

    // Sobrescribir el contenido del archivo original
    const reader = new FileReader();
    reader.onload = function() {
        const originalBuffer = reader.result;
        const modifiedBuffer = new ArrayBuffer(content.length);
        const modifiedView = new Uint8Array(modifiedBuffer);
        for (let i = 0; i < content.length; ++i) {
            modifiedView[i] = content.charCodeAt(i);
        }
        const newFile = new Blob([modifiedBuffer], { type: 'text/plain' });
        compressAndDownloadFile(newFile, "S100_RESPUESTA.DAT");
    };
    reader.readAsArrayBuffer(inputFile);
}

function ordenarLineas(texto) {
    // Dividir el texto en líneas
    var lineas = texto.split('\n');
    
    // Ordenar las líneas basadas en los caracteres de la posición 2 al 8
    lineas.sort(function(a, b) {
        var substrA = a.substring(1, 9); // Obtener los caracteres de la posición 2 al 8 de la línea A
        var substrB = b.substring(1, 9); // Obtener los caracteres de la posición 2 al 8 de la línea B
        return substrA.localeCompare(substrB); // Comparar las subcadenas de manera alfabética
    });
    // Unir las líneas ordenadas nuevamente en un solo texto
    var textoOrdenado = lineas.join('\n');
    // Devolver el texto ordenado
    return textoOrdenado;
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

function analyzeCodes1() {
    if (!inputFile) {
        console.log("Error: No se ha cargado ningún archivo.");
        alert("Por favor, cargue un archivo antes de procesar.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function() {
        let content = reader.result;
        // Modificar las líneas que cumplan con el patrón especificado
        content = content.replace(/^(R\d{8}.*0)/gm, (match, p1) => {
            return p1.replace(/0$/, '1'); // Reemplazar el último '0' por '1'
        });

        // Sobrescribir el contenido del archivo original
        const originalBuffer = reader.result;
        const modifiedBuffer = new ArrayBuffer(content.length);
        const modifiedView = new Uint8Array(modifiedBuffer);
        for (let i = 0; i < content.length; ++i) {
            modifiedView[i] = content.charCodeAt(i);
        }
        const newFile = new Blob([modifiedBuffer], { type: 'text/plain' });
        compressAndDownloadFile(newFile, "S100_RESPUESTA.DAT");
    };
    reader.readAsText(inputFile);
}
