const prisma = require('../lib/prisma');

async function getTicketActivity(req, res, next) {
  try {
    const ticket = await prisma.ticket.findUnique({ where: { id: req.params.id } });
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const logs = await prisma.activityLog.findMany({
      where: { ticketId: req.params.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { timestamp: 'desc' },
    });

    return res.json(logs);
  } catch (err) {
    next(err);
  }
}

module.exports = { getTicketActivity };
