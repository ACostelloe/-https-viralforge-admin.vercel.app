# 🎨 ViralForge AI - Control Panel Design Specification

**For Cursor AI / AI-Powered Builders**

---

## 📋 Project Overview

**App Name:** ViralForge AI — Control Panel  
**Purpose:** Headless AI content generation system admin interface  
**Target Users:** Digital marketers, content managers, agencies  
**Platform:** Web application (desktop-first, responsive)  

---

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary-900: #0F172A     /* Dark Navy Blue - Main backgrounds */
--primary-800: #1E293B     /* Slate Blue - Secondary backgrounds */
--primary-700: #334155     /* Lighter slate for borders */
--primary-600: #475569     /* Text on dark backgrounds */

/* Accent Colors */
--accent-400: #FACC15      /* Yellow - Primary CTAs, highlights */
--accent-300: #FDE047      /* Light yellow - Hover states */

/* Status Colors */
--success-500: #10B981     /* Green - Success states */
--success-100: #D1FAE5     /* Light green - Success backgrounds */
--error-500: #EF4444       /* Red - Error states */
--error-100: #FEE2E2       /* Light red - Error backgrounds */
--warning-500: #F59E0B     /* Orange - Warning states */
--info-500: #3B82F6       /* Blue - Info states */

/* Neutral Colors */
--gray-50: #F8FAFC         /* Very light gray - Main background */
--gray-100: #F1F5F9        /* Light gray - Card backgrounds */
--gray-200: #E2E8F0        /* Border colors */
--gray-400: #94A3B8        /* Placeholder text */
--gray-600: #475569        /* Secondary text */
--gray-900: #0F172A        /* Primary text */

/* Opacity Variants */
--overlay-dark: rgba(15, 23, 42, 0.8)
--overlay-light: rgba(248, 250, 252, 0.9)
```

### Typography
```css
/* Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Font Scales */
--text-xs: 12px     /* Small labels, metadata */
--text-sm: 14px     /* Body text, form inputs */
--text-base: 16px   /* Default body text */
--text-lg: 18px     /* Subheadings */
--text-xl: 20px     /* Card titles */
--text-2xl: 24px    /* Page headings */
--text-3xl: 30px    /* Main dashboard title */

/* Font Weights */
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### Spacing & Layout
```css
/* Spacing Scale */
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px

/* Border Radius */
--radius-sm: 4px     /* Small elements */
--radius-md: 8px     /* Default buttons, cards */
--radius-lg: 12px    /* Large cards */
--radius-xl: 16px    /* Modals, major sections */

/* Shadows */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
```

---

## 🏗️ Layout Structure

### Overall Layout
```
┌─────────────────────────────────────────────────────────────┐
│                     Top Navigation (64px)                   │
├─────────────┬───────────────────────────────────────────────┤
│   Sidebar   │              Main Content Area              │
│   (280px)   │                                              │
│             │                                              │
│             │                                              │
│             │                                              │
│             │                                              │
│             │                                              │
└─────────────┴───────────────────────────────────────────────┘
```

### Grid System
- **Container Max Width:** 1440px
- **Content Max Width:** 1200px
- **Grid Columns:** 12-column system
- **Gutter:** 24px
- **Margin:** 32px on desktop, 16px on mobile

---

## 📱 Component Library

### 1. Navigation Components

#### Top Navigation Bar
```
Height: 64px
Background: white
Border-bottom: 1px solid var(--gray-200)
Shadow: var(--shadow-sm)

Layout:
├─ Logo (left): "ViralForge AI" + icon (40px height)
├─ Search bar (center): Optional global search
└─ User section (right): 
   ├─ Notifications bell icon
   ├─ User avatar (32px)
   └─ Dropdown chevron
```

#### Sidebar Navigation
```
Width: 280px
Background: var(--primary-900)
Height: 100vh (minus top nav)

Navigation Items:
├─ Dashboard       🏠 (active state: yellow accent left border)
├─ Content         📝
├─ Scheduling      📅
├─ Accounts        👤
├─ Analytics       📊
├─ Logs           📋
└─ Settings       ⚙️

Each item:
- Height: 48px
- Padding: 12px 24px
- Icon: 20px
- Text: var(--text-sm), white
- Hover: var(--primary-800) background
- Active: var(--accent-400) left border (4px)
```

