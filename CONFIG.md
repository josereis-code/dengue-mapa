# CONFIG.md

## Configuration Guide for Students

This document provides step-by-step instructions for configuring the application using Google Maps API, Google Apps Script, and GitHub Pages.

### Step 1: Obtain a Google Maps API Key
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project by clicking on the project drop-down and selecting 'New Project'.
3. Name your project and click 'Create'.
4. Once your project is created, navigate to the 'APIs & Services' dashboard.
5. Click on 'Enable APIs and Services'.
6. Search for 'Maps JavaScript API' and click on it, then click 'Enable'.
7. Go back to the 'APIs & Services' dashboard and select 'Credentials'.
8. Click on 'Create credentials', and select 'API key'.
9. Copy the generated API key. You will need this key for your application.

### Step 2: Deploy Google Apps Script
1. Open [Google Apps Script](https://script.google.com/).
2. Create a new project by clicking on 'New Project'.
3. In the script editor, write your function or code that integrates with your application.
4. Save the project. Name it appropriately.
5. Click on 'Deploy' > 'New deployment'.
6. Select the type of deployment (e.g., Web app).
7. Set appropriate access permissions (e.g., 'Anyone' for public access).
8. Click 'Deploy'. You will receive a URL for accessing the deployed script.

### Step 3: Configure GitHub Pages
1. Navigate to your GitHub repository, and click on 'Settings'.
2. Scroll down to the 'Pages' section.
3. Under 'Source', select the branch you want to use for GitHub Pages (usually 'main') and click 'Save'.
4. GitHub will provide a link to your site. Note this link as it will be used for accessing your application.
5. Ensure that your index.html or main file is in the root of the selected branch.

### Conclusion
Following these steps will allow you to configure the necessary components for the application.
If you encounter any issues, please refer to the official documentation for further assistance.