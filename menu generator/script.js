// Parse CSV data
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const row = {};
    const values = lines[i].split(',');
    headers.forEach((header, idx) => {
      row[header] = values[idx] ? values[idx].trim() : '';
    });
    data.push(row);
  }
  
  return data;
}

// Default items from Google Sheet (hardcoded)
const defaultItems = {
  breakfast: [
    { name: 'Poha', highProtein: false },
    { name: 'Upma', highProtein: false },
    { name: 'Sev Upma', highProtein: false },
    { name: 'Besan chilla sandwich', highProtein: true },
    { name: 'Moong dal chilla', highProtein: true },
    { name: 'Pancake', highProtein: false },
    { name: 'Uttapam', highProtein: false },
    { name: 'Overnight oats', highProtein: true },
    { name: 'Sour dought toast', highProtein: false },
    { name: 'handva', highProtein: false },
    { name: 'wagharela bhat', highProtein: false },
    { name: 'Mag khakhra', highProtein: true },
    { name: 'Khichu', highProtein: false },
  ],
  lunch: [
    { name: 'Pav Bhaji (jain style)', highProtein: false },
    { name: 'Misal Pav', highProtein: true },
    { name: 'Rajma', highProtein: true },
    { name: 'Chole', highProtein: true },
    { name: 'Veg Khichdi', highProtein: false },
    { name: 'Dal Dhokli + thepla', highProtein: false },
    { name: 'Mix veg dry + dal + roti', highProtein: false },
    { name: 'Paneer kobi paratha + black dal', highProtein: true },
    { name: 'Dhanshak rice', highProtein: false },
    { name: 'Makhanwala', highProtein: false },
    { name: 'Methi mattar paneer malai + paratha', highProtein: true },
    { name: 'Palak corn + roti', highProtein: false },
    { name: 'spinach mushroom sabzi (dry) + roti', highProtein: false },
    { name: 'Spring onion sabzi + roti', highProtein: false },
    { name: 'Bhindi + roti + dal', highProtein: false },
    { name: 'Makai shaak', highProtein: false },
    { name: 'Thalipith + shaak + cucumber, carrot raita', highProtein: false },
    { name: 'appam and stew', highProtein: false },
    { name: 'Idli/uttapam', highProtein: false },
    { name: 'kobi shaak', highProtein: false },
    { name: 'paneer gravy', highProtein: true },
    { name: 'paneer bhurji', highProtein: true },
    { name: 'kopra fansi shaak', highProtein: false },
    { name: 'south indian kobi+sambhar', highProtein: false },
    { name: 'sing shaak', highProtein: false },
    { name: 'Mix veg paratha with carrot, celery dip', highProtein: false },
    { name: 'Mooli paratha with carrot, celery dip', highProtein: false },
    { name: 'Pakoda kadhi + rice', highProtein: false }
  ],
  dinner: [
    { name: 'Masoor biryani', highProtein: true },
    { name: 'Veg biryani with channa', highProtein: false },
    { name: 'Moong dal chilla with paneer and veggies stuffed', highProtein: true },
    { name: 'Besan chilla with paneer and veggies', highProtein: true },
    { name: 'Chinese noodles (purple cabbage, french beans, carrot, babycorn, brocolli)', highProtein: false },
    { name: 'Ravioli', highProtein: false },
    { name: 'Pizza', highProtein: false },
    { name: 'Lasagna', highProtein: false },
    { name: 'Enchilada', highProtein: false },
    { name: 'Burrito bowl', highProtein: true },
    { name: 'Quesadilla', highProtein: false },
    { name: 'Paneer, mushroom, aloo tikka', highProtein: true },
    { name: 'Paneer bhurji sandwich', highProtein: true },
    { name: 'Tofu stir fry + fried rice', highProtein: false },
    { name: 'Mushroom crostini (mushroom, palak) in healthy white sauce', highProtein: false },
    { name: 'Falafel', highProtein: false },
    { name: 'Burger', highProtein: false },
    { name: 'Rice + thai curry', highProtein: false },
    { name: 'Pani puri', highProtein: false },
    { name: 'Bhel/sev puri', highProtein: false },
    { name: 'Ragda pattice', highProtein: false },
    { name: 'Panini', highProtein: false },
    { name: 'Naulakha', highProtein: false },
    { name: 'Khousway', highProtein: false },
    { name: 'Frankie', highProtein: false }
  ]
};

