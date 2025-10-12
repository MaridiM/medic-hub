# FAQ

## Can users have multiple 2FA methods?
Yes, up to 5 by default (configurable).

## Do users need to re-setup after migration?
No. Existing TOTP and OTP setups are preserved and migrated.

## How long are backup codes valid?
Until used. They are single-use; we recommend regenerating when fewer than 3 remain.

## Can I customize code length and TTL?
Yes. TOTP digits/period and OTP expiry are configurable in constants.

## How do I remember devices?
Pass `trustDevice: true` in `verify2FA`. The server will store a trusted device record (default 30 days).

## What if a user loses their phone?
Use a backup code. If none remain, an admin can regenerate codes after password confirmation.

## Is WebAuthn supported?
Planned. The schema supports passkeys/credentials; add the WebAuthn provider when ready.

## Can I run migration multiple times?
Yes. Scripts are idempotent and will skip already migrated users.

## What about GDPR/PII?
Store minimal personal data (e.g., hashed device IDs). Provide a data export/delete flow if required.

## How do I monitor health?
Emit metrics for success rates, latency, and rate limits. Add alerts for failure spikes and crypto errors.