### 2. Card Components

#### Metric Card
```
Background: white
Border-radius: var(--radius-lg)
Padding: 24px
Shadow: var(--shadow-md)
Min-height: 120px

Layout:
├─ Icon (top-left): 24px, var(--accent-400)
├─ Value (center): var(--text-3xl), var(--font-bold)
├─ Label (bottom): var(--text-sm), var(--gray-600)
└─ Trend indicator (optional): ↗️ +12% (green) or ↘️ -5% (red)
```

#### Content Card
```
Background: white
Border-radius: var(--radius-lg)
Padding: 20px
Shadow: var(--shadow-sm)
Border: 1px solid var(--gray-200)

Components:
├─ Header with title and optional action button
├─ Content area (flexible)
└─ Footer (optional)
```

### 3. Form Components

#### Toggle Switch
```
Width: 48px
Height: 24px
Background (off): var(--gray-300)
Background (on): var(--accent-400)
Thumb: 20px circle, white
Animation: 0.2s ease transition
```

#### Input Field
```
Height: 40px
Padding: 8px 12px
Border: 1px solid var(--gray-300)
Border-radius: var(--radius-md)
Font: var(--text-sm)

States:
- Focus: border-color var(--accent-400), outline-color var(--accent-400)
- Error: border-color var(--error-500)
- Disabled: background var(--gray-100), opacity 0.6
```

#### Button Primary
```
Height: 40px
Padding: 8px 16px
Background: var(--accent-400)
Color: var(--primary-900)
Border-radius: var(--radius-md)
Font: var(--text-sm), var(--font-medium)

States:
- Hover: background var(--accent-300)
- Active: transform scale(0.98)
- Disabled: opacity 0.5, cursor not-allowed
- Loading: spinner icon, disabled state
```

#### Button Secondary
```
Same as primary but:
Background: white
Color: var(--gray-700)
Border: 1px solid var(--gray-300)

Hover: background var(--gray-50)
```

### 4. Status Components

#### Status Badge
```
Padding: 4px 8px
Border-radius: var(--radius-sm)
Font: var(--text-xs), var(--font-medium)

Variants:
- Success: background var(--success-100), color var(--success-500)
- Error: background var(--error-100), color var(--error-500)
- Warning: background var(--warning-100), color var(--warning-500)
- Info: background var(--info-100), color var(--info-500)
```

#### Health Indicator
```
Size: 12px circle
Position: inline with text

States:
- Online: var(--success-500) 🟢
- Warning: var(--warning-500) 🟡
- Error: var(--error-500) 🔴
- Offline: var(--gray-400) ⚫
```

---

## 📊 Screen Specifications

### 1. Dashboard (Home) Screen

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│                    Metrics Row (4 cards)                    │
├─────────────────────────────────────────────────────────────┤
│  System Status     │         Recent Activity               │
│  (left column)     │         (right column)                │
│                    │                                       │
│  - Service Status  │  - Last 10 Posts                     │
│  - Uptime          │  - Upcoming Schedule                  │
│  - Queue Status    │  - Recent Errors                     │
└─────────────────────────────────────────────────────────────┘
```

#### Metrics Cards
1. **Posts Today**
   - Icon: 📝
   - Value: "12" (large)
   - Label: "Posts Today"
   - Trend: "+3 from yesterday"

2. **Next Scheduled Post**
   - Icon: ⏰
   - Value: "15:45" (large)
   - Label: "Next Post"
   - Sublabel: "in 32 minutes"

3. **Platforms Active**
   - Icon: 🔗
   - Value: "2/2" (large)
   - Label: "Platforms Active"
   - Status: IG ✅ TikTok ✅

4. **Current Uptime**
   - Icon: 📈
   - Value: "99.97%" (large)
   - Label: "System Uptime"
   - Trend: "30 days"

#### System Status Panel
```
Title: "System Health"
Components:
├─ Service rows:
│  ├─ API Server: 🟢 Online
│  ├─ Content Gen: 🟢 Active
│  ├─ Scheduler: 🟢 Running
│  └─ Database: 🟢 Connected
├─ Queue Status:
│  ├─ Pending Tasks: 3
│  └─ Processing: 1
└─ Last Updated: "2 mins ago"
```

#### Recent Activity Panel
```
Title: "Recent Posts"
Table columns:
├─ Thumbnail (40x40px)
├─ Caption (truncated)
├─ Platform (IG/TT badge)
├─ Scheduled Time
├─ Status Badge
└─ Actions (view/edit icons)

