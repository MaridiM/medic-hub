# 2FA Cron Jobs Documentation

## Overview

The 2FA module includes automated maintenance tasks that run on scheduled intervals to keep the system clean and performant. These jobs handle cleanup of expired data and enforcement of security policies.

## Architecture

All cron jobs are managed by `TwoFactorCronService` using the `@nestjs/schedule` module. Jobs can be configured via environment variables and monitored through logs.

## Scheduled Jobs

### 1) Cleanup Expired Backup Codes

**Schedule:** Daily at 2:00 AM (configurable)  
**Environment Variable:** `CRON_CLEANUP_BACKUP_CODES`  
**Default:** `0 2 * * *`

**Purpose:**
- Remove backup codes that have passed their expiration date
- Free up database space
- Maintain data hygiene

**What it does:**
1. Identifies all expired, unused backup codes
2. Deletes them from the database
3. Logs metrics (codes deleted, users affected)

**Impact:** Low — only removes already expired codes

---

### 2) Cleanup Old Devices

**Schedule:** Daily at 3:00 AM (configurable)  
**Environment Variable:** `CRON_CLEANUP_DEVICES`  
**Default:** `0 3 * * *`

**Purpose:**
- Remove devices that haven't been seen in 180 days
- Clean up expired device trust records
- Invalidate associated sessions

**What it does:**
1. Identifies devices meeting cleanup criteria:
   - Expired trust period
   - Not seen in 180+ days
   - Revoked devices older than cutoff
2. Invalidates all sessions from these devices
3. Deletes device records
4. Logs metrics (devices deleted, sessions invalidated)

**Impact:** Medium — users may need to re‑authenticate on old devices

---

### 3) Archive Old Security Events

**Schedule:** Weekly on Sunday at 4:00 AM (configurable)  
**Environment Variable:** `CRON_CLEANUP_EVENTS`  
**Default:** `0 4 * * 0`

**Purpose:**
- Manage security event log size
- Comply with data retention policies
- Maintain query performance

**What it does:**
1. Deletes resolved events older than retention period (90 days)
2. Deletes low‑severity unresolved events older than 2× retention
3. Keeps critical events for extended period
4. Logs metrics (events archived/deleted)

**Retention Policy:**
- Resolved events: 90 days
- Unresolved LOW/MEDIUM: 180 days
- Unresolved HIGH/CRITICAL: kept indefinitely

**Impact:** Low — historical data removal only

---

### 4) Enforce Device Limits

**Schedule:** Every 6 hours (configurable)  
**Environment Variable:** `CRON_ENFORCE_DEVICE_LIMITS`  
**Default:** `0 */6 * * *`

**Purpose:**
- Enforce maximum device limit per user
- Revoke oldest devices when limit exceeded
- Maintain security posture

**What it does:**
1. Checks all users with active devices
2. For users exceeding limit (10 devices):
   - Keeps 10 most recently used devices
   - Revokes older devices
   - Invalidates associated sessions
3. Logs enforcement actions

**Impact:** High — users may be logged out of old devices

---

## Configuration

### Environment Variables

```env
# Timezone (affects when jobs run)
TZ=America/New_York

# Custom schedules (cron format)
CRON_CLEANUP_BACKUP_CODES=0 2 * * *
CRON_CLEANUP_DEVICES=0 3 * * *
CRON_CLEANUP_EVENTS=0 4 * * 0
CRON_ENFORCE_DEVICE_LIMITS=0 */6 * * *

# Retention settings (days)
BACKUP_CODES_RETENTION_DAYS=365
DEVICES_RETENTION_DAYS=180
SECURITY_EVENTS_RETENTION_DAYS=90

# Limits
MAX_TRUSTED_DEVICES_PER_USER=10
```

### Cron Expression Format

```
┌────────────── second (optional)
│ ┌──────────── minute
│ │ ┌────────── hour
│ │ │ ┌──────── day of month
│ │ │ │ ┌────── month
│ │ │ │ │ ┌──── day of week
│ │ │ │ │ │
* * * * * *
```

**Examples:**
- `0 2 * * *` — Every day at 2:00 AM  
- `0 */6 * * *` — Every 6 hours  
- `0 0 * * 0` — Every Sunday at midnight  
- `0 0 1 * *` — First day of every month

---

## Monitoring

### Logs

All cron jobs produce detailed logs:

```
🧹 Starting expired backup codes cleanup...
✅ Backup codes cleanup completed: 42 codes removed, 12 users affected (234ms)
```

### Metrics

Each job records metrics including:
- Success/failure status
- Items processed
- Execution duration
- Error details (if failed)

**Example metrics object:**

```json
{
  "job": "cleanup_backup_codes",
  "success": true,
  "itemsProcessed": 42,
  "usersAffected": 12,
  "duration": 234,
  "timestamp": "2023-10-27T02:00:00.234Z"
}
```

