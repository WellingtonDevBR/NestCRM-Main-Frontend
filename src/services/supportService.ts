
import { SupportTicket } from "@/domain/models/support";

// Mock data for support tickets
const mockSupportTickets: SupportTicket[] = [
  {
    id: "ticket-001",
    customerId: "cust-001",
    customerName: "Alice Johnson",
    ticketNumber: "T-2023-0001",
    subject: "Dashboard loading issues",
    description: "Customer reporting that the dashboard takes more than 10 seconds to load.",
    status: "resolved",
    priority: "medium",
    assignedTo: "Technical Support Team",
    createdAt: "2023-11-20T08:30:00Z",
    updatedAt: "2023-11-21T14:15:00Z"
  },
  {
    id: "ticket-002",
    customerId: "cust-002",
    customerName: "Bob Smith",
    ticketNumber: "T-2023-0002",
    subject: "API integration failure",
    description: "Customer unable to connect their internal system to our API. Getting 403 errors.",
    status: "in_progress",
    priority: "high",
    assignedTo: "Dev Ops Team",
    createdAt: "2023-12-05T11:20:00Z",
    updatedAt: "2023-12-06T09:45:00Z"
  },
  {
    id: "ticket-003",
    customerId: "cust-003",
    customerName: "Carol Davis",
    ticketNumber: "T-2023-0003",
    subject: "Custom report not generating",
    description: "The monthly activity report scheduled to run on the 1st did not generate.",
    status: "resolved",
    priority: "low",
    assignedTo: "Reporting Team",
    createdAt: "2023-12-02T10:15:00Z",
    updatedAt: "2023-12-03T16:30:00Z"
  },
  {
    id: "ticket-004",
    customerId: "cust-004",
    customerName: "David Wilson",
    ticketNumber: "T-2023-0004",
    subject: "Account access issues",
    description: "Two team members unable to log in despite password resets.",
    status: "open",
    priority: "critical",
    assignedTo: "Account Security Team",
    createdAt: "2023-12-18T09:10:00Z",
    updatedAt: "2023-12-18T09:10:00Z"
  },
  {
    id: "ticket-005",
    customerId: "cust-005",
    customerName: "Eve Brown",
    ticketNumber: "T-2023-0005",
    subject: "Data import failure",
    description: "Bulk CSV import failed with 230 customer records.",
    status: "closed",
    priority: "medium",
    assignedTo: "Data Management Team",
    createdAt: "2023-12-15T14:25:00Z",
    updatedAt: "2023-12-17T11:05:00Z"
  },
  {
    id: "ticket-006",
    customerId: "cust-001",
    customerName: "Alice Johnson",
    ticketNumber: "T-2024-0001",
    subject: "Feature request: Advanced filtering",
    description: "Customer requesting more advanced filtering options in the reporting module.",
    status: "open",
    priority: "low",
    assignedTo: "Product Team",
    createdAt: "2024-01-05T13:40:00Z",
    updatedAt: "2024-01-05T13:40:00Z"
  }
];

export const supportService = {
  // Fetch all support tickets
  getSupportTickets: async (): Promise<SupportTicket[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockSupportTickets), 800);
    });
  },

  // Get support ticket by ID
  getSupportTicketById: async (id: string): Promise<SupportTicket | undefined> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const ticket = mockSupportTickets.find(ticket => ticket.id === id);
        resolve(ticket);
      }, 500);
    });
  },

  // Get support tickets by customer ID
  getSupportTicketsByCustomerId: async (customerId: string): Promise<SupportTicket[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const tickets = mockSupportTickets.filter(ticket => ticket.customerId === customerId);
        resolve(tickets);
      }, 500);
    });
  }
};
