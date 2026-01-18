# CRM Dashboard - Feature Guide

## 🎯 Quick Start

Navigate to `/admin/leads` to access the new CRM dashboard.

## 📊 Dashboard Overview

### Analytics Cards (Top Section)
Four key metrics displayed prominently:
1. **Total Leads** - Count of all leads across all stages
2. **Conversion Rate** - Percentage of leads that converted (with count)
3. **Total Revenue** - Sum of revenue from converted leads
4. **Potential Revenue** - Sum of estimated value from active pipeline

### Search & Filter Bar
- **Search Box**: Type to search by name, email, or phone number
- **Source Filter**: Filter by Audit, Manual, Referral, or Campaign
- **Priority Filter**: Filter by Hot, Warm, or Cold leads
- **Sort Dropdown**: Sort by Newest, Oldest, Highest Value, or Last Contacted

## 🎴 Kanban Board

### Five Status Columns:
1. **New** - Fresh leads not yet contacted
2. **Contacted** - Leads that have been reached out to
3. **Qualified** - Leads showing strong interest
4. **Converted** - Successfully closed deals
5. **Lost** - Leads that didn't convert

### Column Features:
- **Badge Count**: Shows number of leads in each column
- **Potential Value**: Displays total estimated revenue per column
- **Info Icon**: Hover to see stage description and tips
- **Empty State**: Helpful message and CTA when column is empty

## 🎴 Lead Cards

### Card Information Display:
- **Lead Name** (clickable to view details)
- **Company Name** (if available)
- **Priority Badge**: 🔥 Hot (red) | ⏰ Warm (blue) | ⏰ Cold (gray)
- **Overdue Badge**: Red animated pulse if follow-up is overdue
- **Email Address** with icon
- **Phone Number** with icon (if available)
- **Source Badge**: audit, manual, referral, campaign
- **Industry Badge** (if available)
- **Estimated Value**: Green dollar amount
- **Last Contact**: "X days ago"
- **Next Follow-Up**: "in X days" or "Overdue!"

### Visual Indicators:
- **Left Border Colors**:
  - Red: Overdue follow-up
  - Orange: Hot priority lead
- **Hover Effects**: Shadow elevation and subtle animations
- **Drag State**: Opacity change when dragging

### Quick Actions (Bottom of Card):
1. **Email Button** (Purple) - Opens default email client
2. **Call Button** (Green) - Initiates phone call (if phone exists)
3. **More Menu** (⋮) - Additional options:
   - View Details (navigates to lead detail page)
   - Quick Edit (coming soon)
   - Add Note (coming soon)

### Hover Card:
Hover over lead name to see:
- Full lead name
- Last contacted timestamp
- Full notes/comments

## 🎯 Drag & Drop

### How to Use:
1. **Click and hold** on any lead card
2. **Drag** to desired status column
3. **Drop** to update status
4. **Feedback**: Toast notification confirms the change

### Visual Feedback:
- **During Drag**: Card becomes semi-transparent
- **Over Column**: Purple ring appears around droppable area
- **After Drop**: Success toast message appears

### Auto-Updates:
- Status changes immediately (optimistic update)
- API call updates backend
- If API fails, change is reverted with error message

## 🔍 Search & Filter Examples

### Search:
- Type "acme" → finds "Acme Corporation"
- Type "555-0101" → finds leads with that phone
- Type "@gmail" → finds all Gmail addresses

### Filters:
- **Source = Audit** → Shows only leads from audit wizard
- **Priority = Hot** → Shows only hot leads
- **Source = Referral + Priority = Warm** → Combined filters

### Sort:
- **Newest First** → Most recently created leads at top
- **Highest Value** → Leads with highest estimated value first
- **Last Contacted** → Most recently contacted leads first

## 📱 Responsive Behavior

### Mobile (< 768px):
- Analytics cards stack vertically (1 column)
- Filters stack vertically
- Kanban board scrolls horizontally
- Cards maintain 280px minimum width

### Tablet (768px - 1024px):
- Analytics cards in 2 columns
- Filters in row layout
- Kanban columns visible side-by-side

### Desktop (> 1024px):
- Analytics cards in 4 columns
- All filters in single row
- Full Kanban board visible
- Cards expand to 320px width

## 🎨 Color Coding Guide

### Priority Colors:
- **Hot** 🔥: Red/Orange (urgent, high value)
- **Warm** ⏰: Blue (interested, medium priority)
- **Cold** ⏰: Gray (low priority, long-term)

### Status Colors:
- **New**: Blue theme
- **Contacted**: Yellow theme
- **Qualified**: Purple theme
- **Converted**: Green theme
- **Lost**: Gray theme

### Alert Colors:
- **Overdue**: Red with pulse animation
- **Success**: Green toast notifications
- **Error**: Red toast notifications

## ⚡ Performance Tips

1. **Use Filters**: Narrow down large lead lists
2. **Search First**: Find specific leads quickly
3. **Sort Strategically**: Prioritize by value or urgency
4. **Batch Updates**: Use drag & drop for quick status changes

## 🔔 Important Notes

### Overdue Leads:
- Automatically highlighted with red border
- Animated pulse badge for visibility
- Appears at top when sorted by "Last Contacted"

### Hot Leads:
- Orange left border for quick identification
- Flame icon in priority badge
- Should be prioritized for follow-up

### Empty Columns:
- "New" column shows "Add Lead" button
- Other columns show drag instruction
- Helpful contextual messages

## 🚀 Keyboard Shortcuts (Future)
- `Cmd/Ctrl + K` - Focus search
- `Cmd/Ctrl + N` - Add new lead
- `Esc` - Clear filters
- Arrow keys - Navigate between cards

## 📞 Support Actions

### Email Integration:
- Click "Email" button → Opens default email client
- Pre-fills recipient address
- Ready to compose message

### Phone Integration:
- Click "Call" button → Initiates call on mobile
- Desktop: Opens default phone app (Skype, etc.)
- Only visible if phone number exists

## 🎯 Best Practices

1. **Update Status Regularly**: Drag leads as you progress them
2. **Set Follow-Up Dates**: Prevent leads from becoming overdue
3. **Use Priority Wisely**: Mark high-value leads as "Hot"
4. **Add Notes**: Document important information
5. **Review Overdue**: Check for red-bordered cards daily
6. **Monitor Analytics**: Track conversion rate trends
7. **Filter by Source**: Identify best lead sources

## 🐛 Troubleshooting

### Drag not working?
- Ensure you drag at least 8px before release
- Check if browser supports drag & drop
- Try refreshing the page

### Filters not applying?
- Clear search box first
- Check if "All" is selected in dropdowns
- Refresh page to reset

### Cards not updating?
- Check network connection
- Look for error toast messages
- Refresh page to sync with server

## 📈 Success Metrics to Track

- Time to move lead from "New" to "Contacted"
- Percentage of leads contacted before follow-up date
- Conversion rate improvement over time
- Average deal value by source
- Response time to hot leads

