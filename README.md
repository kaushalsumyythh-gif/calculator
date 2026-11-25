# 🧮 Simple Calculator

A clean, interactive calculator built with **HTML, CSS and JavaScript**. It performs addition, subtraction, multiplication and division, and works with both mouse clicks and the keyboard.

![Calculator screenshot](screenshot.png)

---

## ✨ Features

- ➕➖✖️➗ **Four operations**: addition, subtraction, multiplication and division
- 🔢 **Decimal numbers** and a **± button** for negative numbers
- ⌫ **Backspace** to fix a mistake and **C** to clear everything
- 🧾 **Expression line** that shows the calculation (for example, `24 × 3.5 =`)
- 🔗 **Chained calculations**: keep pressing operators to build on the last result
- 🎯 **Accurate decimals**: `0.1 + 0.2` shows `0.3`, not `0.30000000000000004`
- 🚫 **Error handling**: dividing by zero shows a clear message and recovers on the next key press
- ⌨️ **Keyboard support**: digits, `+ - * /`, `Enter`, `Backspace` and `Esc`
- 📱 **Responsive design** for phones and desktops
- ♿ **Accessible**: labelled buttons, screen-reader friendly display and visible keyboard focus

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `0`-`9` | Enter digits |
| `.` or `,` | Decimal point |
| `+` `-` `*` `/` (or `x`) | Operators |
| `Enter` or `=` | Calculate |
| `Backspace` | Delete the last digit |
| `Esc` or `Delete` | Clear everything |

---

## 🛠️ Tech Stack

- **HTML5** for the structure
- **CSS3** for the layout (CSS Grid), colours and button effects
- **JavaScript (ES5, no libraries)** for the calculator logic, DOM updates and keyboard events

---

## 📁 Project Structure

```
simple-calculator/
├── index.html      # Calculator layout
├── style.css       # Styling
├── script.js       # Calculator logic and interface code
├── screenshot.png  # Preview image used in this README
└── README.md       # Project documentation
```

---

## ▶️ How to Run

No installation needed.

1. Download or clone the repository
   ```bash
   git clone https://github.com/<your-username>/simple-calculator.git
   ```
2. Open `index.html` in any web browser.

---

## 🌐 Deploy on GitHub Pages (free hosting)

1. Upload all the files to a GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose the **main** branch and the **/ (root)** folder, then click **Save**.
5. After a minute, your calculator is live at:
   `https://<your-username>.github.io/<repo-name>/`

---

## ⚙️ How It Works

- `calculate(a, operator, b)` performs one operation and returns `null` when the result is not valid, such as dividing by zero.
- `createCalculator()` holds the calculator's state (current number, previous number, pending operator) and exposes simple actions: `digit`, `decimal`, `operator`, `equals`, `clear`, `backspace` and `negate`.
- The interface code reads button clicks (using a `data-action` attribute on each button) and keyboard events, calls the matching action, and then redraws the display.
- Calculations are worked out **left to right**, like a basic pocket calculator. For example, `2 + 3 × 4` gives `20` (not `14`).
- Numbers are rounded to 12 significant digits to remove floating-point noise, and input is limited to 15 digits.

The logic is separate from the screen code, so it can be tested without a browser. It was checked with 46 test cases (all four operations, decimals, chaining, negative numbers, backspace, divide by zero and recovery, and digit limits), and the interface was checked in a real browser with clicks and keyboard input.

---

## 🚀 Future Improvements

- Percentage and square-root buttons
- Calculation history panel
- Memory keys (M+, M-, MR, MC)
- Light and dark theme toggle
- Operator precedence mode (multiply and divide before add and subtract)

---

## 🙏 Acknowledgement

Thank you to **[Sir's Name]** for the guidance and support throughout this project.

---

## 👤 Author

**[Your Name]**
🔗 [LinkedIn](https://www.linkedin.com/in/your-profile) | 💻 [GitHub](https://github.com/your-username)

---

⭐ If you found this project useful, consider giving it a star!
