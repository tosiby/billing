import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

const itemSchema = z.object({
  name: z.string().min(1),
  category: z.enum(['CONE', 'CUP', 'SUNDAE']),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  lowStockLevel: z.number().int().min(0),
  isActive: z.boolean().optional(),
});

router.get('/', authenticate, async (_req, res) => {
  const items = await prisma.item.findMany({ orderBy: [{ category: 'asc' }, { name: 'asc' }] });
  res.json(items);
});

router.post('/', authenticate, authorize('ADMIN'), async (req, res) => {
  const parsed = itemSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid payload' });

  const item = await prisma.item.create({ data: parsed.data });
  res.status(201).json(item);
});

router.put('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  const parsed = itemSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid payload' });

  const item = await prisma.item.update({
    where: { id: Number(req.params.id) },
    data: parsed.data,
  });
  res.json(item);
});

export default router;
