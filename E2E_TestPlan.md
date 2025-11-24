# E2E Test Plan

This document outlines the end-to-end test scenarios for the authentication system and first feature of the application.

## Scenario ID: E2E-001
**Title:** User registration with email and password
**Preconditions:** Supabase authentication configured
**Steps:**
1) Open home page
2) Navigate to `/signup` page
3) Fill in valid email, password, and username
4) Submit the registration form
5) Verify successful registration redirect
**Expected:** User account is created successfully and user is redirected to home page

## Scenario ID: E2E-002
**Title:** User login with email and password
**Preconditions:** User account exists in system
**Steps:**
1) Open home page
2) Navigate to `/login` page
3) Enter valid email and password
4) Submit the login form
5) After successful authentication, verify user is redirected to home page
6) Verify user email and ID visible on home page
**Expected:** User is authenticated and home page shows authenticated user info

## Scenario ID: E2E-003
**Title:** Google OAuth authentication
**Preconditions:** Google OAuth configured in Supabase
**Steps:**
1) Open home page
2) Navigate to `/login` page
3) Click "Sign in with Google" button
4) Complete Google authentication flow
5) After callback, verify user is redirected to home page
6) Verify user email and ID visible on home page
**Expected:** User authenticates via Google OAuth and home page shows authenticated user info

## Scenario ID: E2E-004
**Title:** Password reset functionality
**Preconditions:** User account exists in system
**Steps:**
1) Open home page
2) Navigate to `/reset-password` page
3) Enter registered email address
4) Submit the reset password form
5) Verify success message is shown
6) Check that password reset email is sent
**Expected:** Password reset email is sent to the user's email address

## Scenario ID: E2E-005
**Title:** Protected route redirects unauthenticated user
**Preconditions:** No active user session
**Steps:**
1) Open home page (which is protected)
2) Verify automatic redirect to `/welcome` page
3) Confirm welcome page is displayed with login/signup options
**Expected:** Unauthenticated user is redirected to welcome page with appropriate message

## Scenario ID: E2E-006
**Title:** Login with invalid credentials
**Preconditions:** User account exists in system
**Steps:**
1) Navigate to `/login` page
2) Enter valid email but invalid password
3) Submit the login form
4) Verify error message is displayed
**Expected:** Login attempt fails with appropriate error message displayed

## Scenario ID: E2E-007
**Title:** Registration with already existing email
**Preconditions:** User account already exists in system
**Steps:**
1) Navigate to `/signup` page
2) Enter email that already exists in system
3) Fill in password and username
4) Submit the registration form
5) Verify error message is displayed
**Expected:** Registration attempt fails with appropriate error message about existing account