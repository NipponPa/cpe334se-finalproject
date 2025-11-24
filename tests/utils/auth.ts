import { Page, BrowserContext } from '@playwright/test';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Signs in a user with email and password
 */
export async function signInUser(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.locator('button:has-text("Log in")').click();
  await page.waitForURL('**/'); // Wait for redirect to home page
}

/**
 * Signs up a new user
 */
export async function signUpUser(page: Page, email: string, password: string, username: string) {
  await page.goto('/signup');
  await page.locator('#username').fill(username);
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.locator('#confirm-password').fill(password);
  await page.locator('button:has-text("Sign up")').click();
  await page.waitForURL('**/'); // Wait for redirect to home page
}

/**
 * Signs out the current user
 */
export async function signOutUser(page: Page) {
  await page.locator('button:has-text("Sign Out")').click();
  await page.waitForURL('**/welcome'); // Wait for redirect to welcome page
}

/**
 * Saves the authentication state to a file
 */
export async function saveAuthState(context: BrowserContext, fileName: string) {
  const state = await context.storageState();
  const filePath = join(process.cwd(), 'tests', 'auth-states', fileName);
  writeFileSync(filePath, JSON.stringify(state, null, 2));
}

/**
 * Loads the authentication state from a file
 */
export async function loadAuthState(context: BrowserContext, fileName: string) {
  const filePath = join(process.cwd(), 'tests', 'auth-states', fileName);
  const state = JSON.parse(readFileSync(filePath, 'utf-8'));
  await context.addInitScript(({ state }) => {
    localStorage.setItem('playwright-auth', JSON.stringify(state));
  }, { state });
}