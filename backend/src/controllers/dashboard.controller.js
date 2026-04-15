const prisma = require('../lib/prisma');

async function getSummary(req, res, next) {
  try {
    const [statusGroups, priorityGroups, users, assigneeTickets, recentActivity] = await Promise.all([
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
      prisma.activityLog.findMany({
        take: 10,
        orderBy: { timestamp: 'desc' },
        include: {
          user: { select: { id: true, name: true } },
          ticket: { select: { id: true, title: true } },
        },
      }),
    ]);

    const statusMap = {};
    for (const group of statusGroups) {
      statusMap[group.status] = group._count._all;
    }

    const byPriority = {};
    for (const group of priorityGroups) {
      byPriority[group.priority] = group._count._all;
    }

    const userMap = {};
    for (const user of users) {
      userMap[user.id] = user;
    }

    const assigneeWorkload = assigneeTickets.map((group) => ({
      name: userMap[group.assigneeId]?.name || 'Unknown',
      ticketCount: group._count._all,
    }));

    const total = await prisma.ticket.count();

    return res.json({
      total,
      open: statusMap['OPEN'] || 0,
      inProgress: statusMap['IN_PROGRESS'] || 0,
      blocked: statusMap['BLOCKED'] || 0,
      done: statusMap['DONE'] || 0,
      byPriority,
      assigneeWorkload,
      recentActivity,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSummary };
