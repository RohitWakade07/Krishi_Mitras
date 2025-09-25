const VoiceBot = (() => {
  let recognition;
  let synth;
  let controls;

  function init({ transcriptEl, responseEl, startBtn, stopBtn, speakBtn }) {
    controls = { transcriptEl, responseEl, startBtn, stopBtn, speakBtn };
    synth = window.speechSynthesis;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.interimResults = true;
      recognition.onresult = (e) => {
        const text = Array.from(e.results).map(r => r[0].transcript).join('');
        transcriptEl.textContent = text;
        if (e.results[0].isFinal) {
          const reply = simpleNLU(text);
          responseEl.value = reply;
          speak(reply);
        }
      };
      recognition.onerror = () => {};
    } else {
      transcriptEl.textContent = 'Speech recognition not supported on this device.';
    }

    startBtn.addEventListener('click', () => recognition && recognition.start());
    stopBtn.addEventListener('click', () => recognition && recognition.stop());
    speakBtn.addEventListener('click', () => speak(responseEl.value));
  }

  function speak(text) {
    if (!text) return;
    if (!synth) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    synth.speak(utterance);
  }

  function simpleNLU(text) {
    const t = text.toLowerCase();
    if (t.includes('baarish') || t.includes('rain')) {
      return 'Agle 24 ghanton me halka varsha sambhav hai.';
    }
    if (t.includes('sinchai') || t.includes('irrigation')) {
      return 'Khet ke kshetra B me kal subah 2 ghante sinchai karein.';
    }
    if (t.includes('khaad') || t.includes('fertilizer')) {
      return 'Zone A me halke nitrogen aadharit khaad ka prayog karein.';
    }
    return 'Kripya fasal ka naam aur prashn batayein.';
  }

  return { init };
})();


