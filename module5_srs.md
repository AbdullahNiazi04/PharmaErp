# Module 5: HUMAN RESOURCE MANAGEMENT (HRM)

> **Purpose:** Manages the end-to-end employee lifecycle, including personnel records, attendance tracking, leave management, and automated payroll processing with slip generation.

### Module Flow
```
Departments → Employees → Attendance → Leaves → Payroll → Pay Slips
```

---

## 5.1 Departments & Designations

#### Purpose
Defines the organizational structure and job roles within the pharmaceutical plant and office.

#### Database Tables

##### Table: `departments`

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Primary key | Auto-generated |
| `name` | TEXT | Dept Name (e.g., QC, Production) | NOT NULL, UNIQUE |
| `manager_id` | UUID | FK to employees | Optional |

##### Table: `designations`

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Primary key | Auto-generated |
| `title` | TEXT | Job Title | NOT NULL |
| `level` | TEXT | Grade (e.g., M1, S1) | Optional |

---

## 5.2 Employee Master

#### Purpose
Centralized repository for all staff data, including employment terms and statutory information.

#### Database Table: `employees`

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Primary key | Auto-generated |
| `employee_code` | TEXT | Unique ID | NOT NULL, UNIQUE |
| **Personal Info** |
| `full_name` | TEXT | Employee name | NOT NULL |
| `cnic_passport` | TEXT | National ID | NOT NULL, UNIQUE |
| `date_of_birth` | DATE | DOB | NOT NULL |
| `gender` | ENUM | Gender | `Male`, `Female`, `Other` |
| **Employment** |
| `department_id` | UUID | FK to departments | NOT NULL |
| `designation_id` | UUID | FK to designations | NOT NULL |
| `joining_date` | DATE | Date of joining | NOT NULL |
| `employment_type` | ENUM | Category | `Permanent`, `Contract`, `Daily Wager` |
| `status` | ENUM | Status | `Active`, `On Leave`, `Terminated`, `Resigned` |
| **Financial** |
| `basic_salary` | NUMERIC | Base pay | NOT NULL |
| `bank_account` | TEXT | Salary account | Optional |
| `social_security_no` | TEXT | Govt ID | Optional |

---

## 5.3 Attendance & Shifts

#### Purpose
Tracks daily clock-in/out times, late arrivals, and overtime, often integrated with biometric hardware.

#### Database Table: `attendance`

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Primary key | Auto-generated |
| `employee_id` | UUID | FK to employees | NOT NULL |
| `date` | DATE | Attendance date | NOT NULL |
| `check_in` | TIMESTAMP | Entry time | Optional |
| `check_out` | TIMESTAMP | Exit time | Optional |
| `status` | ENUM | Day status | `Present`, `Absent`, `Late`, `Half-Day` |
| `overtime_hours` | NUMERIC | Extra hours | Default: 0 |
| `remarks` | TEXT | Manual adjustments | Optional |

---

## 5.4 Leave Management

#### Purpose
Manages leave requests, approvals, and balance tracking.

#### Database Table: `leave_requests`

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Primary key | Auto-generated |
| `employee_id` | UUID | FK to employees | NOT NULL |
| `leave_type` | ENUM | Category | `Sick`, `Casual`, `Annual`, `Maternity` |
| `start_date` | DATE | From | NOT NULL |
| `end_date` | DATE | To | NOT NULL |
| `total_days` | INTEGER | Duration | Calculated |
| `reason` | TEXT | Justification | Optional |
| `status` | ENUM | Approval | `Pending`, `Approved`, `Rejected` |
| `approved_by` | UUID | FK to employees | Optional |

---

## 5.5 Payroll Processing

#### Purpose
Calculates monthly earnings and deductions based on attendance and employee contracts.

#### Database Table: `payroll_periods` (Monthly Header)

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Primary key | Auto-generated |
| `month` | INTEGER | Month (1-12) | NOT NULL |
| `year` | INTEGER | Year | NOT NULL |
| `total_disbursement` | NUMERIC | Grand total | Calculated |
| `status` | ENUM | Process status | `Open`, `Processed`, `Paid` |

---

## 5.6 Pay Slips (Line Items)

#### Purpose
Detailed breakdown of salary for an individual employee for a specific period.

#### Database Table: `pay_slips`

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Primary key | Auto-generated |
| `payroll_id` | UUID | FK to payroll_periods | NOT NULL |
| `employee_id` | UUID | FK to employees | NOT NULL |
| **Earnings** |
| `basic_salary_paid` | NUMERIC | Actual basic | NOT NULL |
| `allowances` | NUMERIC | House/Travel/etc. | Default: 0 |
| `overtime_pay` | NUMERIC | Calculated OT | Default: 0 |
| **Deductions** |
| `tax_deduction` | NUMERIC | Income tax | Calculated |
| `unpaid_leave_ded` | NUMERIC | LWP deduction | Calculated |
| `other_deductions` | NUMERIC | Loans/Fines | Default: 0 |
| **Totals** |
| `net_salary` | NUMERIC | Final payout | Calculated |

---

## CRUD Operations (HRM)

| Operation | Endpoint | Method | Description |
|-----------|----------|--------|-------------|
| Hire Employee | `/hrm/employees` | POST | Creates employee record |
| Mark Attendance | `/hrm/attendance` | POST | Bulk upload or single entry |
| Apply Leave | `/hrm/leaves` | POST | Submits request for approval |
| Process Payroll | `/hrm/payroll/process` | POST | Generates slips for a month |
| Get Pay Slip | `/hrm/pay-slips/:id` | GET | Returns PDF/JSON data for slip |

---

## HRM Business Logic

- **Attendance-Payroll Link:** `unpaid_leave_ded` is automatically calculated by checking `attendance.status = 'Absent'` or `leave_requests.status = 'Approved'` with type Unpaid.

- **Net Salary Formula:**
  ```
  Net Salary = (Basic + Allowances + Overtime) - (Tax + Deductions)
  ```

- **Soft Delete:** Like other modules, all HRM records use the `trash` table pattern for audit trails.

- **Transaction Support:** Payroll generation for all employees is wrapped in a database transaction to ensure consistency.

---

*End of Module 5*
