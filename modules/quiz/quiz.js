(async function() {
    // -------------------------------------------------------------------------
    // Module State Variables
    // -------------------------------------------------------------------------
    let questionDatabase = [];
    let queue = [];
    let currentQuestionIndex = -1;
    let clickCounts = {};
    let totalQuestions = 0;
    let correctCount = 0;

    // -------------------------------------------------------------------------
    // Daten dynamisch über die Registry laden
    // -------------------------------------------------------------------------
    async function loadQuestionsFromRegistry() {
        try {
            // FIX: Array vor dem Laden leeren, damit sich die Fragen bei
            // mehrfachem Öffnen des Moduls nicht duplizieren!
            questionDatabase = [];

            const response = await fetch('./modules/quiz/registryForQuestions.json');
            
            if (!response.ok) {
                console.error("Registry JSON konnte nicht geladen werden. HTTP Status:", response.status);
                return;
            }
            
            const registry = await response.json();

            for (const filePath of registry.files) {
                // FIX 2: Relativer Import-Pfad!
                // quiz_2.js liegt in /modules/quiz/ -> wir springen mit "../../" ins Projekt-Root
                // und hängen dann "modules/quiz/questions/questions00.js" an.
                const relativePath = `../../${filePath}`;
                
                try {
                    const module = await import(relativePath);
                    if (module.questionDatabase) {
                        questionDatabase = questionDatabase.concat(module.questionDatabase);
                    }
                } catch (importError) {
                    console.error(`Fehler beim Importieren von ${relativePath}:`, importError);
                }
            }
        } catch (error) {
            console.error("Allgemeiner Fehler beim Laden der Fragendatenbanken:", error);
        }
    }

    // Scoped CSS styles using the host app's CSS variables for seamless integration
    const quizStyles = `
        <style>
            #quiz-module-container {
                --ok: #03dac6;
                --warn: #cf6679;
                --card-bg: var(--bg-secondary);
                --line-color: var(--border-color);
                
                width: min(900px, 95%);
                margin: 0 auto 40px auto;
                font-family: inherit;
                color: var(--text-normal);
                line-height: 1.45;
            }
            
            #quiz-module-container .header {
                background: linear-gradient(120deg, var(--bg-secondary), var(--bg-tertiary));
                border-bottom: 3px solid var(--accent-color);
                border-radius: 12px;
                padding: 18px 20px;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
                margin-bottom: 14px;
            }
            
            #quiz-module-container .header h1 {
                margin: 0 0 8px;
                font-size: 1.6rem;
                color: var(--accent-color);
                font-weight: bold;
            }
            
            #quiz-module-container .toolbar {
                position: sticky;
                top: 0;
                z-index: 5;
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 10px;
                padding: 10px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
            
            #quiz-module-container .badge {
                display: inline-block;
                border-radius: 8px;
                padding: 6px 12px;
                font-weight: 700;
                background: var(--accent-color);
                color: #fff;
                font-size: 0.9rem;
            }
            
            #quiz-module-container .q {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                padding: 20px;
                margin-top: 16px;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            #quiz-module-container .q h3 {
                margin: 0 0 8px;
                font-size: 1.1rem;
                color: var(--accent-color);
                font-weight: 600;
            }
            
            #quiz-module-container .q p { margin: 6px 0 15px; font-size: 1.05rem; }
            
            #quiz-module-container .opts {
                display: grid;
                gap: 10px;
            }
            
            #quiz-module-container .opt {
                display: flex;
                align-items: flex-start;
                padding: 12px 15px;
                border-radius: 8px;
                background-color: var(--bg-tertiary);
                color: var(--text-normal);
                cursor: pointer;
                border: 2px solid transparent;
                transition: background-color 0.2s, border-color 0.2s;
            }
            
            #quiz-module-container .opt:hover { 
                background-color: var(--bg-primary); 
                border-color: var(--accent-color); 
            }
            
            /* Make inputs visible to support Multi Choice checks visually */
            #quiz-module-container .opt input { 
                margin-right: 12px; 
                margin-top: 4px;
                transform: scale(1.2); 
                cursor: pointer;
            }
            
            #quiz-module-container .opt.correct { background-color: var(--ok); color: #000; border-color: var(--ok); }
            #quiz-module-container .opt.incorrect { background-color: var(--warn); color: #000; border-color: var(--warn); }
            
            /* Match Dropdown Styles */
            #quiz-module-container .match-grid { display: grid; gap: 10px; }
            #quiz-module-container .match-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                align-items: center;
                background: var(--bg-tertiary);
                border-radius: 8px;
                padding: 10px 15px;
                border: 1px solid var(--border-color);
            }
            
            #quiz-module-container select {
                width: 100%;
                border: 1px solid var(--border-color);
                border-radius: 6px;
                padding: 10px;
                background: var(--bg-primary);
                color: var(--text-normal);
                font-size: 0.95rem;
                outline: none;
            }
            
            #quiz-module-container .submit-btn {
                margin-top: 15px;
                background-color: var(--accent-color);
                color: #fff;
                border: none;
                padding: 12px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                width: 100%;
                font-size: 1rem;
                transition: filter 0.2s;
            }
            #quiz-module-container .submit-btn:hover { filter: brightness(1.2); }
            
            /* Hint Styles */
            #quiz-module-container .hint-container {
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px dashed var(--border-color);
            }
            #quiz-module-container .hint-btn {
                background-color: var(--bg-tertiary);
                color: var(--text-normal);
                border: 1px solid var(--border-color);
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.85rem;
                font-weight: bold;
            }
            #quiz-module-container .hint-text {
                margin-top: 10px;
                font-size: 0.95rem;
                color: #ffb74d;
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            
            @media (max-width: 600px) {
                #quiz-module-container .match-row { grid-template-columns: 1fr; }
            }
        </style>
    `;

    const htmlTemplate = `
        ${quizStyles}
        <div id="quiz-module-container">
            <section class="header">
                <h1>theQuizDB</h1>
            </section>

            <div class="toolbar">
                <span>Wähle die richtige(n) Antwort(en).</span>
                <div style="display:flex; gap:10px;">
                    <span id="queue-status" class="badge" style="background:var(--bg-tertiary); color:var(--text-normal); border:1px solid var(--border-color);">Verbleibend: 0</span>
                    <span id="progress-status" class="badge">Richtig Beantwortet: 0 / 0</span>
                </div>
            </div>

            <div id="quiz-content-area">
                <!-- JS rendered questions go here -->
            </div>
        </div>
    `;

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function updateQueueStatus() {
        const statusEl = document.getElementById('queue-status');
        if (statusEl) {
            statusEl.textContent = `Verbleibend in Queue: ${queue.length}`;
        }
        const progressEl = document.getElementById('progress-status');
        if (progressEl) {
            progressEl.textContent = `Richtig Beantwortet: ${correctCount} / ${totalQuestions}`;
        }
    }

    // Hilfsfunktion: Zeigt den Weiter-Button an
    function showNextButton(isCorrect, containerElement) {
        const btn = document.createElement("button");
        btn.textContent = "Weiter";
        btn.className = "submit-btn";
        btn.style.marginTop = "20px";
        btn.style.backgroundColor = "var(--accent-color)";
        
        btn.onclick = () => {
            processSpacedRepetition(isCorrect);
        };
        containerElement.appendChild(btn);
        
        // Scrollt leicht nach unten, falls die Box sehr groß ist
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function renderNextQuestion() {
        const container = document.getElementById('quiz-content-area');
        if (!container) return;

        container.innerHTML = ""; 

        if (queue.length === 0) {
            container.innerHTML = `
                <div class="q" style="text-align:center; padding: 40px;">
                    <h2 style="color:var(--ok); font-size:2rem; margin-bottom:10px;">Glückwunsch!</h2>
                    <p>Du hast alle Fragen erfolgreich in deinem Gedächtnis verankert.</p>
                    <button id="quiz-restart-btn" class="submit-btn" style="width: auto; margin-top:20px;">Deck neu starten</button>
                </div>
            `;
            document.getElementById('quiz-restart-btn').addEventListener('click', startQuizData);
            return;
        }

        currentQuestionIndex = queue[0];
        const q = questionDatabase[currentQuestionIndex];
        clickCounts[q.id] = 0;

        const card = document.createElement("div");
        card.className = "q";
        
        const title = document.createElement("h3");
        title.textContent = q.title;
        card.appendChild(title);

        const text = document.createElement("p");
        text.textContent = q.text;
        card.appendChild(text);

        // Render Single Choice
        if (q.type === "single") {
            const optsContainer = document.createElement("div");
            optsContainer.className = "opts";
            
            // Map to keep track of the original index for evaluating numbers
            const mappedOptions = q.options.map((text, i) => ({text, originalIndex: i}));
            shuffleArray(mappedOptions);

            mappedOptions.forEach((optObj) => {
                const label = document.createElement("label");
                label.className = "opt";
                
                const input = document.createElement("input");
                input.type = "radio";
                input.name = q.id;
                input.value = optObj.originalIndex;
                
                label.appendChild(input);
                
                const span = document.createElement("span");
                span.textContent = optObj.text;
                label.appendChild(span);
                
                optsContainer.appendChild(label);

                label.addEventListener('click', (e) => {
                     // Prevent action if already answered
                     if(optsContainer.querySelector('.correct') || optsContainer.querySelector('.incorrect')) {
                         e.preventDefault();
                         return;
                     }
                     input.checked = true;
                     
                     const selectedVal = parseInt(input.value);
                     // Check against Index or String value depending on DB format
                     const isCorrect = (typeof q.answer === 'number') ? selectedVal === q.answer : optObj.text === q.answer;
                     
                     if (isCorrect) {
                         label.classList.add('correct');
                     } else {
                         label.classList.add('incorrect');
                     }

                     // Highlight the actual correct answer
                     const allLabels = optsContainer.querySelectorAll('.opt');
                     allLabels.forEach(l => {
                         const val = parseInt(l.querySelector('input').value);
                         const isActualCorrect = (typeof q.answer === 'number') ? val === q.answer : l.querySelector('span').textContent === q.answer;
                         if (isActualCorrect) {
                             l.classList.add('correct');
                         }
                         l.querySelector('input').disabled = true;
                     });

                     showNextButton(isCorrect, card);
                });
            });
            card.appendChild(optsContainer);
        } 
        
        // Render Multiple Choice
        else if (q.type === "multi") {
            const optsContainer = document.createElement("div");
            optsContainer.className = "opts";
            
            const mappedOptions = q.options.map((text, i) => ({text, originalIndex: i}));
            shuffleArray(mappedOptions);

            mappedOptions.forEach((optObj) => {
                const label = document.createElement("label");
                label.className = "opt";
                
                const input = document.createElement("input");
                input.type = "checkbox";
                input.name = q.id;
                input.value = optObj.originalIndex;
                
                label.appendChild(input);
                
                const span = document.createElement("span");
                span.textContent = optObj.text;
                label.appendChild(span);
                
                optsContainer.appendChild(label);
            });
            card.appendChild(optsContainer);

            const submitBtn = document.createElement("button");
            submitBtn.textContent = "Antworten prüfen";
            submitBtn.className = "submit-btn";
            submitBtn.onclick = () => {
                // Prevent multi-submit
                if(optsContainer.querySelector('.correct') || optsContainer.querySelector('.incorrect')) return; 
                
                const selectedIndices = Array.from(optsContainer.querySelectorAll('input:checked')).map(cb => parseInt(cb.value));
                const correctIndices = q.answer; // Array of correct indices
                
                // Compare arrays
                const isCorrect = selectedIndices.length === correctIndices.length && selectedIndices.every(val => correctIndices.includes(val));
                
                // Highlight options visually
                const allLabels = optsContainer.querySelectorAll('.opt');
                allLabels.forEach(l => {
                    const cb = l.querySelector('input');
                    const val = parseInt(cb.value);
                    const isSelected = cb.checked;
                    const isActuallyCorrect = correctIndices.includes(val);
                    
                    cb.disabled = true;
                    
                    if (isActuallyCorrect) {
                        l.classList.add('correct'); // Should have been checked
                    } else if (isSelected && !isActuallyCorrect) {
                        l.classList.add('incorrect'); // Wrongly checked
                    }
                });
                
                submitBtn.style.display = 'none';
                showNextButton(isCorrect, card);
            };
            card.appendChild(submitBtn);
        }

        // Render Matching Dropdowns
        else if (q.type === "match") {
            const grid = document.createElement("div");
            grid.className = "match-grid";
            
            q.left.forEach((leftText, i) => {
                const row = document.createElement("div");
                row.className = "match-row";
                
                const l = document.createElement("div");
                l.textContent = leftText;
                l.style.fontWeight = "bold";
                
                const s = document.createElement("select");
                
                const empty = document.createElement("option");
                empty.value = "";
                empty.textContent = "-- Zuordnen --";
                s.appendChild(empty);
                
                const shuffledChoices = [...q.choices];
                shuffleArray(shuffledChoices);

                shuffledChoices.forEach((choice) => {
                    const o = document.createElement("option");
                    o.value = choice;
                    o.textContent = choice;
                    s.appendChild(o);
                });
                
                row.appendChild(l);
                row.appendChild(s);
                grid.appendChild(row);
            });
            card.appendChild(grid);

            const submitBtn = document.createElement("button");
            submitBtn.textContent = "Antworten prüfen";
            submitBtn.className = "submit-btn";
            submitBtn.onclick = () => {
                let allCorrect = true;
                const selects = grid.querySelectorAll('select');
                
                selects.forEach((select, index) => {
                    const selectedValue = select.value;
                    const correctAnswer = q.answer[index];
                    
                    if (selectedValue === correctAnswer) {
                        select.style.borderColor = "var(--ok)";
                        select.style.color = "var(--ok)";
                    } else {
                        select.style.borderColor = "var(--warn)";
                        select.style.color = "var(--warn)";
                        allCorrect = false;
                    }
                    select.disabled = true; 
                });

                submitBtn.style.display = 'none';
                showNextButton(allCorrect, card);
            };
            card.appendChild(submitBtn);
        }

        // Render Open / Research Questions
        else if (q.type === "open") {
            const openContainer = document.createElement("div");
            openContainer.style.marginTop = "15px";
            
            const submitBtn = document.createElement("button");
            submitBtn.textContent = "Lösung anzeigen";
            submitBtn.className = "submit-btn";
            
            openContainer.appendChild(submitBtn);
            card.appendChild(openContainer);
            
            submitBtn.onclick = () => {
                openContainer.innerHTML = `
                    <div style="background:var(--bg-tertiary); padding:15px; border-radius:8px; border:1px solid var(--ok); margin-bottom:15px;">
                        <strong>Lösung:</strong><br>${q.answer}
                    </div>
                    <div style="text-align:center; font-weight:bold; margin-bottom:10px;">Hast du es gewusst oder erfolgreich recherchiert?</div>
                    <div style="display:flex; gap:10px;">
                        <button class="submit-btn" style="background:var(--ok); color:#000; margin-top:0;" id="btn-open-yes">Ja</button>
                        <button class="submit-btn" style="background:var(--warn); color:#000; margin-top:0;" id="btn-open-no">Nein</button>
                    </div>
                `;
                
                document.getElementById('btn-open-yes').onclick = () => {
                    openContainer.style.pointerEvents = 'none';
                    processSpacedRepetition(true);
                };
                document.getElementById('btn-open-no').onclick = () => {
                    openContainer.style.pointerEvents = 'none';
                    processSpacedRepetition(false);
                };
            };
        }


        if (q.hints && q.hints.length > 0) {
            const hintContainer = document.createElement("div");
            hintContainer.className = "hint-container";
            
            const hintBtn = document.createElement("button");
            hintBtn.textContent = "💡 Hint anzeigen";
            hintBtn.className = "hint-btn";
            
            const hintText = document.createElement("div");
            hintText.className = "hint-text";

            hintBtn.onclick = () => {
                clickCounts[q.id]++;
                const count = clickCounts[q.id];
                
                if (count <= q.hints.length) {
                    const newHint = document.createElement('span');
                    newHint.innerHTML = `<strong>Tipp ${count}:</strong> ${q.hints[count-1]}`;
                    hintText.appendChild(newHint);
                }
                
                if (count >= q.hints.length) {
                    hintBtn.style.display = 'none';
                } else {
                    hintBtn.textContent = `💡 Weiterer Hint (${q.hints.length - count} übrig)`;
                }
            };

            hintContainer.appendChild(hintBtn);
            hintContainer.appendChild(hintText);
            card.appendChild(hintContainer);
        }

        container.appendChild(card);
    }

    function processSpacedRepetition(isCorrect) {
        const currentQIndex = queue.shift();

        if (isCorrect) {
            // Richtig: Zähler erhöhen. Frage ist endgültig aus der Queue entfernt!
            correctCount++;
        } else {
            // Falsch: In die Mitte der Queue setzen, um sie später zu wiederholen
            const insertIndex = Math.max(1, Math.floor(queue.length / 2));
            queue.splice(insertIndex, 0, currentQIndex);
        }

        updateQueueStatus();
        renderNextQuestion(); 
    }


    function startQuizData() {
        if (questionDatabase.length === 0) {
            document.getElementById('quiz-content-area').innerHTML = "<p>Keine Fragen gefunden.</p>";
            return;
        }

        // Create initial queue of indices and shuffle
        queue = questionDatabase.map((_, i) => i);
        shuffleArray(queue);
        clickCounts = {};
        totalQuestions = questionDatabase.length;
        correctCount = 0;
        updateQueueStatus();
        renderNextQuestion();
    }

    async function initModule() {
        // 1. Fragen aus der JSON-Registry laden
        await loadQuestionsFromRegistry();

        // 2. Render into host canvas
        window.AppAPI.canvas.setContent(htmlTemplate);
        
        // 3. Start logic
        startQuizData();
    }

    if (window.AppAPI && window.AppAPI.sidebar) {
        window.AppAPI.sidebar.addEntry(
            'quiz-module',
            'Quiz',
            'fa-solid fa-graduation-cap', 
            () => initModule()
        );
    } else {
        console.warn("AppAPI not found. Cannot register quiz module.");
    }
})();