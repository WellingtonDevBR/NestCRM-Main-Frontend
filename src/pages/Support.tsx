
import React from "react";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import SupportTicketsTable from "@/components/support/SupportTicketsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoy, Filter, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const Support: React.FC = () => {
  const { tickets, isLoading, refetch } = useSupportTickets();

  // Calculate metrics
  const openTickets = tickets.filter(ticket => ticket.status === 'open').length;
  const inProgressTickets = tickets.filter(ticket => ticket.status === 'in_progress').length;
  const resolvedTickets = tickets.filter(ticket => ticket.status === 'resolved').length;
  const closedTickets = tickets.filter(ticket => ticket.status === 'closed').length;
  
  const criticalTickets = tickets.filter(ticket => ticket.priority === 'critical').length;
  const highPriorityTickets = tickets.filter(ticket => ticket.priority === 'high').length;

  const resolvedPercentage = tickets.length > 0 
    ? Math.round(((resolvedTickets + closedTickets) / tickets.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Support</h1>
        <Button>
          <LifeBuoy className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>
      
      <div className="flex items-center gap-4 bg-white rounded-lg p-3 shadow-sm border">
        <div className="flex-1">
          <Input placeholder="Search tickets..." className="w-full" />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button variant="ghost" size="sm" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resolution Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{resolvedPercentage}%</span>
                <span className="text-xs text-muted-foreground">
                  {resolvedTickets + closedTickets} of {tickets.length} tickets
                </span>
              </div>
              <Progress value={resolvedPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ticket Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Open</span>
                <span className="text-xl font-bold">{openTickets}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">In Progress</span>
                <span className="text-xl font-bold">{inProgressTickets}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Resolved</span>
                <span className="text-xl font-bold">{resolvedTickets}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Closed</span>
                <span className="text-xl font-bold">{closedTickets}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={criticalTickets > 0 ? "border-red-200 bg-red-50" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-medium ${criticalTickets > 0 ? "text-red-800" : "text-muted-foreground"}`}>
              High Priority Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {criticalTickets > 0 && (
                <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
              )}
              <div>
                <div className="flex gap-1">
                  <span className="text-2xl font-bold">{criticalTickets + highPriorityTickets}</span>
                  <span className="text-sm self-end mb-1 text-muted-foreground">active</span>
                </div>
                {criticalTickets > 0 && (
                  <p className="text-xs text-red-700">
                    {criticalTickets} critical issues require immediate attention
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <Tabs defaultValue="all">
            <div className="flex items-center justify-between">
              <CardTitle>Support Tickets</CardTitle>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent>
          <SupportTicketsTable tickets={tickets} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;
