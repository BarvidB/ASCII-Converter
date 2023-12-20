const imageInput = document.getElementById('imageInput');
const outputCanvas = document.getElementById('outputCanvas');
const asciiArtContainer = document.getElementById('asciiArtContainer');
const convertButton = document.getElementById('convertButton');

convertButton.addEventListener('click', () => {
    const file = imageInput.files[0];
    const desiredWidth = parseInt(document.getElementById('outputWidth').value, 10);

    if (file) {
        if (file.type.startsWith('image')) {
            const img = new Image();
            img.onload = function () {
                const aspectRatio = img.width / img.height;
                const newHeight = Math.round(desiredWidth / aspectRatio);
  
                outputCanvas.width = desiredWidth;
                outputCanvas.height = newHeight;
                const ctx = outputCanvas.getContext('2d');
                ctx.drawImage(img, 0, 0, desiredWidth, newHeight);
                const imageData = ctx.getImageData(0, 0, desiredWidth, newHeight);
  
                asciiArtContainer.textContent = convertImageDataToASCII(imageData);
            };
  
            const reader = new FileReader();
            reader.onload = function (e) {
                img.src = e.target.result;
            };

            reader.readAsDataURL(file);
        } else if (file.type === 'image/gif') {
            //Todo: ADD GIF LOGIC
        } else {
            alert('Unsupported file format. Please upload an image.');
        }
    }
});

const charList = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^`\'.'
const asciiChars = ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.', ' '];

function convertImageDataToASCII(imageData) {
    const { data, width, height } = imageData;

    let asciiArt = '';
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (r + g + b) / 3;

        const asciiIndex = Math.floor((brightness / 255) * (charList.length - 1));
        const asciiChar = charList[asciiIndex];

        asciiArt += asciiChar;

        
        if ((i / 4 + 1) % width === 0) {
            asciiArt += '\n';
        }
    }

    return asciiArt;
}
