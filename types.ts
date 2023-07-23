export interface Address {
    street: string;
    city: string;
    postCode: string;
    country: string;
  }
  
  export interface InvoiceItem {
    name: string;
    quantity: number|null;
    price: number | null;
    total: number|null;
  }
  
  export interface Invoice {
    id: string;
    createdAt?: string;
    paymentDue?: string;
    description?: string;
    paymentTerms?: number;
    clientName?: string;
    clientEmail?: string;
    status?: string;
    senderAddress?: Address;
    clientAddress?: Address;
    items?: InvoiceItem[];
    total?: number;
  }