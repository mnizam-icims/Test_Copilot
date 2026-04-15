const { z } = require('zod');

const statusEnum = z.enum(['OPEN', 'IN_PROGRESS', 'BLOCKED', 'DONE']);
const priorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
const severityEnum = z.enum(['TRIVIAL', 'MINOR', 'MAJOR', 'CRITICAL']);
const testTypeEnum = z.enum(['REGRESSION', 'SMOKE', 'EXPLORATORY', 'AUTOMATION']);

const createTicketSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(1, 'Description is required'),
  status: statusEnum.optional(),
  priority: priorityEnum.optional(),
  severity: severityEnum.optional(),
  testType: testTypeEnum.optional(),
  assigneeId: z.string().optional().nullable(),
  sprintName: z.string().optional().nullable(),
  blockedReason: z.string().optional().nullable(),
  playwrightTestFile: z.string().optional().nullable(),
  testCaseId: z.string().optional().nullable(),
});

const updateTicketSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  status: statusEnum.optional(),
  priority: priorityEnum.optional(),
  severity: severityEnum.optional(),
  testType: testTypeEnum.optional(),
  assigneeId: z.string().optional().nullable(),
  sprintName: z.string().optional().nullable(),
  blockedReason: z.string().optional().nullable(),
  playwrightTestFile: z.string().optional().nullable(),
  testCaseId: z.string().optional().nullable(),
});

module.exports = { createTicketSchema, updateTicketSchema };
