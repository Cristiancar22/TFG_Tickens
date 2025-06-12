import { Response } from 'express';
import { SavingsGoal } from '../models/savingsGoal.model';
import { AuthRequest } from '../middlewares/auth.middleware';
import dayjs from 'dayjs';
import { Budget } from '../models/budget.model';
import { Types } from 'mongoose';
import { logger } from '../utils/logger';

export const getSavingsGoal = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?._id;
        const goal = await SavingsGoal.findOne({
            user: userId,
            isActive: true,
        });

        if (!goal) {
            res.status(404).json({
                message: 'No tienes un objetivo de ahorro',
            });
            return;
        }

        const start = goal.startDate ? new Date(goal.startDate) : new Date();
        const now = new Date();

        const totalSavings = await calculateTotalSavings(userId!, start, now);

        res.json({
            ...goal.toObject(),
            accumulatedAmount: totalSavings,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener el objetivo',
            error,
        });
    }
};

export const getAllSavingsGoals = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?._id;
        const goals = await SavingsGoal.find({ user: userId }).sort({
            startDate: -1,
        });

        res.json(goals);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener todas las metas',
            error,
        });
    }
};

export const createSavingsGoal = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?._id;

        const exists = await SavingsGoal.findOne({
            user: userId,
            isActive: true,
        });
        if (exists) {
            res.status(400).json({
                message: 'Ya existe un objetivo de ahorro activo',
            });
            return;
        }

        const goal = await SavingsGoal.create({
            user: userId,
            ...req.body,
        });

        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el objetivo', error });
    }
};

export const updateSavingsGoal = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;

        const updated = await SavingsGoal.findOneAndUpdate(
            { _id: id, user: userId },
            req.body,
            { new: true },
        );

        if (!updated) {
            res.status(404).json({ message: 'Objetivo no encontrado' });
            return;
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar el objetivo',
            error,
        });
    }
};

export const deleteSavingsGoal = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;

        const deleted = await SavingsGoal.findOneAndDelete({
            _id: id,
            user: userId,
        });

        if (!deleted) {
            res.status(404).json({ message: 'Objetivo no encontrado' });
            return;
        }

        res.json({ message: 'Objetivo eliminado correctamente' });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar el objetivo',
            error,
        });
    }
};

export const getTotalSavings = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?._id;

        const allBudgets = await Budget.find({ user: userId });

        const savingsByMonth = new Map<string, number>();

        const now = dayjs();
        const currentMonth = now.month() + 1;
        const currentYear = now.year();

        for (const budget of allBudgets) {
            if (budget.year === currentYear && budget.month === currentMonth) {
                continue;
            }

            const key = `${budget.year}-${String(budget.month).padStart(2, '0')}`;
            const current = savingsByMonth.get(key) ?? 0;

            if (!budget.category) {
                savingsByMonth.set(
                    key,
                    budget.limitAmount - budget.spentAmount,
                );
            } else if (!savingsByMonth.has(key)) {
                savingsByMonth.set(
                    key,
                    current + (budget.limitAmount - budget.spentAmount),
                );
            }
        }

        const totalSavings = Array.from(savingsByMonth.values()).reduce(
            (acc, s) => acc + s,
            0,
        );

        res.json({ totalSavings });
    } catch (error) {
        logger.error('Error al calcular el ahorro total:', error);
        res.status(500).json({ message: 'Error al calcular el ahorro total' });
    }
};

export const getSavingsRecommendations = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?._id as Types.ObjectId;
        const now = dayjs();
        const start = now.subtract(6, 'month');

        const budgets = await Budget.find({
            user: userId,
            $or: Array.from({ length: 6 }, (_, i) => {
                const date = now.subtract(i, 'month');
                return { month: date.month() + 1, year: date.year() };
            }),
        }).populate('category');

        const recommendations: string[] = [];

        const categoryStats = new Map<
            string,
            {
                name: string;
                totalSpent: number;
                totalLimit: number;
                months: number;
            }
        >();

        for (const b of budgets) {
            const key = b.category ? b.category._id.toString() : 'general';
            const categoryName =
                typeof b.category === 'object' &&
                b.category !== null &&
                'name' in b.category
                    ? b.category.name
                    : 'General';
            if (!categoryStats.has(key)) {
                categoryStats.set(key, {
                    name: categoryName,
                    totalSpent: 0,
                    totalLimit: 0,
                    months: 0,
                });
            }

            const stats = categoryStats.get(key)!;
            stats.totalSpent += b.spentAmount;
            stats.totalLimit += b.limitAmount;
            stats.months += 1;
        }

        for (const [_, stats] of categoryStats) {
            const avgSpent = stats.totalSpent / stats.months;
            const avgLimit = stats.totalLimit / stats.months;
            if ((avgSpent / avgLimit) * 100 === 0) continue;
            if (avgSpent < avgLimit * 0.6) {
                recommendations.push(
                    `Podrías reducir el presupuesto de "${stats.name}" ya que solo usas un ${(
                        (avgSpent / avgLimit) *
                        100
                    ).toFixed(0)}% de media.`,
                );
            } else if (avgSpent > avgLimit * 1.1) {
                recommendations.push(
                    `Has superado frecuentemente tu presupuesto en "${stats.name}". Considera aumentarlo o controlar tus gastos.`,
                );
            } else if (avgSpent > avgLimit * 0.8 && avgSpent < avgLimit * 1.1) {
                recommendations.push(
                    `Tu gasto en "${stats.name}" está muy ajustado al presupuesto. Revisa si puedes ahorrar ahí.`,
                );
            }
        }

        if (recommendations.length === 0) {
            recommendations.push(
                '¡Buen trabajo! No se encontraron recomendaciones específicas. Sigue así. 🎉',
            );
        }

        res.json({ recommendations });
    } catch (error) {
        logger.error('Error al generar recomendaciones:', error);
        res.status(500).json({
            message: 'Error al generar recomendaciones',
            error,
        });
    }
};

const calculateTotalSavings = async (
    userId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
): Promise<number> => {
    const start = dayjs(startDate).startOf('month');
    const end = dayjs(endDate).endOf('month');

    let total = 0;

    const months: { month: number; year: number }[] = [];
    let current = start.clone();

    while (current.isBefore(end, 'month') || current.isSame(end, 'month')) {
        months.push({
            month: current.month() + 1,
            year: current.year(),
        });
        current = current.add(1, 'month');
    }

    for (const { month, year } of months) {
        const budgets = await Budget.find({
            user: userId,
            month,
            year,
        });

        if (budgets.length === 0) continue;

        const generalBudget = budgets.find((b) => !b.category);

        if (generalBudget) {
            total += Math.max(
                generalBudget.limitAmount - generalBudget.spentAmount,
                0,
            );
        } else {
            for (const b of budgets) {
                total += Math.max(b.limitAmount - b.spentAmount, 0);
            }
        }
    }

    return total;
};
