const video = document.querySelector("video");
const cameraButton = document.querySelector(".camera");
const canvas = document.querySelector(".canvas");
const countdownElement = document.getElementById("countdown");
const filenameInput = document.getElementById("filenameInput");

// Access the device camera and stream to video element//
navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  video.srcObject = stream;
  video.play();
});

// Countdown function
function startCountdown() {
  let count = 5;
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

  // store image and filename in sessionStorage for review page
  try {
    sessionStorage.setItem("capturedImage", image_data_url);
    sessionStorage.setItem("capturedFilename", filename);
  } catch (err) {
    console.error("Failed to save image to sessionStorage", err);
  }

  // clear input and countdown state before leaving
  if (filenameInput) filenameInput.value = "";
  if (countdownElement) {
    countdownElement.textContent = "";
    countdownElement.classList.remove("active");
  }

  // redirect to review page where user can approve or retake
  window.location.href = "review.html";
}

// Trigger photo take with countdown//
cameraButton.addEventListener("click", startCountdown);