Max 8 rows visible, "View All" link at bottom
```

### 2. Content Generation Settings Screen

#### Page Header
```
Title: "Content Settings"
Subtitle: "Configure AI content generation parameters"
Action: "Save Changes" button (sticky)
```

#### Settings Sections

##### Content Types (Card)
```
Title: "Content Types"
Description: "Select which types of content to generate"

Toggle Grid (2x3):
├─ ✅ Facts & Trivia
├─ ✅ Motivational Quotes  
├─ ✅ Memes & Humor
├─ ✅ Location Content
├─ ✅ Educational Tips
└─ ❌ Custom Prompts
```

##### AI Configuration (Card)
```
Title: "AI Settings"

Form Fields:
├─ Model Selection: Dropdown (GPT-4, Claude, Gemini)
├─ Creativity Level: Slider (Conservative → Creative)
├─ Content Length: Radio buttons (Short/Medium/Long)
├─ Language: Dropdown (English, Spanish, French...)
└─ Custom Instructions: Textarea (optional)
```

##### Trending Sources (Card)
```
Title: "Trending Data Sources"
Description: "Select sources for trending topics"

Checkbox List:
├─ ✅ Google Trends
├─ ✅ TikTok Discovery
├─ ✅ Instagram Explore
├─ ❌ Twitter Trending
├─ ❌ Reddit Hot
└─ ❌ YouTube Trending
```

##### Media Settings (Card)
```
Title: "Media Generation"

Form Fields:
├─ Image Style: Dropdown (Realistic, Artistic, Minimalist...)
├─ Video Length: Range slider (10s - 60s)
├─ Voice Provider: Dropdown (ElevenLabs, Azure, Google)
├─ Voice ID: Dropdown (based on provider)
└─ Background Music: Toggle + selection
```

### 3. Scheduling Screen

#### Scheduling Controls (Card)
```
Title: "Auto-Scheduling"

Form Layout:
├─ Auto-Schedule Toggle: Large prominent toggle
├─ Posts Per Day: 
│  ├─ Instagram: Number input (1-10)
│  └─ TikTok: Number input (1-10)
├─ Time Windows:
│  ├─ Morning: Time range picker (6:00-12:00)
│  ├─ Afternoon: Time range picker (12:00-18:00)
│  └─ Evening: Time range picker (18:00-24:00)
├─ Time Zones: Multi-select dropdown
└─ Blackout Dates: Date picker (holidays, events)
```

#### Schedule Preview (Card)
```
Title: "Upcoming Schedule"
View: Calendar/List toggle

Calendar View:
- 7-day week view
- Posts shown as colored dots
- Click to view details

List View:
Table with columns:
├─ Date/Time
├─ Platform
├─ Content Type
├─ Status
└─ Actions
```

#### Emergency Controls (Card)
```
Title: "Emergency Controls"
Background: Light red tint

Buttons:
├─ ⏸️ "Pause All Posting" (large, prominent)
├─ 🔄 "Resume Posting"
└─ 🗑️ "Clear Queue"

Status: Current state indicator
```

### 4. Accounts Screen

#### Connected Accounts (Card)
```
Title: "Social Media Accounts"

Account Rows:
┌─────────────────────────────────────────────────────────────┐
│ 📸 Instagram  │ ✅ Connected    │ 🔄 Refresh  ❌ Disconnect │
│ @myaccount    │ Expires: 30d   │                           │
├─────────────────────────────────────────────────────────────┤
│ 🎵 TikTok     │ ✅ Connected    │ 🔄 Refresh  ❌ Disconnect │
│ @myaccount    │ Expires: 60d   │                           │
├─────────────────────────────────────────────────────────────┤
│ ➕ Add Account │                 │ Connect New Account       │
└─────────────────────────────────────────────────────────────┘
```

#### Account Details Modal
```
When clicking account row:

