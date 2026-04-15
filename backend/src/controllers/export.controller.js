const path = require('path');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const PDFDocument = require('pdfkit');
const prisma = require('../lib/prisma');

const EXPORTS_DIR = path.join(__dirname, '../../exports');

function ensureExportsDir() {
  if (!fs.existsSync(EXPORTS_DIR)) {
    fs.mkdirSync(EXPORTS_DIR, { recursive: true });
  }
}

async function exportCSV(req, res, next) {
  try {
    ensureExportsDir();

    const tickets = await prisma.ticket.findMany({
      include: {
        assignee: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const filePath = path.join(EXPORTS_DIR, 'tickets_export.csv');

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'title', title: 'Title' },
        { id: 'description', title: 'Description' },
        { id: 'status', title: 'Status' },
        { id: 'priority', title: 'Priority' },
        { id: 'severity', title: 'Severity' },
        { id: 'testType', title: 'Test Type' },
        { id: 'assigneeName', title: 'Assignee Name' },
        { id: 'assigneeEmail', title: 'Assignee Email' },
        { id: 'sprintName', title: 'Sprint' },
        { id: 'blockedReason', title: 'Blocked Reason' },
        { id: 'playwrightTestFile', title: 'Playwright Test File' },
        { id: 'testCaseId', title: 'Test Case ID' },
        { id: 'createdAt', title: 'Created At' },
        { id: 'updatedAt', title: 'Updated At' },
      ],
    });

    const records = tickets.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      severity: t.severity,
      testType: t.testType,
      assigneeName: t.assignee ? t.assignee.name : '',
      assigneeEmail: t.assignee ? t.assignee.email : '',
      sprintName: t.sprintName || '',
      blockedReason: t.blockedReason || '',
      playwrightTestFile: t.playwrightTestFile || '',
      testCaseId: t.testCaseId || '',
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }));

    await csvWriter.writeRecords(records);

    res.download(filePath, 'tickets_export.csv', (err) => {
      if (err) next(err);
    });
  } catch (err) {
    next(err);
  }
}

async function exportPDF(req, res, next) {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        assignee: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="tickets_export.pdf"');
    doc.pipe(res);

    // Title
    doc.fontSize(20).font('Helvetica-Bold').text('QA Command Center — Ticket Report', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').text(`Generated: ${new Date().toUTCString()}`, { align: 'center' });
    doc.moveDown(1);

    doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.5);

    for (const ticket of tickets) {
      if (doc.y > 700) {
        doc.addPage();
      }

      doc.fontSize(13).font('Helvetica-Bold').text(`[${ticket.testCaseId || ticket.id}] ${ticket.title}`);
      doc.moveDown(0.3);

      doc
        .fontSize(9)
        .font('Helvetica')
        .text(
          `Status: ${ticket.status}  |  Priority: ${ticket.priority}  |  Severity: ${ticket.severity}  |  Type: ${ticket.testType}`
        );

      if (ticket.assignee) {
        doc.text(`Assignee: ${ticket.assignee.name} <${ticket.assignee.email}>`);
      }

      if (ticket.sprintName) {
        doc.text(`Sprint: ${ticket.sprintName}`);
      }

      doc.moveDown(0.3);
      doc.fontSize(10).font('Helvetica').text(`Description: ${ticket.description}`);

      if (ticket.blockedReason) {
        doc
          .fontSize(9)
          .fillColor('red')
          .text(`Blocked Reason: ${ticket.blockedReason}`)
          .fillColor('black');
      }

      if (ticket.playwrightTestFile) {
        doc.fontSize(9).text(`Playwright File: ${ticket.playwrightTestFile}`);
      }

      doc
        .fontSize(8)
        .fillColor('grey')
        .text(`Created: ${ticket.createdAt.toISOString()}  |  Updated: ${ticket.updatedAt.toISOString()}`)
        .fillColor('black');

      doc.moveDown(0.5);
      doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke('#cccccc');
      doc.moveDown(0.5);
    }

    doc.end();
  } catch (err) {
    next(err);
  }
}

module.exports = { exportCSV, exportPDF };
