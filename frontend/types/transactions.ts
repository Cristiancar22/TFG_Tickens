export type Transaction = {
    _id: string;
    total: number;
    purchaseDate: string;
    store: string;
    details?: TransactionDetail[];
};

export type TransactionDetail = {
    product?: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
};
