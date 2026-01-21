import { pgTable, uuid, text, boolean, integer, numeric, date, timestamp } from 'drizzle-orm/pg-core';
import { vendorTypeEnum, vendorStatusEnum, auditStatusEnum, riskCategoryEnum, paymentTermsEnum } from './shared.schema';

export const vendors = pgTable('vendors', {
    id: uuid('id').defaultRandom().primaryKey(),

    // Basic Info
    legalName: text('legal_name').notNull(),
    vendorType: text('vendor_type'),
    businessCategory: text('business_category'),
    registrationNumber: text('registration_number'),
    ntnVatGst: text('ntn_vat_gst'),
    country: text('country'),
    city: text('city'),
    address: text('address'),
    status: vendorStatusEnum('status').default('Active'),
    contactPerson: text('contact_person'),
    contactNumber: text('contact_number'),
    email: text('email'),
    website: text('website'),

    // Compliance
    isGmpCertified: boolean('is_gmp_certified').default(false),
    isBlacklisted: boolean('is_blacklisted').default(false),
    regulatoryLicense: text('regulatory_license'),
    licenseExpiryDate: date('license_expiry_date'),
    qualityRating: integer('quality_rating'), // 1-5
    auditStatus: auditStatusEnum('audit_status').default('Pending'),
    riskCategory: text('risk_category').default('Low'),

    // Financial
    bankName: text('bank_name'),
    accountTitle: text('account_title'),
    accountNumber: text('account_number'),
    currency: text('currency').default('PKR'),
    paymentTerms: text('payment_terms'),
    creditLimit: numeric('credit_limit'),
    taxWithholdingPercent: numeric('tax_withholding_percent'),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
