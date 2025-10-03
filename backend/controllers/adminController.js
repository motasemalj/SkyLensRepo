const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const { sendOrderApprovalEmail, sendOrderRejectionEmail } = require('../utils/email');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch all orders' });
  }
};

exports.approveOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'APPROVED' },
      include: { user: true },
    });
    // TODO: Trigger Stripe payment here (commented for demo)
    // await stripe.paymentIntents.create(...)
    
    // Send approval email
    await sendOrderApprovalEmail(order.user.email, order.user.name, {
      location: order.location,
      package: order.package,
      date: order.date,
      time: order.time
    });
    
    res.json({ message: 'Order approved', order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve order' });
  }
};

exports.rejectOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'REJECTED' },
      include: { user: true },
    });
    // Send rejection email
    await sendOrderRejectionEmail(order.user.email, order.user.name, {
      location: order.location,
      package: order.package,
      date: order.date,
      time: order.time
    });
    
    res.json({ message: 'Order rejected', order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject order' });
  }
};

exports.deleteAllOrders = async (req, res) => {
  try {
    await prisma.order.deleteMany({});
    res.json({ message: 'All orders deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete orders' });
  }
}; 