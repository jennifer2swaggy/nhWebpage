const video = document.querySelector("video");
const cameraButton = document.querySelector(".camera");
const canvas = document.querySelector(".canvas");
const countdownElement = document.getElementById("countdown");
const filenameInput = document.getElementById("filenameInput");
const reviewContainer = document.getElementById("reviewContainer");
const reviewImage = document.getElementById("reviewImage");
const approveBtn = document.getElementById("approveBtn");
const retakeBtn = document.getElementById("retakeBtn");

let stream; // Store the stream globally

// Access the device camera and stream to video element//
navigator.mediaDevices.getUserMedia({ video: true }).then((mediaStream) => {
  stream = mediaStream;
  video.srcObject = stream;
  video.play();
});

// Countdown function
function startCountdown() {
  let count = 3;
  cameraButton.style.pointerEvents = "none"; // Disable button
  countdownElement.classList.add("active");

  const countdownInterval = setInterval(() => {
    if (count > 0) {
      countdownElement.textContent = count;
      count--;
    } else {
      clearInterval(countdownInterval);
      countdownElement.classList.remove("active");
      takePhoto();
      cameraButton.style.pointerEvents = "auto"; // Re-enable button
    }
  }, 1000);
}

// Take photo function
function takePhoto() {
  video.classList.toggle("effect");
  setTimeout(() => video.classList.toggle("effect"), 400);
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  // save image data as jpeg URL //
  const image_data_url = canvas.toDataURL("image/jpeg");

  // Get filename from input, default to "photo" if empty
  const filename = filenameInput.value.trim() || "photo";

  // Set the review image
  reviewImage.src = image_data_url;

  // Hide camera, show review
  cameraButton.style.display = "none";
  countdownElement.style.display = "none";
  reviewContainer.style.display = "block";

  // Store filename for later use
  sessionStorage.setItem("capturedFilename", filename);
}

// Trigger photo take with countdown//
cameraButton.addEventListener("click", startCountdown);

// Approve button event
approveBtn.addEventListener("click", () => {
  const filename = sessionStorage.getItem("capturedFilename") || "photo";
  const image_data_url = reviewImage.src;

  // create link to download the image
  const a = document.createElement("a");
  a.href = image_data_url;
  a.download = filename + ".jpg";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Reset to camera
  reviewContainer.style.display = "none";
  cameraButton.style.display = "block";

  // Reset countdown state so it always starts from 3 the next time
  countdownElement.textContent = "";
  countdownElement.classList.remove("active");
  countdownElement.style.display = "";

  filenameInput.value = "";
  sessionStorage.removeItem("capturedFilename");
});

// Retake button event
retakeBtn.addEventListener("click", () => {
  // Reset to camera
  reviewContainer.style.display = "none";
  cameraButton.style.display = "block";

  // Reset countdown state so it always starts fresh
  countdownElement.textContent = "";
  countdownElement.classList.remove("active");
  countdownElement.style.display = "";
});