### Health Checks

Check cron job status programmatically:

```ts
// In a health check endpoint
const cronStatus = this.twoFactorCronService.getCronJobsStatus();
// Returns array of job status with next run times
```

---

## Manual Execution

### Via Code

```ts
// Inject the service
constructor(
  private readonly twoFactorCronService: TwoFactorCronService
) {}

// Trigger a specific job
await this.twoFactorCronService.triggerJob('cleanup-backup-codes');
```

### Via Admin API (Future)

```graphql
mutation TriggerCronJob($jobName: String!) {
  adminTriggerCronJob(jobName: $jobName) {
    success
    message
  }
}
```

---

## Error Handling

### Failure Modes

**Database Connection Lost**
- Job logs error and retries next scheduled run
- No data corruption risk

**Job Takes Too Long**
- Next run skips if previous still running
- Prevents overlap and resource exhaustion

**Partial Failure**
- Transactions ensure atomic operations
- Metrics show partial completion

### Recovery
- Failed jobs automatically retry on next schedule
- No manual intervention required for transient failures
- Critical failures logged with full stack trace

---

## Performance Considerations

### Database Load
- Jobs run during off‑peak hours by default
- Batch operations with reasonable chunk sizes
- Indexes on queried fields (`createdAt`, `expiresAt`, etc.)

### Timing

Suggested schedule to minimize overlap:

```
02:00 — Backup codes cleanup (quick)
03:00 — Device cleanup (medium)
04:00 — Security events (Sunday only, can be slow)
Every 6h — Device limits (quick per user)
```

### Resource Usage
- Low memory footprint (streaming where possible)
- Controlled batch sizes
- Connection pooling for database

---

## Testing

### Unit Tests

Each cleanup method has unit tests:

```bash
npm test -- backup-code.service.spec.ts
npm test -- device-trust.service.spec.ts
npm test -- security-event.service.spec.ts
```

### Integration Tests

Test full cron job execution:

```bash
npm test -- 2fa-cron.service.spec.ts
```

### Manual Testing

Set aggressive schedules for testing:

```env
CRON_CLEANUP_BACKUP_CODES=*/1 * * * *  # Every minute
```

Steps:
1. Create test data with past dates  
2. Watch logs for execution  
3. Verify cleanup in database

---

## Troubleshooting

### Jobs Not Running
- Check if schedule module is imported:

```ts
// app.module.ts
ScheduleModule.forRoot();
```

- Verify service is instantiated:
  - Check module `providers` array
  - Look for initialization log
- Check cron expression validity

### Jobs Running at Wrong Time
- Verify timezone setting:

```env
TZ=America/New_York
```

- Check server time:

```bash
date
```

- Validate cron expression

### Performance Issues
- Check database indexes:

```sql
EXPLAIN ANALYZE DELETE FROM backup_codes WHERE expires_at < NOW();
```

- Reduce batch sizes if needed  
- Adjust schedules to spread load

---

## Future Improvements

### Planned Enhancements
- **Metrics Dashboard:** Grafana dashboard for cron metrics
- **Alerting:** Notifications on failures
- **Dynamic Scheduling:** Adjust schedules based on system load
- **Smart Skips:** Skip jobs if no work needed
- **Archiving:** Move old data to archive tables; compressed storage for compliance
- **Admin Controls:** UI for viewing job status, manual trigger buttons, schedule override capability

### Proposed Jobs
- **Risk Score Recalculation:** Periodic user risk assessment; update scores based on patterns
- **Anomaly Detection:** Analyze login patterns; flag suspicious accounts
- **Backup Code Reminder:** Notify users with low backup codes; encourage regeneration

---

## 🎯 Final Setup Checklist

1) **Install dependency:**
```bash
npm install @nestjs/schedule
```

2) **Create new files:**
```
src/modules/auth/2fa/services/2fa-cron.service.ts
docs/2fa/CRON_JOBS.md
```

3) **Update existing services:**
- Add/update methods in `backup-code.service.ts`
- Add/update methods in `device-trust.service.ts`
- Add method `archiveOldEvents` in `security-event.service.ts`

4) **Update modules:**
- Import `ScheduleModule` in `app.module.ts`
- Update `2fa.module.ts` with new service
- Update exports in `services/index.ts`

5) **Add environment variables to `.env`:**
```env
TZ=UTC
SECURITY_EVENTS_RETENTION_DAYS=90
```

6) **Restart the application**

7) **Verify in logs:**
```
🤖 2FA Cron Service initialized
📅 Scheduled cron jobs:
  - cleanup-backup-codes: Next run at 2023-10-28T02:00:00.000Z
  - cleanup-devices: Next run at 2023-10-28T03:00:00.000Z
```
