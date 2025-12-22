# WAF Rules Configuration

This document describes how to configure Web Application Firewall (WAF) rules to protect the screenshot scraper API.

## AWS WAF Configuration

### Prerequisites

1. AWS Account with appropriate permissions
2. Application Load Balancer (ALB) or API Gateway protecting the application
3. Basic understanding of AWS WAF concepts

### Step 1: Create WAF Web ACL

1. Navigate to the AWS WAF console
2. Click "Create web ACL"
3. Enter a name (e.g., `screenshot-scraper-waf`)
4. Add a description
5. Select the appropriate CloudWatch metrics and sampled requests settings
6. Click "Next"

### Step 2: Associate with Resources

1. Choose the resources to protect (ALB, API Gateway, CloudFront distribution)
2. Click "Next"

### Step 3: Add Managed Rule Groups

Add the following managed rule groups:

1. **AWSManagedRulesCommonRuleSet** - Protects against common threats
2. **AWSManagedRulesAdminProtectionRuleSet** - Prevents unauthorized access to admin pages
3. **AWSManagedRulesSQLiRuleSet** - Prevents SQL injection attacks
4. **AWSManagedRulesLinuxRuleSet** - Protects against Linux OS vulnerabilities
5. **AWSManagedRulesUnixRuleSet** - Protects against Unix OS vulnerabilities

### Step 4: Add Custom Rules

#### Rate-Based Rule

Create a rate-based rule to prevent abuse:

1. Rule name: `rate-limit`
2. Rule type: `Rate-based rule`
3. Rate limit: 1000 requests in 5 minutes
4. Aggregate type: `IP`
5. Evaluation window: 5 minutes

#### Block Common Attack Patterns

Create rules to block common attack patterns:

##### Block LFI Attempts

1. Rule name: `block-lfi`
2. Rule type: `Regular rule`
3. Add condition:
   - Inspection type: `URI path`
   - Match type: `String matches`
   - Match pattern: `(?i)(\/etc\/passwd|\/etc\/shadow|\/etc\/hosts)`
   - Text transformation: `None`

##### Block SQL Injection Attempts

1. Rule name: `block-sqli`
2. Rule type: `Regular rule`
3. Add condition:
   - Inspection type: `Query string`
   - Match type: `String matches`
   - Match pattern: `(?i)(union\s+select|insert\s+into|drop\s+table|create\s+table|--|\bselect\b.*\bfrom\b.*\bwhere\b)`
   - Text transformation: `Compress whitespace, Lowercase`

##### Block Shell Command Injection

1. Rule name: `block-shell-injection`
2. Rule type: `Regular rule`
3. Add condition:
   - Inspection type: `Query string`
   - Match type: `String matches`
   - Match pattern: `(?i)(\bcat\b\s+\S*\/etc\/|\bnc\b\s+\d+|\bping\b\s+\S+|\bwget\b\s+\S+)`
   - Text transformation: `Compress whitespace, Lowercase`

### Step 5: Configure Rule Priority

Set the rule priority in this order (higher number = higher priority):

1. `AWSManagedRulesCommonRuleSet` - Priority 10
2. `AWSManagedRulesSQLiRuleSet` - Priority 20
3. `block-sqli` - Priority 30
4. `block-shell-injection` - Priority 40
5. `block-lfi` - Priority 50
6. `AWSManagedRulesAdminProtectionRuleSet` - Priority 60
7. `rate-limit` - Priority 70

### Step 6: Set Default Action

Set the default action to `Allow` to only block traffic that matches specific rules.

### Step 7: Review and Create

Review all settings and click "Create web ACL".

## Testing WAF Rules

After implementing WAF rules, test them with the following:

1. Normal API requests should continue to work
2. Malformed requests should be blocked (403 Forbidden)
3. Rate limiting should trigger when threshold is exceeded
4. Common attack patterns should be blocked

## Monitoring WAF

Monitor WAF performance through:

1. AWS CloudWatch metrics for the Web ACL
2. Sampled requests to analyze blocked traffic
3. Alerts for high blocking rates that might indicate legitimate traffic being blocked

## Updating Rules

Regularly review and update WAF rules:

1. Monitor CloudWatch metrics for unusual patterns
2. Review sampled requests for false positives
3. Update rules to address new threats
4. Adjust rate limits based on traffic patterns