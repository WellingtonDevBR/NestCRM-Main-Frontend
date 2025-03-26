
import { Interaction } from "@/domain/models/interaction";

// Mock data for interactions
const mockInteractions: Interaction[] = [
  {
    id: "int-001",
    customerId: "cust-001",
    customerName: "Alice Johnson",
    type: "call",
    date: "2023-11-16T09:30:00Z",
    duration: 15,
    subject: "Onboarding follow-up",
    content: "Discussed implementation timeline and addressed initial questions about the platform.",
    summary: "Discussed implementation timeline and addressed initial questions about the platform.",
    agentName: "Michael Scott",
    status: "closed"
  },
  {
    id: "int-002",
    customerId: "cust-002",
    customerName: "Bob Smith",
    type: "email",
    date: "2023-12-04T10:15:00Z",
    duration: 0,
    subject: "Feature request",
    content: "Customer requested additional reporting capabilities. Forwarded to product team for consideration.",
    summary: "Customer requested additional reporting capabilities. Forwarded to product team for consideration.",
    agentName: "Pam Beesly",
    status: "closed"
  },
  {
    id: "int-003",
    customerId: "cust-003",
    customerName: "Carol Davis",
    type: "meeting",
    date: "2023-12-11T14:00:00Z",
    duration: 45,
    subject: "Quarterly business review",
    content: "Reviewed usage metrics, discussed upcoming needs, and presented roadmap for next quarter.",
    summary: "Reviewed usage metrics, discussed upcoming needs, and presented roadmap for next quarter.",
    agentName: "Jim Halpert",
    status: "closed"
  },
  {
    id: "int-004",
    customerId: "cust-004",
    customerName: "David Wilson",
    type: "chat",
    date: "2023-12-16T11:30:00Z",
    duration: 10,
    subject: "Technical support",
    content: "Helped troubleshoot integration issues with their existing CRM system.",
    summary: "Helped troubleshoot integration issues with their existing CRM system.",
    agentName: "Dwight Schrute",
    status: "open"
  },
  {
    id: "int-005",
    customerId: "cust-005",
    customerName: "Eve Brown",
    type: "call",
    date: "2023-12-19T15:45:00Z",
    duration: 25,
    subject: "Subscription cancellation inquiry",
    content: "Customer considering cancellation due to budget constraints. Offered 3-month discount.",
    summary: "Customer considering cancellation due to budget constraints. Offered 3-month discount.",
    agentName: "Andy Bernard",
    status: "pending"
  },
  {
    id: "int-006",
    customerId: "cust-001",
    customerName: "Alice Johnson",
    type: "email",
    date: "2024-01-10T08:45:00Z",
    duration: 0,
    subject: "Additional user licenses",
    content: "Customer requested quote for adding 5 more user licenses to their account.",
    summary: "Customer requested quote for adding 5 more user licenses to their account.",
    agentName: "Michael Scott",
    status: "closed"
  }
];

export const interactionService = {
  // Fetch all interactions
  getInteractions: async (): Promise<Interaction[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockInteractions), 800);
    });
  },

  // Get interaction by ID
  getInteractionById: async (id: string): Promise<Interaction | undefined> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const interaction = mockInteractions.find(interaction => interaction.id === id);
        resolve(interaction);
      }, 500);
    });
  },

  // Get interactions by customer ID
  getInteractionsByCustomerId: async (customerId: string): Promise<Interaction[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const interactions = mockInteractions.filter(interaction => interaction.customerId === customerId);
        resolve(interactions);
      }, 500);
    });
  }
};
