# Paxum/Paxos Payment Integration

This document describes the Paxum/Paxos payment gateway integration for Ignitia AI.

## Overview

The integration enables:
- Secure payment processing via Paxum/Paxos API
- OAuth2 authentication with token caching
- Payment session creation and tracking
- Webhook handling for payment status updates
- Payment status polling on the frontend

## Architecture

### Backend Components

1. **Token Management** (`lib/paxum/token.ts`)
   - OAuth2 token acquisition and caching
   - Automatic token refresh before expiration
   - Environment variable validation

2. **API Client** (`lib/paxum/client.ts`)
   - Create payments
   - Query payment status
   - List payments by ref_id
   - Status mapping utilities

3. **API Routes**
   - `POST /api/paxum/create-payment` - Create payment session
   - `GET /api/paxum/payment-status` - Check payment status
   - `POST /api/paxum/webhook` - Handle payment webhooks

### Frontend Components

1. **Payment Page** (`app/payments/[paymentSessionId]/page.tsx`)
   - Display payment status
   - Auto-polling for status updates
   - Redirect to report on completion

2. **Buy Report Button** (`components/payment/buy-report-button.tsx`)
   - Reusable component for triggering payments
   - Loading states and error handling

### Database Schema

See `database-payment-transactions.sql` for:
- `payment_sessions` - Track payment lifecycle
- `payment_transactions` - Detailed transaction records
- `webhook_events` - Audit log of webhook events

## Environment Variables

Required environment variables (add to `.env.local`):

```env
# Paxum/Paxos Configuration
PAXUM_CLIENT_ID=your_client_id
PAXUM_CLIENT_SECRET=your_client_secret
PAXUM_API_BASE_URL=https://api.sandbox.paxos.com/v2
PAXUM_OAUTH_URL=https://oauth.paxos.com/oauth2/token
PAXUM_WEBHOOK_SECRET=your_webhook_secret
```

### Environment Setup

1. **Sandbox (Development)**
   ```env
   PAXUM_API_BASE_URL=https://api.sandbox.paxos.com/v2
   ```

2. **Production**
   ```env
   PAXUM_API_BASE_URL=https://api.paxos.com/v2
   ```

## Usage

### Creating a Payment

```typescript
import { BuyReportButton } from "@/components/payment/buy-report-button"

<BuyReportButton
  leadId="lead_123"
  reportId="report_456"
  amount={500}
  currency="USD"
  description="Ignitia AI Growth Blueprint"
/>
```

### Checking Payment Status

```typescript
const response = await fetch(`/api/paxum/payment-status?refId=${refId}`)
const status = await response.json()
```

### Handling Webhooks

Webhooks are automatically handled at `/api/paxum/webhook`. Configure this URL in your Paxos dashboard:

```
https://yourdomain.com/api/paxum/webhook
```

## Payment Flow

1. **User initiates payment**
   - Clicks "Buy Full Blueprint" in wizard or report
   - Frontend calls `/api/paxum/create-payment`

2. **Payment session created**
   - Backend authenticates with Paxos OAuth2
   - Creates payment via Paxos API
   - Returns payment URL to frontend

3. **User redirected to payment**
   - User completes payment on Paxos/Paxum page
   - Paxos processes payment

4. **Webhook notification**
   - Paxos sends webhook to `/api/paxum/webhook`
   - Backend updates payment status
   - Unlocks report for user
   - Sends confirmation email

5. **User returns to site**
   - Payment status page polls for updates
   - Shows completion status
   - Redirects to report

## Payment Statuses

- `pending` - Payment session created, awaiting user action
- `processing` - Payment is being processed
- `completed` - Payment successfully completed
- `failed` - Payment failed
- `cancelled` - Payment cancelled by user
- `expired` - Payment session expired (24 hours)

## Security Considerations

1. **Credentials**
   - Store `PAXUM_CLIENT_SECRET` securely
   - Never expose credentials client-side
   - Use environment variables

2. **Webhook Verification**
   - Verify webhook signatures (if provided by Paxos)
   - Validate payload structure
   - Log all webhook events

3. **HTTPS**
   - Always use HTTPS in production
   - Secure token transmission

4. **Unique Reference IDs**
   - Format: `{leadId}-{reportId}-{timestamp}`
   - Prevents duplicate payments

## Testing

### Sandbox Testing

1. Set up sandbox credentials in `.env.local`
2. Use sandbox API URL
3. Test payment flow end-to-end
4. Verify webhook handling

### Manual Testing Checklist

- [ ] Create payment session
- [ ] Redirect to payment URL
- [ ] Complete payment (sandbox)
- [ ] Webhook received and processed
- [ ] Payment status updated
- [ ] Report unlocked
- [ ] Confirmation email sent

## TODO: Database Integration

The current implementation includes TODO comments for database integration:

1. Store payment sessions in database
2. Update payment status from webhooks
3. Query payment history
4. Reconcile payments with reports

Implement these using your chosen database (Supabase, Prisma, etc.)

## Troubleshooting

### Token Issues
- Check `PAXUM_CLIENT_ID` and `PAXUM_CLIENT_SECRET`
- Verify OAuth URL is correct
- Check token expiration handling

### Payment Creation Fails
- Verify API base URL
- Check request payload format
- Review Paxos API logs

### Webhook Not Received
- Verify webhook URL in Paxos dashboard
- Check HTTPS configuration
- Review webhook signature verification

## Support

For Paxos API documentation and support:
- Sandbox: https://api.sandbox.paxos.com/v2
- Production: https://api.paxos.com/v2
- Documentation: Contact Paxos support for API docs

