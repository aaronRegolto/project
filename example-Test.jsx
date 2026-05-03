import { useState, useEffect } from 'react';
import { generateIshaharaPlate } from '../utils/plateGenerator';

/**
 * Test Component (Ishihara Color Blindness Test)
 * Demonstrates: Complex state management, useEffect for side effects, conditional rendering
 */

const Test = () => {
  const [testStarted, setTestStarted] = useState(false);
  const [currentPlate, setCurrentPlate] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [testCompleted, setTestCompleted] = useState(false);

  // Test plates data
  const plates = [
    { number: 12, answers: [12, 8, 3, 5] },
    { number: 8, answers: [8, 3, 6, 9] },
    { number: 5, answers: [5, 2, 7, 9] },
    { number: 29, answers: [29, 70, 8, 42] },
    { number: 74, answers: [74, 21, 35, 88] },
    { number: 6, answers: [6, 9, 2, 5] },
    { number: 45, answers: [45, 94, 23, 15] },
    { number: 7, answers: [7, 1, 3, 9] },
    { number: 16, answers: [16, 35, 9, 4] },
    { number: 35, answers: [35, 88, 58, 23] },
  ];

  const introCards = [
    {
      number: '10',
      title: 'Plates Total',
      description: 'Each showing a number hidden within a pattern of colored dots',
    },
    {
      title: 'No Time Limit',
      description: 'Take your time. No rush so you don\'t strain your eyes',
    },
    {
      title: 'Quick Result',
      description: 'Receive a diagnosis with insights into your color vision profile',
    },
  ];

  // Generate plate on component mount or when current plate changes
  useEffect(() => {
    if (testStarted && !testCompleted && currentPlate < plates.length) {
      const canvas = document.getElementById('plate-canvas');
      if (canvas) {
        generateIshaharaPlate(canvas, plates[currentPlate].number);
      }
    }
  }, [currentPlate, testStarted, testCompleted]);

  const handleStartTest = () => {
    setTestStarted(true);
    setCurrentPlate(0);
    setAnswers([]);
    setTestCompleted(false);
  };

  const handleAnswerSelect = (answer) => {
    const isCorrect = answer === plates[currentPlate].number;
    const newAnswers = [
      ...answers,
      {
        plateNumber: plates[currentPlate].number,
        userAnswer: answer,
        isCorrect,
      },
    ];
    setAnswers(newAnswers);

    if (currentPlate < plates.length - 1) {
      setCurrentPlate(currentPlate + 1);
    } else {
      setTestCompleted(true);
    }
  };

  const handleCantSee = () => {
    const newAnswers = [
      ...answers,
      {
        plateNumber: plates[currentPlate].number,
        userAnswer: null,
        isCorrect: false,
        skipped: true,
      },
    ];
    setAnswers(newAnswers);

    if (currentPlate < plates.length - 1) {
      setCurrentPlate(currentPlate + 1);
    } else {
      setTestCompleted(true);
    }
  };

  const handleRestartTest = () => {
    setTestStarted(false);
    setCurrentPlate(0);
    setAnswers([]);
    setTestCompleted(false);
  };

  // Calculate results
  const calculateResults = () => {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const totalPlates = plates.length;
    const percentage = (correctCount / totalPlates) * 100;

    let diagnosis = 'Normal Color Vision';
    let description = 'You correctly identified most or all of the numbers. Your color vision appears to be within the normal range.';

    if (percentage < 50) {
      diagnosis = 'Possible Color Vision Deficiency';
      description = 'You had difficulty identifying several numbers. This may indicate a color vision deficiency. We recommend consulting an eye care professional for a comprehensive evaluation.';
    }

    return { correctCount, totalPlates, percentage, diagnosis, description };
  };

  const results = testCompleted ? calculateResults() : null;

  // Render intro section
  if (!testStarted) {
    return (
      <section id="test" className="section" aria-labelledby="test-title">
        <div className="container">
          <div className="section-eyebrow reveal">Interactive Experience</div>
          <h2 className="section-title reveal reveal-delay-1" id="test-title">
            Color Blind <em>Test</em>
          </h2>
          <p className="section-desc reveal reveal-delay-2">
            Take an Ishihara-inspired color vision test. Look at each plate and identify 
            the number hidden inside. Your results may indicate color vision deficiency.
          </p>

          <div className="test-intro" id="test-intro">
            <div className="test-intro-grid reveal">
              {introCards.map((card, idx) => (
                <div key={idx} className="card">
                  {card.number && (
                    <div
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '2.5rem',
                        color: 'var(--accent)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {card.number}
                    </div>
                  )}
                  <div style={{ fontWeight: '600', marginBottom: '0.4rem' }}>
                    {card.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {card.description}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: '2rem',
                padding: '1.25rem 1.5rem',
                background: 'var(--surface)',
                border: '1px solid rgba(200,169,110,0.2)',
                borderLeft: '3px solid var(--accent)',
                borderRadius: '10px',
                maxWidth: '600px',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                lineHeight: '1.7',
              }}
              className="reveal reveal-delay-3"
            >
              <strong style={{ color: 'var(--accent)' }}>Note:</strong> This is an 
              educational simulation only and is NOT a medical diagnosis. For professional 
              evaluation, please consult an optometrist or ophthalmologist.
            </div>

            <div style={{ marginTop: '2rem' }} className="reveal reveal-delay-4">
              <button
                className="btn btn-primary"
                onClick={handleStartTest}
                aria-label="Start color blind test"
              >
                Begin the Test
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Render test in progress
  if (testStarted && !testCompleted) {
    const plate = plates[currentPlate];
    const progress = ((currentPlate) / plates.length) * 100;
    const possibleAnswers = plate.answers;

    return (
      <section id="test" className="section" aria-labelledby="test-title">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            {/* Progress Bar */}
            <div className="test-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="10" aria-valuenow={currentPlate}>
              <div className="test-progress-fill" style={{ width: `${progress}%` }}></div>
            </div>

            {/* Plate Counter */}
            <div className="plate-counter" id="plate-counter">
              Plate {currentPlate + 1} of {plates.length}
            </div>

            {/* Canvas for plate */}
            <div className="plate-wrap">
              <canvas
                id="plate-canvas"
                width="340"
                height="340"
                aria-label="Ishihara color test plate"
              ></canvas>
            </div>

            {/* Instruction */}
            <div className="plate-fact" id="plate-fact">
              Look at the pattern of dots. Can you see a number?
            </div>

            <div style={{ fontSize: '0.9rem', color: 'var(--text-soft)', fontWeight: '500' }}>
              Select the number you see:
            </div>

            {/* Answer Grid */}
            <div className="answer-grid" id="answer-grid" role="group" aria-label="Answer choices">
              {possibleAnswers.map(answer => (
                <button
                  key={answer}
                  className="answer-btn"
                  onClick={() => handleAnswerSelect(answer)}
                  aria-label={`Answer ${answer}`}
                >
                  {answer}
                </button>
              ))}
            </div>

            {/* Can't See Button */}
            <button
              className="cant-see-btn"
              onClick={handleCantSee}
              id="cant-see-btn"
            >
              I cannot see a number
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Render results
  if (testCompleted && results) {
    return (
      <section id="test" className="section" aria-labelledby="test-title">
        <div className="container">
          <div id="test-result" role="region" aria-live="polite" aria-label="Test results">
            <div
              className="result-score"
              id="result-score"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '5rem',
                fontWeight: '700',
                lineHeight: '1',
                marginBottom: '0.5rem',
              }}
            >
              {results.correctCount}/{results.totalPlates}
            </div>

            <div className="result-label" id="result-label" style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              ({results.percentage.toFixed(0)}%)
            </div>

            {/* Diagnosis */}
            <div className="result-diagnosis" id="result-diagnosis" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              <div className="result-diagnosis-title" style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Assessment
              </div>
              <div className="result-diagnosis-text" id="result-diagnosis-text" style={{ fontSize: '0.95rem', color: 'var(--text-soft)', lineHeight: '1.7' }}>
                {results.diagnosis}: {results.description}
              </div>
            </div>

            {/* Answers Review */}
            <div style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Your answers:
            </div>
            <div className="answers-review" id="answers-review">
              {answers.map((answer, idx) => (
                <div
                  key={idx}
                  className={`review-item ${answer.isCorrect ? 'ok' : answer.skipped ? 'skip' : 'miss'}`}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                  }}
                  title={answer.skipped ? 'Skipped' : `Plate: ${answer.plateNumber}, Your answer: ${answer.userAnswer}`}
                >
                  {answer.skipped ? '○' : answer.isCorrect ? '✓' : '✗'}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={handleRestartTest}
                aria-label="Retake the test"
              >
                Retake Test
              </button>
              <a href="#simulator" className="btn btn-outline">
                Try Simulator
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }
};

export default Test;
