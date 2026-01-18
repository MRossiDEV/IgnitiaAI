# CRM Dashboard - Testing Checklist

## ✅ Visual Verification

### Analytics Cards
- [ ] Four cards displayed at top: Total Leads, Conversion Rate, Total Revenue, Potential Revenue
- [ ] Cards show correct numbers (7 total leads, 1 converted = 14.3%)
- [ ] Icons displayed correctly (Users, Target, DollarSign, TrendingUp)
- [ ] Cards responsive: 1 col mobile → 2 col tablet → 4 col desktop

### Search & Filter Bar
- [ ] Search input with magnifying glass icon visible
- [ ] Three dropdowns: Source, Priority, Sort
- [ ] All filters in row on desktop, stacked on mobile
- [ ] Placeholder text visible in all inputs

### Kanban Board
- [ ] Five columns visible: New, Contacted, Qualified, Converted, Lost
- [ ] Each column shows badge count
- [ ] Columns show potential revenue (where applicable)
- [ ] Info icon (ℹ️) visible on each column header
- [ ] Horizontal scroll works on mobile

### Lead Cards
- [ ] Cards display in correct columns based on status
- [ ] "Global Retail Co" in Contacted column has RED border (overdue)
- [ ] "Acme Corporation" has HOT badge (red/orange with flame icon)
- [ ] "Sunset Hospitality" in Converted column
- [ ] All cards show email and phone (where available)
- [ ] Estimated values displayed in green

## 🎯 Functional Testing

### Drag & Drop
- [ ] Click and hold on "Acme Corporation" card
- [ ] Drag to "Contacted" column
- [ ] Purple ring appears around column when hovering
- [ ] Card becomes semi-transparent while dragging
- [ ] Drop card in column
- [ ] Toast notification appears: "Lead moved to contacted ✅"
- [ ] Card now appears in Contacted column
- [ ] Drag back to "New" to reset

### Search Functionality
- [ ] Type "acme" in search box
- [ ] Only Acme Corporation card visible
- [ ] Other cards hidden
- [ ] Clear search → all cards reappear
- [ ] Type "555-0103" → finds Global Retail Co
- [ ] Type "@gmail" → no results (none have gmail)

### Filter by Source
- [ ] Click Source dropdown
- [ ] Select "Audit"
- [ ] Only audit leads visible (Acme, Sunset, Global Retail)
- [ ] Select "Referral"
- [ ] Only referral leads visible (TechStart, Enterprise Solutions)
- [ ] Select "All Sources" → all leads reappear

### Filter by Priority
- [ ] Click Priority dropdown
- [ ] Select "Hot"
- [ ] Only hot leads visible (Acme, Global Retail, Sunset)
- [ ] Select "Warm"
- [ ] Only warm leads visible (TechStart, Enterprise Solutions)
- [ ] Select "Cold"
- [ ] Only cold leads visible (Small Biz, Startup Ventures)

### Sort Functionality
- [ ] Click Sort dropdown
- [ ] Select "Highest Value"
- [ ] Global Retail ($25k) should be first in its column
- [ ] Select "Newest First"
- [ ] Small Biz (1 day old) should be first in New column
- [ ] Select "Oldest First"
- [ ] Startup Ventures (45 days) should be first in Lost column

### Combined Filters
- [ ] Set Source = "Audit" AND Priority = "Hot"
- [ ] Should show: Acme, Global Retail, Sunset
- [ ] Clear filters to reset

## 🎴 Lead Card Interactions

### Hover Effects
- [ ] Hover over "Acme Corporation" name
- [ ] Hover card appears with details and notes
- [ ] Hover over info icon on column header
- [ ] Tooltip appears with stage description
- [ ] Hover over any card
- [ ] Shadow elevation increases

### Quick Actions - Email
- [ ] Click "Email" button on any card
- [ ] Default email client opens (or browser mailto: prompt)
- [ ] Recipient email pre-filled

### Quick Actions - Call
- [ ] Click "Call" button on card with phone number
- [ ] Phone app opens (mobile) or tel: link activates
- [ ] Verify button only shows on cards with phone numbers

### Quick Actions - More Menu
- [ ] Click "⋮" (three dots) on any card
- [ ] Dropdown menu appears
- [ ] Click "View Details"
- [ ] Navigates to lead detail page
- [ ] Go back to leads page
- [ ] Click "Quick Edit" in menu
- [ ] Toast appears: "Quick edit coming soon!"
- [ ] Click "Add Note" in menu
- [ ] Toast appears: "Add note coming soon!"

## 🚨 Priority & Alert Testing

### Hot Leads
- [ ] "Acme Corporation" has red/orange badge with flame icon
- [ ] "Global Retail Co" has red/orange badge with flame icon
- [ ] Cards have orange left border

