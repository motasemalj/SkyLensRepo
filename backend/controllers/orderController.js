const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// Price calculation function
function calculateEstimate(service, pkg) {
  const basePrices = {
    AERIAL_PHOTOGRAPHY: 800,
    EDITED_VIDEO: 1500,
    MAPPING_3D: 2500,
    INDUSTRIAL_INSPECTION: 3000,
  };
  
  const basePrice = basePrices[service] || 1000;
  const packageMultiplier = pkg === 'EDITED' ? 1.5 : 1;
  
  return basePrice * packageMultiplier;
}

exports.createOrder = async (req, res) => {
  try {
    const { location, service, package: pkg, description, date, time, latitude, longitude } = req.body;
    if (!location || !pkg || !service) {
      return res.status(400).json({ error: 'Location, service, and package required' });
    }
    
    // Calculate estimate
    const estimate = calculateEstimate(service, pkg);
    
    const order = await prisma.order.create({
      data: {
        userId: req.user.userId,
        service,
        location,
        latitude,
        longitude,
        package: pkg,
        description,
        date,
        time,
        estimate,
        status: 'PENDING',
      },
    });
    res.status(201).json({ message: 'Order created', order });
  } catch (err) {
    console.error('Order creation error:', err);
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