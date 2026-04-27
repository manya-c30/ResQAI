const chat = document.getElementById("chat");
const input = document.getElementById("input");
const status = document.getElementById("status");

/* ===============================
   💬 CHAT UI
================================ */
function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = "msg " + type;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

/* ===============================
   🔊 TEXT TO SPEECH
================================ */
function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.rate = 1;
  speech.lang = "en-US";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
}

/* ===============================
   🚨 EMERGENCY FLOW (UPDATED)
================================ */
async function handleEmergencyFlow(aiText) {

  status.innerText = "📍 Getting location...";

  navigator.geolocation.getCurrentPosition(async (pos) => {

    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    let places = [];

    try {
      const res = await fetch("http://localhost:3000/nearby-help", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ lat, lng })
      });

      const data = await res.json();
      places = data.places;

    } catch (err) {
      console.log("Nearby error:", err);
    }

    let placeText = "";

    if (places.length > 0) {
      placeText =
        "\n\n🏥 Nearby Help:\n" +
        places.map(p => `${p.name} - ${p.address}`).join("\n");
    }

    const message =
      "🚨 EMERGENCY!\n\n" +
      aiText +
      placeText +
      "\n\n📍 https://maps.google.com/?q=" + lat + "," + lng;

    // ✅ SHOW ALERT INSTEAD OF SMS
    alert("🚨 Emergency Alert Sent!\n\n" + message);

    addMessage("🚨 Emergency alert generated!", "bot");
    status.innerText = "🚨 Alert displayed (no SMS)";

  },
  () => {
    status.innerText = "❌ Location denied";
  });
}

/* ===============================
   📩 SEND MESSAGE
================================ */
window.sendMessage = async () => {

  const msg = input.value.trim();
  if (!msg) return;

  addMessage(msg, "user");
  input.value = "";

  try {
    const res = await fetch("http://localhost:3000/voice-assistant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: msg })
    });

    const data = await res.json();

    const typingDiv = document.createElement("div");
typingDiv.className = "msg bot typing";
typingDiv.innerText = "ResQ AI is typing...";
chat.appendChild(typingDiv);
chat.scrollTop = chat.scrollHeight;

setTimeout(() => {
  chat.removeChild(typingDiv);
  addMessage(data.reply, "bot");
  speak(data.reply);
}, 1000);
    speak(data.reply);

    if (data.emergency) {
      status.innerText = "🚨 Emergency detected!";
      handleEmergencyFlow(data.reply);
    } else {
      status.innerText = "✅ Normal";
    }

  } catch (err) {
    console.error(err);
    status.innerText = "❌ Cannot reach server";
    addMessage("⚠ Server not responding", "bot");
  }
};

/* ===============================
   🎤 VOICE INPUT
================================ */
window.startListening = () => {

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech not supported");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.start();

  status.innerText = "🎤 Listening...";

  recognition.onresult = (event) => {
    const speech = event.results[0][0].transcript;
    input.value = speech;
    sendMessage();
  };

  recognition.onerror = () => {
    status.innerText = "❌ Voice error";
  };
};

/* ===============================
   🚨 MANUAL EMERGENCY BUTTON
================================ */
document.getElementById("emergencyBtn").onclick = () => {

  const message = "🚨 Manual Emergency Alert! I need help.";

  alert("🚨 Emergency Alert Sent!\n\n" + message);
  status.innerText = "🚨 Manual alert triggered";

};