// Load items from localStorage or use defaults
let items = JSON.parse(localStorage.getItem('foodItems'));
if (!items || !items.breakfast || !items.lunch || !items.dinner) {
  items = JSON.parse(JSON.stringify(defaultItems));
  saveItems();
}

// Save items to localStorage
function saveItems() {
  localStorage.setItem('foodItems', JSON.stringify(items));
}

let currentMenu = null;
let currentDays = [];

function menuContains(itemName, menu) {
  return menu.some(day => Object.values(day).some(meal => meal.name === itemName));
}

function replaceMenuItem(dayIndex, meal) {
  if (!currentMenu || !currentMenu[dayIndex]) return;

  const currentItem = currentMenu[dayIndex][meal];
  const categoryItems = items[meal] || [];
  const replacements = categoryItems.filter(item =>
    item.highProtein === currentItem.highProtein &&
    item.name !== currentItem.name &&
    !menuContains(item.name, currentMenu)
  );

  const fallback = categoryItems.filter(item =>
    item.highProtein === currentItem.highProtein &&
    item.name !== currentItem.name
  );

  const candidateItems = replacements.length > 0 ? replacements : fallback;

  if (candidateItems.length === 0) {
    alert('No available replacement found for this item in the same category and protein tier.');
    return;
  }

  const selected = candidateItems[Math.floor(Math.random() * candidateItems.length)];
  currentMenu[dayIndex][meal] = { name: selected.name, highProtein: selected.highProtein };
  displayMenu(currentMenu, currentDays);
}

// Display items
function displayItems() {
  const container = document.getElementById('items-display');
  container.innerHTML = '';

  for (let category in items) {
    if (items[category].length === 0) continue;
    
    const div = document.createElement('div');
    div.className = 'category';
    div.innerHTML = `<h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>`;
    
    items[category].forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'item';
      itemDiv.innerHTML = `
        <span class="item-name ${item.highProtein ? 'high-protein' : ''}">${item.name}</span>
        <div class="item-actions">
          <button class="btn btn-primary btn-small edit-btn" data-category="${category}" data-index="${index}">Edit</button>
        </div>
      `;
      div.appendChild(itemDiv);
    });
    container.appendChild(div);
  }

  // Add event listeners for edit buttons
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      const index = parseInt(this.getAttribute('data-index'));
      editItem(category, index);
    });
  });
}

// Edit item
function editItem(category, index) {
  const item = items[category][index];
  const itemDiv = document.querySelector(`.edit-btn[data-category="${category}"][data-index="${index}"]`).closest('.item');
  itemDiv.innerHTML = `
    <input type="text" value="${item.name}" id="edit-name-${category}-${index}" required>
    <div class="item-actions">
      <label class="checkbox-label">
        <input type="checkbox" id="edit-high-${category}-${index}" ${item.highProtein ? 'checked' : ''}>
        <span>High Protein</span>
      </label>
      <button class="btn btn-primary btn-small save-btn">Save</button>
      <button class="btn btn-danger btn-small cancel-btn">Cancel</button>
    </div>
  `;

  itemDiv.querySelector('.save-btn').addEventListener('click', () => {
    const newName = document.getElementById(`edit-name-${category}-${index}`).value.trim();
    const newHigh = document.getElementById(`edit-high-${category}-${index}`).checked;
    if (newName) {
      items[category][index] = { name: newName, highProtein: newHigh };
      saveItems();
      displayItems();
    }
  });

  itemDiv.querySelector('.cancel-btn').addEventListener('click', () => {
    displayItems();
  });
}

