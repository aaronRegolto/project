/**
 * Voice Manager Utility
 * Handles Speech Synthesis and Recognition Web APIs
 */

export const VoiceManager = {
  /**
   * Speak text using Web Speech API
   * @param {string} text - Text to speak
   * @param {object} options - Configuration options
   * @returns {SpeechSynthesisUtterance}
   */
  speak: (text, options = {}) => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (options.voice) {
      const voices = speechSynthesis.getVoices();
      utterance.voice = voices[options.voice];
    }
    
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;

    window.speechSynthesis.speak(utterance);
    return utterance;
  },

  /**
   * Stop current speech
   */
  stop: () => {
    window.speechSynthesis.cancel();
  },

  /**
   * Get available voices
   * @returns {array} Array of available voices
   */
  getVoices: () => {
    return window.speechSynthesis.getVoices();
  },

  /**
   * Start speech recognition (dictation)
   * @param {function} onResult - Callback for results
   * @param {function} onEnd - Callback for completion
   * @returns {SpeechRecognition} Recognition instance
   */
  startDictation: (onResult, onEnd) => {
    const recognition = new (window.SpeechRecognition || 
                            window.webkitSpeechRecognition)();
    recognition.continuous = true;
    
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onResult(transcript);
    };

    recognition.onend = onEnd;
    recognition.start();
    
    return recognition;
  },
};
