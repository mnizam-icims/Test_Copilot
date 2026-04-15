const prisma = require('../lib/prisma');
const { createTicketSchema, updateTicketSchema } = require('../validators/ticket.validator');

const TRACKED_FIELDS = [
  'title',
  'description',
  'status',
  'priority',
  'severity',
  'testType',
  'assigneeId',
  'sprintName',
  'blockedReason',
  'playwrightTestFile',
  'testCaseId',
];

async function getAllTickets(req, res, next) {
  try {
    const { assigneeId, status, priority, sprint, testType } = req.query;

    const where = {};
    if (assigneeId) where.assigneeId = assigneeId;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (sprint) where.sprintName = sprint;
    if (testType) where.testType = testType;

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        assignee: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(tickets);
  } catch (err) {
    next(err);
  }
}

async function createTicket(req, res, next) {
  try {
    const data = createTicketSchema.parse(req.body);

    const ticket = await prisma.ticket.create({
      data,
      include: {
        assignee: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    await prisma.activityLog.create({
      data: {
        ticketId: ticket.id,
        userId: req.user.id,
        action: 'created',
        newValue: ticket.title,
      },
    });

    return res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
}

async function getTicketById(req, res, next) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id },
      include: {
        assignee: { select: { id: true, name: true, email: true, role: true } },
        activityLogs: {
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    return res.json(ticket);
  } catch (err) {
    next(err);
  }
}

async function updateTicket(req, res, next) {
  try {
    const data = updateTicketSchema.parse(req.body);

    const existing = await prisma.ticket.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const updated = await prisma.ticket.update({
      where: { id: req.params.id },
      data,
      include: {
        assignee: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    // Log each changed field individually
    const logEntries = [];
    for (const field of TRACKED_FIELDS) {
      const oldVal = existing[field] == null ? null : String(existing[field]);
      const newVal = data[field] == null ? null : String(data[field]);

      if (field in data && oldVal !== newVal) {
        logEntries.push({
          ticketId: updated.id,
          userId: req.user.id,
          action: `${field}_changed`,
          oldValue: oldVal,
          newValue: newVal,
        });
      }
    }

    if (logEntries.length > 0) {
      await prisma.activityLog.createMany({ data: logEntries });
    }

    return res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteTicket(req, res, next) {
  try {
    const existing = await prisma.ticket.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    await prisma.ticket.delete({ where: { id: req.params.id } });

    return res.json({ message: 'Ticket deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllTickets, createTicket, getTicketById, updateTicket, deleteTicket };
