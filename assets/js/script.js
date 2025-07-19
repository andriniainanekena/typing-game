/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
let startTime = null;
let currentWordIndex = 0;
let correctChars = 0, totalCharsTyped = 0;
let timerInterval = null;
let timeLeft = 0;
let virtualInput = "";
const wordsToType = [];

const modeSelect = document.getElementById("mode");
const chronoSelect = document.getElementById("chrono");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const timerDisplay = document.getElementById("timer");
const results = document.getElementById("results");
const restartButton = document.getElementById("restart");

const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};

// Generate a random word from the selected mode
const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

// Initialize the typing test
const startTest = (wordCount = 50) => {
    wordsToType.length = 0; // Clear previous words
    wordDisplay.innerHTML = ""; // Clear display
    currentWordIndex = 0;
    correctChars = 0;
    totalCharsTyped = 0;
    virtualInput = "";
    startTime = null;
    clearInterval(timerInterval);
    document.removeEventListener("keydown", handleKeydown);
    results.classList.remove("show");
    restartButton.classList.remove("show");
    results.textContent = ""; // Clear previous results
    timerDisplay.textContent = "";

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    wordsToType.forEach((word, index) => {
        const wordSpan = document.createElement("span");
        wordSpan.classList.add("word");
        if (index === 0) wordSpan.classList.add("word-active");
        wordSpan.textContent = word;
        const spaceSpan = document.createElement("span");
        spaceSpan.textContent = " ";
        wordDisplay.appendChild(wordSpan);
        wordDisplay.appendChild(spaceSpan);
    });
    setupEventListeners();
};

// Start the timer when user begins typing
const startTimer = () => {
    if (!startTime) {
        startTime = Date.now();
        timeLeft = parseInt(chronoSelect.value);
        timerDisplay.textContent = `Temps restant: ${timeLeft}s`;
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Temps restant: ${timeLeft}s`;
            if (timeLeft <= 0) {
                endTest();
            }
        }, 1000);
    }
};

// Calculate and return WPM & accuracy
const endTest = () => {
    clearInterval(timerInterval);
        document.removeEventListener("keydown", handleKeydown);
            const elapsedTime = (Date.now() - startTime) / 1000 / 60;
                const wpm = elapsedTime > 0 ? (correctChars / 5 / elapsedTime).toFixed(2) : 0;
            const accuracy = totalCharsTyped > 0 ? ((correctChars / totalCharsTyped) * 100).toFixed(2) : 0;
        results.textContent = `WPM: ${wpm}, Accuracy: ${accuracy}%`;
    results.classList.add("show");
    restartButton.classList.add("show");
};

// Move to the next word and update stats only on spacebar press
const handleKeydown = (event) => {
    const key = event.key;
    if (key === " ") {
        event.preventDefault();
    startTimer();
        const input = virtualInput.trim();
    if (input === wordsToType[currentWordIndex]) {
        correctChars += input.length;
        totalCharsTyped += input.length;
            const currentWordSpan = wordDisplay.children[currentWordIndex * 2]; // Account for space spans
        currentWordSpan.classList.remove("word-active");
        currentWordSpan.classList.add("word-correct");
        currentWordIndex++;
            if (currentWordIndex < wordsToType.length) {
                wordDisplay.children[currentWordIndex * 2].classList.add("word-active");
                virtualInput = "";
            } else {
                endTest();
            }
        } else {
            totalCharsTyped += input.length;
            virtualInput = "";
        }
    } else if (key === "Backspace") {
        virtualInput = virtualInput.slice(0, -1);
    } else if (key.length === 1) {
        startTimer();
        virtualInput += key;
    }
};

// Event listeners
// Attach `updateWord` to `keydown` instead of `input`
    const setupEventListeners = () => {
        document.removeEventListener("keydown", handleKeydown);
        modeSelect.removeEventListener("change", handleModeChange);
        chronoSelect.removeEventListener("change", handleChronoChange);
        restartButton.removeEventListener("click", handleRestart);

        document.addEventListener("keydown", handleKeydown);
        modeSelect.addEventListener("change", handleModeChange);
        chronoSelect.addEventListener("change", handleChronoChange);
        restartButton.addEventListener("click", handleRestart);
    };

    const handleModeChange = () => startTest();
    const handleChronoChange = () => startTest();
    const handleRestart = () => startTest();


const sections = document.querySelectorAll('.section')
function afficherSection(sectionId) {
    sections.forEach(section => {
        section.classList.remove('section--active')
    })
    const targetSection = document.getElementById(sectionId)
    if (targetSection) {
        targetSection.classList.add('section--active')
        if (sectionId ==='jeu-de-typing') {
            startTest();
        }
    } else {
        console.warn(`Section "${sectionId}" introuvable, retour à l'accueil.`);
        document.getElementById('accueil').classList.add('section--active');
    }
};


document.querySelectorAll('.barre-laterale__item').forEach(item => {
    item.addEventListener('click', () => {
        const section = item.getAttribute('data-section')
        if (section) {
            afficherSection(section);
        }
    })
});


document.getElementById('start-test').addEventListener('click', () => {
    afficherSection('jeu-de-typing')
    startTest()
})

document.getElementById('start-competition').addEventListener('click', () => {
    afficherSection('jeu-de-typing')
    startTest()
})

const toggleModeButton = document.getElementById('toggle-mode')
const body = document.body;
const savedMode = localStorage.getItem('mode')

if (savedMode) {
    body.classList.add(savedMode)
    if (savedMode === 'mode-clair') {
        toggleModeButton.classList.remove('fa-moon')
        toggleModeButton.classList.add('fa-sun')
    }
}

toggleModeButton.addEventListener('click', () => {
    if (body.classList.contains('mode-clair')) {
        body.classList.remove('mode-clair')
        toggleModeButton.classList.remove('fa-sun')
        toggleModeButton.classList.add('fa-moon')
        localStorage.setItem('mode', '')
    } else {
        body.classList.add('mode-clair')
        toggleModeButton.classList.remove('fa-moon')
        toggleModeButton.classList.add('fa-sun')
        localStorage.setItem('mode', 'mode-clair')
    }
})

document
  .getElementById("inscription-btn")
  .addEventListener("click", () => afficherSection("formulaire-inscription"));
document
  .getElementById("submit-inscription")
  .addEventListener("click", () => afficherSection("accueil"));

const fonduEntrées = document.querySelectorAll('.fondu-entrée');
const observateur = new IntersectionObserver((entrées) => {
    entrées.forEach(entrée => {
    if (entrée.isIntersecting) {
        entrée.target.classList.add('visible');
    }
    });
}, { threshold: 0.1 });

fonduEntrées.forEach(élément => observateur.observe(élément));