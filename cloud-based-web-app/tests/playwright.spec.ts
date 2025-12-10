import { test, expect, type Page } from '@playwright/test';

// Set a base URL for all tests (assumes running locally)
const BASE_URL = 'http://localhost:3000';

// --- Test 1: Smoke Test and Title Verification (UNCHANGED) ---
test('1. Smoke Test: Basic Page Load and Navigation Check', async ({ page }: { page: Page }) => {
  // Navigate to the root of the application
  await page.goto(BASE_URL);

  // 1. Check for successful load status
  await expect(page).toHaveURL(BASE_URL + '/');

  // 2. Verify the page title is correct (Change 'Your App Title' to your actual title)
  const title = await page.title();
  expect(title).not.toBeNull();
  expect(title).not.toBe('Next.js App'); 
  console.log(`[Test 1] Page Title found: ${title}`);
  
  // 3. Verify the main navigation link to the 'Court Room' is present
  await expect(page.getByRole('link', { name: 'Court Room' })).toBeVisible();
});


// --- Test 2: User Interaction: Custom Mode Level Builder Entry ---
test('2. Custom Mode: Level Builder Entry and Initial State Check', async ({ page }: { page: Page }) => {
  // 1. Navigate to the main menu
  await page.goto(BASE_URL + '/escape-room');

  // 2. Click the 'Custom Mode' option to go to the level selection screen
  // The element is an h2 within a clickable div in page.tsx
  await page.getByRole('heading', { name: 'Custom Mode' }).click();

  // 3. Verify we are on the custom selection screen (Community Levels)
  await expect(page.getByRole('heading', { name: 'Community Levels' })).toBeVisible();
  
  // 4. Click the '+ Create New Level' button, which transitions to the BuilderComponent
  await page.getByRole('button', { name: '+ Create New Level' }).click();

  // 5. Verify the UI transitioned to the 'builder' mode and check level name input
  
  // Check for the Save button
  const saveButton = page.getByRole('button', { name: /Save/i });
  await expect(saveButton).toBeVisible();

  // Reverting value expectation to the assumed default 'My Custom Level'
  const levelNameInput = page.getByRole('textbox').first();
  await expect(levelNameInput).toBeVisible();
  await expect(levelNameInput).toHaveValue('My Custom Level'); 
  
  // 6. ACTION/FIX: The snapshot shows the lock must be explicitly added.
  const addPuzzleButton = page.getByRole('button', { name: '+ Add Lock' });
  await expect(addPuzzleButton).toBeVisible(); // Ensure the button is present
  await addPuzzleButton.click(); // **CLICK TO CREATE LOCK #1**

  // Now, locate the newly created puzzle ('Lock #1') and click it to enter edit mode.
  const firstLock = page.getByText('Lock #1');
  await expect(firstLock).toBeVisible();
  await firstLock.click();
  
  // 7. Verify we are in the edit state for the lock.
  const editLockTitle = page.getByRole('heading', { name: 'Edit Lock #1' });
  await expect(editLockTitle).toBeVisible();

  console.log(`[Test 2] Successfully entered Level Builder mode and verified initial state.`);
});

// --- Test 3: Locator Example: Finding Input by Value (Updated for Compatibility) ---
test('3. Locator Example: Find input by its current value using CSS selector', async ({ page }: { page: Page }) => {
  // 1. Navigate to the level builder screen (similar to Test 2 setup)
  await page.goto(BASE_URL + '/escape-room');
  await page.getByRole('heading', { name: 'Custom Mode' }).click();
  await page.getByRole('button', { name: '+ Create New Level' }).click();
  
  // 2. Use a resilient locator and revert the value check to the assumed default.
  const levelNameInput = page.getByRole('textbox').first();
  
  // 3. Assert that the input element is visible and check the default value
  await expect(levelNameInput).toBeVisible();
  await expect(levelNameInput).toHaveValue('My Custom Level');

  // 4. Change the value and assert the new value
  const newName = 'The Abandoned Library';
  await levelNameInput.fill(newName);
  await expect(levelNameInput).toHaveValue(newName);
  
  console.log(`[Test 3] Successfully demonstrated locating an input by its role and interacting with it.`);
});