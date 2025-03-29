
import React, { useState } from "react";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import SupportTicketsTable from "@/components/support/SupportTicketsTable";
import SupportTicketDialog from "@/components/support/SupportTicketDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketIcon, Filter, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SupportTicket } from "@/domain/models/support";

const Support: React.FC = () => {
  const { supportTickets, isLoading, refetch } = useSupportTickets();
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<SupportTicket | null>(null);

  const handleAddNewTicket = () => {
    setCurrentTicket(null);
    setIsEditMode(false);
    setOpen(true);
  };

  const handleEditTicket = (ticket: SupportTicket) => {
    setCurrentTicket(ticket);
    setIsEditMode(true);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Support Tickets</h1>
        <Button onClick={handleAddNewTicket}>
          <TicketIcon className="mr-2 h-4 w-4" />
          New Support Ticket
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card rounded-lg p-3 shadow-sm border border-border">
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supportTickets.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-yellow-500" />
            <div className="text-2xl font-bold">
              {supportTickets.filter(ticket => ticket.status === 'open').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <RefreshCw className="mr-2 h-5 w-5 text-blue-500" />
            <div className="text-2xl font-bold">
              {supportTickets.filter(ticket => ticket.status === 'in_progress').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resolved
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
            <div className="text-2xl font-bold">
              {supportTickets.filter(ticket => ticket.status === 'resolved').length}
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
                <TabsTrigger value="progress">In Progress</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent>
          <SupportTicketsTable 
            tickets={supportTickets} 
            isLoading={isLoading} 
            onEdit={handleEditTicket}
          />
        </CardContent>
      </Card>

      <SupportTicketDialog
        open={open}
        onOpenChange={setOpen}
        isEditMode={isEditMode}
        ticket={currentTicket}
      />
    </div>
  );
};

export default Support;
