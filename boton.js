
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

        var option1 = createRadioOption('Limpiar', 'S100', 'option');
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
      textarea.value = text.split('\n').map(line => {
        if (line.length > 24) {
          return line.substring(24, 32);
        }
        return '';
      }).join('\n');
    }