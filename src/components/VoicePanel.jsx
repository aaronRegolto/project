import { useState, useEffect } from 'react'

const VoicePanel = () => {
  const [voiceText, setVoiceText] = useState('')
  const [speaking, setSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [realTimeMode, setRealTimeMode] = useState(false)
  const [lastSpokenText, setLastSpokenText] = useState('')
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState('')
  const [speechRate, setSpeechRate] = useState(1.0)
  const [speechPitch, setSpeechPitch] = useState(1.0)
  const [customPhrases, setCustomPhrases] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newPhrase, setNewPhrase] = useState('')
  const [recognition, setRecognition] = useState(null)

  const DEFAULT_VOICE_KEYWORDS = [
    'Google US English',
    'Microsoft Zira Desktop',
    'Samantha',
    'Alex',
    'Google UK English Female',
    'Google UK English Male'
  ]

  const DEFAULT_PHRASES = [
    'I am deaf. Please read this message.',
    'Could you please help me?',
    'Thank you very much.',
    'Please speak more slowly.',
    'Could you please write that down?',
    'I use a communication device. Please be patient.'
  ]

  useEffect(() => {
    const loadCustomPhrases = () => {
      const stored = localStorage.getItem('customQuickPhrases')
      setCustomPhrases(stored ? JSON.parse(stored) : [])
    }
    loadCustomPhrases()

    const filterVoices = (voiceList) => {
      const defaultVoice = voiceList.find((voice) =>
        DEFAULT_VOICE_KEYWORDS.some((keyword) => voice.name.toLowerCase().includes(keyword.toLowerCase()))
      )

      return defaultVoice ? [defaultVoice] : voiceList.slice(0, 1)
    }

    const populateVoices = () => {
      const synthVoices = speechSynthesis.getVoices() || []
      const selectedList = filterVoices(synthVoices)
      setVoices(selectedList)
      setSelectedVoice((prev) => {
        if (prev && selectedList.some((voice) => voice.name === prev)) return prev
        return selectedList[0]?.name || ''
      })
    }
    populateVoices()
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoices
    }

    // Speech Recognition setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const rec = new SpeechRecognition()
      rec.continuous = true
      rec.interimResults = true
      rec.lang = 'en-US'

      rec.onstart = () => {
        setIsListening(true)
      }

      rec.onresult = (event) => {
        let interimTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            setVoiceText(prev => prev + transcript + ' ')
            setLastSpokenText(prev => prev + transcript + ' ')
          } else {
            interimTranscript += transcript
          }
        }
      }

      rec.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
      }

      rec.onend = () => {
        setIsListening(false)
      }

      setRecognition(rec)
    }
  }, [])

  const speakText = (text) => {
    speechSynthesis.cancel()
    if (!text.trim()) return
    const utterance = new SpeechSynthesisUtterance(text)
    const voice = voices.find(v => v.name === selectedVoice)
    if (voice) utterance.voice = voice
    utterance.rate = speechRate
    utterance.pitch = speechPitch
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    speechSynthesis.speak(utterance)
  }

  const toggleSpeak = () => {
    if (speaking) {
      speechSynthesis.cancel()
      setSpeaking(false)
      return
    }
    const text = voiceText.trim()
    if (!text) return
    setLastSpokenText(text)
    speakText(text)
  }

  const toggleDictation = () => {
    if (!recognition) {
      alert('Speech Recognition is not supported in your browser. Please use Chrome, Firefox, or Edge.')
      return
    }

    if (isListening) {
      recognition.stop()
    } else {
      recognition.start()
    }
  }

  const toggleRealTimeVoice = () => {
    setRealTimeMode(!realTimeMode)
    if (!realTimeMode) {
      setLastSpokenText('')
    } else {
      speechSynthesis.cancel()
      setSpeaking(false)
    }
  }

  const clearVoice = () => {
    speechSynthesis.cancel()
    setSpeaking(false)
    setVoiceText('')
    setLastSpokenText('')
    if (recognition && isListening) recognition.stop()
  }

  const setPhrase = (text) => {
    setVoiceText(text)
    setLastSpokenText('')
  }

  const getDisplayPhrases = () => {
    return customPhrases.length > 0 ? customPhrases : DEFAULT_PHRASES
  }

  const openPhraseManager = () => {
    setIsModalOpen(true)
  }

  const closePhraseManager = () => {
    setIsModalOpen(false)
    setNewPhrase('')
  }

  const addCustomPhrase = () => {
    const text = newPhrase.trim()
    if (!text) {
      alert('Please enter a phrase')
      return
    }
    if (text.length > 150) {
      alert('Phrase is too long (max 150 characters)')
      return
    }
    if (customPhrases.includes(text)) {
      alert('This phrase already exists')
      return
    }
    const updated = [...customPhrases, text]
    setCustomPhrases(updated)
    localStorage.setItem('customQuickPhrases', JSON.stringify(updated))
    setNewPhrase('')
  }

  const deletePhrase = (phrase) => {
    if (confirm('Delete "' + phrase + '"?')) {
      const updated = customPhrases.filter(p => p !== phrase)
      setCustomPhrases(updated)
      localStorage.setItem('customQuickPhrases', JSON.stringify(updated))
    }
  }

  const resetToDefaults = () => {
    if (confirm('Reset to default phrases? Your custom phrases will be kept.')) {
      setCustomPhrases([])
      localStorage.setItem('customQuickPhrases', JSON.stringify([]))
    }
  }

  const clearAllPhrases = () => {
    if (confirm('Delete ALL custom phrases? This cannot be undone.')) {
      setCustomPhrases([])
      localStorage.setItem('customQuickPhrases', JSON.stringify([]))
    }
  }

  return (
    <div className="container">
      <div className="section-eyebrow reveal">Communication Aid</div>
      <h2 className="section-title reveal reveal-delay-1" id="voice-title">Text to <em>Voice</em> Panel</h2>
      <p className="section-desc reveal reveal-delay-2">Need to communicate verbally? Type your message below and have it spoken aloud. Ideal for users who are visually impaired and need assistance with reading.</p>

      <div className="voice-card reveal reveal-delay-3">
        <div className="voice-header">
          <div className="voice-icon-wrap" aria-hidden="true">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zm-1 3a1 1 0 0 1 2 0v8a1 1 0 0 1-2 0V4zm-4 5H5a7 7 0 0 0 14 0h-2a5 5 0 0 1-10 0zm4 8.93V21H9v2h6v-2h-2v-2.07A7 7 0 0 0 19 12h-2a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.93z"/>
            </svg>
          </div>
          <div className="voice-header-text">
            <h3>Voice Communication</h3>
            <p>Type a message and press Speak to convert it to audio</p>
          </div>
          <div className={`voice-wave ${!speaking ? 'idle' : ''}`} id="voice-wave" aria-hidden="true">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>

        <textarea
          className="voice-textarea"
          id="voice-text"
          placeholder="Type your message here to be spoken aloud..."
          aria-label="Text to be spoken aloud"
          value={voiceText}
          onChange={(e) => setVoiceText(e.target.value)}
        ></textarea>

        <div className="voice-controls">
          <div className="voice-control-group">
            <label>Voice</label>
            <div className="voice-select fallback">
              {voices.length > 0
                ? voices[0].name
                : 'Loading default voice...'}
            </div>
          </div>
          <div className="voice-control-group">
            <label htmlFor="voice-speed">Speed: <span id="speed-val">{speechRate.toFixed(1)}</span>x</label>
            <input
              type="range"
              className="voice-range"
              id="voice-speed"
              min="0.5"
              max="2"
              step="0.1"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              aria-label="Speech speed"
            />
          </div>
          <div className="voice-control-group">
            <label htmlFor="voice-pitch">Pitch: <span id="pitch-val">{speechPitch.toFixed(1)}</span></label>
            <input
              type="range"
              className="voice-range"
              id="voice-pitch"
              min="0.5"
              max="2"
              step="0.1"
              value={speechPitch}
              onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
              aria-label="Speech pitch"
            />
          </div>
        </div>

        <div className="voice-actions">
          <button
            className={`voice-speak-btn ${speaking ? 'speaking' : ''}`}
            id="speak-btn"
            onClick={toggleSpeak}
            aria-label="Speak text aloud"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
            <span id="speak-btn-text">{speaking ? 'Stop' : 'Speak'}</span>
          </button>
          <button
            className="btn btn-outline"
            id="dictate-btn"
            onClick={toggleDictation}
            style={{ padding: '0.85rem 1.5rem', fontSize: '0.85rem' }}
            aria-label="Start voice dictation for hands-free typing"
            title="Dictate text (hands-free)"
          >
            <span id="dictate-btn-text">🎤 {isListening ? 'Listening...' : 'Dictate'}</span>
          </button>
          <button
            className={`btn btn-outline ${realTimeMode ? 'active' : ''}`}
            id="realtime-btn"
            onClick={toggleRealTimeVoice}
            style={{ padding: '0.85rem 1.5rem', fontSize: '0.85rem' }}
            aria-label="Toggle real-time voice"
            title="Auto-speak as you type"
          >
            Real-Time
          </button>
          <button
            className="btn btn-outline"
            onClick={clearVoice}
            style={{ padding: '0.85rem 1.5rem', fontSize: '0.85rem' }}
            aria-label="Clear text"
          >
            Clear
          </button>
        </div>

        <div className="quick-phrases" role="group" aria-label="Quick phrases">
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', alignSelf: 'center' }}>Quick:</span>
          <div id="quick-phrases-container" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', flex: 1 }}>
            {getDisplayPhrases().map((phrase, i) => (
              <button
                key={i}
                className={`phrase-btn ${customPhrases.includes(phrase) ? 'custom' : ''}`}
                onClick={() => setPhrase(phrase)}
                aria-label={`Use quick phrase: ${phrase}`}
                title={phrase}
              >
                {phrase.length > 20 ? phrase.substring(0, 17) + '...' : phrase}
              </button>
            ))}
          </div>
          <button
            className="phrase-manage-btn"
            onClick={openPhraseManager}
            aria-label="Manage custom quick phrases"
          >
            + Custom
          </button>
        </div>
      </div>

      {/* Custom Quick Phrases Modal */}
      <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`} id="phrase-modal-overlay" onClick={closePhraseManager} aria-hidden={!isModalOpen}></div>
      <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`} id="phrase-modal-container" style={{ display: isModalOpen ? 'flex' : 'none', zIndex: 10000 }} aria-hidden={!isModalOpen}>
        <div className="custom-phrases-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="phrase-modal-title" aria-modal="true">
          <div className="modal-header">
            <h3 className="modal-title" id="phrase-modal-title">Custom Quick Phrases</h3>
            <button className="modal-close" onClick={closePhraseManager} aria-label="Close modal">✕</button>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', marginBottom: '1rem' }}>Add or manage your custom quick phrases for faster communication:</p>
            <div className="phrase-input-group">
              <input
                type="text"
                className="phrase-input"
                id="phrase-input"
                placeholder="Enter a quick phrase..."
                aria-label="New quick phrase text"
                value={newPhrase}
                onChange={(e) => setNewPhrase(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomPhrase()}
              />
              <button className="modal-btn" onClick={addCustomPhrase} aria-label="Add new phrase">Add</button>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Default phrases are used if no custom phrases are added.</p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <button className="btn btn-outline" onClick={resetToDefaults} style={{ padding: '0.65rem 1rem', fontSize: '0.8rem', flex: 1 }} aria-label="Reset to default phrases">Reset to Defaults</button>
            <button className="btn btn-outline" onClick={clearAllPhrases} style={{ padding: '0.65rem 1rem', fontSize: '0.8rem', flex: 1, borderColor: 'var(--red)', color: 'var(--red)' }} aria-label="Clear all phrases">Clear All</button>
          </div>

          <div className="phrase-list" role="region" aria-label="Custom phrases list">
            {customPhrases.length === 0 ? (
              <div className="empty-state">No custom phrases yet. Add one above to get started!</div>
            ) : (
              customPhrases.map((phrase, i) => (
                <div key={i} className="phrase-item">
                  <div>
                    <div className="phrase-item-label">Custom Phrase</div>
                    <div className="phrase-item-text">{phrase}</div>
                  </div>
                  <div className="phrase-item-actions">
                    <button className="phrase-item-btn" onClick={() => setPhrase(phrase)} aria-label={`Use phrase: ${phrase}`}>Use</button>
                    <button className="phrase-item-btn delete" onClick={() => deletePhrase(phrase)} aria-label={`Delete phrase: ${phrase}`}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoicePanel
