function capturePhoto() {
    photoCanvas.width = width;
    photoCanvas.height = height;
    const context = photoCanvas.getContext('2d');
    context.drawImage(cameraFeed, 0, 0, width, height);

    // Convert the captured frame to a Blob
    photoCanvas.toBlob(function(blob) {
        // Create a reference to the location where the image will be saved in Firebase Storage
        var imageRef = storageRef.child('images/' + new Date().toISOString() + '.png');

        // Upload the image to Firebase Storage
        imageRef.put(blob).then(function(snapshot) {
            console.log('Uploaded a blob or file!');
        }).catch(function(error) {
            console.error('Error uploading image:', error);
        });
    }, 'image/png');
}
