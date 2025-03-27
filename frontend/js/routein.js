// Data for skin types
const skinTypeData = {
    normal: {
      description: "Normal skin is well-balanced: not too oily and not too dry.",
      cleanser: "Gentle foaming cleanser",
      toner: "Hydrating toner with antioxidants",
      serum: "Vitamin C serum for brightness",
      moisturizer: "Lightweight, hydrating moisturizer",
      sunscreen: "Broad-spectrum SPF 30",
      nightCream: "Nourishing night cream with peptides",
      exfoliant: "Mild AHA exfoliant (2-3x weekly)",
      mask: "Hydrating sheet mask (1-2x weekly)"
    },
    dry: {
      description: "Dry skin produces less sebum than normal skin and needs extra hydration.",
      cleanser: "Cream or oil-based cleanser",
      toner: "Alcohol-free hydrating toner",
      serum: "Hyaluronic acid serum",
      moisturizer: "Rich, creamy moisturizer",
      sunscreen: "Moisturizing sunscreen with SPF 30+",
      nightCream: "Intensive repair night cream",
      exfoliant: "Gentle enzymatic exfoliant (1-2x weekly)",
      mask: "Overnight hydrating mask (2x weekly)"
    },
    oily: {
      description: "Oily skin produces excess sebum, giving a shiny appearance and prone to breakouts.",
      cleanser: "Gel or foam cleanser with salicylic acid",
      toner: "Balancing toner with niacinamide",
      serum: "Oil-free antioxidant serum",
      moisturizer: "Oil-free gel moisturizer",
      sunscreen: "Oil-free, matte finish sunscreen",
      nightCream: "Lightweight night treatment with retinol",
      exfoliant: "BHA exfoliant (2-3x weekly)",
      mask: "Clay mask (2x weekly)"
    },
    combination: {
      description: "Combination skin has an oily T-zone (forehead, nose, chin) and dry cheeks.",
      cleanser: "Balanced pH cleanser",
      toner: "Balancing toner",
      serum: "Niacinamide serum",
      moisturizer: "Lightweight lotion for T-zone, richer cream for cheeks",
      sunscreen: "Lightweight, non-comedogenic sunscreen",
      nightCream: "Balanced night cream",
      exfoliant: "AHA/BHA combination exfoliant (2x weekly)",
      mask: "Multi-masking: clay for T-zone, hydrating for cheeks"
    }
  };
  
  // Data for diet types
  const dietTypeData = {
    omnivore: {
      description: "A balanced diet including both plant and animal foods.",
      proteinSources: ["Fatty fish (salmon, mackerel)", "Chicken", "Eggs", "Lean beef", "Turkey"],
      collagenSources: ["Bone broth", "Chicken skin", "Fish with skin", "Beef", "Pork"],
      superfoods: ["Berries", "Nuts", "Avocados", "Fatty fish", "Eggs", "Olive oil"]
    },
    vegetarian: {
      description: "A plant-based diet that excludes meat but may include dairy and eggs.",
      proteinSources: ["Eggs", "Greek yogurt", "Cottage cheese", "Lentils", "Chickpeas", "Tofu"],
      collagenSources: ["Eggs", "Dairy", "Chia seeds", "Soy", "Nuts and seeds"],
      superfoods: ["Berries", "Nuts", "Avocados", "Chia seeds", "Flaxseeds", "Olive oil", "Dark chocolate"]
    },
    vegan: {
      description: "A plant-based diet that excludes all animal products.",
      proteinSources: ["Tofu", "Tempeh", "Lentils", "Chickpeas", "Quinoa", "Hemp seeds", "Nutritional yeast"],
      collagenSources: ["Plant proteins", "Soy", "Nuts and seeds", "Legumes", "Fruits high in vitamin C"],
      superfoods: ["Berries", "Nuts", "Avocados", "Chia seeds", "Flaxseeds", "Olive oil", "Dark chocolate", "Spirulina"]
    }
  };
  
  // Initial reminders
  let reminders = [
    { id: 1, routine: "Morning Routine", time: "07:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], enabled: true },
    { id: 2, routine: "Evening Routine", time: "21:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], enabled: true },
    { id: 3, routine: "Exfoliation", time: "20:30", days: ["Wed", "Sat"], enabled: true },
  ];
  
  // User preferences
  let userPreferences = {
    skinType: "normal",
    dietType: "omnivore"
  };
  
  // DOM Elements
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  const routineTabButtons = document.querySelectorAll('.routine-tab-button');
  const routineTabContents = document.querySelectorAll('.routine-tab-content');
  const dietTabButtons = document.querySelectorAll('.diet-tab-button');
  const dietTabContents = document.querySelectorAll('.diet-tab-content');
  const updatePreferencesButton = document.getElementById('update-preferences');
  const skinTypeRadios = document.querySelectorAll('input[name="skinType"]');
  const dietTypeRadios = document.querySelectorAll('input[name="dietType"]');
  const dayButtons = document.querySelectorAll('.day-button');
  const addReminderButton = document.getElementById('add-reminder');
  const remindersList = document.getElementById('reminders-list');
  
  // Initialize the page
  function init() {
    // Load saved preferences from localStorage if available
    const savedPreferences = localStorage.getItem('skinCarePreferences');
    if (savedPreferences) {
      userPreferences = JSON.parse(savedPreferences);
      
      // Set the radio buttons to match saved preferences
      document.querySelector(`input[name="skinType"][value="${userPreferences.skinType}"]`).checked = true;
      document.querySelector(`input[name="dietType"][value="${userPreferences.dietType}"]`).checked = true;
    }
    
    // Load saved reminders from localStorage if available
    const savedReminders = localStorage.getItem('skinCareReminders');
    if (savedReminders) {
      reminders = JSON.parse(savedReminders);
    }
    
    // Update the UI based on preferences
    updateSkinCareUI();
    updateDietUI();
    renderReminders();
    
    // Set up event listeners
    setupEventListeners();
  }
  
  // Update the skin care UI based on skin type
  function updateSkinCareUI() {
    const skinData = skinTypeData[userPreferences.skinType];
    
    // Update skin type information
    document.getElementById('skin-type-title').textContent = `Your Skin Type: ${userPreferences.skinType.charAt(0).toUpperCase() + userPreferences.skinType.slice(1)}`;
    document.getElementById('skin-description').textContent = skinData.description;
    
    // Update recommended products
    const productsList = document.getElementById('recommended-products');
    productsList.innerHTML = `
      <li>${skinData.cleanser}</li>
      <li>${skinData.toner}</li>
      <li>${skinData.serum}</li>
      <li>${skinData.moisturizer}</li>
    `;
    
    // Update frequency information
    if (userPreferences.skinType === 'dry') {
      document.getElementById('exfoliation-frequency').textContent = '1-2 times weekly';
      document.getElementById('mask-frequency').textContent = '2 times weekly';
      document.getElementById('exfoliation-title').textContent = 'Exfoliation (1-2x weekly)';
    } else {
      document.getElementById('exfoliation-frequency').textContent = '2-3 times weekly';
      document.getElementById('mask-frequency').textContent = '1-2 times weekly';
      document.getElementById('exfoliation-title').textContent = 'Exfoliation (2-3x weekly)';
    }
    
    // Update morning routine
    document.getElementById('morning-cleanser').textContent = skinData.cleanser;
    document.getElementById('morning-toner').textContent = skinData.toner;
    document.getElementById('morning-serum').textContent = skinData.serum;
    document.getElementById('morning-moisturizer').textContent = skinData.moisturizer;
    document.getElementById('morning-sunscreen').textContent = skinData.sunscreen;
    
    // Update evening routine
    document.getElementById('evening-cleanser').textContent = skinData.cleanser;
    document.getElementById('evening-toner').textContent = skinData.toner;
    document.getElementById('evening-serum').textContent = skinData.serum;
    document.getElementById('evening-exfoliant').textContent = skinData.exfoliant;
    document.getElementById('evening-nightcream').textContent = skinData.nightCream;
  }
  
  // Update the diet UI based on diet type
  function updateDietUI() {
    const dietData = dietTypeData[userPreferences.dietType];
    
    // Update diet type information
    document.getElementById('diet-type-display').textContent = userPreferences.dietType.charAt(0).toUpperCase() + userPreferences.dietType.slice(1);
    document.getElementById('diet-description').textContent = dietData.description;
    
    // Update food lists
    const proteinSourcesList = document.getElementById('protein-sources');
    const collagenSourcesList = document.getElementById('collagen-sources');
    const superfoodsList = document.getElementById('superfoods');
    
    proteinSourcesList.innerHTML = '';
    dietData.proteinSources.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      proteinSourcesList.appendChild(li);
    });
    
    collagenSourcesList.innerHTML = '';
    dietData.collagenSources.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      collagenSourcesList.appendChild(li);
    });
    
    superfoodsList.innerHTML = '';
    dietData.superfoods.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      superfoodsList.appendChild(li);
    });
  }
  
  // Render reminders list
  function renderReminders() {
    remindersList.innerHTML = '';
    
    if (reminders.length === 0) {
      remindersList.innerHTML = '<p class="text-center">No reminders set. Add your first reminder below.</p>';
      return;
    }
    
    reminders.forEach(reminder => {
      const reminderElement = document.createElement('div');
      reminderElement.className = 'reminder-item';
      reminderElement.innerHTML = `
        <div class="reminder-info">
          <div class="reminder-icon">
            <i class="fas fa-bell"></i>
          </div>
          <div class="reminder-details">
            <h4>${reminder.routine}</h4>
            <p>
              <i class="fas fa-clock"></i>
              <span>${reminder.time}</span>
              <span class="separator">•</span>
              <span>${reminder.days.join(', ')}</span>
            </p>
          </div>
        </div>
        <div class="reminder-actions">
          <label class="switch">
            <input type="checkbox" ${reminder.enabled ? 'checked' : ''} data-id="${reminder.id}">
            <span class="slider"></span>
          </label>
          <button class="delete-button" data-id="${reminder.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      
      remindersList.appendChild(reminderElement);
    });
    
    // Add event listeners to the new elements
    document.querySelectorAll('.switch input').forEach(switchInput => {
      switchInput.addEventListener('change', function() {
        const id = parseInt(this.getAttribute('data-id'));
        toggleReminder(id);
      });
    });
    
    document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        deleteReminder(id);
      });
    });
  }
  
  // Toggle reminder enabled state
  function toggleReminder(id) {
    reminders = reminders.map(reminder => 
      reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
    );
    
    // Save to localStorage
    localStorage.setItem('skinCareReminders', JSON.stringify(reminders));
  }
  
  // Delete a reminder
  function deleteReminder(id) {
    reminders = reminders.filter(reminder => reminder.id !== id);
    
    // Save to localStorage
    localStorage.setItem('skinCareReminders', JSON.stringify(reminders));
    
    // Re-render the reminders list
    renderReminders();
  }
  
  // Add a new reminder
  function addNewReminder() {
    const routineSelect = document.getElementById('reminder-routine');
    const timeInput = document.getElementById('reminder-time');
    const selectedDays = Array.from(document.querySelectorAll('.day-button.active')).map(button => button.getAttribute('data-day'));
    
    if (routineSelect.value && timeInput.value && selectedDays.length > 0) {
      const newReminder = {
        id: Date.now(),
        routine: routineSelect.value,
        time: timeInput.value,
        days: selectedDays,
        enabled: true
      };
      
      reminders.push(newReminder);
      
      // Save to localStorage
      localStorage.setItem('skinCareReminders', JSON.stringify(reminders));
      
      // Re-render the reminders list
      renderReminders();
      
      // Reset form
      routineSelect.value = 'Morning Routine';
      timeInput.value = '08:00';
      document.querySelectorAll('.day-button').forEach(button => {
        button.classList.add('active');
      });
    } else {
      alert('Please fill in all fields and select at least one day.');
    }
  }
  
  // Set up event listeners
  function setupEventListeners() {
    // Tab navigation
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tab = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(tab).classList.add('active');
      });
    });
    
    // Routine tab navigation
    routineTabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tab = button.getAttribute('data-routine-tab');
        
        // Remove active class from all buttons and contents
        routineTabButtons.forEach(btn => btn.classList.remove('active'));
        routineTabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(tab).classList.add('active');
      });
    });
    
    // Diet tab navigation
    dietTabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tab = button.getAttribute('data-diet-tab');
        
        // Remove active class from all buttons and contents
        dietTabButtons.forEach(btn => btn.classList.remove('active'));
        dietTabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(tab).classList.add('active');
      });
    });
    
    // Update preferences
    updatePreferencesButton.addEventListener('click', () => {
      // Get selected skin type
      const selectedSkinType = document.querySelector('input[name="skinType"]:checked').value;
      
      // Get selected diet type
      const selectedDietType = document.querySelector('input[name="dietType"]:checked').value;
      
      // Update preferences
      userPreferences.skinType = selectedSkinType;
      userPreferences.dietType = selectedDietType;
      
      // Save to localStorage
      localStorage.setItem('skinCarePreferences', JSON.stringify(userPreferences));
      
      // Update UI
      updateSkinCareUI();
      updateDietUI();
      
      // Show confirmation
      alert('Preferences updated successfully!');
    });
    
    // Day buttons for reminders
    dayButtons.forEach(button => {
      button.addEventListener('click', () => {
        button.classList.toggle('active');
      });
    });
    
    // Add reminder button
    addReminderButton.addEventListener('click', addNewReminder);
  }
  
  // Initialize the page when DOM is loaded
  document.addEventListener('DOMContentLoaded', init);