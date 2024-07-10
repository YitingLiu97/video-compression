document.getElementById('uploadBtn').addEventListener('click', async () => {
    const videoInput = document.getElementById('videoInput').files[0];
    if (!videoInput) {
        alert('Please select a video file first.');
        return;
    }

    const formData = new FormData();
    formData.append('video', videoInput);

    const response = await fetch('/compress', {
        method: 'POST',
        body: formData,
    });

    if (response.ok) {
        const blob = await response.blob();
        const videoURL = URL.createObjectURL(blob);
        const videoPreview = document.getElementById('videoPreview');
        videoPreview.src = videoURL;
        videoPreview.load();
        videoPreview.play();
    } else {
        alert('Video compression failed');
    }
});
