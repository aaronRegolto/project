/**
 * Ishihara Plate Generator
 * Creates color blindness test plates
 */

/**
 * Generate an Ishihara-style color test plate on canvas
 * @param {HTMLCanvasElement} canvas - Target canvas element
 * @param {number} number - Number to hide in plate
 */
export const generateIshaharaPlate = (canvas, number) => {
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Background circle
  ctx.fillStyle = '#f5f5f5';
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, width / 2 - 10, 0, Math.PI * 2);
  ctx.fill();

  // Get random color palette
  const colors = getRandomColorPalette();
  const dotRadius = 8;
  const spacing = 20;

  // Generate random dots
  for (let y = 0; y < height; y += spacing) {
    for (let x = 0; x < width; x += spacing) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw hidden number
  drawNumber(ctx, number, width, height);
};

/**
 * Get a random color palette for the plate
 * @returns {array} Array of color strings
 */
const getRandomColorPalette = () => {
  const palettes = [
    ['#FF6B6B', '#FF8E72', '#FFAA50', '#FFD93D'],
    ['#4ECDC4', '#45B7D1', '#96CEB4', '#ABEBC6'],
    ['#FFD93D', '#FEC860', '#FFE66D', '#F4D03F'],
    ['#E74C3C', '#E67E22', '#F39C12', '#F1C40F'],
  ];
  return palettes[Math.floor(Math.random() * palettes.length)];
};

/**
 * Draw a number on the canvas using distinct color
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} number - Number to draw
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
const drawNumber = (ctx, number, width, height) => {
  ctx.fillStyle = '#c8a96e';
  ctx.font = 'bold 120px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(number, width / 2, height / 2);
};

/**
 * Generate random test plates
 * @param {number} count - Number of plates to generate
 * @returns {array} Array of plate objects with numbers
 */
export const generateTestPlates = (count = 10) => {
  const numbers = [12, 8, 5, 29, 74, 6, 45, 7, 16, 35];
  return numbers.slice(0, count).map((num) => ({
    number: num,
    answers: getRandomAnswers(num, 4),
  }));
};

/**
 * Generate random answer choices
 * @param {number} correct - Correct answer
 * @param {number} count - Total number of choices
 * @returns {array} Array of answer choices
 */
const getRandomAnswers = (correct, count) => {
  const answers = [correct];
  while (answers.length < count) {
    const random = Math.floor(Math.random() * 99) + 1;
    if (!answers.includes(random)) {
      answers.push(random);
    }
  }
  return answers.sort(() => Math.random() - 0.5);
};
