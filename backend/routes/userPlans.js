const express = require('express');
const router = express.Router();
const User = require('../models/User');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');

// Export saved plans to CSV
router.get('/export/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const favoritedPlans = user.favoritedPlans.sort((a, b) => new Date(b.favoritedAt) - new Date(a.favoritedAt));

    // Transform data for CSV export
    const csvData = favoritedPlans.map(plan => ({
      'Favorited Date': new Date(plan.favoritedAt).toLocaleDateString(),
      'Car Make': plan.car.make,
      'Car Model': plan.car.model,
      'Car Year': plan.car.year,
      'Car Trim': plan.car.trim || 'N/A',
      'MSRP': `$${plan.car.msrp.toLocaleString()}`,
      'Dealer Price': `$${plan.car.dealerPrice.toLocaleString()}`,
      'Location': `${plan.car.location?.city || 'N/A'}, ${plan.car.location?.state || 'N/A'}`,
      'Plan Type': plan.planType,
      'Plan Name': plan.planName,
      'Term': plan.term,
      'Down Payment': `$${plan.downPayment.toLocaleString()}`,
      'Monthly Payment': `$${plan.monthlyPayment.toLocaleString()}`,
      'APR': `${plan.apr.toFixed(2)}%`,
      'Total Amount': `$${plan.totalAmount.toLocaleString()}`,
      'Credit Score': plan.financialInputs.creditScore,
      'Annual Income': plan.financialInputs.annualIncome,
      'Monthly Budget': plan.financialInputs.monthlyBudget,
      'Is Recommended': plan.isRecommended ? 'Yes' : 'No',
      'Description': plan.description || 'N/A',
      'Features': plan.features?.join('; ') || 'N/A',
      'Requirements': plan.requirements?.join('; ') || 'N/A'
    }));

    // Define CSV fields with proper labels
    const fields = [
      { label: 'Favorited Date', value: 'Favorited Date' },
      { label: 'Car Make', value: 'Car Make' },
      { label: 'Car Model', value: 'Car Model' },
      { label: 'Car Year', value: 'Car Year' },
      { label: 'Car Trim', value: 'Car Trim' },
      { label: 'MSRP', value: 'MSRP' },
      { label: 'Dealer Price', value: 'Dealer Price' },
      { label: 'Location', value: 'Location' },
      { label: 'Plan Type', value: 'Plan Type' },
      { label: 'Plan Name', value: 'Plan Name' },
      { label: 'Term', value: 'Term' },
      { label: 'Down Payment', value: 'Down Payment' },
      { label: 'Monthly Payment', value: 'Monthly Payment' },
      { label: 'APR', value: 'APR' },
      { label: 'Total Amount', value: 'Total Amount' },
      { label: 'Credit Score', value: 'Credit Score' },
      { label: 'Annual Income', value: 'Annual Income' },
      { label: 'Monthly Budget', value: 'Monthly Budget' },
      { label: 'Is Recommended', value: 'Is Recommended' },
      { label: 'Description', value: 'Description' },
      { label: 'Features', value: 'Features' },
      { label: 'Requirements', value: 'Requirements' }
    ];

    // Create CSV parser with options
    const parser = new Parser({ 
      fields,
      delimiter: ',',
      quote: '"',
      escape: '"',
      header: true
    });

    const csv = parser.parse(csvData);
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="favorited-plans.csv"');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting saved plans:', error);
    res.status(500).json({ 
      message: 'Error exporting saved plans',
      error: error.message 
    });
  }
});

