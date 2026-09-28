const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentInput = '0';
let previousValue = null;
let operator = null;
let waitingForNewValue = false;

function updateDisplay() {
  display.textContent = currentInput;
}

function inputDigit(digit) {
  if (waitingForNewValue) {
    currentInput = digit;
    waitingForNewValue = false;
  } else {
    currentInput = currentInput === '0' ? digit : currentInput + digit;
  }

  updateDisplay();
}

function inputDecimal() {
  if (waitingForNewValue) {
    currentInput = '0.';
    waitingForNewValue = false;
    updateDisplay();
    return;
  }

  if (!currentInput.includes('.')) {
    currentInput += '.';
    updateDisplay();
  }
}

function performCalculation(nextOperator) {
  const inputValue = Number(currentInput);

  if (previousValue === null) {
    previousValue = inputValue;
  } else if (operator) {
    const result = evaluate(previousValue, inputValue, operator);
    currentInput = String(result);
    previousValue = result;
  }

  operator = nextOperator;
  waitingForNewValue = true;
}

function evaluate(first, second, op) {
  switch (op) {
    case '+':
      return first + second;
    case '-':
      return first - second;
    case '*':
      return first * second;
    case '/':
      return second === 0 ? 'Hata' : first / second;
    default:
      return second;
  }
}

function clearAll() {
  currentInput = '0';
  previousValue = null;
  operator = null;
  waitingForNewValue = false;
  updateDisplay();
}

function deleteLast() {
  if (waitingForNewValue) return;

  currentInput = currentInput.length <= 1 ? '0' : currentInput.slice(0, -1);
  updateDisplay();
}

function calculatePercentage() {
  currentInput = String(Number(currentInput) / 100);
  updateDisplay();
}

function calculateResult() {
  if (operator === null || waitingForNewValue) {
    return;
  }

  const inputValue = Number(currentInput);
  const result = evaluate(previousValue, inputValue, operator);

  currentInput = String(result);
  previousValue = null;
  operator = null;
  waitingForNewValue = true;
  updateDisplay();
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;
    const action = button.dataset.action;

    if (value !== undefined) {
      if (['+', '-', '*', '/'].includes(value)) {
        performCalculation(value);
        return;
      }

      if (value === '.') {
        inputDecimal();
        return;
      }

      inputDigit(value);
      return;
    }

    switch (action) {
      case 'clear':
        clearAll();
        break;
      case 'delete':
        deleteLast();
        break;
      case 'percent':
        calculatePercentage();
        break;
      case 'calculate':
        calculateResult();
        break;
      default:
        break;
    }
  });
});

updateDisplay();
