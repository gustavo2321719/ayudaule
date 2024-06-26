
    document.getElementById('limpiezaButton').addEventListener('click', function() {
      if (!document.getElementById('textAreaContainer')) {
        var container = document.createElement('div');
        container.id = 'textAreaContainer';

        var textarea = document.createElement('textarea');
        textarea.id = 'inputText';
        textarea.rows = 4;
        textarea.cols = 50;
        container.appendChild(textarea);

        container.appendChild(document.createElement('br'));

        var option1 = createRadioOption('Limpiar S100', 'S100', 'option');
        container.appendChild(option1.label);
        container.appendChild(option1.input);

        option1.input.addEventListener('change', function() {
          modifyText();
        });

        document.body.appendChild(container);
      }
    });

    function createRadioOption(id, value, name) {
      var input = document.createElement('input');
      input.type = 'radio';
      input.id = id;
      input.name = name;
      input.value = value;

      var label = document.createElement('label');
      label.htmlFor = id;
      label.textContent = id;

      return { label, input };
    }

    function modifyText() {
      var textarea = document.getElementById('inputText');
      var text = textarea.value;
    
      // Eliminar todos los espacios en blanco que no sean saltos de línea
      var cleanedText = text.replace(/ /g, '');
    
      // Aplicar la transformación original a cada línea
      textarea.value = cleanedText.split('\n').map(line => {
        if (line.length > 10) {
          return line.substring(11, 19);
        }
        return '';
      }).join('\n');
    }
    