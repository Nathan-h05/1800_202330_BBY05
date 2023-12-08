const cameraFeed = document.getElementById('camera-feed');
const photoCanvas = document.getElementById('photo-canvas');
const captureButton = document.getElementById('capture-button');
const width = 640; 
const height = 480; 

// Request access to the user's camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
        cameraFeed.srcObject = stream;
    })
    .catch(function(error) {
        console.error('Error accessing camera:', error);
    });

// Function to capture a photo
function capturePhoto() {
    photoCanvas.width = width;
    photoCanvas.height = height;
    const context = photoCanvas.getContext('2d');
    context.drawImage(cameraFeed, 0, 0, width, height);

    // Convert the captured frame to an image and save it
    const imgData = photoCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = imgData;
    a.download = 'captured-photo.png';
    a.save
    a.click();
}

// Attach the capturePhoto function to the button click event
captureButton.addEventListener('click', capturePhoto);




