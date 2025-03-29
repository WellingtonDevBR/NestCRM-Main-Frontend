
import React, { useState } from "react";
import { useInteractions } from "@/hooks/useInteractions";
import InteractionsTable from "@/components/interactions/InteractionsTable";
import InteractionDialog from "@/components/interactions/InteractionDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Filter, RefreshCw, Mail, Phone, Users, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Interaction } from "@/domain/models/interaction";

const Interactions: React.FC = () => {
  const { interactions, isLoading, refetch } = useInteractions();
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentInteraction, setCurrentInteraction] = useState<Interaction | null>(null);

  const handleAddNewInteraction = () => {
    setCurrentInteraction(null);
    setIsEditMode(false);
    setOpen(true);
  };

  const handleEditInteraction = (interaction: Interaction) => {
    setCurrentInteraction(interaction);
    setIsEditMode(true);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Interactions</h1>
        <Button onClick={handleAddNewInteraction}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Log Interaction
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card rounded-lg p-3 shadow-sm border border-border">
        <div className="flex-1">
          <Input placeholder="Search interactions..." className="w-full" />
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
              Total Interactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interactions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Emails
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Mail className="mr-2 h-5 w-5 text-purple-500" />
            <div className="text-2xl font-bold">
              {interactions.filter(interaction => interaction.type === 'email').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Calls
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Phone className="mr-2 h-5 w-5 text-blue-500" />
            <div className="text-2xl font-bold">
              {interactions.filter(interaction => interaction.type === 'call').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Meetings
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-green-500" />
            <div className="text-2xl font-bold">
              {interactions.filter(interaction => interaction.type === 'meeting').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Tabs defaultValue="all">
            <div className="flex items-center justify-between">
              <CardTitle>Customer Interactions</CardTitle>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent>
          <InteractionsTable 
            interactions={interactions} 
            isLoading={isLoading} 
            onEdit={handleEditInteraction}
          />
        </CardContent>
      </Card>

      <InteractionDialog
        open={open}
        onOpenChange={setOpen}
        isEditMode={isEditMode}
        interaction={currentInteraction}
      />
    </div>
  );
};

export default Interactions;