Modal Content:
├─ Platform logo + account name
├─ Connection status and expiry
├─ Permissions granted list
├─ Usage statistics (posts this month)
├─ Token refresh button
└─ Disconnect button (destructive)
```

#### Add Account Flow
```
Step 1: Platform Selection
- Large platform cards with logos
- Click to initiate OAuth

Step 2: OAuth Flow
- External window/redirect
- Progress indicator

Step 3: Confirmation
- Account details verification
- Permission summary
- "Complete Setup" button
```

### 5. Analytics Screen

#### Analytics Overview (Cards Row)
```
4 Metric Cards:
├─ Total Posts: "156" (+12 this week)
├─ Avg Engagement: "4.2%" (+0.8% vs last month)
├─ Top Platform: "Instagram" (65% of engagement)
└─ Best Time: "3:00 PM" (highest engagement)
```

#### Charts Section
```
Chart Container (large card):
├─ Time Period Selector: 7D | 30D | 90D | 1Y
├─ Metric Selector: Views | Likes | Comments | Shares
├─ Line Chart: Performance over time
└─ Platform Toggle: All | Instagram | TikTok
```

#### Performance Table
```
Title: "Post Performance"
Sortable columns:
├─ Thumbnail (40x40)
├─ Date Posted
├─ Platform
├─ Views
├─ Likes
├─ Comments
├─ Shares
├─ Engagement Rate
└─ Actions (view details icon)

Pagination: 20 rows per page
Export button: "Download CSV"
```

#### Top Content (Card)
```
Title: "Top Performing Content"
List of top 5 posts:
├─ Thumbnail + caption preview
├─ Engagement metrics
├─ Platform badge
└─ "View Details" link
```

### 6. Logs Screen

#### Log Filters (Top Bar)
```
Filter Controls:
├─ Time Range: Date picker
├─ Severity: All | Info | Warning | Error
├─ Module: All | Content | Posting | Analytics
├─ Search: Text input
└─ Auto-refresh: Toggle (5s/30s/Off)
```

#### Log Stream (Card)
```
Title: "System Logs"

Log Entry Format:
┌─────────────────────────────────────────────────────────────┐
│ 🔴 ERROR    2024-01-15 14:32:15    Content Generation      │
│ Failed to generate image: OpenAI API rate limit exceeded   │
│ Module: openai_service.py:127                              │
│ [Retry] [View Details] [Ignore]                           │
├─────────────────────────────────────────────────────────────┤
│ ✅ INFO     2024-01-15 14:30:42    Social Posting          │
│ Successfully posted to Instagram: @account                 │
│ Post ID: 12345, Engagement: 45 likes in 2min              │
│ [View Post] [View Analytics]                               │
└─────────────────────────────────────────────────────────────┘
```

#### Error Summary (Card)
```
Title: "Error Summary (Last 24h)"

Error Stats:
├─ Critical: 0
├─ Errors: 3
├─ Warnings: 12
└─ Info: 156

Top Errors:
├─ API Rate Limits: 2 occurrences
├─ Network Timeouts: 1 occurrence
└─ Content Generation: 0 occurrences
```

---

## 🎯 Interactive Behaviors

### Micro-Interactions

#### Save State Feedback
```
States:
1. Default: "Save Changes" button
2. Saving: "Saving..." with spinner
3. Success: "Saved ✅" green background (2s)
4. Error: "Error ❌" red background with retry option
```

#### Real-time Updates
```
Components that update automatically:
├─ Dashboard metrics (every 30s)
├─ System status indicators (every 10s)
├─ Log stream (every 5s if enabled)
├─ Queue counters (every 15s)
└─ Uptime metrics (every 60s)
```

#### Loading States
```
Skeleton screens for:
├─ Dashboard metrics loading
├─ Charts loading
├─ Table data loading
└─ Account status checking

