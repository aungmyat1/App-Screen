# Database Schema for Multi-Tenancy

## Overview

The AppScreens database schema is designed with multi-tenancy in mind, supporting both simple and complex organizational structures. The schema uses a shared database, shared schema approach with row-level security to isolate tenant data.

## Core Entities

### 1. Organizations
```sql
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    billing_email VARCHAR(255),
    tenant_id VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'member',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Teams
```sql
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Team Memberships
```sql
CREATE TABLE team_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);
```

### 5. Projects
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. Screenshot Jobs
```sql
CREATE TABLE screenshot_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id),
    app_id VARCHAR(255) NOT NULL,
    app_url TEXT NOT NULL,
    store VARCHAR(20) NOT NULL, -- 'google' or 'apple'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    result_url TEXT,
    error_message TEXT,
    priority INTEGER DEFAULT 0,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7. Screenshots
```sql
CREATE TABLE screenshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES screenshot_jobs(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    file_path TEXT,
    file_size INTEGER,
    width INTEGER,
    height INTEGER,
    device_type VARCHAR(50),
    orientation VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 8. Shared Jobs
```sql
CREATE TABLE shared_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES screenshot_jobs(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    shared_by UUID REFERENCES users(id),
    shared_with UUID REFERENCES users(id),
    permission VARCHAR(20) DEFAULT 'view', -- 'view', 'edit', 'download'
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 9. Comments
```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES screenshot_jobs(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 10. Subscriptions
```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    plan_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'cancelled', 'expired'
    braintree_subscription_id VARCHAR(255),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 11. Usage Tracking
```sql
CREATE TABLE usage_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    value INTEGER NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Indexes for Performance

```sql
-- Organization indexes
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_teams_organization_id ON teams(organization_id);
CREATE INDEX idx_projects_organization_id ON projects(organization_id);
CREATE INDEX idx_screenshot_jobs_organization_id ON screenshot_jobs(organization_id);
CREATE INDEX idx_screenshots_organization_id ON screenshots(organization_id);
CREATE INDEX idx_shared_jobs_organization_id ON shared_jobs(organization_id);
CREATE INDEX idx_comments_organization_id ON comments(organization_id);
CREATE INDEX idx_subscriptions_organization_id ON subscriptions(organization_id);
CREATE INDEX idx_usage_tracking_organization_id ON usage_tracking(organization_id);

-- Job indexes
CREATE INDEX idx_screenshot_jobs_status ON screenshot_jobs(status);
CREATE INDEX idx_screenshot_jobs_created_at ON screenshot_jobs(created_at);
CREATE INDEX idx_screenshot_jobs_app_id ON screenshot_jobs(app_id);

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_team_memberships_user_id ON team_memberships(user_id);
CREATE INDEX idx_team_memberships_team_id ON team_memberships(team_id);
```

## Row-Level Security Policies

```sql
-- Enable RLS on tenant-specific tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenshot_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for users
CREATE POLICY user_org_isolation_policy ON users
    USING (organization_id = current_setting('app.current_org_id')::UUID);

-- Create policies for teams
CREATE POLICY team_org_isolation_policy ON teams
    USING (organization_id = current_setting('app.current_org_id')::UUID);

-- Create policies for screenshot_jobs
CREATE POLICY job_org_isolation_policy ON screenshot_jobs
    USING (organization_id = current_setting('app.current_org_id')::UUID);

-- Similar policies for other tables...
```

## Multi-Tenancy Implementation

### Tenant Identification
Each request includes a tenant identifier in the HTTP headers:
```
X-Tenant-ID: acme-corp
```

### Database Context
The tenant ID is set at the beginning of each request:
```sql
SET app.current_org_id = 'organization-uuid';
```

This ensures that all queries automatically filter by the tenant's organization ID through the row-level security policies.

## Data Isolation Levels

1. **Complete Isolation**: Each tenant's data is completely separate
2. **Shared Reference Data**: Common data (e.g., device types, countries) is shared
3. **Cross-Tenant Sharing**: Explicit sharing mechanisms for collaboration

## Backup and Recovery

- Daily backups of the entire database
- Point-in-time recovery for each tenant
- Cross-region replication for disaster recovery
- Tenant-specific backup and restore capabilities