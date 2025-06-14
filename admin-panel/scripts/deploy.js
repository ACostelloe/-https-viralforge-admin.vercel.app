#!/usr/bin/env node

/**
 * ViralForge Admin Panel - Deployment Script
 * Automates deployment to multiple free hosting platforms
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const execCommand = (command, options = {}) => {
  try {
    const result = execSync(command, { 
      stdio: 'inherit', 
      encoding: 'utf8',
      ...options 
    });
    return result;
  } catch (error) {
    log(`❌ Command failed: ${command}`, 'red');
    throw error;
  }
};

const checkPrerequisites = () => {
  log('🔍 Checking prerequisites...', 'blue');
  
  // Check if we're in the right directory
  if (!fs.existsSync('package.json')) {
    log('❌ package.json not found. Please run this script from the admin-panel directory.', 'red');
    process.exit(1);
  }
  
  // Check if build directory exists
  if (!fs.existsSync('dist')) {
    log('📦 Building project first...', 'yellow');
    execCommand('npm run build:prod');
  }
  
  log('✅ Prerequisites checked', 'green');
};

const deployToVercel = () => {
  log('🚀 Deploying to Vercel...', 'blue');
  
  try {
    // Check if Vercel CLI is installed
    execCommand('vercel --version', { stdio: 'pipe' });
    
    // Deploy to Vercel
    execCommand('vercel --prod');
    
    log('✅ Successfully deployed to Vercel!', 'green');
    log('🌐 Your site will be available at: https://your-project.vercel.app', 'cyan');
  } catch (error) {
    log('❌ Vercel deployment failed. Make sure you have Vercel CLI installed and are logged in.', 'red');
    log('💡 Run: npm i -g vercel && vercel login', 'yellow');
  }
};

const deployToNetlify = () => {
  log('🚀 Deploying to Netlify...', 'blue');
  
  try {
    // Check if Netlify CLI is installed
    execCommand('netlify --version', { stdio: 'pipe' });
    
    // Deploy to Netlify
    execCommand('netlify deploy --prod --dir=dist');
    
    log('✅ Successfully deployed to Netlify!', 'green');
    log('🌐 Your site will be available at: https://your-site.netlify.app', 'cyan');
  } catch (error) {
    log('❌ Netlify deployment failed. Make sure you have Netlify CLI installed and are logged in.', 'red');
    log('💡 Run: npm i -g netlify-cli && netlify login', 'yellow');
  }
};

const deployToSurge = () => {
  log('🚀 Deploying to Surge.sh...', 'blue');
  
  try {
    // Check if Surge CLI is installed
    execCommand('surge --version', { stdio: 'pipe' });
    
    // Deploy to Surge
    const domain = `viralforge-admin-${Date.now()}.surge.sh`;
    execCommand(`surge ./dist ${domain}`);
    
    log('✅ Successfully deployed to Surge!', 'green');
    log(`🌐 Your site is available at: https://${domain}`, 'cyan');
  } catch (error) {
    log('❌ Surge deployment failed. Make sure you have Surge CLI installed.', 'red');
    log('💡 Run: npm i -g surge', 'yellow');
  }
};

const deployToGitHubPages = () => {
  log('🚀 Preparing GitHub Pages deployment...', 'blue');
  
  try {
    // Check if we're in a git repository
    execCommand('git status', { stdio: 'pipe' });
    
    // Add and commit changes
    execCommand('git add .');
    execCommand('git commit -m "Deploy to GitHub Pages" || true');
    execCommand('git push origin main');
    
    log('✅ Code pushed to GitHub!', 'green');
    log('🌐 GitHub Pages will deploy automatically via GitHub Actions', 'cyan');
    log('📋 Check the Actions tab in your GitHub repository for deployment status', 'yellow');
  } catch (error) {
    log('❌ GitHub Pages deployment preparation failed.', 'red');
    log('💡 Make sure you have a git repository set up and GitHub Actions enabled.', 'yellow');
  }
};

const showDeploymentSummary = () => {
  log('\n🎉 Deployment Summary', 'bright');
  log('='.repeat(50), 'blue');
  log('Your ViralForge Admin Panel has been deployed to:', 'cyan');
  log('• Vercel: https://your-project.vercel.app', 'green');
  log('• Netlify: https://your-site.netlify.app', 'green');
  log('• Surge: https://viralforge-admin-*.surge.sh', 'green');
  log('• GitHub Pages: https://username.github.io/repository/', 'green');
  log('\n📋 Next Steps:', 'yellow');
  log('1. Configure custom domains if needed', 'white');
  log('2. Set up environment variables on each platform', 'white');
  log('3. Configure monitoring and analytics', 'white');
  log('4. Test all deployments thoroughly', 'white');
  log('\n📖 For detailed instructions, see DEPLOYMENT_GUIDE.md', 'cyan');
};

const main = () => {
  const args = process.argv.slice(2);
  const platform = args[0];
  
  log('🚀 ViralForge Admin Panel Deployment Script', 'bright');
  log('='.repeat(50), 'blue');
  
  checkPrerequisites();
  
  if (platform) {
    switch (platform.toLowerCase()) {
      case 'vercel':
        deployToVercel();
        break;
      case 'netlify':
        deployToNetlify();
        break;
      case 'surge':
        deployToSurge();
        break;
      case 'github':
      case 'gh-pages':
        deployToGitHubPages();
        break;
      default:
        log(`❌ Unknown platform: ${platform}`, 'red');
        log('💡 Available platforms: vercel, netlify, surge, github', 'yellow');
        process.exit(1);
    }
  } else {
    // Deploy to all platforms
    log('🌐 Deploying to all platforms...', 'magenta');
    
    deployToVercel();
    deployToNetlify();
    deployToSurge();
    deployToGitHubPages();
    
    showDeploymentSummary();
  }
  
  log('\n✨ Deployment complete!', 'green');
};

// Handle errors gracefully
process.on('uncaughtException', (error) => {
  log(`❌ Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  log(`❌ Unhandled promise rejection: ${error.message}`, 'red');
  process.exit(1);
});

// Run the script
main(); 