
import { CustomField as DomainCustomField, Customer as DomainCustomer } from "@/domain/models/customer";
import { CustomField as NewCustomField, CustomFieldCategory } from "@/domain/models/customField";

// Re-export the types from domain models to maintain backward compatibility
export type CustomField = DomainCustomField | NewCustomField;
export type Customer = DomainCustomer;
export type { CustomFieldCategory };
