# Wizard Testing Guide

## Quick Start

1. **Start the development server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Navigate to the wizard**:
   ```
   http://localhost:3000/wizard
   ```

## Testing Checklist

### Step 1: Business Context
- [ ] Enter business name (required field validation)
- [ ] Enter website (optional - hover over help icon to see tooltip)
- [ ] Select industry from dropdown (required)
- [ ] Select business size
- [ ] Select monthly revenue
- [ ] Click "Continue" - should be disabled until required fields are filled
- [ ] Verify progress bar shows ~16% (1/6 steps)

### Step 2: Pain Discovery
- [ ] Hover over each pain point card to see tooltip with explanation
- [ ] Click cards to select/deselect (should show visual feedback)
- [ ] Select multiple pain points
- [ ] Verify selection counter badge appears
- [ ] Try the "Other" input field
- [ ] Click "Back" to return to Step 1
- [ ] Click "Continue" to proceed
- [ ] Verify progress bar shows ~33% (2/6 steps)

### Step 3: Growth Gaps
- [ ] Hover over each gap card to see tooltip
- [ ] Click cards to select/deselect
- [ ] Select multiple gaps
- [ ] Verify selection counter badge appears
- [ ] Try the "Other" input field
- [ ] Click "Back" to return to Step 2
- [ ] Click "Continue" to proceed
- [ ] Verify progress bar shows ~50% (3/6 steps)

### Step 4: Report Choice (Upsell)
- [ ] Verify personalized message if 3+ pain points selected
- [ ] Click "Free Growth Snapshot" card
- [ ] Click "Full Growth Blueprint" card (should show $500 badge)
- [ ] Verify "RECOMMENDED" badge on Full Blueprint
- [ ] Verify social proof elements (500+ businesses, $50k avg)
- [ ] Click "I'll decide later" link
- [ ] Select a report type (Free or Full)
- [ ] Click "Continue" - should be disabled if "later" is selected
- [ ] Verify progress bar shows ~66% (4/6 steps)

### Step 5: Email Submission

#### For Free Report:
- [ ] Verify heading says "Where should we send your audit?"
- [ ] Enter invalid email (should show error)
- [ ] Enter valid email (should show green checkmark)
- [ ] Verify privacy message with shield icon
- [ ] Click "Back" to return to Step 4
- [ ] Click "Generate My Free Audit" button
- [ ] Verify loading state ("Generating...")
- [ ] Should proceed to Step 6
- [ ] Verify progress bar shows ~83% (5/6 steps)

#### For Full Blueprint:
- [ ] Go back to Step 4 and select "Full Growth Blueprint"
- [ ] Proceed to Step 5
- [ ] Verify heading says "Where should we send your blueprint?"
- [ ] Enter valid email
- [ ] Click "Purchase Full Blueprint - $500" button
- [ ] Should redirect to payment page (Paxum)

### Step 6: Confirmation (Free Report Only)
- [ ] Verify success icon appears
- [ ] Verify heading "Your audit is being generated!"
- [ ] Check dynamic recap card shows:
  - Business name
  - Industry
  - Selected pain points (as badges)
  - Selected growth gaps (as badges)
- [ ] Verify "Check your email in 5–10 minutes" message
- [ ] Click "Schedule Strategy Call" button
- [ ] Verify progress bar shows 100% (6/6 steps)

## Visual Elements to Verify

### Progress Bar
- [ ] Animates smoothly between steps
- [ ] Shows correct percentage
- [ ] Progress message updates for each step

### Interactive Cards
- [ ] Hover effect (shadow appears)
- [ ] Selected state (primary border, light background)
- [ ] Unselected state (gray border)
- [ ] Checkmark appears when selected
- [ ] Smooth transitions

### Tooltips
- [ ] Appear on hover
- [ ] Positioned correctly (right side for cards)
- [ ] Readable text
- [ ] Dismiss on mouse leave

### Buttons
- [ ] Proper disabled states
- [ ] Loading states work
- [ ] Hover effects
- [ ] Consistent styling

### Form Validation
- [ ] Required field indicators (red asterisk)
- [ ] Inline error messages
- [ ] Success indicators (green checkmark)
- [ ] Proper focus states

## Browser Testing

Test in multiple browsers:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Mobile browsers (responsive design)

## Responsive Design

Test at different screen sizes:
- [ ] Desktop (1920px)
- [ ] Laptop (1366px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)

## API Endpoints

The wizard calls these endpoints:

1. **POST /api/leads** - Creates lead (called for paid reports)
2. **POST /api/audit** - Generates free audit
3. **POST /api/paxum/create-payment** - Creates payment session (for paid reports)

Check browser console for:
- [ ] No JavaScript errors
- [ ] API calls succeed (200/201 status)
- [ ] Proper request/response data

## Known Behaviors

### Free Report Flow:
1. User completes all steps
2. Selects "Free Growth Snapshot"
3. Enters email
4. Clicks "Generate My Free Audit"
5. API call to `/api/audit`
6. Proceeds to confirmation page

### Paid Report Flow:
1. User completes all steps
2. Selects "Full Growth Blueprint"
3. Enters email
4. Clicks "Purchase Full Blueprint - $500"
5. API call to `/api/leads` (creates lead)
6. API call to `/api/paxum/create-payment`
7. Redirects to Paxum payment page

## Troubleshooting

### If wizard doesn't load:
- Check browser console for errors
- Verify all UI components are installed
- Run `npm install` to ensure dependencies

### If API calls fail:
- Check that API route files exist in `app/api/`
- Verify server is running
- Check network tab in browser dev tools

### If styling looks wrong:
- Verify Tailwind CSS is working
- Check that `globals.css` is imported
- Clear browser cache

## Performance

- [ ] Page loads quickly
- [ ] No layout shifts
- [ ] Smooth animations
- [ ] No console warnings
- [ ] Images/icons load properly

## Accessibility

- [ ] Tab navigation works
- [ ] Screen reader friendly
- [ ] Proper ARIA labels
- [ ] Keyboard shortcuts work
- [ ] Focus indicators visible

