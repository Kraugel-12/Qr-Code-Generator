let qr;

function generateQR() {
    const data = document.getElementById('text').value;
    const qrcodeDiv = document.getElementById("qrcode");
    const logoEl = document.getElementById("logo");
    const logoRadius = document.getElementById("logoRadius").value;
    const downloadButton = document.getElementById("downloadBtn");

    qrcodeDiv.innerHTML = "";
    downloadButton.style.display = "none";

    if (!data.trim()) {
        alert("Please enter text or URL.");
        return;
    }

    qr = new QRCode(qrcodeDiv, {
        text: data,
        width: 200,
        height: 200,
        correctLevel: QRCode.CorrectLevel.H
    });

    setTimeout(() => {
        const logoInput = document.getElementById("logoUpload");
        if (logoInput.files.length > 0) {
            const file = logoInput.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                logoEl.src = e.target.result;
                logoEl.style.display = "block";
                logoEl.style.borderRadius = logoRadius + "%";
            };

            reader.readAsDataURL(file);
        } else {
            logoEl.style.display = "none";
        }

        downloadButton.style.display = "block";
    }, 300);
}

document.getElementById("logoRadius").addEventListener("input", function() {
    document.getElementById("logo").style.borderRadius = this.value + "%";
});

function downloadQR() {
    const qrCanvas = document.querySelector("#qrcode canvas");
    const logo = document.getElementById("logo");

    const finalCanvas = document.createElement("canvas");
    const ctx = finalCanvas.getContext("2d");

    const size = 300;
    finalCanvas.width = size;
    finalCanvas.height = size;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    ctx.drawImage(qrCanvas, 50, 50, 200, 200);

    if (logo.style.display !== "none") {
        ctx.save();
        const radius = parseInt(document.getElementById("logoRadius").value);
        const logoSize = 70;
        const x = (size - logoSize) / 2;
        const y = (size - logoSize) / 2;

        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + logoSize - radius, y);
        ctx.quadraticCurveTo(x + logoSize, y, x + logoSize, y + radius);
        ctx.lineTo(x + logoSize, y + logoSize - radius);
        ctx.quadraticCurveTo(x + logoSize, y + logoSize, x + logoSize - radius, y + logoSize);
        ctx.lineTo(x + radius, y + logoSize);
        ctx.quadraticCurveTo(x, y + logoSize, x, y + logoSize - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(logo, x, y, logoSize, logoSize);
        ctx.restore();
    }

    const link = document.createElement("a");
    link.download = "QRCode.png";
    link.href = finalCanvas.toDataURL();
    link.click();
}
