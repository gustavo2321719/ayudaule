// script.js o dentro de una etiqueta <script>
document.getElementById('fileInput').addEventListener('change', function() {
    if (this.files.length > 0) {  // Comprobar si se ha seleccionado al menos un archivo
        document.getElementById('processButton').style.display = 'block';
    } else {
        document.getElementById('processButton').style.display = 'none';
    }
});
