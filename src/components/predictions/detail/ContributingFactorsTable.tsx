
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Factor {
  factor: string;
  impact: number;
}

interface ContributingFactorsTableProps {
  factors: Factor[];
}

const ContributingFactorsTable: React.FC<ContributingFactorsTableProps> = ({ factors }) => {
  // Sort factors by impact for better visualization
  const sortedFactors = [...factors].sort((a, b) => b.impact - a.impact);

  return (
    <Card className="mt-6 transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Key Contributing Factors</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Factor</TableHead>
              <TableHead className="w-[180px] text-right">Impact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedFactors.map((factor, index) => {
              const impactPercentage = Math.round(factor.impact * 100);
              
              // Determine color based on impact
              const getImpactColor = (impact: number) => {
                if (impact >= 30) return "bg-red-600";
                if (impact >= 15) return "bg-amber-600";
                return "bg-blue-600";
              };
              
              return (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{factor.factor}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm font-medium w-8">{impactPercentage}%</span>
                      <div className="w-[100px]">
                        <Progress
                          value={impactPercentage}
                          className={`h-2 ${getImpactColor(impactPercentage)}`}
                        />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ContributingFactorsTable;
