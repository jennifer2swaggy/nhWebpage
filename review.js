// review.js
// Reads the image data stored by the camera page and provides buttons for
// approving (download) or rejecting (retake).

document.addEventListener("DOMContentLoaded", () => {
  const storedImage = sessionStorage.getItem("capturedImage");
  const storedFilename = sessionStorage.getItem("capturedFilename") || "photo";

  if (!storedImage) {
    // no image saved, go back to camera
    window.location.href = "index.html";
    return;
  }

  const img = document.getElementById("reviewImage");
  img.src = storedImage;

  document.getElementById("approveBtn").addEventListener("click", () => {
    // create link to download the image
    const a = document.createElement("a");
    a.href = storedImage;
    a.download = storedFilename + ".jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // clear storage and return to camera
    sessionStorage.removeItem("capturedImage");
    sessionStorage.removeItem("capturedFilename");
    window.location.href = "index.html";
  });

  document.getElementById("retakeBtn").addEventListener("click", () => {
    // clear only the image but keep the filename for retake
    sessionStorage.removeItem("capturedImage");
    window.location.href = "index.html";
  });
});
