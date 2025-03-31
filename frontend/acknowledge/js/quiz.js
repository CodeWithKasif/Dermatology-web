document.addEventListener('DOMContentLoaded', function() {
    // Quiz data
    const questions = [
        {
            id: 1,
            text: "How does your skin feel after cleansing?",
            options: [
                {
                    text: "Comfortable and balanced",
                    skinTypes: { normal: 2, combination: 1 }
                },
                {
                    text: "Tight and dry",
                    skinTypes: { dry: 2, sensitive: 1 }
                },
                {
                    text: "Still oily, especially in the T-zone",
                    skinTypes: { oily: 2, combination: 1 }
                },
                {
                    text: "Irritated or stinging",
                    skinTypes: { sensitive: 2 }
                }
            ]
        },
        {
            id: 2,
            text: "How would you describe your pores?",
            options: [
                {
                    text: "Barely visible",
                    skinTypes: { normal: 2, dry: 1 }
                },
                {
                    text: "Visible in T-zone, less visible on cheeks",
                    skinTypes: { combination: 2 }
                },
                {
                    text: "Visibly enlarged, especially in T-zone",
                    skinTypes: { oily: 2 }
                },
                {
                    text: "Varies, but skin gets irritated easily",
                    skinTypes: { sensitive: 2 }
                }
            ]
        },
        {
            id: 3,
            text: "How often does your skin get shiny throughout the day?",
            options: [
                {
                    text: "Rarely gets shiny",
                    skinTypes: { normal: 1, dry: 2 }
                },
                {
                    text: "Gets shiny in the T-zone by midday",
                    skinTypes: { combination: 2 }
                },
                {
                    text: "Gets very shiny within a few hours after washing",
                    skinTypes: { oily: 2 }
                },
                {
                    text: "Varies, but often reacts to products with redness",
                    skinTypes: { sensitive: 2 }
                }
            ]
        },
        {
            id: 4,
            text: "How does your skin react to new products?",
            options: [
                {
                    text: "Usually adapts well with no issues",
                    skinTypes: { normal: 2 }
                },
                {
                    text: "Often feels tighter or flakier",
                    skinTypes: { dry: 2 }
                },
                {
                    text: "Often causes breakouts or looks shinier",
                    skinTypes: { oily: 2 }
                },
                {
                    text: "Frequently causes stinging, redness, or irritation",
                    skinTypes: { sensitive: 2 }
                }
            ]
        },
        {
            id: 5,
            text: "How would you describe your skin's texture?",
            options: [
                {
                    text: "Smooth and even",
                    skinTypes: { normal: 2 }
                },
                {
                    text: "Rough, flaky, or both",
                    skinTypes: { dry: 2 }
                },
                {
                    text: "Smooth in some areas, rough in others",
                    skinTypes: { combination: 2 }
                },
                {
                    text: "Bumpy with frequent breakouts",
                    skinTypes: { oily: 1, sensitive: 1 }
                }
            ]
        }
    ];

    const results = {
        normal: {
            type: "Normal Skin",
            description: "You have well-balanced skin with good circulation and a clear, even complexion. Your skin is neither too oily nor too dry.",
            characteristics: [
                "Balanced oil production",
                "Small, barely visible pores",
                "Good blood circulation",
                "No severe sensitivity",
                "Rarely has blemishes",
                "A smooth, even texture"
            ],
            recommendations: [
                "Use a gentle cleanser twice daily",
                "Apply a light, balanced moisturizer",
                "Use sunscreen daily",
                "Exfoliate 1-2 times per week",
                "Use hydrating masks occasionally"
            ]
        },
        dry: {
            type: "Dry Skin",
            description: "Your skin produces less oil than normal skin, leading to a lack of moisture and natural oils needed for protection.",
            characteristics: [
                "Feels tight, especially after cleansing",
                "May have flaky patches",
                "Almost invisible pores",
                "Dull complexion",
                "May show early signs of aging",
                "Can be itchy or irritated"
            ],
            recommendations: [
                "Use cream-based, hydrating cleansers",
                "Apply rich moisturizers with ingredients like hyaluronic acid",
                "Avoid hot water when washing your face",
                "Use hydrating masks regularly",
                "Consider facial oils",
                "Exfoliate gently only 1-2 times per week"
            ]
        },
        oily: {
            type: "Oily Skin",
            description: "Your skin produces excess sebum (oil), which can lead to a shiny appearance and more frequent breakouts.",
            characteristics: [
                "Shiny or greasy appearance",
                "Enlarged, clearly visible pores",
                "Prone to blackheads and breakouts",
                "Thicker skin texture",
                "Makeup doesn't stay on as long"
            ],
            recommendations: [
                "Use a foaming or gel cleanser",
                "Apply oil-free, non-comedogenic moisturizers",
                "Use clay masks regularly",
                "Consider products with salicylic acid or niacinamide",
                "Exfoliate regularly but gently",
                "Use blotting papers throughout the day"
            ]
        },
        combination: {
            type: "Combination Skin",
            description: "You have a mix of skin types, typically oily in the T-zone (forehead, nose, chin) and normal to dry on the cheeks.",
            characteristics: [
                "Oily T-zone (forehead, nose, chin)",
                "Normal to dry cheeks",
                "Enlarged pores in the T-zone",
                "Occasional breakouts in oily areas",
                "Cheeks may feel tight after cleansing"
            ],
            recommendations: [
                "Use a balanced cleanser",
                "Consider multi-masking (different masks for different areas)",
                "Use lightweight, oil-free moisturizers",
                "Apply heavier creams only on dry areas if needed",
                "Use targeted treatments for specific concerns in different areas"
            ]
        },
        sensitive: {
            type: "Sensitive Skin",
            description: "Your skin reacts easily to products, environmental factors, or both, often with redness, irritation, or discomfort.",
            characteristics: [
                "Reacts easily to products or environmental factors",
                "May appear red or blotchy",
                "Can feel itchy, tight, or burning",
                "May have visible broken capillaries",
                "Prone to rashes and bumps",
                "Can be dry and flaky"
            ],
            recommendations: [
                "Use fragrance-free, hypoallergenic products",
                "Patch test all new products",
                "Avoid products with alcohol, fragrances, and harsh chemicals",
                "Use gentle, soothing ingredients like aloe, chamomile, and oat",
                "Protect skin from extreme temperatures and sun exposure",
                "Consult a dermatologist for persistent issues"
            ]
        }
    };

    // Quiz state
    let currentQuestion = 0;
    let scores = {
        normal: 0,
        dry: 0,
        oily: 0,
        combination: 0,
        sensitive: 0
    };

    // DOM elements
    const quizContainer = document.querySelector('.quiz-container');
    if (!quizContainer) return;

    // Initialize quiz
    function initQuiz() {
        renderQuestion();
    }

    // Render current question
    function renderQuestion() {
        const question = questions[currentQuestion];
        
        const progressPercent = Math.round(((currentQuestion + 1) / questions.length) * 100);
        
        const questionHTML = `
            <div class="progress-container">
                <div class="progress-info">
                    <span>Question ${currentQuestion + 1} of ${questions.length}</span>
                    <span>${progressPercent}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                </div>
            </div>
            
            <h2 class="question">${question.text}</h2>
            
            <div class="options">
                ${question.options.map((option, index) => `
                    <button class="option-btn" data-index="${index}">
                        ${option.text}
                    </button>
                `).join('')}
            </div>
        `;
        
        quizContainer.innerHTML = questionHTML;
        
        // Add event listeners to options
        document.querySelectorAll('.option-btn').forEach(button => {
            button.addEventListener('click', handleAnswer);
        });
    }

    // Handle answer selection
    function handleAnswer(e) {
        const selectedIndex = parseInt(e.target.getAttribute('data-index'));
        const selectedOption = questions[currentQuestion].options[selectedIndex];
        
        // Update scores
        Object.entries(selectedOption.skinTypes).forEach(([skinType, points]) => {
            if (scores[skinType] !== undefined) {
                scores[skinType] += points;
            }
        });
        
        // Move to next question or show result
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            renderQuestion();
        } else {
            showResult();
        }
    }

    // Show quiz result
    function showResult() {
        // Determine skin type with highest score
        let highestScore = 0;
        let skinType = 'normal';
        
        Object.entries(scores).forEach(([type, score]) => {
            if (score > highestScore) {
                highestScore = score;
                skinType = type;
            }
        });
        
        const result = results[skinType];
        
        const resultHTML = `
            <div class="result">
                <h2 class="result-title">${result.type}</h2>
                <p class="result-description">${result.description}</p>
                
                <div class="result-section">
                    <h3 class="result-section-title">Characteristics:</h3>
                    <ul class="result-list">
                        ${result.characteristics.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="result-section">
                    <h3 class="result-section-title">Recommendations:</h3>
                    <ul class="result-list">
                        ${result.recommendations.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                
                <button class="btn restart-btn">Take Quiz Again</button>
            </div>
        `;
        
        quizContainer.innerHTML = resultHTML;
        
        // Add event listener to restart button
        document.querySelector('.restart-btn').addEventListener('click', restartQuiz);
    }

    // Restart quiz
    function restartQuiz() {
        currentQuestion = 0;
        scores = {
            normal: 0,
            dry: 0,
            oily: 0,
            combination: 0,
            sensitive: 0
        };
        renderQuestion();
    }

    // Initialize quiz
    initQuiz();
});