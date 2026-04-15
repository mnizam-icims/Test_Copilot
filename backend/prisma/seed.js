const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data in dependency order
  await prisma.activityLog.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create users
  const ravi = await prisma.user.create({
    data: {
      name: 'Ravi Kumar',
      email: 'ravi@qacc.dev',
      password: hashedPassword,
      role: 'QA_LEAD',
    },
  });

  const priya = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya@qacc.dev',
      password: hashedPassword,
      role: 'QA_ENGINEER',
    },
  });

  const ankit = await prisma.user.create({
    data: {
      name: 'Ankit Singh',
      email: 'ankit@qacc.dev',
      password: hashedPassword,
      role: 'QA_ENGINEER',
    },
  });

  const sneha = await prisma.user.create({
    data: {
      name: 'Sneha Patel',
      email: 'sneha@qacc.dev',
      password: hashedPassword,
      role: 'QA_ENGINEER',
    },
  });

  console.log('Users created:', [ravi.email, priya.email, ankit.email, sneha.email]);

  const users = [ravi, priya, ankit, sneha];

  // 20 tickets spread across statuses, priorities, severities, test types
  const ticketData = [
    {
      title: 'Login page does not validate empty fields',
      description: 'When submitting the login form with empty email and password, no validation message is shown.',
      status: 'OPEN',
      priority: 'HIGH',
      severity: 'MAJOR',
      testType: 'REGRESSION',
      assigneeId: priya.id,
      sprintName: 'Sprint 1',
      testCaseId: 'TC-001',
    },
    {
      title: 'Dashboard chart not rendering on Firefox',
      description: 'The analytics pie chart fails to render on Firefox 120+. Console shows WebGL error.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      severity: 'MAJOR',
      testType: 'EXPLORATORY',
      assigneeId: ankit.id,
      sprintName: 'Sprint 1',
      testCaseId: 'TC-002',
    },
    {
      title: 'Export CSV includes duplicate rows',
      description: 'CSV export produces duplicate ticket rows when filters are applied.',
      status: 'OPEN',
      priority: 'MEDIUM',
      severity: 'MINOR',
      testType: 'REGRESSION',
      assigneeId: sneha.id,
      sprintName: 'Sprint 1',
      testCaseId: 'TC-003',
    },
    {
      title: 'API rate limiter blocks valid requests',
      description: 'Rate limiter is too aggressive and blocks authenticated users after 10 rapid requests.',
      status: 'BLOCKED',
      priority: 'CRITICAL',
      severity: 'CRITICAL',
      testType: 'SMOKE',
      assigneeId: ravi.id,
      sprintName: 'Sprint 2',
      blockedReason: 'Waiting for infrastructure team to update rate limit config.',
      testCaseId: 'TC-004',
    },
    {
      title: 'User profile avatar upload fails for PNG > 2MB',
      description: 'Uploading a PNG image larger than 2MB throws a 500 error instead of a user-friendly message.',
      status: 'DONE',
      priority: 'LOW',
      severity: 'MINOR',
      testType: 'REGRESSION',
      assigneeId: priya.id,
      sprintName: 'Sprint 1',
      testCaseId: 'TC-005',
    },
    {
      title: 'Playwright smoke suite fails on CI pipeline',
      description: 'The smoke test suite times out on CI due to missing environment variables for staging.',
      status: 'BLOCKED',
      priority: 'CRITICAL',
      severity: 'CRITICAL',
      testType: 'AUTOMATION',
      assigneeId: ankit.id,
      sprintName: 'Sprint 2',
      blockedReason: 'CI secrets not configured. Waiting for DevOps.',
      playwrightTestFile: 'tests/smoke/login.spec.ts',
      testCaseId: 'TC-006',
    },
    {
      title: 'Password reset email not sent in staging',
      description: 'The forgot-password flow does not trigger an email on the staging environment.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      severity: 'MAJOR',
      testType: 'REGRESSION',
      assigneeId: sneha.id,
      sprintName: 'Sprint 2',
      testCaseId: 'TC-007',
    },
    {
      title: 'Ticket status dropdown missing "BLOCKED" option',
      description: 'When editing a ticket, the status dropdown does not include the BLOCKED option.',
      status: 'DONE',
      priority: 'MEDIUM',
      severity: 'MINOR',
      testType: 'REGRESSION',
      assigneeId: priya.id,
      sprintName: 'Sprint 1',
      testCaseId: 'TC-008',
    },
    {
      title: 'Search autocomplete returns stale results',
      description: 'Typing in the search bar shows results from a previous query for about 2 seconds.',
      status: 'OPEN',
      priority: 'LOW',
      severity: 'TRIVIAL',
      testType: 'EXPLORATORY',
      assigneeId: ankit.id,
      sprintName: 'Sprint 3',
      testCaseId: 'TC-009',
    },
    {
      title: 'JWT token not refreshed after role change',
      description: 'When an admin changes a user role, the user\'s active JWT still carries the old role until expiry.',
      status: 'OPEN',
      priority: 'HIGH',
      severity: 'MAJOR',
      testType: 'SMOKE',
      assigneeId: ravi.id,
      sprintName: 'Sprint 2',
      testCaseId: 'TC-010',
    },
    {
      title: 'Pagination breaks on last page with filters',
      description: 'Navigating to the last page of filtered results causes a blank page and 404 in the network tab.',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      severity: 'MAJOR',
      testType: 'REGRESSION',
      assigneeId: sneha.id,
      sprintName: 'Sprint 3',
      testCaseId: 'TC-011',
    },
    {
      title: 'Mobile layout broken on ticket detail view',
      description: 'On screens < 375px the ticket detail modal overflows and action buttons are hidden.',
      status: 'OPEN',
      priority: 'LOW',
      severity: 'MINOR',
      testType: 'EXPLORATORY',
      assigneeId: priya.id,
      sprintName: 'Sprint 3',
      testCaseId: 'TC-012',
    },
    {
      title: 'Automation: Add E2E test for ticket creation flow',
      description: 'Write a Playwright test covering full ticket creation, assignment, and status change.',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      severity: 'MINOR',
      testType: 'AUTOMATION',
      assigneeId: ankit.id,
      sprintName: 'Sprint 3',
      playwrightTestFile: 'tests/e2e/ticket-creation.spec.ts',
      testCaseId: 'TC-013',
    },
    {
      title: 'Database query N+1 on dashboard summary',
      description: 'Dashboard summary endpoint fires N+1 queries causing 3s+ load times with many tickets.',
      status: 'OPEN',
      priority: 'HIGH',
      severity: 'MAJOR',
      testType: 'REGRESSION',
      assigneeId: ravi.id,
      sprintName: 'Sprint 2',
      testCaseId: 'TC-014',
    },
    {
      title: 'PDF export missing ticket description text',
      description: 'Generated PDF files omit the description field for all tickets.',
      status: 'DONE',
      priority: 'MEDIUM',
      severity: 'MAJOR',
      testType: 'REGRESSION',
      assigneeId: sneha.id,
      sprintName: 'Sprint 1',
      testCaseId: 'TC-015',
    },
    {
      title: 'Smoke: Verify health check endpoint returns 200',
      description: 'Add and verify /api/health returns 200 with uptime information.',
      status: 'DONE',
      priority: 'LOW',
      severity: 'TRIVIAL',
      testType: 'SMOKE',
      assigneeId: priya.id,
      sprintName: 'Sprint 1',
      testCaseId: 'TC-016',
    },
    {
      title: 'Concurrent ticket updates cause data race',
      description: 'Two users updating the same ticket simultaneously can overwrite each other\'s changes silently.',
      status: 'OPEN',
      priority: 'CRITICAL',
      severity: 'CRITICAL',
      testType: 'EXPLORATORY',
      assigneeId: ravi.id,
      sprintName: 'Sprint 3',
      testCaseId: 'TC-017',
    },
    {
      title: 'Activity log timestamps show UTC instead of local time',
      description: 'Activity log entries display raw UTC timestamps; should respect user timezone.',
      status: 'IN_PROGRESS',
      priority: 'LOW',
      severity: 'TRIVIAL',
      testType: 'REGRESSION',
      assigneeId: ankit.id,
      sprintName: 'Sprint 3',
      testCaseId: 'TC-018',
    },
    {
      title: 'Bulk delete does not trigger activity log',
      description: 'When deleting multiple tickets at once via the bulk action, no activity log entry is created.',
      status: 'OPEN',
      priority: 'MEDIUM',
      severity: 'MINOR',
      testType: 'REGRESSION',
      assigneeId: sneha.id,
      sprintName: 'Sprint 3',
      testCaseId: 'TC-019',
    },
    {
      title: 'Automation: Regression suite for sprint 2 features',
      description: 'Create a full regression automation suite covering all Sprint 2 deliverables.',
      status: 'OPEN',
      priority: 'HIGH',
      severity: 'MAJOR',
      testType: 'AUTOMATION',
      assigneeId: priya.id,
      sprintName: 'Sprint 3',
      playwrightTestFile: 'tests/regression/sprint2.spec.ts',
      testCaseId: 'TC-020',
    },
  ];

  const tickets = [];
  for (const data of ticketData) {
    const ticket = await prisma.ticket.create({ data });
    tickets.push(ticket);
  }

  console.log(`Created ${tickets.length} tickets`);

  // Activity log entries for each ticket
  const actions = ['created', 'status_changed', 'priority_changed', 'assigned', 'comment_added'];

  for (const ticket of tickets) {
    const author = users[Math.floor(Math.random() * users.length)];

    await prisma.activityLog.create({
      data: {
        ticketId: ticket.id,
        userId: author.id,
        action: 'created',
        newValue: ticket.title,
        timestamp: ticket.createdAt,
      },
    });

    if (ticket.status !== 'OPEN') {
      await prisma.activityLog.create({
        data: {
          ticketId: ticket.id,
          userId: ravi.id,
          action: 'status_changed',
          oldValue: 'OPEN',
          newValue: ticket.status,
        },
      });
    }

    if (ticket.assigneeId) {
      await prisma.activityLog.create({
        data: {
          ticketId: ticket.id,
          userId: ravi.id,
          action: 'assigned',
          newValue: ticket.assigneeId,
        },
      });
    }

    if (ticket.priority === 'CRITICAL' || ticket.priority === 'HIGH') {
      await prisma.activityLog.create({
        data: {
          ticketId: ticket.id,
          userId: ravi.id,
          action: 'priority_changed',
          oldValue: 'MEDIUM',
          newValue: ticket.priority,
        },
      });
    }
  }

  console.log('Activity logs created');
  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
