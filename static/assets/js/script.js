document.addEventListener('DOMContentLoaded', function () {
    // Function to dynamically load fonts and update the preview
    function loadFontsAndPreview() {
        fetch('/get_fonts')
            .then(response => response.json())
            .then(data => {
                const fontSelect = document.getElementById('font');

                // Clear existing options
                fontSelect.innerHTML = '';

                // Add options for each font
                data.fonts.forEach(font => {
                    const option = document.createElement('option');
                    option.value = font;
                    option.style.fontFamily = font;
                    option.textContent = font;
                    fontSelect.appendChild(option);
                });

                // Update the virtual keyboard and preview
                const selectedFont = fontSelect.value;
                updateVirtualKeyboard(selectedFont);
                previewText();

                // Dynamically add @font-face rules for each font
                generateFontFaceRules(data.fonts);
            })
            .catch(error => console.error('Error fetching fonts:', error));
    }

    // Fetch available fonts and initialize the page
    loadFontsAndPreview();

    // Attach event listeners
    document.getElementById('favcolor').addEventListener('input', previewText);
    document.getElementById('text').addEventListener('input', previewText);

    document.getElementById('font').addEventListener('change', function () {
        const selectedFont = this.value;
        updateVirtualKeyboard(selectedFont);
        previewText();
    });

    document.getElementById('generate-btn').addEventListener('click', function () {
        downloadImage();
    });

    document.getElementById('reset-btn').addEventListener('click', function () {
        resetText();
    });
});

function updateDisplay() {
    var inputText = document.getElementById('text').value;
    var displayTextElement = document.getElementById('display-text');
    var selectedFont = document.getElementById('font').value;
    var selectedColor = document.getElementById('favcolor').value;

    displayTextElement.style.fontFamily = selectedFont;
    displayTextElement.style.color = selectedColor;
    displayTextElement.innerText = inputText;

    document.getElementById('color-display').style.backgroundColor = selectedColor;
    document.getElementById('color-input').value = selectedColor;
}

function updateVirtualKeyboard(fontName) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz `1234567890-=[];';

    const virtualKeyboardContainer = document.getElementById('virtual-keyboard');
    virtualKeyboardContainer.innerHTML = '';

    const fontTester = document.createElement('span');
    fontTester.style.visibility = 'hidden';
    fontTester.style.fontFamily = fontName;
    document.body.appendChild(fontTester);

    characters.split('').forEach(char => {
        fontTester.textContent = char;
        const keyElement = document.createElement('div');
        keyElement.classList.add('virtual-key');
        keyElement.style.fontFamily = fontName;

        const keyCharacter = document.createElement('div');
        keyCharacter.classList.add('key-character');
        keyCharacter.textContent = fontTester.textContent;

        keyElement.appendChild(keyCharacter);

        keyElement.addEventListener('click', function () {
            var inputText = document.getElementById('text');
            inputText.value += char;
            updateDisplay();
        });

        virtualKeyboardContainer.appendChild(keyElement);
    });

    document.body.removeChild(fontTester);
}

function previewText() {
    var formData = new FormData(document.forms[0]);
    var selectedFont = document.getElementById('font').value;

    var previewTextElement = document.getElementById('display-text');

    previewTextElement.style.fontFamily = selectedFont;

    var selectedColor = document.getElementById('favcolor').value;
    previewTextElement.style.color = selectedColor;

    previewTextElement.innerText = document.getElementById('text').value;

    updateVirtualKeyboard(selectedFont);
}

function downloadImage() {
    var formData = new FormData(document.forms[0]);
    var text= document.getElementById('invisible-input').value
    console.log(text)
    fetch('/generate', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.blob())
        .then(blob => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = `${text}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Error:', error));
}

function resetText() {
    document.getElementById('text').value = '';
    updateDisplay();
}

function generateFontFaceRules(fontNames) {
    var fontFaceRules = '';

    fontNames.forEach(function (fontName) {
        fontFaceRules += `
            @font-face {
                font-family: '${fontName}';
                src: url('static/fonts/${fontName}.ttf') format('truetype');
            }
        `;
    });

    // Apply the generated font face styles to a <style> element or your stylesheet
    var styleElement = document.createElement('style');
    styleElement.innerHTML = fontFaceRules;
    document.head.appendChild(styleElement);
}
