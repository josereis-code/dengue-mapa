# Setting Up Google Sheets and Apps Script Backend

This guide will help you set up a Google Sheets document along with the necessary Apps Script backend for the 'Dengue Mapa' project.

## Step 1: Create a New Google Sheet
1. Go to [Google Sheets](https://sheets.google.com).
2. Click on the **Blank** option to create a new spreadsheet.
3. Name your sheet (e.g., "Dengue Data").

## Step 2: Input Initial Data
1. In your newly created Google Sheet, set up the headers in the first row (e.g., "Date", "Location", "Cases").
2. Enter some sample data beneath these headers for initial testing.

## Step 3: Open Apps Script
1. Click on `Extensions` in the menu.
2. Select `Apps Script` from the dropdown. This will open a new tab for Apps Script.

## Step 4: Write Your Apps Script
1. Delete any code in the script editor and replace it with your custom script.
2. Use the following example to start:
   ```javascript
   function myFunction() {
       Logger.log('Hello, world!');
   }
   ```
3. Save your script by clicking on the disk icon, name it something relevant like "DengueScript".

## Step 5: Set Up Triggers (if necessary)
1. Click on the clock icon to open the triggers menu.
2. Add a trigger by clicking on `+ Add Trigger` button in the bottom right. Set it up as desired (for example, to run daily).

## Step 6: Authorize Your Script
1. Run your function from the Apps Script editor by clicking on the `Run` button (▶️).
2. You will be prompted to authorize the script. Follow the instructions to grant necessary permissions.

## Step 7: Test Your Setup
1. Go back to your Google Sheets and refresh it.
2. Check the `View` > `Logs` in Apps Script to see if your function is working as expected.

## Conclusion
You have now successfully set up the Google Sheets and Apps Script backend for your project. From here, you can expand your script to include additional functionality as needed.