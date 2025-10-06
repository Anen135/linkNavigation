let enabled = true;
const hints = [];
const hintKeys = "asdfghjkl";
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
    handleHintInput(e.key);
  }
});

chrome.runtime.onMessage.addListener((message) => {
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
    hint.textContent = hintCombinations[index];
    hint.className = "vim-hint";
    hint.style.top = `${link.getBoundingClientRect().top + window.scrollY}px`;
    hint.style.left = `${link.getBoundingClientRect().left + window.scrollX}px`;
    document.body.appendChild(hint);
    hints.push({ key: hintCombinations[index], element: link, hint });
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
  const keyList = hintKeys.split("");
  let length = 1;

  while (Math.pow(keyList.length, length) < count) {
    length++;
  }

  const result = [];
  let index = 0;

  function getCombination(num, len) {
    let combo = "";
    while (combo.length < len) {
      combo = keyList[num % keyList.length] + combo;
      num = Math.floor(num / keyList.length);
    }
    return combo;
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
