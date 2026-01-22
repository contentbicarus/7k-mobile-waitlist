# GitHub Setup Guide

## Prerequisites
- Git installed on your computer ([Download Git](https://git-scm.com/downloads))
- GitHub account

## Steps to Push to GitHub

### 1. Install Git (if not installed)
Download and install Git from: https://git-scm.com/downloads

### 2. Initialize Git Repository (if not already initialized)
```bash
cd "C:\Users\My Computer\Desktop\7K Waitlist"
git init
```

### 3. Add All Files
```bash
git add .
```

### 4. Create Initial Commit
```bash
git commit -m "Initial commit: 7K Waitlist landing page"
```

### 5. Create Repository on GitHub
1. Go to https://github.com/new
2. Create a new repository (e.g., `7k-waitlist`)
3. **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Copy the repository URL (e.g., `https://github.com/yourusername/7k-waitlist.git`)

### 6. Add Remote and Push
```bash
# Add GitHub as remote (replace with your repository URL)
git remote add origin https://github.com/yourusername/7k-waitlist.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Alternative: Using GitHub Desktop

If you prefer a GUI:
1. Download [GitHub Desktop](https://desktop.github.com/)
2. Sign in with your GitHub account
3. File → Add Local Repository
4. Select your project folder
5. Click "Publish repository" to push to GitHub

## What Gets Pushed

The `.gitignore` file ensures these are **excluded**:
- `node_modules/` - Dependencies (will be installed via `npm install`)
- `.vercel/` - Vercel deployment files
- `.env` files - Environment variables (should be set in Vercel)
- Development files (`format-private-key.js`, `api/test-env.js`, `generated-page.html`)
- Unused images

## What Gets Included

✅ All essential project files:
- `index.html`
- `styles.css`
- `package.json`
- `api/submit-waitlist.js`
- `images/` (only used images)
- `README/` folder (all documentation)
- `.gitignore`

## After Pushing

Once pushed to GitHub, you can:
- Share the repository URL with your team
- Set up GitHub Actions for CI/CD (optional)
- Use GitHub Issues for bug tracking
- Collaborate with others

## Updating the Repository

After making changes:
```bash
git add .
git commit -m "Description of changes"
git push
```