### Overdue Leads
- [ ] "Global Retail Co" has red left border (4px)
- [ ] Red "Overdue" badge with alert icon
- [ ] Badge has pulse animation
- [ ] Follow-up date shows in red text

### Timeline Display
- [ ] Cards show "Last contact: X days ago" (where applicable)
- [ ] Cards show "Follow-up: in X days" or "Overdue!"
- [ ] Clock icons displayed next to timeline info

## 📱 Responsive Testing

### Mobile (375px width)
- [ ] Open browser dev tools
- [ ] Set viewport to iPhone SE (375px)
- [ ] Analytics cards stack vertically (1 column)
- [ ] Search and filters stack vertically
- [ ] Kanban board scrolls horizontally
- [ ] Cards maintain minimum 280px width
- [ ] All text readable, no overflow

### Tablet (768px width)
- [ ] Set viewport to iPad (768px)
- [ ] Analytics cards in 2 columns
- [ ] Filters in row layout
- [ ] Kanban columns visible side-by-side
- [ ] Touch targets adequate size

### Desktop (1440px width)
- [ ] Set viewport to desktop (1440px)
- [ ] Analytics cards in 4 columns
- [ ] All filters in single row
- [ ] Full Kanban board visible
- [ ] Optimal spacing and layout

## 🎨 Empty State Testing

### Empty Column
- [ ] Drag all leads out of "Qualified" column
- [ ] Empty state appears with message
- [ ] Message says "Drag leads here to mark as qualified"
- [ ] Illustration or icon visible
- [ ] Drag a lead back → empty state disappears

### Empty New Column
- [ ] Drag all leads out of "New" column
- [ ] Empty state shows "Add Lead" button
- [ ] Click button → navigates to add lead page

## 🔄 API Integration Testing

### Status Update
- [ ] Open browser Network tab
- [ ] Drag a lead to different column
- [ ] PATCH request sent to `/api/leads/[id]`
- [ ] Request body contains new status
- [ ] Response is 200 OK
- [ ] Lead state updates in UI

### Error Handling
- [ ] Stop the dev server
- [ ] Try to drag a lead
- [ ] Error toast appears
- [ ] Lead reverts to original position
- [ ] Restart server

## 🎯 Data Accuracy

### Analytics Calculations
- [ ] Total Leads = 7 ✓
- [ ] Converted = 1 (Sunset Hospitality)
- [ ] Conversion Rate = 14.3% (1/7)
- [ ] Total Revenue = $12,000 (Sunset's actual value)
- [ ] Potential Revenue = sum of non-converted, non-lost leads

### Column Counts
- [ ] New: 2 leads (Acme, Small Biz)
- [ ] Contacted: 3 leads (TechStart, Global Retail, Enterprise)
- [ ] Qualified: 0 leads
- [ ] Converted: 1 lead (Sunset)
- [ ] Lost: 1 lead (Startup Ventures)

### Revenue Display
- [ ] Acme: $15,000
- [ ] TechStart: $8,000
- [ ] Global Retail: $25,000
- [ ] Sunset: $12,000
- [ ] Small Biz: $3,000
- [ ] Enterprise: $18,000
- [ ] Startup: $5,000

## 🐛 Edge Cases

### Long Names
- [ ] All names display without overflow
- [ ] Truncation with ellipsis if needed
- [ ] Full name visible in hover card

### Missing Data
- [ ] Cards without phone don't show call button
- [ ] Cards without company don't show company line
- [ ] Cards without priority show no priority badge
- [ ] Cards without notes show basic hover card

### Multiple Filters
- [ ] Apply all filters at once
- [ ] Results update correctly
- [ ] Clear one filter at a time
- [ ] Results update incrementally

## ✨ Polish & UX

### Animations
- [ ] Smooth drag animation
- [ ] Card hover elevation smooth
- [ ] Toast notifications slide in
- [ ] Pulse animation on overdue badge
- [ ] Column highlight transition smooth

### Accessibility
- [ ] Tab through all interactive elements
- [ ] Focus indicators visible
- [ ] Buttons have proper labels
- [ ] Color contrast sufficient
- [ ] Screen reader friendly (test if available)

### Performance
- [ ] Page loads quickly
- [ ] Drag feels responsive
- [ ] Filters apply instantly
- [ ] No lag with 7 leads
- [ ] Smooth scrolling

## 📝 Notes Section

**Issues Found:**
- 

**Suggestions:**
- 

**Browser Tested:**
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

**Devices Tested:**
- [ ] Desktop
- [ ] Tablet
- [ ] Mobile

**Overall Rating:** ⭐⭐⭐⭐⭐

