# Техническое Задание: Medic HUB → Doctor Lab (DL)

**Версия:** 1.1 (детализированная)
**Дата:** 2025-09-19
**На основе:** Product Requirements Document v0.2

## 1. Введение

Это детализированное техническое задание (ТЗ) для реализации платформы Doctor Lab. Документ системно переводит все пункты продуктовых требований (PRD) в конкретные технические задачи, архитектурные решения и спецификации для MVP, PRO и LATER этапов.

### 1.1. Технологический стек

- **Бэкенд (BE):** NestJS, GraphQL (Code-First), Prisma, PostgreSQL, Redis, MinIO (S3-совместимое хранилище).
- **Фронтенд (FE):** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, React Hook Form, Zod.
- **Инфраструктура:** Docker, Docker Compose.

### 1.2. Ключевые правила разработки

Разработка ведется в строгом соответствии с правилами, определенными в `.cursor/rules` и процессом документирования (ADR, Conventional Commits).

---

## 2. Детальная проработка архитектуры

### 2.1. Бэкенд: Полная схема данных Prisma

Ниже представлена полная схема данных, включающая поля для всех этапов (MVP, PRO, LATER). Поля, не относящиеся к MVP, помечены комментарием.

`apps/api/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ======================================
// Раздел 1, 2, 13, 15: Tenant, User, RBAC
// ======================================

model Tenant {
  id          String    @id @default(cuid())
  name        String    // [MVP] "Клиника 'Здоровье'" или "Dr. John Doe"
  type        TenantType @default(CLINIC) // [MVP]
  
  ownerId     String    @unique
  owner       User      @relation("TenantOwner", fields: [ownerId], references: [id])
  
  staff       Membership[]

  // --- Связи с другими моделями ---
  services    Service[]
  patients    PatientProfile[]
  schedules      Schedule[]
  invoices    Invoice[]
  tasks       Task[]
  // branches    Branch[] // [PRO]
  // notificationTemplates Json // [PRO]
  // branding    Json?    // [PRO] { logoUrl, primaryColor }

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  phone         String?   @unique
  password      String
  firstName     String
  lastName      String
  
  memberships   Membership[]
  
  ownedTenant   Tenant?   @relation("TenantOwner")
  createdSchedules Schedule[]   @relation("CreatedBy")
  assignedTasks Task[]
  
  // twoFactorSecret String? // [PRO]
  // twoFactorEnabled Boolean @default(false) // [PRO]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Membership {
  tenantId  String
  tenant    Tenant @relation(fields: [tenantId], references: [id])
  userId    String
  user      User   @relation(fields: [userId], references: [id])
  role      Role

  @@id([tenantId, userId])
}

enum TenantType {
  CLINIC
  SPECIALIST // [MVP] Для Solo Doctor
}

enum Role {
  OWNER      // [MVP]
  CLINIC_ADMIN // [MVP]
  DOCTOR     // [MVP]
  ASSISTANT_RECEPTION // [MVP]
  INVENTORY_MANAGER // [PRO]
  ACCOUNTANT // [PRO]
  USER       // [MVP] Базовая роль для аутентифицированного пользователя
  GUEST      // [MVP] Не используется в БД, только в логике
}


// ======================================
// Раздел 3: Patients & EMR
// ======================================

model Patient {
  id          String    @id @default(cuid())
  email       String?   @unique
  phone       String    @unique // [MVP] E.164 format
  firstName   String
  lastName    String
  dateOfBirth DateTime
  
  // gender      String?   // [PRO]
  // tags        String[]  // [PRO]
  // doNotContact Boolean  @default(false) // [PRO]

  profiles    PatientProfile[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model PatientProfile {
  id        String   @id @default(cuid())
  patientId String
  patient   Patient  @relation(fields: [patientId], references: [id])
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  
  emrLight  Json     // [MVP] { anamnesis, allergies, diagnoses }
  
  // insurance   Json?    // [PRO] { provider, policyNo }
  // customFields Json?   // [PRO]
  
  files     File[]
  schedules    Schedule[]
  invoices  Invoice[]
  // treatmentPlans TreatmentPlan[] // [MVP->PRO]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([patientId, tenantId])
}

model File {
  id          String   @id @default(cuid())
  profileId   String
  profile     PatientProfile @relation(fields: [profileId], references: [id])
  
  fileName    String
  fileUrl     String   // [MVP] URL to MinIO/S3
  fileType    String
  
  // tags        String[] // [PRO]
  
  uploadedAt  DateTime @default(now())
}

// ======================================
// Раздел 4, 6: Services, Treatment Plans
// ======================================

model Service {
  id          String   @id @default(cuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  
  name        String   // [MVP]
  description String?
  duration    Int      // [MVP] in minutes
  price       Float    // [MVP] Базовая цена
  
  // category    String?  // [PRO]
  // requiredResources Json? // [PRO] { "doctor": 1, "room": 1 }
  // recipe      Json?    // [PRO] Списание расходников
  
  schedules      Schedule[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model TreatmentPlan {
  id          String   @id @default(cuid())
  profileId   String
  profile     PatientProfile @relation(fields: [profileId], references: [id])
  
  name        String
  description String?
  status      TreatmentPlanStatus @default(DRAFT)
  
  // items       Json     // [MVP->PRO] { serviceId, stage, price }
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum TreatmentPlanStatus {
  DRAFT
  APPROVED
  PARTIAL
  COMPLETED
  CANCELLED
}

// ======================================
// Раздел 5: Scheduling (Schedules)
// ======================================

model Schedule {
  id          String        @id @default(cuid())
  tenantId    String
  tenant      Tenant        @relation(fields: [tenantId], references: [id])
  profileId   String
  profile     PatientProfile @relation(fields: [profileId], references: [id])
  serviceId   String
  service     Service       @relation(fields: [serviceId], references: [id])
  
  startTime   DateTime      // [MVP]
  endTime     DateTime      // [MVP]
  status      ScheduleStatus   @default(DRAFT) // [MVP]
  
  notes       String?
  
  createdById String
  createdBy   User          @relation("CreatedBy", fields: [createdById], references: [id])
  
  // origin      String?       // [PRO] "portal", "reception", "assistant"
  // bufferAfter Int @default(0) // [PRO] в минутах
  
  invoice     Invoice?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

enum ScheduleStatus {
  DRAFT
  CONFIRMED
  ARRIVED
  NO_SHOW
  IN_PROGRESS
  DONE
  CANCELLED
}

// ======================================
// Раздел 8: Billing (Invoices)
// ======================================

model Invoice {
  id          String        @id @default(cuid())
  tenantId    String
  tenant      Tenant        @relation(fields: [tenantId], references: [id])
  profileId   String
  profile     PatientProfile @relation(fields: [profileId], references: [id])
  
  scheduleId     String?       @unique
  schedule       Schedule?        @relation(fields: [scheduleId], references: [id])
  
  amount      Float         // [MVP]
  status      InvoiceStatus @default(ISSUED) // [MVP]
  
  // currency    String   @default("RUB") // [PRO]
  // taxAmount   Float?   // [PRO]
  // paymentProvider String? // [PRO]
  
  paymentLink String?       // [MVP]
  paidAt      DateTime?
  
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

enum InvoiceStatus {
  ISSUED
  PARTIALLY_PAID // [PRO]
  PAID
  VOID
  REFUNDED       // [PRO]
}

// ======================================
// Раздел 9: Inventory (Склад)
// ======================================

model InventoryItem {
  id          String   @id @default(cuid())
  tenantId    String
  // tenant      Tenant   @relation(fields: [tenantId], references: [id])
  
  sku         String   @unique // [MVP]
  name        String
  quantity    Int      @default(0) // [MVP]
  minStock    Int      @default(0) // [MVP] Пороговый остаток
  
  // category    String?  // [PRO]
  // trackLots   Boolean @default(false) // [PRO]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// ======================================
// Раздел 16: Tasks
// ======================================

model Task {
  id          String     @id @default(cuid())
  tenantId    String
  tenant      Tenant     @relation(fields: [tenantId], references: [id])
  
  title       String     // [MVP]
  description String?
  status      TaskStatus @default(OPEN) // [MVP]
  
  dueDate     DateTime?
  
  assigneeId  String?
  assignee    User?      @relation(fields: [assigneeId], references: [id])
  
  // --- [PRO] ---
  // patientId   String?
  // scheduleId     String?
  // invoiceId   String?
  
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum TaskStatus {
  OPEN
  IN_PROGRESS
  DONE
  CANCELLED
}

// ======================================
// Раздел 11: Audit
// ======================================

model AuditLog {
  id        String   @id @default(cuid())
  tenantId  String   // [MVP]
  userId    String   // [MVP] Кто совершил действие
  action    String   // [MVP] e.g., "user.login", "schedule.create"
  details   Json     // [MVP] Контекст действия
  timestamp DateTime @default(now())
}
```

