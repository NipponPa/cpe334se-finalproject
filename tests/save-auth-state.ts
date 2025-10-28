import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const AUTH_FILE_NAME = 'google-auth.json';
const AUTH_FILE_PATH = path.join(__dirname, 'auth-states', AUTH_FILE_NAME);

async function saveAuthStateManually() {
  // Create auth-states directory if it doesn't exist
  const authDir = path.join(__dirname, 'auth-states');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Navigating to login page...');
  await page.goto('http://localhost:3000/login');
  
  console.log('Please manually complete Google authentication in the opened browser.');
  console.log('After successful login and redirection to your app, press Enter in this terminal to save the authentication state.');
  
  // Wait for user input (after manual login)
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  await new Promise(resolve => rl.question('Press Enter when authenticated: ', resolve));
  
  // Save the authentication state
  await context.storageState({ path: AUTH_FILE_PATH });
  console.log(`Authentication state saved to ${AUTH_FILE_PATH}`);
  
  await browser.close();
  rl.close();
}

saveAuthStateManually();