let enabled = true;
const hints = [];
const hintKeys = ["KeyA","KeyS","KeyD","KeyF","KeyG","KeyH","KeyJ","KeyK","KeyL"];
const hintLabels = ["a","s","d","f","g","h","j","k","l"];
let currentInput = "";

chrome.storage.local.get("enabled", (data) => {
  enabled = data.enabled ?? true;
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    enabled = changes.enabled.newValue;
    if (!enabled) removeHints();
  }
});

document.addEventListener("keydown", (e) => {
  if (!enabled) return;

  if (hints.length > 0) {
    e.preventDefault();
    handleHintInput(e.code);
  }
});

chrome.runtime.onMessage.addListener((message) => {
  console.log("command acti")
  if (!enabled) return;

  if (message.command === "toggle-hints") {
    showHints();
  }
});

function showHints() {
  removeHints();
  const links = [...document.querySelectorAll("a, button, [role=button]")].filter(el => el.offsetParent !== null);
  
  if (links.length === 0) return;

  const hintCombinations = generateHintCombinations(links.length);
  
  links.forEach((link, index) => {
    const hint = document.createElement("span");
    hint.textContent = hintCombinations[index].label;
    hint.className = "vim-hint";
    hint.style.top = `${link.getBoundingClientRect().top + window.scrollY}px`;
    hint.style.left = `${link.getBoundingClientRect().left + window.scrollX}px`;
    document.body.appendChild(hint);
    hints.push({ key: hintCombinations[index].key, element: link, hint });
  });

  currentInput = "";
}

function handleHintInput(key) {
  currentInput += key;

  const matchingHints = hints.filter(h => h.key.startsWith(currentInput));

  if (matchingHints.length === 1 && matchingHints[0].key === currentInput) {
    matchingHints[0].element.click();
    removeHints();
  } else if (matchingHints.length === 0) {
    removeHints();
  }
}

function generateHintCombinations(count) {
  let length = 1;
  while (Math.pow(hintKeys.length, length) < count) { length++; }

  const result = [];
  let index = 0;

  function getCombination(num, len) {
    let keyCombo = "";
    let labelCombo = "";
    let added = 0;

    while (added < len) {
      const i = num % hintKeys.length;

      keyCombo = hintKeys[i] + keyCombo;
      labelCombo = hintLabels[i] + labelCombo;

      num = Math.floor(num / hintKeys.length);
      added++;
    }

    return { key: keyCombo, label: labelCombo };
  }

  while (result.length < count) {
    result.push(getCombination(index, length));
    index++;
  }

  return result;
}


function removeHints() {
  hints.forEach(({ hint }) => hint.remove());
  hints.length = 0;
  currentInput = "";
}
