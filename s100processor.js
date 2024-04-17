
function s100Process() {
    const number = prompt("¿Cuántas fichas S100 son consistentes? (revisar esta información en la página sigof)");
    console.log("Número ingresado:", number);
    if (number === "0") {
        if (inputFile) {
            console.log("Procediendo a comprimir y descargar el archivo, ya que el número es 0");
            compressAndDownloadFile(inputFile, "Respuesta s100", "S100_RESPUESTA.dat");
        } else {
            console.log("Error: No se ha cargado ningún archivo.");
            alert("Por favor, cargue un archivo antes de procesar.");
        }
    } else {
        const numberOfCodes = parseInt(number, 10);
        console.log("Número de códigos a procesar:", numberOfCodes);
        if (isNaN(numberOfCodes) || numberOfCodes <= 0) {
            console.log("Entrada inválida, debe ser un número mayor que cero");
            alert("Por favor, ingrese un número válido mayor que cero.");
            return;
        }

        createInputsForCodes(numberOfCodes);
    }
}

function createInputsForCodes(numberOfCodes) {
    console.log("Creando inputs para", numberOfCodes, "códigos");
    const container = document.createElement('div');
    container.id = "codeInputsContainer";

    const description = document.createElement('p');
    description.textContent = "¿Cuáles son los códigos de las fichas S100 consistentes?";
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
    button.textContent = 'Analizar';
    button.onclick = analyzeCodes;
    container.appendChild(button);

    document.body.appendChild(container);
}

function analyzeCodes() {
    const container = document.getElementById('codeInputsContainer');
    const inputs = container.querySelectorAll('input');
    const codes = Array.from(inputs).map(input => input.value.trim());
    console.log("Códigos ingresados:", codes);

    if (!inputFile) {
        console.log("Error: Archivo no cargado al momento de analizar.");
        alert("Por favor, cargue un archivo antes de procesar.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function() {
        let content = reader.result;
        let modified = false;
        console.log("Inicio de la lectura del archivo y procesamiento de códigos.");

        codes.forEach(code => {
            if (code.match(/^\d{8}$/)) {
                const regex = new RegExp("R" + code + ".{859}(110|210)", "g");
                content = content.replace(regex, match => {
                    modified = true;
                    console.log("Modificando código:", code);
                    return match.slice(0, -3) + "111";
                });
            } else {
                console.log("Código inválido o no cumple el formato de 8 dígitos:", code);
            }
        });

        if (modified) {
            console.log("Cambios realizados, procediendo a compresión y descarga.");
            const newFile = new Blob([content], { type: 'text/plain' });
            compressAndDownloadFile(newFile, "Respuesta s100", "S100_RESPUESTA.dat");
        } else {
            console.log("No se encontraron coincidencias o no se necesitaron cambios.");
            alert("No se encontraron coincidencias o no se necesitaron cambios.");
        }
    };
    reader.readAsText(inputFile);
}

function compressAndDownloadFile(blob, zipName, fileName) {
    console.log("Comprimiendo archivo:", fileName, "en", zipName + ".zip");
    const zip = new JSZip();
    zip.file(fileName, blob);
    zip.generateAsync({type:"blob"})
    .then(function(content) {
        const link = document.createElement('a');
        const url = URL.createObjectURL(content);
        link.href = url;
        link.download = zipName + ".zip";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log("Descarga completada.");
    });
}