Spinner overlay for:
├─ Save operations
├─ Account connections
├─ Manual refreshes
└─ OAuth flows
```

#### Hover Effects
```
Interactive elements:
├─ Buttons: slight scale (1.02x) + shadow increase
├─ Cards: shadow elevation
├─ Table rows: background color change
├─ Navigation items: background color + icon color
└─ Status indicators: tooltip on hover
```

### Form Validation

#### Real-time Validation
```
Input validation:
├─ Required fields: red border + error message
├─ Format validation: email, URLs, numbers
├─ Range validation: min/max values
├─ Custom validation: API key format
└─ Success state: green border + checkmark
```

#### Error Handling
```
Error presentation:
├─ Inline errors: below input fields
├─ Toast notifications: top-right corner
├─ Modal errors: for critical failures
└─ Page-level errors: banner at top
```

---

## 📱 Responsive Behavior

### Breakpoints
```css
/* Desktop Large */
@media (min-width: 1440px) { /* Full layout */ }

/* Desktop */
@media (min-width: 1024px) { /* Standard layout */ }

/* Tablet */
@media (min-width: 768px) { 
  /* Sidebar collapses to icons */
  /* Cards stack in 2 columns */
}

/* Mobile */
@media (max-width: 767px) {
  /* Sidebar becomes bottom navigation */
  /* Single column layout */
  /* Simplified charts */
}
```

### Sidebar Responsive Behavior
```
Desktop (>1024px): Full sidebar (280px)
Tablet (768-1024px): Collapsed sidebar (64px, icons only)
Mobile (<768px): Bottom navigation bar
```

### Content Adaptation
```
Desktop: 4-column metric cards
Tablet: 2-column metric cards  
Mobile: 1-column metric cards

Tables: Horizontal scroll on small screens
Charts: Simplified on mobile (fewer data points)
Forms: Full-width inputs on mobile
```

---

## 🚀 Implementation Notes for Cursor AI

### Technology Stack Recommendations
```
Framework: React 18+ with TypeScript
Styling: Tailwind CSS 3.x
Charts: Recharts or Chart.js
Icons: Heroicons or Lucide React
State: React Query + Zustand
Forms: React Hook Form
Tables: TanStack Table
```

### Key Features to Implement
1. **Real-time data updates** using WebSocket or polling
2. **Optimistic UI updates** for better user experience
3. **Offline handling** with proper error states
4. **Keyboard shortcuts** for power users
5. **Accessibility** (WCAG 2.1 AA compliance)

### Performance Considerations
- **Lazy loading** for charts and heavy components
- **Virtual scrolling** for large tables/logs
- **Image optimization** for thumbnails
- **Code splitting** by route
- **Caching** for API responses

### Security Requirements
- **JWT authentication** with refresh tokens
- **HTTPS only** in production
- **CSP headers** for XSS protection
- **Input sanitization** for all forms
- **Rate limiting** indicators in UI

---

## ✅ Checklist for AI Builder

### Phase 1: Core Layout
- [ ] Implement design system (colors, typography, spacing)
- [ ] Create sidebar navigation with routing
- [ ] Build top navigation with user menu
- [ ] Implement responsive grid system
- [ ] Add basic card components

### Phase 2: Dashboard
- [ ] Create metric cards with real-time data
- [ ] Build system status indicators
- [ ] Implement recent activity table
- [ ] Add health monitoring displays
- [ ] Create auto-refresh functionality

### Phase 3: Settings Screens
- [ ] Build content generation settings form
- [ ] Create scheduling configuration panel
- [ ] Implement account management interface
- [ ] Add form validation and save states
- [ ] Create settings persistence

### Phase 4: Analytics & Monitoring
- [ ] Implement interactive charts
- [ ] Build performance data tables
- [ ] Create log viewing interface
- [ ] Add filtering and search functionality
- [ ] Implement data export features

### Phase 5: Polish & Interactions
- [ ] Add loading states and skeleton screens
- [ ] Implement error handling and messaging
- [ ] Create smooth transitions and animations
- [ ] Add keyboard shortcuts
- [ ] Implement accessibility features

---

**🎯 Ready for AI Builder Implementation**

This specification provides everything needed to build a professional, production-ready admin control panel for ViralForge AI. The design prioritizes clarity, functionality, and automation monitoring over manual content creation interfaces. 