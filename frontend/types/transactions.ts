export type Transaction = {
    _id: string;
    total: number;
    purchaseDate: string;
    store: { name: string };
    details?: TransactionDetail[];
};

export type TransactionDetail = {
    product?: Product;
    quantity: number;
    unitPrice: number;
    subtotal: number;
};

export type Product = {
    name: string;
};
