import { Router } from 'express';
import { startOfDay } from 'date-fns';
import { prisma } from '../config/prisma.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/summary', authenticate, authorize('ADMIN'), async (_req, res) => {
  const todayStart = startOfDay(new Date());

  const sales = await prisma.sale.findMany({
    where: { createdAt: { gte: todayStart } },
    include: { items: true },
  });

  const totals = sales.reduce(
    (acc, sale) => {
      acc.total += sale.totalAmount;
      if (sale.paymentMode === 'CASH') acc.cash += sale.totalAmount;
      if (sale.paymentMode === 'UPI') acc.upi += sale.totalAmount;
      return acc;
    },
    { total: 0, cash: 0, upi: 0 }
  );

  const topItemsRaw = await prisma.saleItem.groupBy({
    by: ['itemId'],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 5,
  });

  const items = await prisma.item.findMany({ where: { id: { in: topItemsRaw.map((t) => t.itemId) } } });
  const itemMap = new Map(items.map((i) => [i.id, i.name]));

  const topItems = topItemsRaw.map((t) => ({
    itemId: t.itemId,
    name: itemMap.get(t.itemId) || 'Unknown',
    quantity: t._sum.quantity || 0,
  }));

  res.json({
    todayTotalSales: totals.total,
    todayCashTotal: totals.cash,
    todayUpiTotal: totals.upi,
    billsToday: sales.length,
    topItems,
  });
});

export default router;
