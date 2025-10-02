const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

exports.createOrder = async (req, res) => {
  try {
    const { location, package: pkg, description, date, time, latitude, longitude } = req.body;
    if (!location || !pkg) return res.status(400).json({ error: 'Location and package required' });
    const order = await prisma.order.create({
      data: {
        userId: req.user.userId,
        location,
        latitude,
        longitude,
        package: pkg,
        description,
        date,
        time,
        status: 'PENDING',
      },
    });
    res.status(201).json({ message: 'Order created', order });
  } catch (err) {
    res.status(500).json({ error: 'Order creation failed' });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}; 