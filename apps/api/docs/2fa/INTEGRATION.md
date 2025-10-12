# Integration Guide

Примеры интеграции 2FA модуля с различными frontend фреймворками и платформами.

## 📋 Table of Contents

1. [React Integration](#react-integration)
2. [Vue.js Integration](#vuejs-integration)
3. [Angular Integration](#angular-integration)
4. [React Native (Mobile)](#react-native-mobile)
5. [Next.js Integration](#nextjs-integration)
6. [Vanilla JavaScript](#vanilla-javascript)

---

## React Integration

### Setup Apollo Client

**src/lib/apollo.ts**

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/graphql',
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('sessionToken')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
```

---

### TOTP Setup Component

**src/components/2fa/TotpSetup.tsx**

```typescript
import React, { useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { QRCodeSVG } from 'qrcode.react'
import {
  GENERATE_TOTP_SETUP,
  COMPLETE_TOTP_SETUP,
} from '@/graphql/2fa.queries'

interface TotpSetupProps {
  onComplete: () => void
}

export const TotpSetup: React.FC<TotpSetupProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'generate' | 'verify' | 'backup'>('generate')
  const [secret, setSecret] = useState<string>('')
  const [code, setCode] = useState<string>('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])

  // Step 1: Generate QR code
  const [generateSetup, { data: setupData, loading: generating }] = useLazyQuery(
    GENERATE_TOTP_SETUP,
    {
      onCompleted: (data) => {
        setSecret(data.generateTotpSetup.manualEntryKey)
        setStep('verify')
      },
    }
  )

  // Step 2: Complete setup
  const [completeSetup, { loading: completing, error }] = useMutation(
    COMPLETE_TOTP_SETUP,
    {
      onCompleted: (data) => {
        setBackupCodes(data.completeTotpSetup.backupCodes)
        setStep('backup')
      },
    }
  )

  const handleGenerateClick = () => {
    generateSetup({
      variables: {
        data: { name: 'Google Authenticator' },
      },
    })
  }

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    completeSetup({
      variables: {
        data: {
          secret,
          code,
          name: 'My Authenticator',
        },
      },
    })
  }

  const handleDownloadCodes = () => {
    const text = backupCodes.map((c, i) => `${i + 1}. ${c}`).join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `backup-codes-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Step 1: Generate
  if (step === 'generate') {
    return (
      <div className="totp-setup">
        <div className="header">
          <h2>Enable Two-Factor Authentication</h2>
          <p>Protect your account with an authenticator app</p>
        </div>

        <button
          onClick={handleGenerateClick}
          disabled={generating}
          className="btn-primary"
        >
          {generating ? 'Generating...' : 'Get Started'}
        </button>
      </div>
    )
  }

  // Step 2: Scan QR and verify
  if (step === 'verify') {
    return (
      <div className="totp-verify">
        <div className="header">
          <h2>Scan QR Code</h2>
          <p>Use your authenticator app to scan this code</p>
        </div>

        <div className="qr-code-container">
          {setupData?.generateTotpSetup.qrCodeUrl && (
            <QRCodeSVG
              value={setupData.generateTotpSetup.qrCodeUrl}
              size={256}
              level="H"
            />
          )}
        </div>

        <div className="manual-entry">
          <details>
            <summary>Can't scan? Enter manually</summary>
            <div className="secret-key">
              <code>{secret}</code>
              <button
                onClick={() => navigator.clipboard.writeText(secret)}
                className="btn-icon"
              >
                📋 Copy
              </button>
            </div>
          </details>
        </div>

        <form onSubmit={handleVerifySubmit} className="verify-form">
          <label>
            <span>Enter the 6-digit code from your app:</span>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              maxLength={6}
              pattern="\d{6}"
              required
              autoFocus
            />
          </label>

          {error && (
            <div className="error-message">
              {error.message.includes('invalid_code')
                ? '❌ Invalid code. Make sure your device time is synced.'
                : '❌ Something went wrong. Please try again.'}
            </div>
          )}

          <button
            type="submit"
            disabled={completing || code.length !== 6}
            className="btn-primary"
          >
            {completing ? 'Verifying...' : 'Verify and Enable'}
          </button>
        </form>

        <div className="help-text">
          <p>💡 Tip: Ensure your phone's time is synchronized</p>
        </div>
      </div>
    )
  }

  // Step 3: Backup codes
  if (step === 'backup') {
    return (
      <div className="backup-codes">
        <div className="warning-header">
          <h2>⚠️ Save Your Backup Codes</h2>
          <p className="warning">These codes will only be shown ONCE!</p>
        </div>

        <div className="codes-grid">
          {backupCodes.map((code, index) => (
            <div key={index} className="code-item">
              <span className="number">{index + 1}.</span>
              <code className="code">{code}</code>
            </div>
          ))}
        </div>

        <div className="actions">
          <button onClick={handleDownloadCodes} className="btn-primary">
            📥 Download Codes
          </button>
          <button onClick={() => window.print()} className="btn-secondary">
            🖨️ Print Codes
          </button>
        </div>

        <div className="confirmation">
          <label className="checkbox-label">
            <input
              type="checkbox"
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            <span>I have saved these codes in a secure place</span>
          </label>
        </div>

        <button
          onClick={onComplete}
          disabled={!confirmed}
          className="btn-success"
        >
          Complete Setup
        </button>

        <div className="info-box">
          <h4>When to use backup codes:</h4>
          <ul>
            <li>Lost your phone</li>
            <li>Authenticator app was deleted</li>
            <li>Got a new device</li>
          </ul>
        </div>
      </div>
    )
  }
}

const [confirmed, setConfirmed] = useState(false)
```

**Styles (Tailwind CSS):**

```css
/* src/components/2fa/TotpSetup.module.css */
.totp-setup,
.totp-verify,
.backup-codes {
  @apply max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg;
}

.header {
  @apply text-center mb-6;
}

.header h2 {
  @apply text-2xl font-bold text-gray-800 mb-2;
}

.header p {
  @apply text-gray-600;
}

.qr-code-container {
  @apply flex justify-center p-6 bg-gray-50 rounded-lg mb-4;
}

.manual-entry {
  @apply mb-6;
}

.secret-key {
  @apply flex items-center gap-2 mt-2;
}

.secret-key code {
  @apply flex-1 p-2 bg-gray-100 rounded font-mono text-sm;
}

.verify-form {
  @apply space-y-4;
}

.verify-form label {
  @apply block;
}

.verify-form label span {
  @apply block mb-2 font-medium text-gray-700;
}

.verify-form input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg
         text-center text-2xl tracking-widest
         focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.error-message {
  @apply p-3 bg-red-50 border border-red-200 rounded-lg text-red-700;
}

.help-text {
  @apply mt-4 text-center text-sm text-gray-600;
}

.warning-header {
  @apply text-center mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg;
}

.warning {
  @apply text-yellow-800 font-semibold;
}

.codes-grid {
  @apply grid grid-cols-2 gap-3 mb-6;
}

.code-item {
  @apply flex items-center gap-2 p-3 bg-gray-50 rounded border border-gray-200;
}

.code-item .number {
  @apply text-gray-500 font-medium;
}

.code-item .code {
  @apply flex-1 font-mono text-lg font-semibold text-gray-800;
}

.actions {
  @apply flex gap-3 mb-6;
}

.btn-primary {
  @apply flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium
         hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
         transition-colors;
}

.btn-secondary {
  @apply flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium
         hover:bg-gray-300 transition-colors;
}

.btn-success {
  @apply w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium
         hover:bg-green-700 disabled:opacity-50 transition-colors;
}

.confirmation {
  @apply mb-6;
}

.checkbox-label {
  @apply flex items-center gap-2 cursor-pointer;
}

.checkbox-label input[type="checkbox"] {
  @apply w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500;
}

.info-box {
  @apply mt-6 p-4 bg-blue-50 rounded-lg;
}

.info-box h4 {
  @apply font-semibold text-gray-800 mb-2;
}

.info-box ul {
  @apply list-disc list-inside text-gray-700 space-y-1;
}

@media print {
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
  }
  
  .actions,
  .confirmation {
    display: none;
  }
}
```

---

### Login with 2FA Component

**src/components/auth/LoginForm.tsx**

```typescript
import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { LOGIN, VERIFY_2FA } from '@/graphql/auth.queries'

export const LoginForm: React.FC = () => {
  const router = useRouter()
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials')
  
  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [twoFACode, setTwoFACode] = useState('')
  const [trustDevice, setTrustDevice] = useState(true)
  const [showBackupCode, setShowBackupCode] = useState(false)

  // Login mutation
  const [login, { loading: loggingIn, error: loginError }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      if (data.login.requires2FA) {
        setStep('2fa')
      } else {
        localStorage.setItem('sessionToken', data.login.sessionToken)
        router.push('/dashboard')
      }
    },
  })

  // 2FA verification mutation
  const [verify2FA, { loading: verifying, error: verifyError }] = useMutation(
    VERIFY_2FA,
    {
      onCompleted: () => {
        router.push('/dashboard')
      },
    }
  )

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login({ variables: { email, password } })
  }

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    verify2FA({
      variables: {
        data: {
          code: twoFACode,
          trustDevice,
        },
      },
    })
  }

  // Step 1: Credentials
  if (step === 'credentials') {
    return (
      <div className="login-form">
        <h2>Sign In</h2>
        
        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {loginError && (
            <div className="error-message">
              {loginError.message}
            </div>
          )}

          <button
            type="submit"
            disabled={loggingIn}
            className="btn-primary"
          >
            {loggingIn ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="links">
          <a href="/forgot-password">Forgot password?</a>
          <a href="/register">Create account</a>
        </div>
      </div>
    )
  }

  // Step 2: 2FA Verification
  if (step === '2fa') {
    return (
      <div className="verify-2fa">
        <h2>Two-Factor Authentication</h2>
        <p>Enter the code from your authenticator app</p>

        <form onSubmit={handleVerifySubmit}>
          <div className="form-group">
            <input
              type="text"
              value={twoFACode}
              onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              maxLength={showBackupCode ? 8 : 6}
              className="code-input"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={trustDevice}
                onChange={(e) => setTrustDevice(e.target.checked)}
              />
              <span>Trust this device for 30 days</span>
            </label>
          </div>

          {verifyError && (
            <div className="error-message">
              {verifyError.message.includes('invalid_code')
                ? 'Invalid code. Please try again.'
                : verifyError.message}
            </div>
          )}

          <button
            type="submit"
            disabled={verifying || twoFACode.length < 6}
            className="btn-primary"
          >
            {verifying ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <div className="alternatives">
          <button
            onClick={() => setShowBackupCode(!showBackupCode)}
            className="link-button"
          >
            {showBackupCode ? '← Back to 2FA code' : 'Use backup code instead'}
          </button>
        </div>
      </div>
    )
  }
}
```

---

### Custom Hook: use2FA

**src/hooks/use2FA.ts**

```typescript
import { useQuery, useMutation } from '@apollo/client'
import {
  MY_2FA_METHODS,
  REMOVE_2FA_METHOD,
  UPDATE_2FA_METHOD,
} from '@/graphql/2fa.queries'

export const use2FA = () => {
  const { data, loading, refetch } = useQuery(MY_2FA_METHODS)

  const [removeMethod, { loading: removing }] = useMutation(REMOVE_2FA_METHOD, {
    onCompleted: () => refetch(),
  })

  const [updateMethod, { loading: updating }] = useMutation(UPDATE_2FA_METHOD, {
    onCompleted: () => refetch(),
  })

  const methods = data?.my2FAMethods?.methods || []
  const primaryMethod = data?.my2FAMethods?.primary
  const is2FAEnabled = data?.my2FAMethods?.is2FAEnabled || false

  const setPrimaryMethod = (methodId: string) => {
    return updateMethod({
      variables: {
        data: {
          methodId,
          isPrimary: true,
        },
      },
    })
  }

  const deleteMethod = (methodId: string, password: string) => {
    return removeMethod({
      variables: {
        data: {
          methodId,
          password,
        },
      },
    })
  }

  return {
    methods,
    primaryMethod,
    is2FAEnabled,
    loading,
    removing,
    updating,
    setPrimaryMethod,
    deleteMethod,
    refetch,
  }
}
```

**Usage:**

```typescript
import { use2FA } from '@/hooks/use2FA'

function Settings() {
  const { methods, is2FAEnabled, setPrimaryMethod, deleteMethod } = use2FA()

  return (
    <div>
      {methods.map((method) => (
        <MethodCard
          key={method.id}
          method={method}
          onSetPrimary={() => setPrimaryMethod(method.id)}
          onDelete={() => {
            const password = prompt('Enter password:')
            if (password) deleteMethod(method.id, password)
          }}
        />
      ))}
    </div>
  )
}
```

---

## Vue.js Integration

### Setup Apollo Client

**src/plugins/apollo.ts**

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3000/graphql',
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('sessionToken')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
```

**src/main.ts**

```typescript
import { createApp } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import App from './App.vue'
import { apolloClient } from './plugins/apollo'

const app = createApp(App)
app.provide(DefaultApolloClient, apolloClient)
app.mount('#app')
```

---

### TOTP Setup Component (Vue 3 Composition API)

**src/components/TotpSetup.vue**

```vue
<template>
  <div class="totp-setup">
    <!-- Step 1: Generate -->
    <div v-if="step === 'generate'" class="generate-step">
      <h2>Enable Two-Factor Authentication</h2>
      <p>Protect your account with an authenticator app</p>
      
      <button @click="handleGenerate" :disabled="loading">
        {{ loading ? 'Generating...' : 'Get Started' }}
      </button>
    </div>

    <!-- Step 2: Scan QR -->
    <div v-else-if="step === 'verify'" class="verify-step">
      <h2>Scan QR Code</h2>
      
      <div class="qr-code">
        <img :src="qrCodeUrl" alt="TOTP QR Code" />
      </div>

      <details>
        <summary>Can't scan? Enter manually</summary>
        <div class="manual-entry">
          <code>{{ manualKey }}</code>
          <button @click="copyToClipboard">Copy</button>
        </div>
      </details>

      <form @submit.prevent="handleVerify">
        <label>
          Enter 6-digit code:
          <input
            v-model="code"
            type="text"
            placeholder="123456"
            maxlength="6"
            pattern="\d{6}"
            required
          />
        </label>

        <div v-if="error" class="error">{{ error.message }}</div>

        <button type="submit" :disabled="verifying || code.length !== 6">
          {{ verifying ? 'Verifying...' : 'Verify' }}
        </button>
      </form>
    </div>

    <!-- Step 3: Backup Codes -->
    <div v-else-if="step === 'backup'" class="backup-step">
      <h2>⚠️ Save Your Backup Codes</h2>
      <p class="warning">These will only be shown once!</p>

      <div class="codes-grid">
        <div v-for="(code, i) in backupCodes" :key="i" class="code-item">
          <span>{{ i + 1 }}.</span>
          <code>{{ code }}</code>
        </div>
      </div>

      <div class="actions">
        <button @click="downloadCodes">📥 Download</button>
        <button @click="window.print()">🖨️ Print</button>
      </div>

      <label>
        <input v-model="confirmed" type="checkbox" />
        I have saved these codes
      </label>

      <button @click="handleComplete" :disabled="!confirmed">
        Complete Setup
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLazyQuery, useMutation } from '@vue/apollo-composable'
import { GENERATE_TOTP_SETUP, COMPLETE_TOTP_SETUP } from '@/graphql/2fa'

const emit = defineEmits<{
  complete: []
}>()

const step = ref<'generate' | 'verify' | 'backup'>('generate')
const code = ref('')
const qrCodeUrl = ref('')
const manualKey = ref('')
const backupCodes = ref<string[]>([])
const confirmed = ref(false)

// Generate QR
const { load: generate, loading } = useLazyQuery(GENERATE_TOTP_SETUP)

const handleGenerate = async () => {
  const result = await generate()
  if (result) {
    qrCodeUrl.value = result.data.generateTotpSetup.qrCodeUrl
    manualKey.value = result.data.generateTotpSetup.manualEntryKey
    step.value = 'verify'
  }
}

// Complete setup
const { mutate: complete, loading: verifying, error } = useMutation(
  COMPLETE_TOTP_SETUP
)

const handleVerify = async () => {
  const result = await complete({
    data: {
      secret: manualKey.value,
      code: code.value,
    },
  })

  if (result?.data) {
    backupCodes.value = result.data.completeTotpSetup.backupCodes
    step.value = 'backup'
  }
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(manualKey.value)
}

const downloadCodes = () => {
  const text = backupCodes.value.map((c, i) => `${i + 1}. ${c}`).join('\n')
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `backup-codes-${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

const handleComplete = () => {
  emit('complete')
}
</script>

<style scoped>
.totp-setup {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.qr-code {
  display: flex;
  justify-content: center;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
  margin: 1rem 0;
}

.codes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin: 1rem 0;
}

.code-item {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.warning {
  color: #d97706;
  font-weight: 600;
}

.error {
  color: #dc2626;
  padding: 0.5rem;
  background: #fee2e2;
  border-radius: 4px;
  margin: 0.5rem 0;
}
</style>
```

---

## Angular Integration

### Apollo Setup

**src/app/graphql.module.ts**

```typescript
import { NgModule } from '@angular/core'
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular'
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core'
import { HttpLink } from 'apollo-angular/http'

const uri = 'http://localhost:3000/graphql'

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache(),
  }
}

@NgModule({
  imports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
```

---

### TOTP Setup Component (Angular)

**src/app/components/totp-setup/totp-setup.component.ts**

```typescript
import { Component } from '@angular/core'
import { Apollo, gql } from 'apollo-angular'

const GENERATE_TOTP_SETUP = gql`
  query GenerateTotpSetup {
    generateTotpSetup {
      qrCodeUrl
      manualEntryKey
    }
  }
`

const COMPLETE_TOTP_SETUP = gql`
  mutation CompleteTotpSetup($data: CompleteTotpSetupInput!) {
    completeTotpSetup(data: $data) {
      success
      backupCodes
    }
  }
`

@Component({
  selector: 'app-totp-setup',
  templateUrl: './totp-setup.component.html',
  styleUrls: ['./totp-setup.component.scss'],
})
export class TotpSetupComponent {
  step: 'generate' | 'verify' | 'backup' = 'generate'
  loading = false
  
  qrCodeUrl: string = ''
  manualKey: string = ''
  code: string = ''
  backupCodes: string[] = []
  
  error: string | null = null

  constructor(private apollo: Apollo) {}

  generateSetup() {
    this.loading = true
    this.apollo
      .query({
        query: GENERATE_TOTP_SETUP,
      })
      .subscribe({
        next: (result: any) => {
          this.qrCodeUrl = result.data.generateTotpSetup.qrCodeUrl
          this.manualKey = result.data.generateTotpSetup.manualEntryKey
          this.step = 'verify'
          this.loading = false
        },
        error: (error) => {
          this.error = error.message
          this.loading = false
        },
      })
  }

  verifyCode() {
    this.loading = true
    this.apollo
      .mutate({
        mutation: COMPLETE_TOTP_SETUP,
        variables: {
          data: {
            secret: this.manualKey,
            code: this.code,
          },
        },
      })
      .subscribe({
        next: (result: any) => {
          self = result  # placeholder to ensure code block integrity
          this.backupCodes = result.data.completeTotpSetup.backupCodes
          this.step = 'backup'
          this.loading = false
        },
        error: (error) => {
          this.error = error.message
          this.loading = false
        },
      })
  }

  downloadCodes() {
    const text = this.backupCodes.map((c, i) => `${i + 1}. ${c}`).join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `backup-codes-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }
}
```

**totp-setup.component.html**

```html
<div class="totp-setup">
  <!-- Generate -->
  <div *ngIf="step === 'generate'" class="step">
    <h2>Enable Two-Factor Authentication</h2>
    <button (click)="generateSetup()" [disabled]="loading">
      {{ loading ? 'Generating...' : 'Get Started' }}
    </button>
  </div>

  <!-- Verify -->
  <div *ngIf="step === 'verify'" class="step">
    <h2>Scan QR Code</h2>
    
    <div class="qr-code">
      <img [src]="qrCodeUrl" alt="TOTP QR" />
    </div>

    <form (ngSubmit)="verifyCode()">
      <label>
        Enter 6-digit code:
        <input
          [(ngModel)]="code"
          name="code"
          type="text"
          placeholder="123456"
          maxlength="6"
          required
        />
      </label>

      <div *ngIf="error" class="error">{{ error }}</div>

      <button type="submit" [disabled]="loading || code.length !== 6">
        {{ loading ? 'Verifying...' : 'Verify' }}
      </button>
    </form>
  </div>

  <!-- Backup Codes -->
  <div *ngIf="step === 'backup'" class="step">
    <h2>Save Your Backup Codes</h2>
    
    <div class="codes-grid">
      <div *ngFor="let code of backupCodes; let i = index" class="code-item">
        {{ i + 1 }}. <code>{{ code }}</code>
      </div>
    </div>

    <button (click)="downloadCodes()">Download Codes</button>
  </div>
</div>
```

---

## React Native (Mobile)

### TOTP Setup with Camera QR Scanner

**src/screens/TotpSetupScreen.tsx**

```typescript
import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native'
import { useLazyQuery, useMutation } from '@apollo/client'
import QRCode from 'react-native-qrcode-svg'
import Clipboard from '@react-native-clipboard/clipboard'
import {
  GENERATE_TOTP_SETUP,
  COMPLETE_TOTP_SETUP,
} from '@/graphql/2fa.queries'

export const TotpSetupScreen = ({ navigation }) => {
  const [step, setStep] = useState('generate')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [secret, setSecret] = useState('')
  const [code, setCode] = useState('')

  const [generate, { loading: generating }] = useLazyQuery(
    GENERATE_TOTP_SETUP,
    {
      onCompleted: (data) => {
        setQrCodeUrl(data.generateTotpSetup.qrCodeUrl)
        setSecret(data.generateTotpSetup.manualEntryKey)
        setStep('verify')
      },
    }
  )

  const [complete, { loading: verifying }] = useMutation(COMPLETE_TOTP_SETUP, {
    onCompleted: (data) => {
      Alert.alert(
        'Success',
        'TOTP enabled! Save your backup codes.',
        [{ text: 'OK', onPress: () => setStep('backup') }]
      )
    },
    onError: (error) => {
      Alert.alert('Error', error.message)
    },
  })

  if (step === 'generate') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Enable 2FA</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => generate()}
          disabled={generating}
        >
          <Text style={styles.buttonText}>
            {generating ? 'Generating...' : 'Get Started'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (step === 'verify') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Scan QR Code</Text>
        
        <QRCode value={qrCodeUrl} size={200} />

        <TouchableOpacity onPress={() => Clipboard.setString(secret)}>
          <Text style={styles.link}>Copy manual entry key</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={code}
          onChangeText={setCode}
          placeholder="Enter 6-digit code"
          keyboardType="number-pad"
          maxLength={6}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            complete({
              variables: {
                data: { secret, code },
              },
            })
          }
          disabled={verifying || code.length !== 6}
        >
          <Text style={styles.buttonText}>
            {verifying ? 'Verifying...' : 'Verify'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return null
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#007AFF',
    marginTop: 10,
  },
})
```

---

## Next.js Integration

### Middleware for 2FA Check

**middleware.ts**

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/dashboard', '/settings', '/profile']
const SENSITIVE_ROUTES = ['/settings/security', '/settings/delete-account']

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('sessionToken')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Check if route requires 2FA verification
  if (SENSITIVE_ROUTES.some((route) => request.nextUrl.pathname.startsWith(route))) {
    // Call GraphQL to check session.is2FAVerified
    const response = await fetch(process.env.GRAPHQL_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `query { isSession2FAVerified }`,
      }),
    })

    const { data } = await response.json()

    if (!data?.isSession2FAVerified) {
      return NextResponse.redirect(new URL('/verify-2fa', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*'],
}
```

---

## Vanilla JavaScript

### Without Framework

```html
<!DOCTYPE html>
<html>
<head>
  <title>2FA Setup</title>
</head>
<body>
  <div id="app">
    <h2>Enable 2FA</h2>
    <button id="generateBtn">Get Started</button>
    
    <div id="qrStep" style="display:none">
      <img id="qrCode" />
      <input id="codeInput" type="text" placeholder="123456" maxlength="6" />
      <button id="verifyBtn">Verify</button>
    </div>
  </div>

  <script>
    const GRAPHQL_URL = 'http://localhost:3000/graphql'
    const TOKEN = localStorage.getItem('sessionToken')

    async function graphqlRequest(query, variables = {}) {
      const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({ query, variables }),
      })
      
      const { data, errors } = await response.json()
      
      if (errors) {
        throw new Error(errors[0].message)
      }
      
      return data
    }

    // Generate QR
    document.getElementById('generateBtn').addEventListener('click', async () => {
      try {
        const data = await graphqlRequest(`
          query {
            generateTotpSetup {
              qrCodeUrl
              manualEntryKey
            }
          }
        `)
        
        document.getElementById('qrCode').src = data.generateTotpSetup.qrCodeUrl
        document.getElementById('qrStep').style.display = 'block'
        window.totpSecret = data.generateTotpSetup.manualEntryKey
      } catch (error) {
        alert('Error: ' + error.message)
      }
    })

    // Verify code
    document.getElementById('verifyBtn').addEventListener('click', async () => {
      const code = document.getElementById('codeInput').value
      
      try {
        const data = await graphqlRequest(`
          mutation CompleteTotpSetup($data: CompleteTotpSetupInput!) {
            completeTotpSetup(data: $data) {
              success
              backupCodes
            }
          }
        `, {
          data: {
            secret: window.totpSecret,
            code,
          },
        })
        
        alert('Success! Save these codes: ' + data.completeTotpSetup.backupCodes.join(', '))
      } catch (error) {
        alert('Error: ' + error.message)
      }
    })
  </script>
</body>
</html>
```

---

## Testing

### Jest + React Testing Library

**src/components/__tests__/TotpSetup.test.tsx**

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'
import { TotpSetup } from '../TotpSetup'
import { GENERATE_TOTP_SETUP, COMPLETE_TOTP_SETUP } from '@/graphql/2fa'

const mocks = [
  {
    request: {
      query: GENERATE_TOTP_SETUP,
    },
    result: {
      data: {
        generateTotpSetup: {
          qrCodeUrl: 'data:image/png;base64,...',
          manualEntryKey: 'ABCDEFGHIJKLMNOP',
        },
      },
    },
  },
  {
    request: {
      query: COMPLETE_TOTP_SETUP,
      variables: {
        data: {
          secret: 'ABCDEFGHIJKLMNOP',
          code: '123456',
        },
      },
    },
    result: {
      data: {
        completeTotpSetup: {
          success: true,
          backupCodes: ['A1B2C3D4', 'E5F6G7H8'],
        },
      },
    },
  },
]

describe('TotpSetup', () => {
  it('generates QR code and completes setup', async () => {
    const user = userEvent.setup()
    const onComplete = jest.fn()

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TotpSetup onComplete={onComplete} />
      </MockedProvider>
    )

    // Click generate
    await user.click(screen.getByText('Get Started'))

    // Wait for QR code
    await waitFor(() => {
      expect(screen.getByAltText('TOTP QR Code')).toBeInTheDocument()
    })

    // Enter code
    const input = screen.getByPlaceholderText('123456')
    await user.type(input, '123456')

    // Submit
    await user.click(screen.getByText('Verify and Enable'))

    // Check backup codes shown
    await waitFor(() => {
      expect(screen.getByText(/Save Your Backup Codes/i)).toBeInTheDocument()
    })
  })
})
```

---

## Next Steps

- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues
- [FAQ.md](./FAQ.md) - Frequently asked questions

---

**Last Updated:** 2025-01-XX
