
import { CustomField as DomainCustomField, Customer as DomainCustomer } from "@/domain/models/customer";

// Re-export the types from domain models to maintain backward compatibility
export type CustomField = DomainCustomField;
export type Customer = DomainCustomer;
