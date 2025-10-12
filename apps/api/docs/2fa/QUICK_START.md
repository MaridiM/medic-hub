# Quick Start Guide

Пошаговое руководство по интеграции 2FA в ваше приложение.

## 📋 Table of Contents

1. [Setup TOTP (Google Authenticator)](#setup-totp)
2. [Setup OTP Email](#setup-otp-email)
3. [Setup OTP SMS](#setup-otp-sms)
4. [Login with 2FA](#login-with-2fa)
5. [Manage Methods](#manage-methods)
6. [Handle Backup Codes](#handle-backup-codes)

---

## Setup TOTP

### Step 1: Generate QR Code

**GraphQL Query:**

```graphql
query GenerateTotpSetup {
  generateTotpSetup {
    methodId
    qrCodeUrl
    manualEntryKey
    issuer
    accountName
  }
}
```

**Frontend Code (React):**

```tsx
import { useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import QRCode from 'react-qr-code'

function TotpSetupStep1() {
  const [generateSetup, { data, loading }] = useLazyQuery(GENERATE_TOTP_SETUP)

  if (loading) return <div>Generating QR code...</div>

  if (!data) {
    return (
      <button onClick={() => generateSetup()}>
        Enable 2FA with Authenticator App
      </button>
    )
  }

  const { qrCodeUrl, manualEntryKey, issuer } = data.generateTotpSetup

  return (
    <div className="totp-setup">
      <h2>Step 1: Scan QR Code</h2>
      
      <div className="qr-code">
        <img src={qrCodeUrl} alt="TOTP QR Code" />
      </div>

      <div className="manual-entry">
        <p>Can't scan? Enter this key manually:</p>
        <code>{manualEntryKey}</code>
        <button onClick={() => navigator.clipboard.writeText(manualEntryKey)}>
          Copy
        </button>
      </div>

      <div className="instructions">
        <h3>How to scan:</h3>
        <ol>
          <li>Open your authenticator app (Google Authenticator, Authy, etc.)</li>
          <li>Tap "Add account" or "+"</li>
          <li>Select "Scan QR code"</li>
          <li>Point camera at the code above</li>
        </ol>
      </div>

      <button onClick={() => setStep(2)}>
        Next: Enter Verification Code
      </button>
    </div>
  )
}
```

---

### Step 2: Verify and Complete

**GraphQL Mutation:**

```graphql
mutation CompleteTotpSetup($data: CompleteTotpSetupInput!) {
  completeTotpSetup(data: $data) {
    success
    methodId
    backupCodes
    message
  }
}
```

**Frontend Code (React):**

```tsx
import { useState } from 'react'
import { useMutation } from '@apollo/client'

function TotpSetupStep2({ secret }) {
  const [code, setCode] = useState('')
  const [backupCodes, setBackupCodes] = useState(null)
  
  const [completeSetup, { loading, error }] = useMutation(COMPLETE_TOTP_SETUP, {
    onCompleted: (data) => {
      setBackupCodes(data.completeTotpSetup.backupCodes)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    completeSetup({
      variables: {
        data: {
          secret,
          code,
          name: 'Google Authenticator'
        }
      }
    })
  }

  // Step 3: Show backup codes
  if (backupCodes) {
    return <BackupCodesDisplay codes={backupCodes} />
  }

  return (
    <div className="totp-verify">
      <h2>Step 2: Enter Verification Code</h2>
      
      <form onSubmit={handleSubmit}>
        <label>
          Enter the 6-digit code from your app:
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            maxLength={6}
            pattern="\d{6}"
            required
          />
        </label>

        {error && (
          <div className="error">
            {error.message.includes('invalid_code') 
              ? 'Invalid code. Please check your authenticator app.'
              : 'Something went wrong. Please try again.'
            }
          </div>
        )}

        <button type="submit" disabled={loading || code.length !== 6}>
          {loading ? 'Verifying...' : 'Verify and Enable 2FA'}
        </button>
      </form>

      <div className="help">
        <p>💡 Tip: Make sure your phone's time is synchronized</p>
        <a href="#" onClick={() => setStep(1)}>← Go back to QR code</a>
      </div>
    </div>
  )
}
```

---

### Step 3: Save Backup Codes

**Frontend Code (React):**

```tsx
import { useState } from 'react'

function BackupCodesDisplay({ codes }) {
  const [confirmed, setConfirmed] = useState(false)

  const downloadCodes = () => {
    const text = `YourApp Backup Codes
Generated: ${new Date().toLocaleDateString()}

IMPORTANT: Save these codes in a secure place!
Each code can only be used once.

${codes.map((code, i) => `${i + 1}. ${code}`).join('\n')}

Keep these codes:
- In a password manager
- Printed in a safe place
- In encrypted cloud storage

DO NOT:
- Share these codes with anyone
- Store in plain text files
- Email to yourself
`
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `yourapp-backup-codes-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const printCodes = () => {
    window.print()
  }

  return (
    <div className="backup-codes">
      <div className="warning">
        <h2>⚠️ Save Your Backup Codes</h2>
        <p>These codes will only be shown ONCE!</p>
      </div>

      <div className="codes-list">
        {codes.map((code, index) => (
          <div key={index} className="code-item">
            <span className="code-number">{index + 1}.</span>
            <code className="code-value">{code}</code>
          </div>
        ))}
      </div>

      <div className="actions">
        <button onClick={downloadCodes} className="primary">
          📥 Download Codes
        </button>
        <button onClick={printCodes} className="secondary">
          🖨️ Print Codes
        </button>
      </div>

      <div className="confirmation">
        <label>
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
          />
          I have saved these backup codes in a secure place
        </label>
      </div>

      <button
        onClick={() => router.push('/dashboard')}
        disabled={!confirmed}
        className="continue"
      >
        Continue to Dashboard
      </button>

      <div className="help">
        <h3>When to use backup codes:</h3>
        <ul>
          <li>Lost your phone</li>
          <li>Authenticator app was deleted</li>
          <li>Got a new device</li>
        </ul>
      </div>
    </div>
  )
}
```

**CSS для печати:**

```css
@media print {
  /* Hide everything except backup codes */
  body * {
    visibility: hidden;
  }
  
  .backup-codes,
  .backup-codes * {
    visibility: visible;
  }
  
  .backup-codes {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  
  .actions,
  .confirmation {
    display: none;
  }
}
```

---

## Setup OTP Email

### Complete Flow

**Frontend Code (React):**

```tsx
import { useState } from 'react'
import { useMutation } from '@apollo/client'

function OtpEmailSetup() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [methodId, setMethodId] = useState('')
  const [code, setCode] = useState('')
  const [backupCodes, setBackupCodes] = useState(null)

  const [setupOtp] = useMutation(SETUP_OTP, {
    onCompleted: (data) => {
      setMethodId(data.setupOtp.methodId)
      setStep(2)
    }
  })

  const [sendCode] = useMutation(SEND_OTP_CODE, {
    onCompleted: () => {
      alert('Code sent! Check your email.')
    }
  })

  const [verifySetup] = useMutation(VERIFY_OTP_SETUP, {
    onCompleted: (data) => {
      setBackupCodes(data.verifyOtpSetup.backupCodes)
      setStep(3)
    }
  })

  // Step 1: Enter email
  if (step === 1) {
    return (
      <div className="otp-setup">
        <h2>Setup Email OTP</h2>
        <p>We'll send verification codes to your email</p>

        <form onSubmit={(e) => {
          e.preventDefault()
          setupOtp({
            variables: {
              data: {
                method: 'OTP_EMAIL',
                email,
                name: 'My Email'
              }
            }
          })
        }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
          <button type="submit">Continue</button>
        </form>
      </div>
    )
  }

  // Step 2: Verify code
  if (step === 2) {
    return (
      <div className="otp-verify">
        <h2>Verify Your Email</h2>
        <p>Enter the code sent to {email}</p>

        <form onSubmit={(e) => {
          e.preventDefault()
          verifySetup({
            variables: {
              data: { methodId, code }
            }
          })
        }}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            maxLength={6}
            required
          />
          <button type="submit">Verify</button>
        </form>

        <button onClick={() => sendCode({ variables: { data: { methodId } } })}>
          Resend Code
        </button>
      </div>
    )
  }

  // Step 3: Backup codes
  if (step === 3) {
    return <BackupCodesDisplay codes={backupCodes} />
  }
}
```

---

## Setup OTP SMS

**Frontend Code (React):**

```tsx
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

function OtpSmsSetup() {
  const [phone, setPhone] = useState('')
  const [methodId, setMethodId] = useState('')
  const [code, setCode] = useState('')

  const [setupOtp] = useMutation(SETUP_OTP, {
    onCompleted: (data) => {
      setMethodId(data.setupOtp.methodId)
    }
  })

  const [sendCode] = useMutation(SEND_OTP_CODE)
  const [verifySetup] = useMutation(VERIFY_OTP_SETUP)

  return (
    <div className="sms-setup">
      <h2>Setup SMS OTP</h2>

      {!methodId ? (
        <form onSubmit={(e) => {
          e.preventDefault()
          setupOtp({
            variables: {
              data: {
                method: 'OTP_SMS',
                phone,
                name: 'My Phone'
              }
            }
          })
          sendCode({ variables: { data: { methodId } } })
        }}>
          <PhoneInput
            value={phone}
            onChange={setPhone}
            defaultCountry="US"
            placeholder="Enter phone number"
          />
          <button type="submit" disabled={!phone}>
            Send Code
          </button>
        </form>
      ) : (
        <form onSubmit={(e) => {
          e.preventDefault()
          verifySetup({
            variables: {
              data: { methodId, code }
            }
          })
        }}>
          <p>Code sent to {phone}</p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
          />
          <button type="submit">Verify</button>
        </form>
      )}
    </div>
  )
}
```

---

## Login with 2FA

### Complete Login Flow

**Frontend Code (React):**

```tsx
import { useState } from 'react'
import { useMutation } from '@apollo/client'

function LoginFlow() {
  const [step, setStep] = useState('credentials') // 'credentials' | '2fa'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [requires2FA, setRequires2FA] = useState(false)
  const [twoFACode, setTwoFACode] = useState('')

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      if (data.login.requires2FA) {
        setRequires2FA(true)
        setStep('2fa')
      } else {
        // Login complete
        router.push('/dashboard')
      }
    }
  })

  const [verify2FA] = useMutation(VERIFY_2FA, {
    onCompleted: () => {
      router.push('/dashboard')
    }
  })

  // Step 1: Username & Password
  if (step === 'credentials') {
    return (
      <form onSubmit={(e) => {
        e.preventDefault()
        login({
          variables: { email, password }
        })
      }}>
        <h2>Sign In</h2>
        
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        
        <button type="submit">Sign In</button>
      </form>
    )
  }

  // Step 2: 2FA Verification
  if (step === '2fa') {
    return (
      <form onSubmit={(e) => {
        e.preventDefault()
        verify2FA({
          variables: {
            data: {
              code: twoFACode,
              trustDevice: true // Remember this device
            }
          }
        })
      }}>
        <h2>Two-Factor Authentication</h2>
        <p>Enter code from your authenticator app</p>

        <input
          type="text"
          value={twoFACode}
          onChange={(e) => setTwoFACode(e.target.value)}
          placeholder="123456"
          maxLength={6}
          autoFocus
        />

        <label>
          <input type="checkbox" defaultChecked />
          Trust this device for 30 days
        </label>

        <button type="submit">Verify</button>

        <div className="alternatives">
          <button onClick={() => setShowBackupCodeInput(true)}>
            Use backup code instead
          </button>
          <button onClick={() => requestOtpCode()}>
            Send code via email
          </button>
        </div>
      </form>
    )
  }
}
```

---

## Manage Methods

### List and Manage Methods

**Frontend Code (React):**

```tsx
import { useQuery, useMutation } from '@apollo/client'

function TwoFactorSettings() {
  const { data, loading, refetch } = useQuery(MY_2FA_METHODS)
  const [removeMethod] = useMutation(REMOVE_2FA_METHOD, {
    onCompleted: () => refetch()
  })
  const [updateMethod] = useMutation(UPDATE_2FA_METHOD, {
    onCompleted: () => refetch()
  })

  if (loading) return <div>Loading...</div>

  const methods = data?.my2FAMethods?.methods || []
  const primary = data?.my2FAMethods?.primary

  return (
    <div className="2fa-settings">
      <h2>Two-Factor Authentication</h2>

      {methods.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="methods-list">
          {methods.map((method) => (
            <MethodCard
              key={method.id}
              method={method}
              isPrimary={method.id === primary?.id}
              onSetPrimary={() => updateMethod({
                variables: {
                  data: {
                    methodId: method.id,
                    isPrimary: true
                  }
                }
              })}
              onRemove={() => {
                if (confirm('Are you sure?')) {
                  const password = prompt('Enter your password:')
                  removeMethod({
                    variables: {
                      data: {
                        methodId: method.id,
                        password
                      }
                    }
                  })
                }
              }}
            />
          ))}
        </div>
      )}

      <div className="add-method">
        <h3>Add New Method</h3>
        <button onClick={() => router.push('/2fa/setup/totp')}>
          📱 Authenticator App
        </button>
        <button onClick={() => router.push('/2fa/setup/email')}>
          📧 Email OTP
        </button>
        <button onClick={() => router.push('/2fa/setup/sms')}>
          📲 SMS OTP
        </button>
      </div>
    </div>
  )
}

function MethodCard({ method, isPrimary, onSetPrimary, onRemove }) {
  const icons = {
    TOTP: '📱',
    OTP_EMAIL: '📧',
    OTP_SMS: '📲',
    WEBAUTHN: '🔑',
    PASSKEY: '👆'
  }

  return (
    <div className={`method-card ${isPrimary ? 'primary' : ''}`}>
      <div className="method-icon">
        {icons[method.method]}
      </div>

      <div className="method-info">
        <div className="method-name">
          {method.name || method.method}
          {isPrimary && <span className="badge">Primary</span>}
        </div>
        <div className="method-stats">
          Last used: {formatDate(method.lastUsedAt)} | 
          Used {method.useCount} times
        </div>
      </div>

      <div className="method-actions">
        {!isPrimary && (
          <button onClick={onSetPrimary} className="secondary">
            Set as Primary
          </button>
        )}
        <button onClick={onRemove} className="danger">
          Remove
        </button>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="empty-state">
      <h3>🔒 Protect Your Account</h3>
      <p>
        Two-factor authentication adds an extra layer of security 
        to your account.
      </p>
      <button onClick={() => router.push('/2fa/setup')}>
        Enable 2FA
      </button>
    </div>
  )
}
```

---

## Handle Backup Codes

### View Backup Codes Status

**Frontend Code (React):**

```tsx
import { useQuery } from '@apollo/client'

function BackupCodesStatus() {
  const { data } = useQuery(BACKUP_CODES_STATUS)
  
  if (!data) return null

  const { total, used, remaining, isLow } = data.backupCodesStatus

  return (
    <div className={`backup-status ${isLow ? 'warning' : ''}`}>
      <h3>Backup Codes</h3>
      
      <div className="progress">
        <div 
          className="progress-bar"
          style={{ width: `${(remaining / total) * 100}%` }}
        />
      </div>

      <div className="stats">
        <span>Used: {used}/{total}</span>
        <span>Remaining: {remaining}</span>
      </div>

      {isLow && (
        <div className="warning-message">
          ⚠️ Running low on backup codes! Consider regenerating.
        </div>
      )}

      <button onClick={() => setShowRegenerateModal(true)}>
        Regenerate Codes
      </button>
    </div>
  )
}
```

### Regenerate Backup Codes

**Frontend Code (React):**

```tsx
import { useState } from 'react'
import { useMutation } from '@apollo/client'

function RegenerateBackupCodes({ methodId }) {
  const [password, setPassword] = useState('')
  const [newCodes, setNewCodes] = useState(null)

  const [regenerate] = useMutation(REGENERATE_BACKUP_CODES, {
    onCompleted: (data) => {
      setNewCodes(data.regenerateBackupCodes.backupCodes)
    }
  })

  if (newCodes) {
    return <BackupCodesDisplay codes={newCodes} />
  }

  return (
    <div className="regenerate-modal">
      <h2>⚠️ Regenerate Backup Codes</h2>
      
      <div className="warning">
        <p>This will invalidate all existing backup codes!</p>
        <p>Make sure you have access to your authenticator app.</p>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault()
        regenerate({
          variables: {
            data: { methodId, password }
          }
        })
      }}>
        <label>
          Enter your password to confirm:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <div className="actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="danger">
            Regenerate Codes
          </button>
        </div>
      </form>
    </div>
  )
}
```

---

## GraphQL Queries/Mutations

**client/graphql/2fa.graphql**

```graphql
# TOTP
query GenerateTotpSetup($data: GenerateTotpSetupInput) {
  generateTotpSetup(data: $data) {
    methodId
    qrCodeUrl
    manualEntryKey
    issuer
    accountName
  }
}

