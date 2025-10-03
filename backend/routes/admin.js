const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

function requireAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ error: 'Admin only' });
  next();
}

router.get('/orders', auth, requireAdmin, adminController.getAllOrders);
router.post('/orders/:orderId/approved', auth, requireAdmin, adminController.approveOrder);
router.post('/orders/:orderId/rejected', auth, requireAdmin, adminController.rejectOrder);
router.post('/orders/:orderId/:status', auth, requireAdmin, (req, res) => {
  const { status } = req.params;
  if (status === 'approved') {
    return adminController.approveOrder(req, res);
  } else if (status === 'rejected') {
    return adminController.rejectOrder(req, res);
  } else {
    return res.status(400).json({ error: 'Invalid status' });
  }
});
router.delete('/orders', auth, requireAdmin, adminController.deleteAllOrders);

module.exports = router; 