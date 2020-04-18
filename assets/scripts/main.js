"use strict";

// Clear the viewport.
function clearViewport() {
    document.getElementById("viewport-screen").textContent = "";
}

// Pop a character off the viewport string.
function popChar() {
    const viewport_obj = document.getElementById("viewport-screen");
    const expression = viewport_obj.textContent;
    const len = expression.length;
    if (0 < len) {
        viewport_obj.textContent = expression.slice(0, len - 1);
    }
}

// Push a character onto the viewport string.
function pushChar(c) {
    const viewport_obj = document.getElementById("viewport-screen");
    let expression = viewport_obj.innerHTML;
    if ("Error" === expression) {
        expression = "";
    }
    expression += c;
    viewport_obj.innerHTML = expression;
}

// Evaluate the expression in the viewport.
function evalExpression() {
    const viewport_obj = document.getElementById("viewport-screen");
    let expression = viewport_obj.textContent;
    // Do nothing if the user tries to evaluate the error message.
    if ("Error" === expression) {
        return;
    }
    // Replace unicode characters with javascript operators.
    expression = expression.replace(/[\u00F7\u00D7\u2212\u002b]/g, (c) => {
        return {
            '\u00F7': '/',
            '\u00D7': '*',
            '\u2212': '-',
            '\u002b': '+'
        }[c];
    });
    let result = "";
    try {
        result = eval(expression);
    }
    catch (err) {
        console.error(err);
        result = "Error";
    }
    finally {
        viewport_obj.textContent = result;
    }
}

// Capture keypresses and treat them as calculator inputs, if appropriate.
function handleKeypresses(event) {
    event.preventDefault();
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
    switch (event.key) {
        case '0': case '1': case '2': case '3': case '4': case '5':
        case '6': case '7': case '8': case '9': case '.':
            pushChar(event.key);
            break;
        case '/':
            pushChar('&divide;');
            break;
        case '*':
            pushChar('&times;');
            break;
        case '-':
            pushChar('&minus;');
            break;
        case '+':
            pushChar('&plus;');
            break;
        case "Del": // IE 9, IE 11, and Firefox <= v36 use "Del"
        case "Delete": 
            clearViewport();
            break;
        case "Backspace":
            popChar();
            break;
        case "Enter":
            evalExpression();
            break;
        default:
            break;
    }
    return;
}

function main() {
    // Bind calculator buttons to appropriate functions.
    document.getElementById("clear").addEventListener("click", clearViewport);
    document.getElementById("backspace").addEventListener("click", popChar);
    document.getElementById("evaluate").addEventListener("click", evalExpression);
    // All other calculator buttons represent themselves.
    const symbolic_input_list = document.getElementsByClassName("symbolic-input");
    Array.from(symbolic_input_list).forEach((elem) => {
        elem.addEventListener("click", (e) => {
            pushChar(e.target.textContent);
        });
    });
    window.addEventListener("keydown", handleKeypresses);
}

main();
