document.addEventListener('DOMContentLoaded', function() {
    // Quiz questions
    const questions = [
        {
            id: "skin-feel",
            question: "How does your skin feel after cleansing?",
            options: [
                { value: "tight", label: "Tight and dry" },
                { value: "normal", label: "Comfortable and normal" },
                { value: "oily", label: "Still oily or greasy" },
                { value: "combination", label: "Tight in some areas, oily in others" },
                { value: "sensitive", label: "Irritated or stinging" },
            ],
        },
        {
            id: "pores",
            question: "How would you describe your pores?",
            options: [
                { value: "invisible", label: "Barely visible" },
                { value: "small", label: "Small and not noticeable" },
                { value: "large-tzone", label: "Large in T-zone, small elsewhere" },
                { value: "large", label: "Large and visible across face" },
                { value: "varies", label: "Varies depending on skin irritation" },
            ],
        },
        {
            id: "shine",
            question: "How does your skin look by midday?",
            options: [
                { value: "dull", label: "Dull or flaky" },
                { value: "normal", label: "No significant change" },
                { value: "shiny-tzone", label: "Shiny in T-zone only" },
                { value: "very-shiny", label: "Very shiny or greasy" },
                { value: "red", label: "Red or irritated" },
            ],
        },
        {
            id: "sensitivity",
            question: "How does your skin react to new products?",
            options: [
                { value: "rarely", label: "Rarely reacts negatively" },
                { value: "sometimes", label: "Sometimes becomes dry or oily" },
                { value: "often", label: "Often becomes irritated or breaks out" },
                { value: "very-often", label: "Very often becomes red, itchy, or burns" },
                { value: "depends", label: "Depends on the product ingredients" },
            ],
        },
        {
            id: "concerns",
            question: "What are your main skin concerns?",
            options: [
                { value: "dryness", label: "Dryness or flakiness" },
                { value: "aging", label: "Fine lines and wrinkles" },
                { value: "acne", label: "Acne or breakouts" },
                { value: "oiliness", label: "Excess oil or shine" },
                { value: "sensitivity", label: "Redness or irritation" },
            ],
        },
    ];

    // DOM elements
    const quizCard = document.getElementById('quiz-card');
    const resultsCard = document.getElementById('results-card');
    const questionText = document.getElementById('question-text');
    const quizOptions = document.getElementById('quiz-options');
    const currentQuestionEl = document.getElementById('current-question');
    const totalQuestionsEl = document.getElementById('total-questions');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const progressBar = document.getElementById('quiz-progress');

    // If quiz elements don't exist, exit early
    if (!quizCard || !questionText) return;

    // Quiz state
    let currentStep = 0;
    const answers = {};
    
    // Initialize quiz
    function initQuiz() {
        totalQuestionsEl.textContent = questions.length;
        showQuestion(0);
    }
    
    // Show a specific question
    function showQuestion(index) {
        const question = questions[index];
        
        // Update question text
        questionText.textContent = question.question;
        currentQuestionEl.textContent = index + 1;
        
        // Update progress bar
        progressBar.style.width = `${((index + 1) / questions.length) * 100}%`;
        
        // Create options HTML
        quizOptions.innerHTML = '';
        question.options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = question.id;
            input.id = option.value;
            input.value = option.value;
            
            // Check if this option was previously selected
            if (answers[question.id] === option.value) {
                input.checked = true;
            }
            
            const label = document.createElement('label');
            label.htmlFor = option.value;
            label.textContent = option.label;
            
            optionDiv.appendChild(input);
            optionDiv.appendChild(label);
            quizOptions.appendChild(optionDiv);
        });
        
        // Update button states
        prevButton.disabled = index === 0;
        nextButton.textContent = index === questions.length - 1 ? 'See Results' : 'Next';
    }
    
    // Handle next button click
    nextButton.addEventListener('click', function() {
        // Get selected option
        const selectedOption = document.querySelector(`input[name="${questions[currentStep].id}"]:checked`);
        
        // Require an answer
        if (!selectedOption) {
            alert('Please select an option to continue.');
            return;
        }
        
        // Save answer
        answers[questions[currentStep].id] = selectedOption.value;
        
        // Move to next question or show results
        if (currentStep < questions.length - 1) {
            currentStep++;
            showQuestion(currentStep);
        } else {
            showResults();
        }
    });
    
    // Handle previous button click
    prevButton.addEventListener('click', function() {
        if (currentStep > 0) {
            currentStep--;
            showQuestion(currentStep);
        }
    });
    
    // Show quiz results
    function showResults() {
        // Calculate skin type
        const skinType = calculateSkinType();
        
        // Update results
        document.getElementById('skin-type-result').textContent = 
            skinType.skinType + (skinType.sensitive ? ' & Sensitive' : '');
        
        // Update recommendations
        document.getElementById('cleanser-recommendations').innerHTML = 
            skinType.recommendations.cleansers.map(item => `<li>${item}</li>`).join('');
        
        document.getElementById('treatment-recommendations').innerHTML = 
            skinType.recommendations.treatments.map(item => `<li>${item}</li>`).join('');
        
        document.getElementById('moisturizer-recommendations').innerHTML = 
            skinType.recommendations.moisturizers.map(item => `<li>${item}</li>`).join('');
        
        document.getElementById('sunscreen-recommendations').innerHTML = 
            skinType.recommendations.sunscreens.map(item => `<li>${item}</li>`).join('');
        
        document.getElementById('habits-recommendations').innerHTML = 
            skinType.recommendations.habits.map(item => `<li>${item}</li>`).join('');
        
        // Hide quiz, show results
        quizCard.style.display = 'none';
        resultsCard.style.display = 'block';
    }
    
    // Calculate skin type based on answers
    function calculateSkinType() {
        // Simple algorithm to determine skin type based on answers
        const counts = {
            dry: 0,
            normal: 0,
            oily: 0,
            combination: 0,
            sensitive: 0,
        };

        // Map answers to skin types
        const answerMap = {
            tight: "dry",
            normal: "normal",
            oily: "oily",
            combination: "combination",
            sensitive: "sensitive",
            invisible: "dry",
            small: "normal",
            "large-tzone": "combination",
            large: "oily",
            varies: "sensitive",
            dull: "dry",
            "shiny-tzone": "combination",
            "very-shiny": "oily",
            red: "sensitive",
            rarely: "normal",
            sometimes: "normal",
            often: "combination",
            "very-often": "sensitive",
            depends: "sensitive",
            dryness: "dry",
            aging: "dry",
            acne: "oily",
            oiliness: "oily",
            sensitivity: "sensitive",
        };

        // Count occurrences of each skin type
        Object.values(answers).forEach((answer) => {
            const skinType = answerMap[answer];
            if (skinType) {
                counts[skinType]++;
            }
        });

        // Find the skin type with the highest count
        let maxCount = 0;
        let resultType = "normal";

        Object.entries(counts).forEach(([type, count]) => {
            if (count > maxCount) {
                maxCount = count;
                resultType = type;
            }
        });

        // Special case for combination skin
        if (counts.oily > 0 && counts.dry > 0) {
            resultType = "combination";
        }

        // If sensitive has any points, consider it as a factor
        const isSensitive = counts.sensitive > 0;

        return {
            skinType: resultType,
            sensitive: isSensitive,
            recommendations: getRecommendations(resultType, isSensitive),
        };
    }
    
    // Get recommendations based on skin type
    function getRecommendations(skinType, isSensitive) {
        const recommendations = {
            cleansers: [],
            treatments: [],
            moisturizers: [],
            sunscreens: [],
            habits: [],
        };

        // Base recommendations on skin type
        switch (skinType) {
            case "dry":
                recommendations.cleansers = [
                    "Cream or oil-based cleansers",
                    "Hydrating cleansers with ceramides or hyaluronic acid",
                ];
                recommendations.treatments = [
                    "Hydrating serums with hyaluronic acid",
                    "Nourishing face oils",
                    "Weekly hydrating masks",
                ];
                recommendations.moisturizers = ["Rich creams with ceramides", "Moisturizers with shea butter or squalane"];
                recommendations.sunscreens = [
                    "Moisturizing sunscreens with SPF 30+",
                    "Sunscreens with added hydrating ingredients",
                ];
                recommendations.habits = [
                    "Avoid hot water when cleansing",
                    "Use a humidifier",
                    "Drink plenty of water",
                    "Avoid alcohol and caffeine",
                ];
                break;
            case "normal":
                recommendations.cleansers = ["Gentle foaming or gel cleansers", "Balancing cleansers"];
                recommendations.treatments = ["Antioxidant serums", "Vitamin C for brightening", "Weekly exfoliation"];
                recommendations.moisturizers = ["Lightweight lotions", "Gel-creams"];
                recommendations.sunscreens = ["Lightweight sunscreens with SPF 30+"];
                recommendations.habits = ["Maintain a consistent routine", "Stay hydrated", "Get adequate sleep"];
                break;
            case "oily":
                recommendations.cleansers = ["Gel or foaming cleansers", "Cleansers with salicylic acid"];
                recommendations.treatments = [
                    "Oil-free serums with niacinamide",
                    "BHA (salicylic acid) treatments",
                    "Clay masks twice weekly",
                ];
                recommendations.moisturizers = ["Oil-free gel moisturizers", "Lightweight hydrators"];
                recommendations.sunscreens = ["Oil-free or mattifying sunscreens", "Gel-based sunscreens"];
                recommendations.habits = ["Don't over-cleanse", "Use blotting papers", "Avoid heavy, occlusive products"];
                break;
            case "combination":
                recommendations.cleansers = ["Balanced pH cleansers", "Gentle foaming cleansers"];
                recommendations.treatments = ["BHA for T-zone", "Hydrating serums for dry areas", "Multi-masking"];
                recommendations.moisturizers = ["Lightweight lotions", "Gel-creams with targeted application"];
                recommendations.sunscreens = ["Lightweight, non-greasy sunscreens"];
                recommendations.habits = [
                    "Target treatments to specific areas",
                    "Adjust routine seasonally",
                    "Consider different products for different face areas",
                ];
                break;
            default:
                recommendations.cleansers = ["Gentle, pH-balanced cleansers"];
                recommendations.treatments = ["Hydrating serums", "Gentle exfoliation"];
                recommendations.moisturizers = ["Balanced moisturizers"];
                recommendations.sunscreens = ["Mineral sunscreens with SPF 30+"];
                recommendations.habits = ["Maintain a consistent routine", "Stay hydrated"];
        }

        // Modify recommendations if skin is sensitive
        if (isSensitive) {
            recommendations.cleansers = ["Fragrance-free, gentle cleansers", "Cream cleansers without sulfates"];
            recommendations.treatments = ["Centella asiatica serums", "Aloe vera gels", "Avoid strong actives like retinol"];
            recommendations.moisturizers = [
                "Fragrance-free moisturizers with ceramides",
                "Soothing ingredients like oat extract",
            ];
            recommendations.sunscreens = [
                "Mineral sunscreens with zinc oxide or titanium dioxide",
                "Fragrance-free formulations",
            ];
            recommendations.habits = [
                "Patch test new products",
                "Avoid hot water",
                "Minimize product layering",
                "Avoid fragranced products",
            ];
        }

        return recommendations;
    }
    
    // Initialize the quiz
    initQuiz();
});