export type LlmItem = {
    cantidad: number | null;
    descripcion: string;
    precio_unitario: number | null;
    importe: number | null;
    peso_kg: number | null;
};

export type LlmResponse = {
    supermercado: string | null;
    fecha: string | null;
    direccion: string | null;
    items: LlmItem[];
    total_ticket: number | null;
};

export type OcrResponse = {
    text: string;
};
