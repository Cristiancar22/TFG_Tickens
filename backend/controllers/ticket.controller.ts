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
import { LlmResponse, OcrResponse } from '../types';
import { LLM_PORT, OCR_PORT } from '../config/env';

export const processTicket = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        logger.info('📥 Inicio del procesamiento de ticket');

        if (!req.file) {
            logger.warn('⚠️ No se proporcionó ninguna imagen');
            res.status(400).json({
                message: 'No se proporcionó ninguna imagen',
            });
            return;
        }

        const userId = req.user!._id;
        const imageBuffer = req.file.buffer;
        const imageBase64 = imageBuffer.toString('base64');

        logger.info('📸 Imagen recibida y convertida a base64');

        const ticket = await Ticket.create({
            user: userId,
            scanDate: new Date(),
            rawData: imageBase64,
            processingStatus: 'pendienteOCR',
        });

        logger.info(`📝 Ticket creado con ID: ${ticket._id}`);

        const form = new FormData();
        form.append('image', imageBuffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        logger.info('📤 Enviando imagen al microservicio OCR...');

        const ocrResponse = await axios.post<OcrResponse>(
            `http://ocr_service:${OCR_PORT}/ocr`,
            form,
            {
                headers: form.getHeaders(),
            },
        );

        logger.info('✅ OCR recibido correctamente');

        const { text } = ocrResponse.data;
        if (!text?.trim()) {
            logger.warn('⚠️ OCR no devolvió texto');
            res.status(400).json({
                message: 'No se ha podido extraer texto de la imagen proporcionada',
            });
            return;
        }

        ticket.processingStatus = 'pendienteLLM';
        ticket.ocrMetadata = ocrResponse.data;
        await ticket.save();

        logger.info('📤 Enviando texto al microservicio LLM...');

        const llmResponse = await axios.post<LlmResponse>(
            `http://llm_service:${LLM_PORT}/parse`,
            { text },
        );

        logger.info('✅ LLM respondió correctamente');

        const parsed = llmResponse.data;
        const storeName = parsed.supermercado?.trim();
        const nameToUse = storeName || 'Desconocido';

        logger.info(`🏬 Nombre de tienda detectado: ${nameToUse}`);

        let store = await Store.findOne({ name: nameToUse, createdBy: userId });
        if (!store) {
            logger.info('➕ Creando nueva tienda');
            store = await Store.create({
                name: nameToUse,
                address: parsed.direccion,
                createdBy: userId,
            });
        }

        let parsedDate = new Date();
        if (parsed.fecha && /^\d{2}\/\d{2}\/\d{4}$/.test(parsed.fecha)) {
            const [day, month, year] = parsed.fecha.split('/');
            parsedDate = new Date(`${year}-${month}-${day}`);
        }

        logger.info(`📅 Fecha extraída: ${parsedDate.toISOString()}`);

        const transaction = await Transaction.create({
            ticket: ticket._id,
            user: userId,
            store: store ? store._id : null,
            purchaseDate: parsedDate,
            total: parsed.total_ticket ?? 0,
        });

        logger.info(`💰 Transacción creada con ID: ${transaction._id}`);

        for (const item of parsed.items) {
            const descripcion = item.descripcion?.trim();
            if (!descripcion) {
                logger.warn('⛔️ Ítem sin descripción, se omite');
                continue;
            }

            let product = await Product.findOne({ name: descripcion, createdBy: userId });
            if (!product) {
                logger.info(`➕ Creando producto: ${descripcion}`);
                product = await Product.create({
                    name: descripcion,
                    category: null,
                    group: null,
                    createdBy: userId,
                });
            }

            await TransactionDetail.create({
                transaction: transaction._id,
                product: product._id,
                quantity: item.cantidad ?? 1,
                unitPrice: item.precio_unitario ?? 0,
                subtotal: item.importe ?? 0,
            });

            logger.info(`🧾 Detalle registrado: ${descripcion}`);
        }

        ticket.processingStatus = 'procesado';
        await ticket.save();

        logger.info('✅ Ticket procesado y guardado completamente');

        res.status(201).json({
            message: 'Ticket procesado correctamente',
            resultado: parsed,
        });
    } catch (error) {
        logger.error('❌ Error al procesar el ticket:', {
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined,
        });

        res.status(500).json({ message: 'Error al procesar el ticket' });
    }
};


export const processTicketPdf = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        if (!req.file || req.file.mimetype !== 'application/pdf') {
            res.status(400).json({
                message: 'Se requiere un archivo PDF válido',
            });
            return;
        }

        const userId = req.user?._id;
        const pdfBuffer = req.file.buffer;
        const pdfBase64 = pdfBuffer.toString('base64');

        const ticket = await Ticket.create({
            user: userId,
            scanDate: new Date(),
            rawData: pdfBase64,
            processingStatus: 'pdf_subido',
        });

        res.status(201).json({
            message: 'PDF recibido y almacenado correctamente',
            ticketId: ticket._id,
        });
    } catch (error) {
        logger.error('Error al procesar el PDF:', error);
        res.status(500).json({ message: 'Error al procesar el archivo PDF' });
    }
};
