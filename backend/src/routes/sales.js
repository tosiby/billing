import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const saleSchema = z.object({
  paymentMode: z.enum(['CASH', 'UPI']),
  items: z.array(
    z.object({
      itemId: z.number().int().positive(),
      quantity: z.number().int().positive(),
    })
  ).min(1),
});

router.post('/', authenticate, async (req, res) => {
  const parsed = saleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid payload' });

  try {
    const result = await prisma.$transaction(async (tx) => {
    const ids = parsed.data.items.map((it) => it.itemId);
    const dbItems = await tx.item.findMany({ where: { id: { in: ids }, isActive: true } });

    if (dbItems.length !== ids.length) throw new Error('Some items unavailable');

    const map = new Map(dbItems.map((it) => [it.id, it]));

    let total = 0;
    const saleItemsData = parsed.data.items.map((it) => {
      const item = map.get(it.itemId);
      if (!item || item.stock < it.quantity) {
        throw new Error(`Insufficient stock for ${item?.name || 'item'}`);
      }
      total += item.price * it.quantity;
      return { itemId: it.itemId, quantity: it.quantity, price: item.price };
    });

    const billNumber = `BILL-${Date.now()}`;

    const sale = await tx.sale.create({
      data: {
        billNumber,
        totalAmount: Number(total.toFixed(2)),
        paymentMode: parsed.data.paymentMode,
        staffId: req.user.id,
        items: { create: saleItemsData },
      },
      include: {
        staff: { select: { name: true } },
        items: { include: { item: true } },
      },
    });

    for (const it of parsed.data.items) {
      await tx.item.update({
        where: { id: it.itemId },
        data: { stock: { decrement: it.quantity } },
      });
    }

    return sale;
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Could not create sale' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  const sale = await prisma.sale.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      staff: { select: { name: true, email: true } },
      items: { include: { item: true } },
    },
  });
  if (!sale) return res.status(404).json({ message: 'Sale not found' });
  res.json(sale);
});

router.get('/', authenticate, async (_req, res) => {
  const sales = await prisma.sale.findMany({
    include: { staff: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  res.json(sales);
});

export default router;