mutation CompleteTotpSetup($data: CompleteTotpSetupInput!) {
  completeTotpSetup(data: $data) {
    success
    methodId
    backupCodes
    message
  }
}

# OTP
mutation SetupOtp($data: SetupOtpInput!) {
  setupOtp(data: $data) {
    methodId
    destination
    message
  }
}

mutation SendOtpCode($data: SendOtpCodeInput) {
  sendOtpCode(data: $data) {
    success
    message
  }
}

mutation VerifyOtpSetup($data: VerifyOtpSetupInput!) {
  verifyOtpSetup(data: $data) {
    success
    methodId
    backupCodes
    message
  }
}

# Verification
mutation Verify2FA($data: Verify2FAInput!) {
  verify2FA(data: $data) {
    success
    message
  }
}

# Management
query My2FAMethods {
  my2FAMethods {
    methods {
      id
      method
      name
      isActive
      isPrimary
      lastUsedAt
      useCount
      createdAt
    }
    primary {
      id
      method
      name
    }
    totalActive
    is2FAEnabled
  }
}

mutation Update2FAMethod($data: Update2FAMethodInput!) {
  update2FAMethod(data: $data) {
    success
  }
}

mutation Remove2FAMethod($data: Remove2FAMethodInput!) {
  remove2FAMethod(data: $data) {
    success
  }
}

# Backup Codes
query BackupCodesStatus($methodId: String) {
  backupCodesStatus(methodId: $methodId) {
    total
    used
    remaining
    expired
    isLow
  }
}

mutation RegenerateBackupCodes($data: RegenerateBackupCodesInput!) {
  regenerateBackupCodes(data: $data) {
    success
    backupCodes
    message
  }
}
```

---

## Next Steps

✅ You now have 2FA fully integrated!

**Recommended additions:**

1. Add email notifications for 2FA events
2. Implement device trust UI
3. Add security events dashboard
4. Set up monitoring and alerts

**See also:**

- [FLOWS.md](./FLOWS.md) - Visual flow diagrams
- [INTEGRATION.md](./INTEGRATION.md) - Framework-specific examples
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues

---

**Last Updated:** 2025-10-12
