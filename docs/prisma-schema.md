# Prisma Schema Documentation

This document describes the complete Prisma schema for the screenshot management SaaS application, including all models, relationships, and database structure.

## Table of Contents
1. [Overview](#overview)
2. [Models](#models)
   - [User Management](#user-management)
   - [Organization & Teams](#organization--teams)
   - [Projects](#projects)
   - [Screenshot Storage](#screenshot-storage)
   - [Comments & Annotations](#comments--annotations)
   - [Subscription & Billing](#subscription--billing)
3. [Relationships](#relationships)
4. [Indexes](#indexes)
5. [Enums](#enums)
6. [Migration Strategy](#migration-strategy)

## Overview

The Prisma schema defines a multi-tenant SaaS application for managing app store screenshots with the following key features:
- Multi-tenant user management with organizations and teams
- Screenshot job processing and storage with metadata
- Collaborative commenting and annotation system
- Subscription-based billing with multiple plan tiers

## Models

### User Management

#### User
Represents a user in the system with authentication and tenant information.

```prisma
model User {
  id             String    @id @default(uuid())
  email          String    @unique
  password       String
  firstName      String
  lastName       String
  avatar         String?
  role           Role      @default(USER)
  status         UserStatus @default(ACTIVE)
  organizationId String?
  organization   Organization? @relation(fields: [organizationId], references: [id])
  teamMemberships TeamMember[]
  screenshotJobs  ScreenshotJob[]
  comments       Comment[]
  subscription   Subscription?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}
```

Fields:
- `id`: Unique identifier (UUID)
- `email`: User's email address (unique)
- `password`: Hashed password
- `firstName`, `lastName`: User's name
- `avatar`: URL to user's avatar image
- `role`: User's role (USER, ADMIN, OWNER)
- `status`: Account status (ACTIVE, INACTIVE, SUSPENDED)
- `organizationId`: Reference to the user's organization
- `createdAt`, `updatedAt`: Timestamps

#### Organization
Represents a tenant in the multi-tenant system.

```prisma
model Organization {
  id          String    @id @default(uuid())
  name        String
  slug        String    @unique
  description String?
  logo        String?
  website     String?
  status      OrganizationStatus @default(ACTIVE)
  users       User[]
  teams       Team[]
  projects    Project[]
  subscription Subscription?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

#### Team
Represents a group of users within an organization.

```prisma
model Team {
  id             String    @id @default(uuid())
  name           String
  description    String?
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  members        TeamMember[]
  projects       Project[]
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
}
```

#### TeamMember
Junction table representing user membership in teams.

```prisma
model TeamMember {
  id     String  @id @default(uuid())
  userId String
  teamId String
  role   TeamRole @default(MEMBER)
  user   User    @relation(fields: [userId], references: [id])
  team   Team    @relation(fields: [teamId], references: [id])

  @@unique([userId, teamId])
}
```

### Projects

#### Project
Container for organizing screenshot jobs.

```prisma
model Project {
  id             String    @id @default(uuid())
  name           String
  description    String?
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  teamId         String?
  team           Team?       @relation(fields: [teamId], references: [id])
  screenshotJobs ScreenshotJob[]
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
}
```

### Screenshot Storage

#### ScreenshotJob
Represents a request to capture screenshots from an app store.

```prisma
model ScreenshotJob {
  id              String     @id @default(uuid())
  appId           String
  appName         String
  appIcon         String?
  store           Store
  status          JobStatus  @default(PENDING)
  priority        Int        @default(0)
  userId          String
  user            User       @relation(fields: [userId], references: [id])
  projectId       String?
  project         Project?   @relation(fields: [projectId], references: [id])
  screenshots     Screenshot[]
  zipFilePath     String?
  errorMessage    String?
  startedAt       DateTime?
  completedAt     DateTime?
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
}
```

#### Screenshot
Individual screenshot captured as part of a job.

```prisma
model Screenshot {
  id            String   @id @default(uuid())
  jobId         String
  job           ScreenshotJob @relation(fields: [jobId], references: [id])
  url           String
  thumbnailUrl  String?
  filePath      String?
  width         Int?
  height        Int?
  deviceType    String?
  osVersion     String?
  locale        String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### Comments & Annotations

#### Comment
Represents a comment or annotation on a screenshot job.

```prisma
model Comment {
  id         String   @id @default(uuid())
  content    String
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  jobId      String
  job        ScreenshotJob @relation(fields: [jobId], references: [id])
  parentId   String?
  parent     Comment? @relation("CommentReplies", fields: [parentId], references: [id])
  replies    Comment[] @relation("CommentReplies")
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

### Subscription & Billing

#### Subscription
Represents an organization's subscription to a plan.

```prisma
model Subscription {
  id             String        @id @default(uuid())
  organizationId String        @unique
  organization   Organization  @relation(fields: [organizationId], references: [id])
  planId         String
  plan           Plan          @relation(fields: [planId], references: [id])
  status         SubscriptionStatus @default(ACTIVE)
  startDate      DateTime
  endDate        DateTime?
  cancelDate     DateTime?
  customerId     String?       // Payment provider customer ID
  subscriptionId String?       // Payment provider subscription ID
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}
```

#### Plan
Represents a subscription plan tier.

```prisma
model Plan {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  price       Float
  currency    String   @default("USD")
  interval    PlanInterval
  maxJobs     Int      @default(-1) // -1 for unlimited
  maxUsers    Int      @default(-1) // -1 for unlimited
  features    String[]
  status      PlanStatus @default(ACTIVE)
  subscriptions Subscription[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### Payment
Records individual payment transactions.

```prisma
model Payment {
  id             String   @id @default(uuid())
  subscriptionId String
  subscription   Subscription @relation(fields: [subscriptionId], references: [id])
  amount         Float
  currency       String
  status         PaymentStatus
  transactionId  String?   // Payment provider transaction ID
  invoiceUrl     String?
  paidAt         DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}
```

## Relationships

The schema includes the following key relationships:

1. **User ↔ Organization**: Many-to-one (users belong to one organization)
2. **User ↔ TeamMember**: One-to-many (users can be members of multiple teams)
3. **Team ↔ TeamMember**: One-to-many (teams have many members)
4. **Organization ↔ Team**: One-to-many (organizations have many teams)
5. **User ↔ ScreenshotJob**: One-to-many (users create many screenshot jobs)
6. **Project ↔ ScreenshotJob**: One-to-many (projects contain many screenshot jobs)
7. **ScreenshotJob ↔ Screenshot**: One-to-many (jobs have many screenshots)
8. **User ↔ Comment**: One-to-many (users create many comments)
9. **ScreenshotJob ↔ Comment**: One-to-many (jobs have many comments)
10. **Comment ↔ Comment**: Self-referential (comments can have replies)
11. **Organization ↔ Subscription**: One-to-one (organizations have one subscription)
12. **Plan ↔ Subscription**: One-to-many (plans have many subscriptions)
13. **Subscription ↔ Payment**: One-to-many (subscriptions have many payments)

## Indexes

The schema includes the following indexes for performance optimization:

1. `User`: email (unique), organizationId
2. `Organization`: slug (unique)
3. `TeamMember`: userId, teamId (composite unique)
4. `ScreenshotJob`: userId, projectId, status, createdAt
5. `Screenshot`: jobId
6. `Comment`: userId, jobId, parentId
7. `Subscription`: organizationId (unique), planId, status
8. `Plan`: name (unique)
9. `Payment`: subscriptionId, status

## Enums

The schema uses the following enums:

```prisma
enum Role {
  USER
  ADMIN
  OWNER
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

enum OrganizationStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

enum TeamRole {
  MEMBER
  MANAGER
  OWNER
}

enum Store {
  APPLE
  GOOGLE
  MICROSOFT
}

enum JobStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

enum SubscriptionStatus {
  ACTIVE
  CANCELLED
  EXPIRED
  PAST_DUE
}

enum PlanInterval {
  MONTH
  YEAR
}

enum PlanStatus {
  ACTIVE
  INACTIVE
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}
```

## Migration Strategy

To apply this schema to your database:

1. Make sure your DATABASE_URL is configured in `.env`
2. Run the following commands:
   ```bash
   # Generate Prisma Client
   npm run prisma:generate
   
   # Apply migrations
   npm run prisma:migrate
   
   # Seed initial data
   npm run prisma:seed
   ```

The migration will create all tables, indexes, constraints, and seed the database with default plans (Free, Pro, Enterprise).

## Extensibility

This schema can be extended with additional features such as:
- Audit logs
- File storage metadata
- Notification preferences
- Custom roles and permissions
- API keys for third-party integrations
- Webhook configurations