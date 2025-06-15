export interface Notification {
    _id: string;
    user: string;
    type?: string;
    message?: string;
    creationDate?: string;
    status?: 'pending' | 'read' | 'archived';
}