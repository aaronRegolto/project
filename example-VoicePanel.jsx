import { useState, useEffect } from 'react';
import { VoiceManager } from '../utils/voiceManager';

/**
 * Voice Panel Component
 * Demonstrates: Speech Synthesis API, state management with arrays, modal handling
 */

const VoicePanel = () => {
  const [voiceText, setVoiceText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(0);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [speechPitch, setSpeechPitch] = useState(1.0);
  const [isDictating, setIsDictating] = useState(false);
  const [isRealTimeVoice, setIsRealTimeVoice] = useState(false);
  const [customPhrases, setCustomPhrases] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPhrase, setNewPhrase] = useState('');
  const [recognition, setRecognition] = useState(null);

  // Default quick phrases
  const defaultPhrases = [
    'Hello',
    'Thank you',
    'Yes',
    'No',
    'Please',
    'Help',
    'Can you repeat?',
  ];

  // Initialize voices on component mount
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = VoiceManager.getVoices();
      setVoices(availableVoices);
    };

    // Voices might not be loaded immediately
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();

    // Load custom phrases from localStorage
    const saved = localStorage.getItem('customPhrases');
    if (saved) {
      setCustomPhrases(JSON.parse(saved));
    }
  }, []);

  // Stop speaking when component unmounts
  useEffect(() => {
    return () => {
      VoiceManager.stop();
      if (recognition) {
        recognition.stop();
      }
    };
  }, [recognition]);

  // Real-time voice: speak text as user types
  useEffect(() => {
    if (isRealTimeVoice && voiceText && !isSpeaking) {
      handleSpeak();
    }
  }, [voiceText, isRealTimeVoice]);

  const handleSpeak = () => {
    if (!voiceText.trim()) return;

    if (isSpeaking) {
      VoiceManager.stop();
      setIsSpeaking(false);
      return;
    }

    const options = {
      voice: selectedVoice,
      rate: parseFloat(speechRate),
      pitch: parseFloat(speechPitch),
    };

    const utterance = VoiceManager.speak(voiceText, options);
    setIsSpeaking(true);

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };
  };

  const handleToggleDictation = () => {
    if (isDictating) {
      if (recognition) {
        recognition.stop();
      }
      setIsDictating(false);
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('Speech Recognition not supported in this browser');
        return;
      }

      const newRecognition = new SpeechRecognition();
      newRecognition.continuous = true;
      newRecognition.interimResults = true;

      newRecognition.onstart = () => {
        setIsDictating(true);
      };

      newRecognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setVoiceText(prev => prev + transcript + ' ');
          } else {
            interimTranscript += transcript;
          }
        }
      };

      newRecognition.onend = () => {
        setIsDictating(false);
      };

      newRecognition.start();
      setRecognition(newRecognition);
    } catch (error) {
      console.error('Speech recognition error:', error);
      alert('Error starting speech recognition');
    }
  };

  const handleClearText = () => {
    setVoiceText('');
    VoiceManager.stop();
    setIsSpeaking(false);
  };

  const handleAddPhrase = () => {
    if (newPhrase.trim()) {
      const updated = [...customPhrases, newPhrase];
      setCustomPhrases(updated);
      localStorage.setItem('customPhrases', JSON.stringify(updated));
      setNewPhrase('');
    }
  };

  const handleDeletePhrase = (index) => {
    const updated = customPhrases.filter((_, i) => i !== index);
    setCustomPhrases(updated);
    localStorage.setItem('customPhrases', JSON.stringify(updated));
  };

  const handleResetPhrases = () => {
    setCustomPhrases([]);
    localStorage.removeItem('customPhrases');
  };

  const handleQuickPhrase = (phrase) => {
    setVoiceText(phrase);
    if (isRealTimeVoice) {
      const options = {
        voice: selectedVoice,
        rate: parseFloat(speechRate),
        pitch: parseFloat(speechPitch),
      };
      VoiceManager.speak(phrase, options);
    }
  };

  const displayPhrases = customPhrases.length > 0 ? customPhrases : defaultPhrases;

  return (
    <>
      <section id="voice" className="section" aria-labelledby="voice-title">
        <div className="container">
          <div className="section-eyebrow reveal">Communication Aid</div>
          <h2 className="section-title reveal reveal-delay-1" id="voice-title">
            Text to <em>Voice</em> Panel
          </h2>
          <p className="section-desc reveal reveal-delay-2">
            Need to communicate verbally? Type your message below and have it spoken 
            aloud. Ideal for users who are visually impaired and need assistance with reading.
          </p>

          <div className="voice-card reveal reveal-delay-3">
            {/* Header */}
            <div className="voice-header">
              <div className="voice-icon-wrap" aria-hidden="true">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zm-1 3a1 1 0 0 1 2 0v8a1 1 0 0 1-2 0V4zm-4 5H5a7 7 0 0 0 14 0h-2a5 5 0 0 1-10 0zm4 8.93V21H9v2h6v-2h-2v-2.07A7 7 0 0 0 19 12h-2a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.93z" />
                </svg>
              </div>
              <div className="voice-header-text">
                <h3>Voice Communication</h3>
                <p>Type a message and press Speak to convert it to audio</p>
              </div>
              <div 
                className={`voice-wave ${isSpeaking ? '' : 'idle'}`} 
                id="voice-wave" 
                aria-hidden="true"
              >
                <span></span><span></span><span></span><span></span><span></span>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              className="voice-textarea"
              id="voice-text"
              value={voiceText}
              onChange={(e) => setVoiceText(e.target.value)}
              placeholder="Type your message here to be spoken aloud..."
              aria-label="Text to be spoken aloud"
            ></textarea>

            {/* Controls */}
            <div className="voice-controls">
              <div className="voice-control-group">
                <label htmlFor="voice-select">Voice</label>
                <select
                  className="voice-select"
                  id="voice-select"
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(parseInt(e.target.value))}
                  aria-label="Select voice"
                >
                  {voices.length > 0 ? (
                    voices.map((voice, idx) => (
                      <option key={idx} value={idx}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))
                  ) : (
                    <option>Loading voices...</option>
                  )}
                </select>
              </div>

              <div className="voice-control-group">
                <label htmlFor="voice-speed">
                  Speed: <span id="speed-val">{speechRate.toFixed(1)}</span>x
                </label>
                <input
                  type="range"
                  className="voice-range"
                  id="voice-speed"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(e.target.value)}
                  aria-label="Speech speed"
                />
              </div>

              <div className="voice-control-group">
                <label htmlFor="voice-pitch">
                  Pitch: <span id="pitch-val">{speechPitch.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  className="voice-range"
                  id="voice-pitch"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechPitch}
                  onChange={(e) => setSpeechPitch(e.target.value)}
                  aria-label="Speech pitch"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="voice-actions">
              <button
                className={`voice-speak-btn ${isSpeaking ? 'speaking' : ''}`}
                id="speak-btn"
                onClick={handleSpeak}
                aria-label={isSpeaking ? 'Stop speaking' : 'Speak text aloud'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
                <span id="speak-btn-text">{isSpeaking ? 'Stop' : 'Speak'}</span>
              </button>

              <button
                className="btn btn-outline"
                id="dictate-btn"
                onClick={handleToggleDictation}
                style={{ padding: '0.85rem 1.5rem', fontSize: '0.85rem' }}
                aria-label={isDictating ? 'Stop voice dictation' : 'Start voice dictation'}
                title="Dictate text (hands-free)"
              >
                <span id="dictate-btn-text">
                  🎤 {isDictating ? 'Stop' : 'Dictate'}
                </span>
              </button>

              <button
                className={`btn btn-outline`}
                id="realtime-btn"
                onClick={() => setIsRealTimeVoice(!isRealTimeVoice)}
                style={{ 
                  padding: '0.85rem 1.5rem', 
                  fontSize: '0.85rem',
                  background: isRealTimeVoice ? 'var(--accent-glow)' : 'transparent',
                  borderColor: isRealTimeVoice ? 'var(--accent)' : 'var(--border)',
                  color: isRealTimeVoice ? 'var(--accent)' : 'var(--text-soft)',
                }}
                aria-label={isRealTimeVoice ? 'Disable real-time voice' : 'Enable real-time voice'}
                title="Auto-speak as you type"
              >
                Real-Time
              </button>

              <button
                className="btn btn-outline"
                onClick={handleClearText}
                style={{ padding: '0.85rem 1.5rem', fontSize: '0.85rem' }}
                aria-label="Clear text"
              >
                Clear
              </button>
            </div>

            {/* Quick Phrases */}
            <div className="quick-phrases" role="group" aria-label="Quick phrases">
              <span style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                alignSelf: 'center',
              }}>Quick:</span>
              <div id="quick-phrases-container" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', flex: 1 }}>
                {displayPhrases.map((phrase, idx) => (
                  <button
                    key={idx}
                    className="phrase-btn"
                    onClick={() => handleQuickPhrase(phrase)}
                    title={`Say: ${phrase}`}
                  >
                    {phrase}
                  </button>
                ))}
              </div>
              <button
                className="phrase-manage-btn"
                onClick={() => setIsModalOpen(true)}
                aria-label="Manage custom quick phrases"
              >
                + Custom
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Overlay */}
      <div
        className={`modal-overlay ${isModalOpen ? 'active' : ''}`}
        id="phrase-modal-overlay"
        onClick={() => setIsModalOpen(false)}
        aria-hidden={!isModalOpen}
        style={{ display: isModalOpen ? 'flex' : 'none' }}
      ></div>

      {/* Modal */}
      <div
        className="modal-overlay"
        id="phrase-modal-container"
        style={{ display: isModalOpen ? 'flex' : 'none', zIndex: '10000' }}
        aria-hidden={!isModalOpen}
      >
        <div
          className="custom-phrases-modal"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-labelledby="phrase-modal-title"
          aria-modal="true"
        >
          <div className="modal-header">
            <h3 className="modal-title" id="phrase-modal-title">
              Custom Quick Phrases
            </h3>
            <button
              className="modal-close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-soft)',
              marginBottom: '1rem',
            }}>
              Add or manage your custom quick phrases for faster communication:
            </p>
            <div className="phrase-input-group">
              <input
                type="text"
                className="phrase-input"
                id="phrase-input"
                value={newPhrase}
                onChange={(e) => setNewPhrase(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddPhrase()}
                placeholder="Enter a quick phrase..."
                aria-label="New quick phrase text"
              />
              <button
                className="modal-btn"
                onClick={handleAddPhrase}
                aria-label="Add new phrase"
              >
                Add
              </button>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Default phrases are used if no custom phrases are added.
            </p>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <button
              className="btn btn-outline"
              onClick={handleResetPhrases}
              style={{ padding: '0.65rem 1rem', fontSize: '0.8rem', flex: 1 }}
              aria-label="Reset to default phrases"
            >
              Reset to Defaults
            </button>
            <button
              className="btn btn-outline"
              onClick={handleResetPhrases}
              style={{
                padding: '0.65rem 1rem',
                fontSize: '0.8rem',
                flex: 1,
                borderColor: 'var(--red)',
                color: 'var(--red)',
              }}
              aria-label="Clear all phrases"
            >
              Clear All
            </button>
          </div>

          {/* Phrase List */}
          {customPhrases.length > 0 && (
            <div className="phrase-list">
              {customPhrases.map((phrase, idx) => (
                <div key={idx} className="phrase-item">
                  <span className="phrase-item-text">{phrase}</span>
                  <button
                    className="phrase-item-btn delete"
                    onClick={() => handleDeletePhrase(idx)}
                    aria-label={`Delete phrase: ${phrase}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {customPhrases.length === 0 && (
            <div className="empty-state">
              No custom phrases yet. Add one above to get started!
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VoicePanel;
