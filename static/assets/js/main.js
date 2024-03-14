

// Function to generate font face rules
function generateFontFaceRules(fontNames) {
var fontFaceRules = '';

fontNames.forEach(function (fontName) {
fontFaceRules += `
  @font-face {
      font-family: '${fontName}';
      src: url('static/fonts/${fontName}.ttf');
  }
`;
});

// Apply the generated font face styles to a <style> element or your stylesheet
var styleElement = document.createElement('style');
styleElement.innerHTML = fontFaceRules;
document.head.appendChild(styleElement);
}

// Array of font names
var fontNames = ['AMS_Aaditya', 'AMS_Aakash', 'AMS_Anaram', 'AMS_Chhatrapati', 'AMS_Deepak', 'AMS_Deepak_Regular', 'AMS_Kangna', 'AMS_Kesri', 'AMS_Khadu', 'AMS_MahaBharat', 'barakhadi'];

// Call the function to generate font face rules
generateFontFaceRules(fontNames);

function updateTextInputFont(fontName) {
const inputBox = document.querySelector('.invisible-input');
inputBox.style.fontFamily = fontName;
inputBox.placeholder = 'yaeTae oaqpa kra...';
document.getElementById('selected_font_hidden').value = fontName; // Assign the font name to the hidden input field
generateKeyboard(fontName); // Generate keyboard for the selected font
}

// Function to generate the keyboard for the selected font
function generateKeyboard(fontName) {
const keyboardContainer = document.querySelector('.keyboard-container');
keyboardContainer.innerHTML = ''; // Clear previous keyboard

// Create a canvas element to measure the glyphs
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Set the font style
ctx.font = `24px ${fontName}`; // Adjust font size for mobile

// Get the width of each glyph
const glyphs = {};
for (let i = 32; i <= 126; i++) { // ASCII range
const char = String.fromCharCode(i);
const width = ctx.measureText(char).width;
if (width > 0) { // Exclude empty glyphs
  glyphs[char] = char;
}
}

// Generate keyboard keys based on the extracted glyphs
for (let glyph in glyphs) {
if (glyphs.hasOwnProperty(glyph)) {
  const button = document.createElement('div');
  button.classList.add('keyboard-key');
  button.textContent = glyph;
  button.style.fontFamily = fontName

  // Add click event listener to insert glyph into input box
  button.addEventListener('click', function () {
      const inputBox = document.querySelector('.invisible-input');
      const currentText = inputBox.value;
      inputBox.value = currentText + glyph;
  });

  keyboardContainer.appendChild(button);
}
}
}


// Function to load fonts and preview
function loadFontsAndPreview() {
const dropdownMenu = document.querySelector('.dropdown-menu');

// Add event listener to dropdown menu
dropdownMenu.addEventListener('click', function(event) {
if (event.target.classList.contains('dropdown-item')) {
  const selectedFont = event.target.style.fontFamily;
  updateTextInputFont(selectedFont);
}
});
}
// Function to update font style and glyph characters of keyboard keys
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
keyCharacter.style.fontFamily = fontName

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



// Call the function to load fonts and preview
loadFontsAndPreview();

// Changing the color of the text inside input tag
// Get references to the color picker and text input elements
const colorPicker = document.getElementById('colorpicker');
const textInput = document.querySelector('.invisible-input');

// Add event listener to the color picker input
colorPicker.addEventListener('input', function(event) {
// Get the selected color value
const selectedColor = event.target.value;

// Set the color of the text input
textInput.style.color = selectedColor;
});



function resetText() {
document.getElementById('text').value = '';
updateDisplay();
}

