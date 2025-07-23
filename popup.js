document.getElementById("submitQueryBtn").addEventListener("click", async () => {
  const query = document.getElementById("queryInput").value.trim();
  if (!query) return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab.url;

  try {
    const response = await fetch(`http://localhost:9010/get_udemy_query_timestamp?url=${encodeURIComponent(url)}&query=${encodeURIComponent(query)}`);
    const result = await response.json();

    if (!result || typeof result !== "object" || !("start_time" in result) || !("end_time" in result)) {
      alert("No query found or invalid response.");
      return;
    }

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (start, end) => {
        const video = document.querySelector("video");
        if (!video) {
          alert("No video element found on this page.");
          return;
        }

        video.currentTime = start;
        video.play();

        if (window._loopInterval) clearInterval(window._loopInterval);
        window._loopInterval = setInterval(() => {
          if (video.currentTime >= end) {
            video.currentTime = start;
            video.play();
          }
        }, 300);
      },
      args: [result.start_time, result.end_time]
    });

  } catch (error) {
    console.error("Error fetching timestamp:", error);
    alert("No query found or request failed.");
  }
});
