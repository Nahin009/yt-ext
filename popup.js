document.getElementById("loopBtn").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: startLoopSegment,
    });
  });
  
  function startLoopSegment() {
    const startTime = 30;
    const endTime = 40;
  
    function waitForVideoAndLoop() {
      const video = document.querySelector('video');
  
      if (!video) {
        // console.log("Video element not found yet, retrying...");
        // setTimeout(waitForVideoAndLoop, 500); // Keep trying
        alert("No video element found on this page.");
        return;
      }
  
      console.log("Video element found! Starting loop...");
  
      video.currentTime = startTime;
      video.play();
  
      if (window._loopInterval) clearInterval(window._loopInterval);
  
      window._loopInterval = setInterval(() => {
        if (video.currentTime >= endTime) {
          video.currentTime = startTime;
          video.play();
        }
      }, 300);
    }
  
    waitForVideoAndLoop();
  }
  