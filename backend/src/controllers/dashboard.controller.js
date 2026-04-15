const prisma = require('../lib/prisma');

async function getSummary(req, res, next) {
  try {
    const [statusGroups, priorityGroups, users, assigneeTickets] = await Promise.all([
      prisma.ticket.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
      prisma.ticket.groupBy({
        by: ['priority'],
        _count: { _all: true },
      }),
      prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true },
      }),
      prisma.ticket.groupBy({
        by: ['assigneeId'],
        _count: { _all: true },
        where: { assigneeId: { not: null } },
      }),
    ]);

    const countsByStatus = {};
    for (const group of statusGroups) {
      countsByStatus[group.status] = group._count._all;
    }

    const countsByPriority = {};
    for (const group of priorityGroups) {
      countsByPriority[group.priority] = group._count._all;
    }

    const userMap = {};
    for (const user of users) {
      userMap[user.id] = user;
    }

    const assigneeWorkload = assigneeTickets.map((group) => ({
      assignee: userMap[group.assigneeId] || { id: group.assigneeId, name: 'Unknown' },
      ticketCount: group._count._all,
    }));

    const totalTickets = await prisma.ticket.count();

    return res.json({
      totalTickets,
      countsByStatus,
      countsByPriority,
      assigneeWorkload,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSummary };
