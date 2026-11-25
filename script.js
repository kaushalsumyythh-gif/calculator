(function () {
  'use strict';

  /* ---------- Calculator logic (no DOM, so it can be tested with Node.js) ---------- */

  var SYMBOLS = {
    '+': '+',
    '-': '−',
    '*': '×',
    '/': '÷'
  };

  var MAX_DIGITS = 15;

  // Performs one calculation. Returns null if the result is not a valid number
  // (for example, division by zero).
  function calculate(a, op, b) {
    var result;

    switch (op) {
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/':
        if (b === 0) {
          return null;
        }
        result = a / b;
        break;
      default:
        return null;
    }

    return isFinite(result) ? result : null;
  }

  // Removes floating point noise, so 0.1 + 0.2 shows 0.3 instead of 0.30000000000000004.
  function tidy(n) {
    return parseFloat(n.toPrecision(12));
  }

  function formatNumber(n) {
    return String(tidy(n));
  }

  function errorMessage(op, b) {
    return (op === '/' && b === 0) ? 'Cannot divide by zero' : 'Result too large';
  }

  function createCalculator() {
    var s;

    function reset() {
      s = {
        current: '0',      // the number being typed, or the last result
        previous: null,    // the first number of the pending calculation
        operator: null,    // the pending operator
        overwrite: false,  // true when the next digit should start a new number
        expression: '',    // small line shown above the main display
        error: false
      };
    }

    function fail(message, expression) {
      reset();
      s.current = message;
      s.expression = expression || '';
      s.error = true;
    }

    function digitCount(text) {
      return text.replace(/[^0-9]/g, '').length;
    }

    reset();

    return {
      digit: function (d) {
        if (s.error) { reset(); }

        if (s.overwrite) {
          if (s.operator === null) { s.expression = ''; }
          s.current = d;
          s.overwrite = false;
        } else if (s.current === '0') {
          s.current = d;
        } else if (digitCount(s.current) < MAX_DIGITS) {
          s.current += d;
        }
      },

      decimal: function () {
        if (s.error) { reset(); }

        if (s.overwrite) {
          if (s.operator === null) { s.expression = ''; }
          s.current = '0.';
          s.overwrite = false;
        } else if (s.current.indexOf('.') === -1) {
          s.current += '.';
        }
      },

      operator: function (op) {
        var value, result;

        if (s.error) { return; }

        // Pressing a second operator straight after the first just replaces it.
        if (s.operator !== null && s.overwrite) {
          s.operator = op;
          s.expression = formatNumber(s.previous) + ' ' + SYMBOLS[op];
          return;
        }

        value = parseFloat(s.current);

        if (s.operator !== null) {
          // Chained calculation: work out the pending one first (left to right).
          result = calculate(s.previous, s.operator, value);
          if (result === null) {
            fail(errorMessage(s.operator, value),
                 formatNumber(s.previous) + ' ' + SYMBOLS[s.operator] + ' ' + formatNumber(value) + ' =');
            return;
          }
          s.previous = tidy(result);
          s.current = formatNumber(result);
        } else {
          s.previous = value;
        }

        s.operator = op;
        s.overwrite = true;
        s.expression = formatNumber(s.previous) + ' ' + SYMBOLS[op];
      },

      equals: function () {
        var a, b, result, text;

        if (s.error || s.operator === null) { return; }

        a = s.previous;
        b = parseFloat(s.current);
        text = formatNumber(a) + ' ' + SYMBOLS[s.operator] + ' ' + formatNumber(b) + ' =';
        result = calculate(a, s.operator, b);

        if (result === null) {
          fail(errorMessage(s.operator, b), text);
          return;
        }

        s.current = formatNumber(result);
        s.expression = text;
        s.previous = null;
        s.operator = null;
        s.overwrite = true;
      },

      clear: function () {
        reset();
      },

      backspace: function () {
        if (s.error) { reset(); return; }
        if (s.overwrite) { return; }

        s.current = s.current.slice(0, -1);
        if (s.current === '' || s.current === '-') {
          s.current = '0';
        }
      },

      negate: function () {
        if (s.error || s.current === '0') { return; }

        s.current = s.current.charAt(0) === '-' ? s.current.slice(1) : '-' + s.current;
      },

      display: function () { return s.current; },
      expression: function () { return s.expression; },
      hasError: function () { return s.error; }
    };
  }

  var api = {
    calculate: calculate,
    formatNumber: formatNumber,
    createCalculator: createCalculator
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  if (typeof document === 'undefined') {
    return;
  }

  /* ---------- User interface ---------- */

  var calc = createCalculator();
  var displayEl = document.getElementById('display');
  var expressionEl = document.getElementById('expression');
  var keysEl = document.getElementById('keys');

  function render() {
    var text = calc.display();

    displayEl.textContent = text;
    expressionEl.textContent = calc.expression() || ' ';
    displayEl.classList.toggle('error', calc.hasError());
    displayEl.classList.toggle('small', !calc.hasError() && text.length > 11);
  }

  function perform(action, value) {
    switch (action) {
      case 'digit':     calc.digit(value);    break;
      case 'decimal':   calc.decimal();       break;
      case 'operator':  calc.operator(value); break;
      case 'equals':    calc.equals();        break;
      case 'clear':     calc.clear();         break;
      case 'backspace': calc.backspace();     break;
      case 'negate':    calc.negate();        break;
    }
    render();
  }

  // Briefly highlights the on-screen key that matches a keyboard press.
  function flash(action, value) {
    var selector = 'button[data-action="' + action + '"]';
    var buttons, i, button;

    if (value !== undefined) {
      selector += '[data-value="' + value + '"]';
    }
    buttons = keysEl.querySelectorAll(selector);

    for (i = 0; i < buttons.length; i++) {
      button = buttons[i];
      button.classList.add('pressed');
      setTimeout(function (b) { b.classList.remove('pressed'); }, 120, button);
    }
  }

  keysEl.addEventListener('click', function (event) {
    var button = event.target.closest('button[data-action]');

    if (button) {
      perform(button.getAttribute('data-action'), button.getAttribute('data-value'));
    }
  });

  document.addEventListener('keydown', function (event) {
    var key = event.key;
    var action = null;
    var value;

    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    if (/^[0-9]$/.test(key)) {
      action = 'digit';
      value = key;
    } else if (key === '.' || key === ',') {
      action = 'decimal';
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
      action = 'operator';
      value = key;
    } else if (key === 'x' || key === 'X') {
      action = 'operator';
      value = '*';
    } else if (key === 'Enter' || key === '=') {
      action = 'equals';
    } else if (key === 'Backspace') {
      action = 'backspace';
    } else if (key === 'Escape' || key === 'Delete') {
      action = 'clear';
    }

    if (action === null) {
      return;
    }

    event.preventDefault(); // stops "/" quick-find and Enter re-clicking a focused button
    perform(action, value);
    flash(action, value);
  });

  render();
})();
