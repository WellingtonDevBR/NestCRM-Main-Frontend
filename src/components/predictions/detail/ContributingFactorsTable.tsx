
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Factor {
  factor: string;
  impact: number;
}

interface ContributingFactorsTableProps {
  factors: Factor[];
}

const ContributingFactorsTable: React.FC<ContributingFactorsTableProps> = ({ factors }) => {
  return (
    <div className="mt-6 rounded-lg border p-4 shadow-sm">
      <h3 className="font-medium text-lg mb-4">Key Contributing Factors</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Factor</TableHead>
            <TableHead className="text-right">Impact</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {factors.map((factor, index) => (
            <TableRow key={index}>
              <TableCell>{factor.factor}</TableCell>
              <TableCell className="text-right">{Math.round(factor.impact * 100)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContributingFactorsTable;
