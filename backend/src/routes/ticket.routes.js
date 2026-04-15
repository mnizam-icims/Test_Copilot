const { Router } = require('express');
const auth = require('../middleware/auth');
const {
  getAllTickets,
  createTicket,
  getTicketById,
  updateTicket,
  deleteTicket,
} = require('../controllers/ticket.controller');
const { getTicketActivity } = require('../controllers/activity.controller');

const router = Router();

router.use(auth);

router.get('/', getAllTickets);
router.post('/', createTicket);
router.get('/:id', getTicketById);
router.patch('/:id', updateTicket);
router.delete('/:id', deleteTicket);
router.get('/:id/activity', getTicketActivity);

module.exports = router;
