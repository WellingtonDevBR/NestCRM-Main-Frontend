
import React from "react";
import { Customer } from "@/domain/models/customer";
import CustomersTableContainer from "./table/CustomersTableContainer";

interface CustomersTableProps {
  onEdit: (customer: Customer) => void;
}

const CustomersTable: React.FC<CustomersTableProps> = ({ onEdit }) => {
  return <CustomersTableContainer onEdit={onEdit} />;
};

export default CustomersTable;
