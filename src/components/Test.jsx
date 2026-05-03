import { useState, useEffect, useMemo, useRef } from 'react'

const plates = [
  { img: '/plates/plate1.png', answer: 71 },
  { img: '/plates/plate2.jpg', answer: 6 },
  { img: '/plates/plate3.jpg', answer: 26 },
  { img: '/plates/plate4.jpg', answer: 12 },
  { img: '/plates/plate5.jpg', answer: 2 },
  { img: '/plates/plate6.jpg', answer: 96 },
  { img: '/plates/plate7.jpg', answer: 29 },
  { img: '/plates/plate8.jpg', answer: 5 },
  { img: '/plates/plate9.avif', answer: 8 },
  { img: '/plates/plate10.png', answer: 1 }
]

const shufflePlates = (array) => {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const buildAnswerGrid = (plateIdx, plateOrder) => {
  if (!plateOrder[plateIdx]) return []
  const correct = plateOrder[plateIdx].answer
  const options = new Set([correct])
  const distractors = [
    correct + 1, correct - 1, correct + 2, correct - 2,
    correct + 10, correct - 10, Math.round(correct * 1.5),
    Math.max(1, correct - 20), correct + 5, correct - 5
  ]
  distractors.forEach(d => {
    if (options.size < 5 && d > 0 && d < 100) options.add(d)
  })
  while (options.size < 5) options.add(Math.floor(Math.random() * 80) + 1)
  return [...options].sort(() => Math.random() - 0.5)
}

const Test = () => {
  const [testStarted, setTestStarted] = useState(false)
  const [plateOrder, setPlateOrder] = useState(plates)
  const [currentPlate, setCurrentPlate] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [testCompleted, setTestCompleted] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const canvasRef = useRef(null)

  const visibleOptions = useMemo(() => buildAnswerGrid(currentPlate, plateOrder), [currentPlate, plateOrder])

  useEffect(() => {
    if (testStarted && !testCompleted && plateOrder[currentPlate]) {
      showPlate(currentPlate)
      setSelectedAnswer(null)
      setRevealed(false)
    }
  }, [currentPlate, testStarted, testCompleted, plateOrder])

  const showPlate = (idx) => {
    const plate = plateOrder[idx]
    const canvas = canvasRef.current
    if (!canvas || !plate) return
    const ctx = canvas.getContext('2d')
    canvas.width = 340
    canvas.height = 340
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const img = new window.Image()
    img.onload = function () {
      const cw = canvas.width
      const ch = canvas.height
      const scale = Math.min(cw / img.width, ch / img.height)
      const nw = img.width * scale
      const nh = img.height * scale
      const x = (cw - nw) / 2
      const y = (ch - nh) / 2
      ctx.clearRect(0, 0, cw, ch)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, x, y, nw, nh)
    }
    img.src = plate.img
  }

  const startTest = () => {
    setPlateOrder(shufflePlates(plates))
    setCurrentPlate(0)
    setUserAnswers([])
    setTestStarted(true)
    setTestCompleted(false)
    setSelectedAnswer(null)
    setRevealed(false)
  }

  const advancePlate = () => {
    if (currentPlate >= plateOrder.length - 1) {
      setTestCompleted(true)
    } else {
      setCurrentPlate(currentPlate + 1)
    }
  }

  const submitAnswer = (num) => {
    if (revealed) return
    const plate = plateOrder[currentPlate]
    const correct = num === plate.answer
    setUserAnswers([...userAnswers, { given: num, expected: plate.answer, correct }])
    setSelectedAnswer(num)
    setRevealed(true)
    setTimeout(advancePlate, 1200)
  }

  const cantSee = () => {
    if (revealed) return
    const plate = plateOrder[currentPlate]
    setUserAnswers([...userAnswers, { given: null, expected: plate.answer, correct: false }])
    setSelectedAnswer(null)
    setRevealed(true)
    setTimeout(advancePlate, 1200)
  }

  const showResult = () => {
    const correctCount = userAnswers.filter(a => a.correct).length
    const score = Math.round((correctCount / plateOrder.length) * 100)
    let diag
    if (score >= 80) {
      diag = 'Your color vision appears to be normal or near-normal. You were able to distinguish the hidden numbers in most plates. However, this is only a screening tool—minor deficiencies may not be detected.'
    } else if (score >= 50) {
      diag = 'You may have a mild color vision deficiency. Some plates were difficult for you to read. This could indicate mild red-green color blindness (deuteranomaly or protanomaly). A professional eye examination is recommended.'
    } else {
      diag = 'Your results suggest a significant color vision deficiency. Many plates were difficult to distinguish. This may indicate deuteranopia, protanopia, or another color vision deficiency. Please consult an eye care professional for an accurate diagnosis.'
    }
    return { correct: correctCount, score, diag }
  }

  const restartTest = () => {
    setTestStarted(false)
    setCurrentPlate(0)
    setUserAnswers([])
    setTestCompleted(false)
    setSelectedAnswer(null)
    setRevealed(false)
  }

  const result = testCompleted ? showResult() : null

  return (
    <div className="container">
      <div className="section-eyebrow reveal">Interactive Experience</div>
      <h2 className="section-title reveal reveal-delay-1" id="test-title">Color Blind <em>Test</em></h2>
      <p className="section-desc reveal reveal-delay-2">Take an Ishihara-inspired color vision test. Look at each plate and identify the number hidden inside. Your results may indicate color vision deficiency.</p>

      <div className={`test-intro ${testStarted ? 'hidden' : ''}`} id="test-intro">
        <div className="test-intro-grid reveal">
          <div className="card">
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>10</div>
            <div style={{ fontWeight: '600', marginBottom: '0.4rem' }}>Plates Total</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Each showing a number hidden within a pattern of colored dots</div>
          </div>
          <div className="card">
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '0.5rem' }}></div>
            <div style={{ fontWeight: '600', marginBottom: '0.4rem' }}>No Time Limit</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Take your time. No rush so you don't strain your eyes</div>
          </div>
          <div className="card">
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '0.5rem' }}></div>
            <div style={{ fontWeight: '600', marginBottom: '0.4rem' }}>Quick Result</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Receive a diagnosis with insights into your color vision profile</div>
          </div>
        </div>
        <div style={{ marginTop: '2rem', padding: '1.25rem 1.5rem', background: 'var(--surface)', border: '1px solid rgba(200,169,110,0.2)', borderLeft: '3px solid var(--accent)', borderRadius: '10px', maxWidth: '600px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7' }} className="reveal reveal-delay-3">
          <strong style={{ color: 'var(--accent)' }}>Note:</strong> This is an educational simulation only and is NOT a medical diagnosis. Plates are randomized each time you start the test, so the sequence will be different on each attempt. For professional evaluation, please consult an optometrist or ophthalmologist.
        </div>
        <div style={{ marginTop: '2rem' }} className="reveal reveal-delay-4">
          <button className="btn btn-primary" onClick={startTest} aria-label="Start color blind test">Begin the Test</button>
        </div>
      </div>

      <div className={`test-flow ${testStarted && !testCompleted ? 'active' : ''}`} id="test-flow" aria-live="polite">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div className="test-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax={plateOrder.length} aria-valuenow={currentPlate}>
            <div className="test-progress-fill" id="test-progress-fill" style={{ width: `${(currentPlate / plateOrder.length) * 100}%` }}></div>
          </div>
          <div className="plate-counter" id="plate-counter">Plate {currentPlate + 1} of {plateOrder.length}</div>
          <div className="plate-wrap">
            <canvas ref={canvasRef} id="plate-canvas" width="340" height="340" aria-label="Ishihara color test plate"></canvas>
          </div>
          <div className="plate-fact" id="plate-fact">Look at the pattern of dots. Can you see a number?</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-soft)', fontWeight: '500' }}>Select the number you see:</div>
          <div className="answer-grid" id="answer-grid" role="group" aria-label="Answer choices">
            {testStarted && !testCompleted && visibleOptions.map(num => {
              const plate = plateOrder[currentPlate]
              const correct = plate?.answer === num
              const selected = selectedAnswer === num
              return (
                <button
                  key={num}
                  className={`answer-btn ${revealed && correct ? 'reveal' : ''} ${selected ? (correct ? 'correct' : 'wrong') : ''} ${revealed ? 'disabled' : ''}`}
                  onClick={() => submitAnswer(num)}
                  aria-label={`Answer: ${num}`}
                  disabled={revealed}
                >
                  {num}
                </button>
              )
            })}
          </div>
          <button className="cant-see-btn" onClick={cantSee} id="cant-see-btn" disabled={revealed}>I cannot see a number</button>
        </div>
      </div>

      <div id="test-result" className={testCompleted ? 'show' : ''} role="region" aria-live="polite" aria-label="Test results">
        {result && (
          <>
            <div className="result-score" id="result-score" style={{ color: result.score >= 80 ? 'var(--green)' : result.score >= 50 ? 'var(--accent)' : 'var(--red)' }}>
              {result.score}%
            </div>
            <div className="result-label" id="result-label">{result.correct} of {plateOrder.length} plates correct</div>
            <div className="result-diagnosis" id="result-diagnosis">
              <div className="result-diagnosis-title">Assessment</div>
              <div className="result-diagnosis-text" id="result-diagnosis-text">{result.diag}</div>
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Your answers:</div>
            <div className="answers-review" id="answers-review">
              {userAnswers.map((a, i) => (
                <div key={i} className={`review-item ${a.given === null ? 'skip' : a.correct ? 'ok' : 'miss'}`} title={`Plate ${i + 1}: expected ${a.expected}, got ${a.given ?? 'skipped'}`}>
                  {a.correct ? 'ok' : (a.given === null ? '--' : a.expected)}
                </div>
              ))}
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={restartTest}>Retake Test</button>
              <a href="#simulator" className="btn btn-outline">Try Simulator</a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Test

