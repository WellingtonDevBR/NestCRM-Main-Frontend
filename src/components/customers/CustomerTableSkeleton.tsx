
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomField } from "@/domain/models/customer";

interface CustomerTableSkeletonProps {
  visibleColumns: Record<string, boolean>;
  visibleCustomFields: CustomField[];
}

const CustomerTableSkeleton: React.FC<CustomerTableSkeletonProps> = ({
  visibleColumns,
  visibleCustomFields
}) => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          {visibleColumns.name && (
            <TableCell><Skeleton className="h-6 w-32" /></TableCell>
          )}
          {visibleColumns.email && (
            <TableCell><Skeleton className="h-6 w-48" /></TableCell>
          )}
          {visibleColumns.phone && (
            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
          )}
          
          {/* Custom fields from settings */}
          {visibleCustomFields.map((field, i) => 
            visibleColumns[field.key] && (
              <TableCell key={field.key}>
                <Skeleton className="h-6 w-24" />
              </TableCell>
            )
          )}
          
          {visibleColumns.createdAt && (
            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
          )}
          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default CustomerTableSkeleton;