// Display menu
function displayMenu(menu, days) {
  currentMenu = menu;
  currentDays = days;

  const container = document.getElementById('menu-display');
  let html = '<div class="table-wrapper"><table><tr><th>Day</th><th>Breakfast</th><th>Lunch</th><th>Dinner</th></tr>';
  menu.forEach((dayMenu, index) => {
    const breakfastLabel = dayMenu.breakfast.highProtein ? `${dayMenu.breakfast.name} ⭐` : dayMenu.breakfast.name;
    const lunchLabel = dayMenu.lunch.highProtein ? `${dayMenu.lunch.name} ⭐` : dayMenu.lunch.name;
    const dinnerLabel = dayMenu.dinner.highProtein ? `${dayMenu.dinner.name} ⭐` : dayMenu.dinner.name;

    html += `
      <tr>
        <td>${days[index]}</td>
        <td>
          <div class="menu-cell">
            <span>${breakfastLabel}</span>
            <button class="btn btn-secondary btn-small replace-btn" data-day="${index}" data-meal="breakfast" aria-label="Replace breakfast item for ${days[index]}">Replace</button>
          </div>
        </td>
        <td>
          <div class="menu-cell">
            <span>${lunchLabel}</span>
            <button class="btn btn-secondary btn-small replace-btn" data-day="${index}" data-meal="lunch" aria-label="Replace lunch item for ${days[index]}">Replace</button>
          </div>
        </td>
        <td>
          <div class="menu-cell">
            <span>${dinnerLabel}</span>
            <button class="btn btn-secondary btn-small replace-btn" data-day="${index}" data-meal="dinner" aria-label="Replace dinner item for ${days[index]}">Replace</button>
          </div>
        </td>
      </tr>`;
  });
  html += '</table></div><div class="menu-legend"><strong>⭐</strong> = High Protein item</div>';
  container.innerHTML = html;

  document.querySelectorAll('.replace-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const dayIndex = parseInt(this.getAttribute('data-day'));
      const meal = this.getAttribute('data-meal');
      replaceMenuItem(dayIndex, meal);
    });
  });
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Initialize app - attach all event listeners
function initializeApp() {
  console.log('App initializing...');
  
  // Wait for XLSX library to be available
  function waitForXLSX(callback, attempts = 0) {
    if (typeof XLSX !== 'undefined') {
      console.log('XLSX library loaded');
      callback();
    } else if (attempts < 50) {
      // Wait 100ms and try again (max 5 seconds)
      setTimeout(() => waitForXLSX(callback, attempts + 1), 100);
    } else {
      console.warn('XLSX library failed to load after 5 seconds. Import feature may not work.');
      callback(); // Continue anyway
    }
  }
  
  waitForXLSX(attachEventListeners);
}