### 2.2. Бэкенд: GraphQL API

API будет разделено на модули в NestJS.

- **`AuthModule`**
  - `Mutation: register(input: RegisterInput!)` - [MVP]
  - `Mutation: login(input: LoginInput!)` - [MVP]
  - `Query: me()` - [MVP]
  - `Mutation: enable2FA()` - [PRO]
  - `Mutation: confirm2FA(code: String!)` - [PRO]

- **`TenantsModule`**
  - `Mutation: createTenant(input: CreateTenantInput!)` - [MVP]
  - `Query: myTenant()` - [MVP]
  - `Mutation: updateTenantSettings(input: UpdateSettingsInput!)` - [MVP]
  - `Mutation: inviteStaff(email: String!, role: Role!)` - [MVP]
  - `Query: staff()` - [MVP]

- **`PatientsModule`**
  - `Mutation: createPatient(input: CreatePatientInput!)` - [MVP]
  - `Query: patients(search: String, page: Int)` - [MVP]
  - `Query: patient(id: String!)` - [MVP] (включая EMR, файлы, расписания)
  - `Mutation: updatePatientEMR(profileId: String!, emr: Json!)` - [MVP]
  - `Mutation: uploadFile(profileId: String!, file: Upload!)` - [MVP]
  - `Mutation: mergePatients(primaryPatientId: String!, secondaryPatientId: String!)` - [PRO]

