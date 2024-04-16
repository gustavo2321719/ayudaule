

function s100Process() {
    const number = prompt("¿Cuántas fichas S100 son consistentes? (revisar esta información en la página sigof)");
    if (number === "0") {
        if (inputFile) {
            downloadFile(inputFile, "S100_RESPUESTA.dat");
        } else {
            alert("Por favor, cargue un archivo antes de procesar.");
        }
    } else {
        const numberOfCodes = parseInt(number, 10);
        if (isNaN(numberOfCodes) || numberOfCodes <= 0) {
            alert("Por favor, ingrese un número válido mayor que cero.");
            return;
        }

        // Creamos los inputs para que el usuario ingrese los códigos de fichas consistentes
        createInputsForCodes(numberOfCodes);
    }
}

function createInputsForCodes(numberOfCodes) {
    const container = document.createElement('div');
    container.id = "codeInputsContainer";
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
    button.textContent = 'Analizar';
    button.onclick = analyzeCodes;
    container.appendChild(button);
    
    document.body.appendChild(container);
}

function analyzeCodes() {
    const container = document.getElementById('codeInputsContainer');
    const inputs = container.querySelectorAll('input');
    const codes = Array.from(inputs).map(input => input.value.trim());

    if (!inputFile) {
        alert("Por favor, cargue un archivo antes de procesar.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function() {
        let content = reader.result;
        let modified = false;

        codes.forEach(code => {
            if (code.match(/^\d{8}$/)) { // Verifica si el código tiene 8 dígitos
                const regex = new RegExp("R" + code + ".{867}110", "g");
                content = content.replace(regex, match => {
                    modified = true;
                    return match.slice(0, -3) + "111";
                });
            }
        });

        if (modified) {
            const newFile = new Blob([content], { type: 'text/plain' });
            downloadFile(newFile, "S100_RESPUESTA.dat");
        } else {
            alert("No se encontraron coincidencias o no se necesitaron cambios.");
        }
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