function attachEventListeners() {
  console.log('Attaching event listeners...');
  
  // Toggle items visibility
  const toggleBtn = document.getElementById('toggle-items-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      const itemsDisplay = document.getElementById('items-display');
      if (itemsDisplay.classList.contains('hidden')) {
        itemsDisplay.classList.remove('hidden');
        toggleBtn.textContent = 'Hide Items';
        toggleBtn.setAttribute('aria-expanded', 'true');
      } else {
        itemsDisplay.classList.add('hidden');
        toggleBtn.textContent = 'Show Items';
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Hide header on scroll down, show on scroll up
  const header = document.querySelector('.header');
  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (!header) return;

    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }

    lastScrollY = Math.max(currentScrollY, 0);
  });

  // Add item form
  const addForm = document.getElementById('add-item-form');
  if (addForm) {
    addForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('item-name').value.trim();
      const category = document.getElementById('item-category').value;
      const highProtein = document.getElementById('high-protein').checked;

      if (!name || !category) return;

      items[category].push({ name, highProtein });
      saveItems();
      displayItems();
      this.reset();
    });
  }

  // Import Excel File
  const importBtn = document.getElementById('import-excel-btn');
  if (importBtn) {
    importBtn.addEventListener('click', function() {
      console.log('Import button clicked');
      const fileInput = document.getElementById('excel-file');
      const file = fileInput.files[0];
      
      console.log('File selected:', file);
      
      if (!file) {
        alert('Please select a file to import.');
        return;
      }

      try {
        const reader = new FileReader();
        reader.onload = function(e) {
          try {
            console.log('File read successfully');
            let jsonData = [];
            
            // Check file type
            if (file.name.endsWith('.csv')) {
              // Parse CSV directly
              console.log('Parsing as CSV');
              const csvText = e.target.result;
              jsonData = parseCSV(csvText);
            } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
              // Try to use XLSX library
              if (typeof XLSX === 'undefined') {
                throw new Error('XLSX library not loaded. Please use CSV format instead, or refresh the page and try again.');
              }
              console.log('Parsing as XLSX');
              const data = new Uint8Array(e.target.result);
              const workbook = XLSX.read(data, { type: 'array' });
              const worksheet = workbook.Sheets[workbook.SheetNames[0]];
              jsonData = XLSX.utils.sheet_to_json(worksheet);
            } else {
              throw new Error('Unsupported file format. Please use .xlsx, .xls, or .csv files.');
            }
            
            console.log('Parsed data:', jsonData);
            
            if (jsonData.length === 0) {
              throw new Error('File is empty.');
            }
            
            let importedCount = 0;
            jsonData.forEach((row, idx) => {
              console.log(`Processing row ${idx}:`, row);
              
              let cat = '';
              let name = '';
              let hp = 'no';
              
              for (const key in row) {
                const keyLower = key.toLowerCase().trim();
                if (keyLower.includes('category')) {
                  cat = String(row[key] || '').toLowerCase().trim();
                } else if (keyLower.includes('name')) {
                  name = String(row[key] || '').trim();
                } else if (keyLower.includes('highprotein') || keyLower.includes('high protein')) {
                  hp = String(row[key] || 'no').toLowerCase().trim();
                }
              }
              
              console.log(`Row ${idx} - Category: ${cat}, Name: ${name}, HighProtein: ${hp}`);
              
              if (['breakfast', 'lunch', 'dinner'].includes(cat) && name) {
                const highProtein = hp === 'yes' || hp === 'true' || hp === '1' || hp === 'y';
                items[cat].push({ name, highProtein });
                importedCount++;
                console.log(`Added item: ${name} to ${cat}`);
              }
            });
            
            if (importedCount === 0) {
              throw new Error('No valid items found in the file. Check column names and category values.');
            }
            
            saveItems();
            displayItems();
            alert(`Successfully imported ${importedCount} items!`);
            fileInput.value = '';
          } catch (innerError) {
            console.error('Error processing file:', innerError);
            alert('Error processing file: ' + innerError.message);
          }
        };
        
        reader.onerror = function() {
          console.error('Error reading file');
          alert('Error reading file. Please try again.');
        };
        
        // Read as different types depending on file extension
        if (file.name.endsWith('.csv')) {
          reader.readAsText(file);
        } else {
          reader.readAsArrayBuffer(file);
        }
      } catch (error) {
        console.error('Import error:', error);
        alert('Error importing: ' + error.message);
      }
    });
  } else {
    console.error('Import button not found!');
  }

  // Generate menu
  const generateBtn = document.getElementById('generate-menu');
  if (generateBtn) {
    generateBtn.addEventListener('click', function() {
      const used = new Set();
      const menu = [];
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      let paneerCount = 0;
      const maxPaneer = 3;
      let lastPaneerDay = -2; // Day when paneer was last used

      for (let day = 0; day < 7; day++) {
        const dayMenu = {};
        let dayPaneerUsed = false; // Track if paneer used on this day
        
        for (let meal of ['breakfast', 'lunch', 'dinner']) {
          const categoryItems = items[meal];
          let available = categoryItems.filter(item => !used.has(item.name));
          const requireHigh = (meal === 'breakfast' || meal === 'dinner') ? day % 2 === 0 : day % 2 === 1;
          let candidates = requireHigh ? available.filter(item => item.highProtein) : available;
          if (candidates.length === 0) {
            candidates = available;
          }
          if (candidates.length === 0) {
            alert(`Not enough items for ${meal} on ${days[day]}`);
            return;
          }
          
          // Filter out paneer items if:
          // 1. We've already used paneer 3 times
          // 2. Paneer was used on the previous day
          // 3. Paneer already used in another meal today
          let selectedCandidates = candidates;
          if (paneerCount >= maxPaneer || day - lastPaneerDay === 1 || dayPaneerUsed) {
            selectedCandidates = candidates.filter(item => !item.name.toLowerCase().includes('paneer'));
          }
          
          // If no candidates after filtering, allow paneer if within limits and not on consecutive days
          if (selectedCandidates.length === 0) {
            selectedCandidates = candidates;
          }
          
          const selected = selectedCandidates[Math.floor(Math.random() * selectedCandidates.length)];
          dayMenu[meal] = { name: selected.name, highProtein: selected.highProtein };
          used.add(selected.name);
          
          // Check if this item is paneer and update tracking
          if (selected.name.toLowerCase().includes('paneer')) {
            dayPaneerUsed = true;
            if (paneerCount < maxPaneer) {
              paneerCount++;
              lastPaneerDay = day;
            }
          }
        }
        menu.push(dayMenu);
      }

      displayMenu(menu, days);
    });
  }

  // Shuffle menu
  const shuffleBtn = document.getElementById('shuffle-menu');
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', function() {
      const used = new Set();
      const menu = [];
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      let paneerCount = 0;
      const maxPaneer = 3;
      let lastPaneerDay = -2; // Day when paneer was last used

      for (let day = 0; day < 7; day++) {
        const dayMenu = {};
        let dayPaneerUsed = false; // Track if paneer used on this day
        
        for (let meal of ['breakfast', 'lunch', 'dinner']) {
          const categoryItems = items[meal];
          let available = categoryItems.filter(item => !used.has(item.name));
          const requireHigh = (meal === 'breakfast' || meal === 'dinner') ? day % 2 === 0 : day % 2 === 1;
          let candidates = requireHigh ? available.filter(item => item.highProtein) : available;
          if (candidates.length === 0) {
            candidates = available;
          }
          if (candidates.length === 0) {
            alert(`Not enough items for ${meal} on ${days[day]}`);
            return;
          }
          
          // Filter out paneer items if:
          // 1. We've already used paneer 3 times
          // 2. Paneer was used on the previous day
          // 3. Paneer already used in another meal today
          let selectedCandidates = candidates;
          if (paneerCount >= maxPaneer || day - lastPaneerDay === 1 || dayPaneerUsed) {
            selectedCandidates = candidates.filter(item => !item.name.toLowerCase().includes('paneer'));
          }
          
          // If no candidates after filtering, allow paneer if within limits and not on consecutive days
          if (selectedCandidates.length === 0) {
            selectedCandidates = candidates;
          }
          
          const selected = selectedCandidates[Math.floor(Math.random() * selectedCandidates.length)];
          dayMenu[meal] = { name: selected.name, highProtein: selected.highProtein };
          used.add(selected.name);
          
          // Check if this item is paneer and update tracking
          if (selected.name.toLowerCase().includes('paneer')) {
            dayPaneerUsed = true;
            if (paneerCount < maxPaneer) {
              paneerCount++;
              lastPaneerDay = day;
            }
          }
        }
        menu.push(dayMenu);
      }

      displayMenu(menu, days);
    });
  }

  // Display initial items
  displayItems();
  console.log('App initialized successfully');
}