// Export saved plans to PDF (revised for better formatting and text visibility)
router.get('/export-pdf/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const favoritedPlans = user.favoritedPlans.sort(
      (a, b) => new Date(b.favoritedAt) - new Date(a.favoritedAt)
    );

    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 60, bottom: 60, left: 50, right: 50 },
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="user_plans.pdf"');
    doc.pipe(res);

    /* ---------------------------
       HEADER SECTION
    --------------------------- */
    const topY = doc.y;
    try {
      doc.image('backend/assets/toyota-logo.png', 50, topY, { width: 50 });
    } catch {
      console.log('Logo not found — continuing without image');
    }

    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .fillColor('#111827')
      .text('Saved Plans Summary', 0, topY, { align: 'center' });

    doc.moveDown(0.8);

    /* ---------------------------
       USER INFO SECTION
    --------------------------- */
    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#374151')
      .text(`User: ${(user.firstName || 'N/A').toUpperCase()} ${(user.lastName || 'N/A').toUpperCase()}`, 50)
      .moveDown(0.3)
      .text(`Export Date: ${new Date().toLocaleDateString()}`, 50)
      .moveDown(0.3)
      .text(`Total Plans: ${favoritedPlans.length}`, 50);

    // Separator line
    doc
      .moveDown(0.4)
      .strokeColor('#E5E7EB')
      .lineWidth(0.5)
      .moveTo(50, doc.y)
      .lineTo(doc.page.width - 50, doc.y)
      .stroke();

    doc.moveDown(0.4);

    /* ---------------------------
       TABLE SETUP (Adjusted widths for better fit)
    --------------------------- */
    const pageWidth = doc.page.width - 100; // Account for margins
    const colX = 50;
    const headerHeight = 24;
    const minRowHeight = 22;

    // Adjusted column widths to prevent text overflow
    const columns = [
      { label: 'Plan Name', width: 0.18, align: 'left' },
      { label: 'Vehicle', width: 0.20, align: 'left' },
      { label: 'Term', width: 0.08, align: 'center' },
      { label: 'Down Payment', width: 0.15, align: 'right' },
      { label: 'Monthly Payment', width: 0.15, align: 'right' },
      { label: 'APR', width: 0.08, align: 'right' },
      { label: 'Credit Score', width: 0.08, align: 'center' },
      { label: 'Total', width: 0.08, align: 'right' },
    ];

    // Verify total width sums to 1.0
    const totalWidthRatio = columns.reduce((acc, c) => acc + c.width, 0);
    if (Math.abs(totalWidthRatio - 1.0) > 0.001) {
      throw new Error('Column widths must sum to 1.0');
    }

    // Header background
    const headerY = doc.y;
    doc.rect(colX, headerY, pageWidth, headerHeight).fill('#374151');
    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9);

    let x = colX;
    columns.forEach((col) => {
      const colWidth = pageWidth * col.width;
      doc.text(col.label, x + 6, headerY + 8, {
        width: colWidth - 12,
        align: col.align,
        ellipsis: false,
        continued: false,
      });
      x += colWidth;
    });

    let currentY = headerY + headerHeight;
    let totalCost = 0;
    doc.font('Helvetica').fontSize(8).fillColor('#111827');

    /* ---------------------------
       TABLE BODY
    --------------------------- */
    for (let i = 0; i < favoritedPlans.length; i++) {
      const plan = favoritedPlans[i];
      const bgColor = i % 2 === 0 ? '#FFFFFF' : '#F9FAFB';
      const vehicleText = `${plan.car.year} ${plan.car.make} ${plan.car.model}`;
      const planTotal = plan.totalAmount || 0;
      totalCost += planTotal;

      const values = [
        plan.planName || 'N/A',
        vehicleText,
        plan.term || 'N/A',
        `$${plan.downPayment?.toLocaleString() || '0'}`,
        `$${plan.monthlyPayment?.toLocaleString() || '0'}`,
        `${plan.apr?.toFixed(2) || '0.00'}%`,
        plan.financialInputs?.creditScore || '—',
        `$${planTotal.toLocaleString()}`,
      ];

      // Calculate dynamic row height based on text content
      let maxTextHeight = 0;
      doc.fontSize(8).font('Helvetica');
      columns.forEach((col, j) => {
        const colWidth = pageWidth * col.width - 12; // Padding
        const textHeight = doc.heightOfString(values[j], {
          width: colWidth,
          align: col.align,
          ellipsis: false,
          continued: false,
        });
        maxTextHeight = Math.max(maxTextHeight, textHeight);
      });

      const dynamicRowHeight = Math.max(minRowHeight, maxTextHeight + 12); // More padding for better fit

      // Draw background
      doc.rect(colX, currentY, pageWidth, dynamicRowHeight).fill(bgColor);
      doc.fillColor('#111827');

      // Draw cell content
      let colPos = colX;
      columns.forEach((col, j) => {
        const colWidth = pageWidth * col.width;
        doc.text(values[j], colPos + 6, currentY + 6, {
          width: colWidth - 12,
          align: col.align,
          ellipsis: false,
          continued: false,
        });
        colPos += colWidth;
      });

      // Draw cell borders
      doc
        .strokeColor('#E5E7EB')
        .lineWidth(0.3)
        .rect(colX, currentY, pageWidth, dynamicRowHeight)
        .stroke();

      // Draw vertical lines
      let lineX = colX;
      columns.forEach((col) => {
        doc
          .moveTo(lineX, currentY)
          .lineTo(lineX, currentY + dynamicRowHeight)
          .stroke();
        lineX += pageWidth * col.width;
      });
      doc
        .moveTo(lineX, currentY)
        .lineTo(lineX, currentY + dynamicRowHeight)
        .stroke();

      currentY += dynamicRowHeight;

      // Handle page break
      if (currentY + dynamicRowHeight > doc.page.height - 80) {
        doc.addPage();
        currentY = 50;

        // Redraw table header
        doc.rect(colX, currentY, pageWidth, headerHeight).fill('#374151');
        doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9);

        let hx = colX;
        columns.forEach((col) => {
          const colWidth = pageWidth * col.width;
          doc.text(col.label, hx + 6, currentY + 8, {
            width: colWidth - 12,
            align: col.align,
            ellipsis: false,
            continued: false,
          });
          hx += colWidth;
        });

        currentY += headerHeight;
        doc.font('Helvetica').fontSize(8).fillColor('#111827');
      }
    }

    /* ---------------------------
       SUMMARY SECTION
    --------------------------- */
    doc.moveDown(1);
    const summaryTop = doc.y;

    // Separator above summary
    doc
      .strokeColor('#4B5563')
      .lineWidth(1)
      .moveTo(50, summaryTop)
      .lineTo(doc.page.width - 50, summaryTop)
      .stroke();

    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#111827').text('Summary', 50);

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#374151')
      .moveDown(0.3)
      .text(`Total Plans: ${favoritedPlans.length}`, 50)
      .moveDown(0.2)
      .text(`Total Cost: $${totalCost.toLocaleString()}`, 50);

    /* ---------------------------
       FOOTER
    --------------------------- */
    const footerY = doc.page.height - 50;
    doc
      .strokeColor('#E5E7EB')
      .lineWidth(1)
      .moveTo(50, footerY - 10)
      .lineTo(doc.page.width - 50, footerY - 10)
      .stroke();

    doc
      .fontSize(8)
      .font('Helvetica')
      .fillColor('#9CA3AF')
      .text('Generated by Find My Toyota', 0, footerY, { align: 'center' });

    doc.end();
  } catch (error) {
    console.error('Error exporting saved plans to PDF:', error);
    res.status(500).json({
      message: 'Error exporting saved plans to PDF',
      error: error.message,
    });
  }
});

module.exports = router;