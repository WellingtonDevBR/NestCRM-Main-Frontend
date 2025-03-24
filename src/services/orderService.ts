
import { Order } from "@/domain/models/order";

// Mock data for orders
const mockOrders: Order[] = [
  {
    id: "ord-001",
    customerId: "cust-001",
    customerName: "Alice Johnson",
    orderNumber: "ORD-2023-0001",
    date: "2023-11-15T10:30:00Z",
    status: "delivered",
    total: 249.99,
    items: [
      {
        id: "item-001",
        productName: "Premium Subscription (Annual)",
        quantity: 1,
        unitPrice: 249.99,
        total: 249.99
      }
    ]
  },
  {
    id: "ord-002",
    customerId: "cust-002",
    customerName: "Bob Smith",
    orderNumber: "ORD-2023-0002",
    date: "2023-12-03T14:45:00Z",
    status: "shipped",
    total: 149.99,
    items: [
      {
        id: "item-002",
        productName: "Standard Subscription (6 months)",
        quantity: 1,
        unitPrice: 149.99,
        total: 149.99
      }
    ]
  },
  {
    id: "ord-003",
    customerId: "cust-003",
    customerName: "Carol Davis",
    orderNumber: "ORD-2023-0003",
    date: "2023-12-10T09:15:00Z",
    status: "processing",
    total: 398.98,
    items: [
      {
        id: "item-003",
        productName: "Premium Subscription (Annual)",
        quantity: 1,
        unitPrice: 249.99,
        total: 249.99
      },
      {
        id: "item-004",
        productName: "Setup & Configuration",
        quantity: 1,
        unitPrice: 148.99,
        total: 148.99
      }
    ]
  },
  {
    id: "ord-004",
    customerId: "cust-004",
    customerName: "David Wilson",
    orderNumber: "ORD-2023-0004",
    date: "2023-12-15T16:20:00Z",
    status: "pending",
    total: 99.99,
    items: [
      {
        id: "item-005",
        productName: "Basic Subscription (3 months)",
        quantity: 1,
        unitPrice: 99.99,
        total: 99.99
      }
    ]
  },
  {
    id: "ord-005",
    customerId: "cust-005",
    customerName: "Eve Brown",
    orderNumber: "ORD-2023-0005",
    date: "2023-12-18T11:05:00Z",
    status: "cancelled",
    total: 349.98,
    items: [
      {
        id: "item-006",
        productName: "Premium Subscription (Annual)",
        quantity: 1,
        unitPrice: 249.99,
        total: 249.99
      },
      {
        id: "item-007",
        productName: "Data Migration Service",
        quantity: 1,
        unitPrice: 99.99,
        total: 99.99
      }
    ]
  }
];

export const orderService = {
  // Fetch all orders
  getOrders: async (): Promise<Order[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockOrders), 800);
    });
  },

  // Get order by ID
  getOrderById: async (id: string): Promise<Order | undefined> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const order = mockOrders.find(order => order.id === id);
        resolve(order);
      }, 500);
    });
  },

  // Get orders by customer ID
  getOrdersByCustomerId: async (customerId: string): Promise<Order[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const orders = mockOrders.filter(order => order.customerId === customerId);
        resolve(orders);
      }, 500);
    });
  }
};
