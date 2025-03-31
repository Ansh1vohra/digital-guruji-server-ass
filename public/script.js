// script.js - Keep the same screenshot function
async function captureScreenshot() {
    const btn = document.querySelector('.screenshot-btn');
    btn.disabled = true;
    btn.textContent = 'Capturing...';
    
    try {
        const response = await fetch('/screenshot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `infographic-${new Date().toISOString()}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        alert('Error capturing screenshot: ' + error.message);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Take Screenshot';
    }
}