- **`SchedulingModule`**
  - `Mutation: createService(input: CreateServiceInput!)` - [MVP]
  - `Query: services()` - [MVP]
  - `Mutation: createSchedule(input: CreateScheduleInput!)` - [MVP]
  - `Mutation: updateSchedule(id: String!, input: UpdateScheduleInput!)` - [MVP] (для DnD и смены статуса)
  - `Query: schedules(dateRange: DateRangeInput!, resourceIds: [String])` - [MVP]
  - `Query: availableSlots(date: String!, serviceId: String!)` - [MVP]

- **`BillingModule`**
  - `Mutation: createInvoiceForSchedule(scheduleId: String!)` - [MVP]
  - `Query: invoices(patientId: String)` - [MVP]
  - `Mutation: processOnlinePayment(invoiceId: String!)` - [MVP] (генерирует ссылку)
  - `Mutation: processRefund(invoiceId: String!, amount: Float)` - [PRO]

- **`InventoryModule`**
  - `Mutation: createInventoryItem(input: CreateItemInput!)` - [MVP]
  - `Query: inventoryItems()` - [MVP]
  - `Query: inventoryAlerts()` - [MVP] (возвращает товары с `quantity <= minStock`)
  - `Mutation: adjustStock(itemId: String!, change: Int!)` - [PRO]

- **`TasksModule`**
  - `Mutation: createTask(input: CreateTaskInput!)` - [MVP]
  - `Query: tasks(filters: TaskFilters!)` - [MVP]
  - `Mutation: updateTask(id: String!, input: UpdateTaskInput!)` - [MVP]

---

### 2.3. Фронтенд: Детализация экранов и компонентов

- **Общая структура:**
  - `src/app`: Роутинг.
  - `src/modules`: Папки по фичам (e.g., `calendar`, `patients`, `billing`).
  - `src/packages/components`: Общие компоненты.
  - `src/graphql`: Сгенерированный код GraphQL Code Generator.

