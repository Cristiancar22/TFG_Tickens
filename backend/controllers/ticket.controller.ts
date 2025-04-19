import { Response } from 'express';
import axios from 'axios';
import FormData from 'form-data';
import { Ticket } from '../models/ticket.model';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Store } from '../models/store.model';
import { Product } from '../models/product.model';
import { Transaction } from '../models/transaction.model';
import { TransactionDetail } from '../models/transactionDetail.model';
import { logger } from '../utils/logger';

type LlmItem = {
    cantidad: number | null;
    descripcion: string;
    precio_unitario: number | null;
    importe: number | null;
    peso_kg: number | null;
};

type LlmResponse = {
    supermercado: string | null;
    fecha: string | null;
    direccion: string | null;
    items: LlmItem[];
    total_ticket: number | null;
};

export const processTicket = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({
                message: 'No se proporcionó ninguna imagen',
            });
            return;
        }

        const userId = req.user?._id;
        const imageBuffer = req.file.buffer;
        const imageBase64 = imageBuffer.toString('base64');

        // Paso 1: Guardar el ticket con estado pendienteOCR
        const ticket = await Ticket.create({
            user: userId,
            scanDate: new Date(),
            rawData: imageBase64,
            processingStatus: 'pendienteOCR',
        });

        // Paso 2: Enviar imagen al servicio OCR
        const form = new FormData();
        form.append('image', imageBuffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        const ocrResponse = await axios.post(
            'http://ocr_service:5000/ocr',
            form,
            {
                headers: form.getHeaders(),
            },
        );

        const { text } = ocrResponse.data as any;

        // Actualizar ticket con el resultado del OCR
        ticket.processingStatus = 'pendienteLLM';
        ticket.ocrMetadata = ocrResponse.data;
        await ticket.save();

        // Paso 3: Enviar texto al servicio LLM
        const llmResponse = await axios.post<LlmResponse>(
            'http://ticket-parser:5020/parse',
            { text },
        );
        const parsed = llmResponse.data;

        // Paso 4: Obtener o crear el supermercado
        const storeName = parsed.supermercado?.trim();
        let store = null;
        if (storeName) {
            store = await Store.findOne({ name: storeName });
            if (!store) {
                store = await Store.create({
                    name: storeName || 'Desconocido',
                    address: parsed.direccion,
                    createdBy: userId,
                });
            }
        }

        let parsedDate = new Date();
        if (parsed.fecha && /^\d{2}\/\d{2}\/\d{4}$/.test(parsed.fecha)) {
            const [day, month, year] = parsed.fecha.split('/');
            parsedDate = new Date(`${year}-${month}-${day}`);
        }

        // Paso 5: Crear la transacción
        const transaction = await Transaction.create({
            ticket: ticket._id,
            user: userId,
            tienda: store ? store._id : null,
            purchaseDate: parsedDate,
            total: parsed.total_ticket ?? 0,
        });

        // Paso 6: Procesar los items y crear productos/detalles
        for (const item of parsed.items) {
            const descripcion = item.descripcion?.trim();
            if (!descripcion) continue;

            let product = await Product.findOne({ name: descripcion });
            if (!product) {
                product = await Product.create({
                    name: descripcion,
                    category: null,
                    group: null,
                });
            }

            await TransactionDetail.create({
                transaccion: transaction._id,
                producto: product._id,
                quantity: item.cantidad ?? 1,
                unitPrice: item.precio_unitario ?? 0,
                subtotal: item.importe ?? 0,
            });
        }

        // Paso 7: Actualizar ticket como procesado
        ticket.processingStatus = 'procesado';
        await ticket.save();

        res.status(201).json({
            message: 'Ticket procesado correctamente',
            resultado: parsed,
        });
    } catch (error) {
        logger.error('❌ Error al procesar el ticket:', error);
        res.status(500).json({ message: 'Error al procesar el ticket' });
    }
};
