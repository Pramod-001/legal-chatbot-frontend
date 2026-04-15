export const useSpeechRecognition = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.error('Browser does not support Speech Recognition');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-IN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  return recognition;
};

export const startListening = (recognition, onResult, onError, onEnd) => {
  if (!recognition) {
    console.error('Speech recognition not available');
    return;
  }

  recognition.onstart = () => {
    console.log('Voice listening started...');
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log('Voice transcript:', transcript);
    if (onResult) onResult(transcript);
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    if (onError) onError(event.error);
  };

  recognition.onend = () => {
    console.log('Voice listening ended');
    if (onEnd) onEnd();
  };

  try {
    recognition.start();
  } catch (error) {
    console.error('Error starting speech recognition:', error);
    if (onError) onError(error.message);
  }
};

export const stopListening = (recognition) => {
  if (recognition) {
    try {
      recognition.stop();
    } catch (e) {
      // Already stopped
    }
  }
};

// ---- Text-to-Speech (TTS) ----

export const speakText = (text, onEnd) => {
  if (!window.speechSynthesis) {
    console.error('Browser does not support Speech Synthesis');
    return;
  }

  // Stop any currently playing speech first
  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-IN';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  // Try to find best available voice
  const voices = window.speechSynthesis.getVoices();
  const indianVoice = voices.find(v => v.lang === 'en-IN');
  const englishVoice = voices.find(v => v.lang.startsWith('en'));
  if (indianVoice) {
    utterance.voice = indianVoice;
  } else if (englishVoice) {
    utterance.voice = englishVoice;
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (event) => {
    console.error('Speech synthesis error:', event.error);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};