- **Экран "Расписание" (`/schedule`) - [MVP]**
  - **Компоненты:**
    - `CalendarView`: Основной компонент на базе `fullcalendar`, отображает расписания.
    - `ScheduleCard`: Карточка записи в календаре.
    - `ScheduleEditorSheet`: Боковая панель (shadcn Sheet) для создания/редактирования записи.
    - `ResourceFilter`: Фильтры по врачам/кабинетам.
  - **GraphQL:**
    - `query schedules`: для получения записей на выбранный диапазон.
    - `mutation createSchedule`, `mutation updateSchedule`: для создания и изменения записей.

- **Экран "Пациенты" (`/patients`) - [MVP]**
  - **Компоненты:**
    - `PatientSearchInput`: Поле поиска.
    - `PatientDataTable`: Таблица с пациентами (shadcn DataTable).
    - `CreatePatientDialog`: Диалог создания нового пациента.
  - **GraphQL:**
    - `query patients`: для поиска и пагинации.
    - `mutation createPatient`.

- **Экран "Карточка пациента" (`/patients/[id]`) - [MVP]**
  - **Компоненты:**
    - `PatientHeader`: ФИО, контакты, теги.
    - `PatientTimeline`: Лента событий (записи, оплаты, файлы).
    - `EMREditor`: Редактор для `emrLight` (анамнез, диагнозы).
    - `FilesManager`: Загрузка и просмотр файлов.
  - **GraphQL:**
    - `query patient`: основной запрос для получения всех данных.
    - `mutation updatePatientEMR`, `mutation uploadFile`.

- **Экран "Счета" (`/billing`) - [MVP]**
  - **Компоненты:**
    - `InvoiceDataTable`: Таблица счетов с фильтрами.
    - `InvoiceDetails`: Просмотр деталей счета, печать, QR-код.
  - **GraphQL:**
    - `query invoices`.

- **Экран "Склад (лайт)" (`/inventory`) - [MVP]**
  - **Компоненты:**
    - `InventoryDataTable`: Таблица номенклатуры.
    - `CreateItemDialog`: Диалог добавления товара.
    - `StockAlerts`: Виджет с товарами, требующими закупки.
  - **GraphQL:**
    - `query inventoryItems`, `query inventoryAlerts`.

---

## 3. План реализации (Roadmap)

### 3.1. MVP (R1)

- **Спринт 1-2: Фундамент**
  - **BE:** Настроить проект, реализовать схему Prisma (только MVP поля), запустить миграцию.
  - **BE:** Реализовать `AuthModule` (регистрация, логин, JWT, guards).
  - **FE:** Настроить проект, UI-кит, `graphql-request` и `graphql-code-generator`.
  - **FE:** Сверстать страницы логина/регистрации и основной layout приложения.
  - **Infra:** Настроить `docker-compose.yml` для `db`, `api`, `web`.

- **Спринт 3-4: Организация и Пациенты**
  - **BE/FE:** Реализовать создание Тенанта и приглашение персонала.
  - **BE/FE:** Реализовать полный CRUD для Пациентов (поиск, создание, просмотр, редактирование EMR).
  - **BE/FE:** Реализовать загрузку файлов в карточке пациента.

- **Спринт 5-6: Расписание и Услуги**
  - **BE/FE:** Реализовать CRUD для Услуг.
  - **BE/FE:** Реализовать создание/изменение записей.
  - **FE:** Реализовать интерактивный календарь на главном экране.

- **Спринт 7: Биллинг и Задачи**
  - **BE/FE:** Реализовать создание счетов из записей и их просмотр.
  - **BE/FE:** Реализовать базовый функционал задач.
  - **BE:** Настроить логирование аудита для всех критических мутаций.

### 3.2. PRO (R2-R4) и LATER (R5+)

Функционал из этих этапов будет декомпозирован и спланирован после успешного запуска MVP. Архитектура MVP закладывает расширяемость для следующих фич:
- **Прайс-листы:** Модель `Service` будет расширена.
- **Филиалы:** Будет введена модель `Branch` и доработана логика `Tenant`.
- **Омниканальный чат:** Потребует отдельного микросервиса и интеграций.
- **DL Assistant:** Потребует интеграции с NLP-сервисами.