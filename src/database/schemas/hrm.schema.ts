import { pgTable, uuid, text, integer, numeric, date, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// --- HRM ENUMS ---
export const genderEnum = pgEnum('gender', ['Male', 'Female', 'Other']);
export const employmentTypeEnum = pgEnum('employment_type', ['Permanent', 'Contract', 'Daily Wager']);
export const employeeStatusEnum = pgEnum('employee_status', ['Active', 'On Leave', 'Terminated', 'Resigned']);
export const attendanceStatusEnum = pgEnum('attendance_status', ['Present', 'Absent', 'Late', 'Half-Day']);
export const leaveTypeEnum = pgEnum('leave_type', ['Sick', 'Casual', 'Annual', 'Maternity']);
export const leaveStatusEnum = pgEnum('leave_status', ['Pending', 'Approved', 'Rejected']);
export const payrollStatusEnum = pgEnum('payroll_status', ['Open', 'Processed', 'Paid']);

// --- DEPARTMENTS ---
export const departments = pgTable('departments', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull().unique(),
    managerId: uuid('manager_id'), // FK to employees, added after employees table exists
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// --- DESIGNATIONS ---
export const designations = pgTable('designations', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    level: text('level'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// --- EMPLOYEES ---
export const employees = pgTable('employees', {
    id: uuid('id').defaultRandom().primaryKey(),
    employeeCode: text('employee_code').notNull().unique(),

    // Personal Info
    fullName: text('full_name').notNull(),
    cnicPassport: text('cnic_passport').notNull().unique(),
    dateOfBirth: date('date_of_birth').notNull(),
    gender: genderEnum('gender'),

    // Employment
    departmentId: uuid('department_id').references(() => departments.id).notNull(),
    designationId: uuid('designation_id').references(() => designations.id).notNull(),
    joiningDate: date('joining_date').notNull(),
    employmentType: employmentTypeEnum('employment_type').default('Permanent'),
    status: employeeStatusEnum('status').default('Active'),

    // Financial
    basicSalary: numeric('basic_salary').notNull(),
    bankAccount: text('bank_account'),
    socialSecurityNo: text('social_security_no'),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// --- ATTENDANCE ---
export const attendance = pgTable('attendance', {
    id: uuid('id').defaultRandom().primaryKey(),
    employeeId: uuid('employee_id').references(() => employees.id).notNull(),
    date: date('date').notNull(),
    checkIn: timestamp('check_in'),
    checkOut: timestamp('check_out'),
    status: attendanceStatusEnum('status').default('Present'),
    overtimeHours: numeric('overtime_hours').default('0'),
    remarks: text('remarks'),
    createdAt: timestamp('created_at').defaultNow(),
});

// --- LEAVE REQUESTS ---
export const leaveRequests = pgTable('leave_requests', {
    id: uuid('id').defaultRandom().primaryKey(),
    employeeId: uuid('employee_id').references(() => employees.id).notNull(),
    leaveType: leaveTypeEnum('leave_type').notNull(),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    totalDays: integer('total_days').notNull(),
    reason: text('reason'),
    status: leaveStatusEnum('status').default('Pending'),
    approvedBy: uuid('approved_by').references(() => employees.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// --- PAYROLL PERIODS ---
export const payrollPeriods = pgTable('payroll_periods', {
    id: uuid('id').defaultRandom().primaryKey(),
    month: integer('month').notNull(),
    year: integer('year').notNull(),
    totalDisbursement: numeric('total_disbursement').default('0'),
    status: payrollStatusEnum('status').default('Open'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// --- PAY SLIPS ---
export const paySlips = pgTable('pay_slips', {
    id: uuid('id').defaultRandom().primaryKey(),
    payrollId: uuid('payroll_id').references(() => payrollPeriods.id).notNull(),
    employeeId: uuid('employee_id').references(() => employees.id).notNull(),

    // Earnings
    basicSalaryPaid: numeric('basic_salary_paid').notNull(),
    allowances: numeric('allowances').default('0'),
    overtimePay: numeric('overtime_pay').default('0'),

    // Deductions
    taxDeduction: numeric('tax_deduction').default('0'),
    unpaidLeaveDed: numeric('unpaid_leave_ded').default('0'),
    otherDeductions: numeric('other_deductions').default('0'),

    // Total
    netSalary: numeric('net_salary').notNull(),

    createdAt: timestamp('created_at').defaultNow(),
});
