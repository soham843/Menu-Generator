# Weekly Food Menu Generator

A simple web application to manage food items and generate weekly menus.

## Features
- Add food items categorized by breakfast, lunch, or dinner
- Mark items as high-protein
- Edit item names and high-protein status
- Import items from Excel files (.xlsx, .xls) or CSV files
- Generate a weekly menu (Mon-Sun) with no repeats
- High-protein items appear in meals on alternate days

## Usage
1. Open `index.html` in a web browser.
2. Add food items manually using the form: enter name, select category, check high-protein if applicable.
3. Alternatively, import from a CSV or Excel file: Create a .csv/.xlsx file with columns Category, Name, HighProtein. Browse and select the file, then click Import Items.
4. View added items in the repository section.
5. Click "Edit" next to an item to change its name or high-protein status.
6. Click "Generate Menu" to create a random weekly menu.
7. The menu is displayed in a table with asterisks (*) marking high-protein items.
8. A legend explains that * = High Protein item.

## Requirements
- At least 7 items per category to avoid repeats.
- Sufficient high-protein items for alternate day requirements.

## Excel File Import Setup

**Easiest Option: Use CSV Format**
1. Create a CSV file with these columns (headers required):
   - **Category** (values: breakfast, lunch, or dinner)
   - **Name** (the food item name)
   - **HighProtein** (optional, values: yes/no, true/false, or 1/0)

2. Example CSV content:
   ```
   Category,Name,HighProtein
   breakfast,Oatmeal,yes
   breakfast,Eggs,yes
   lunch,Grilled Chicken,yes
   lunch,Caesar Salad,no
   dinner,Salmon,yes
   dinner,Rice,no
   ```

3. Save as `.csv` file and upload in the app

**Alternative: Excel Format (.xlsx)**
- Create an Excel file with the same column structure
- Save as .xlsx and upload
- Requires the XLSX library to load from CDN (needs internet)

**How to Import:**
- Go to "Import from Excel or CSV File" section
- Click "Choose File" and select your CSV or Excel file
- Click "Import Items" button
- Items will be imported and added to your repository

## Files
- `index.html`: Main page
- `styles.css`: Styling
- `script.js`: Application logic
- `README.md`: This file