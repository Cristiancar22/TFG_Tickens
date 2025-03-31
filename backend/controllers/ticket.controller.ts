import { Request, Response } from 'express';
import axios from 'axios';
import FormData from 'form-data';
import { Ticket } from '../models/ticket.model';
import { AuthRequest } from '../middlewares/auth.middleware';

export const processTicket = async (req: AuthRequest, res: Response):Promise<any> => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: 'No se proporcionó ninguna imagen' });
		}

		const imageBuffer = req.file.buffer;
		const imageBase64 = imageBuffer.toString('base64');

		const form = new FormData();
		form.append('image', imageBuffer, {
			filename: req.file.originalname,
			contentType: req.file.mimetype,
		});

		const ocrResponse = await axios.post('http://192.168.1.223:5010/ocr', form, {
			headers: form.getHeaders(),
		});

		const ticket = await Ticket.create({
			user: req.user?._id,
			scanDate: new Date(),
			ticketImage: imageBase64,
			processingStatus: 'processed',
			ocrMetadata: ocrResponse.data,
		});

		res.status(201).json({ ticket });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error al procesar el ticket' });
	}
};
