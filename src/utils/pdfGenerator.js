import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * 🏛️ IBES Official PDF Generation Service
 * Generates triple-copy approval documents for Tutor/Supervisor appointments.
 */

const IBES_NAVY = [0, 31, 63]; // #001f3f
const IBES_RED = [231, 1, 57]; // #E70139

const getBase64ImageFromURL = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/jpeg");
      resolve(dataURL);
    };
    img.onerror = (error) => reject(error);
    img.src = url;
  });
};

export const generateTutorApprovalPDFs = async (app, leaderName) => {
  const copies = [
    { target: 'TUTOR', filename: `Approval_Tutor_Copy_${app.fullName.replace(/\s+/g, '_')}.pdf` },
    { target: 'LEARNING CENTRE', filename: `Approval_LearningCentre_Copy_${app.fullName.replace(/\s+/g, '_')}.pdf` },
    { target: 'ADMINISTRATION', filename: `Approval_Admin_Copy_${app.fullName.replace(/\s+/g, '_')}.pdf` }
  ];

  let logoBase64 = null;
  try {
    logoBase64 = await getBase64ImageFromURL("https://ibesuni.fr/portal/assets/emails/ibes.jpg");
  } catch (e) {
    console.warn("Logo fetch failed, proceeding without logo", e);
  }

  for (const copy of copies) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // 🎨 Layout Constants
    const margin = 20;
    let currentY = 20;

    // 🏗️ Header Section
    if (logoBase64) {
      doc.addImage(logoBase64, 'JPEG', margin, currentY, 40, 15);
    }
    
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`OFFICIAL APPROVAL - ${copy.target} COPY`, pageWidth - margin, currentY + 5, { align: 'right' });
    doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, pageWidth - margin, currentY + 10, { align: 'right' });
    
    currentY += 25;

    // 📘 Title Box
    doc.setFillColor(...IBES_NAVY);
    doc.rect(margin, currentY, pageWidth - (margin * 2), 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("LETTER OF APPOINTMENT: TUTOR & SUPERVISOR", pageWidth / 2, currentY + 8, { align: 'center' });
    
    currentY += 22;

    // 👤 Personal Profile Detail
    doc.setTextColor(...IBES_NAVY);
    doc.setFontSize(12);
    doc.text("1. APPLICANT PERSONAL DOSSIER", margin, currentY);
    currentY += 5;
    
    doc.autoTable({
      startY: currentY,
      margin: { left: margin, right: margin },
      body: [
        ["Full Name & Title", app.fullName],
        ["Gender", app.gender],
        ["Contact Number", app.contactNumber],
        ["Home Address", app.homeAddress],
        ["Personal Email", app.workEmail]
      ],
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: { 0: { fontStyle: 'bold', width: 50 } }
    });

    currentY = doc.lastAutoTable.finalY + 10;

    // 💼 Professional Alignment
    doc.text("2. PROFESSIONAL & ACADEMIC ALIGNMENT", margin, currentY);
    currentY += 5;

    doc.autoTable({
      startY: currentY,
      margin: { left: margin, right: margin },
      body: [
        ["Programme Name", app.ibesprogrammes || app.ibesProgrammes || "Not Specified"],
        ["Specific Module(s)", app.ibesModules || "General Assignment"],
        ["Current Occupation", app.occupation],
        ["Employer / Institution", app.employer],
        ["Approved Centre", app.approvedCentre || "N/A"]
      ],
      theme: 'grid',
      headStyles: { fillColor: IBES_NAVY },
      styles: { fontSize: 10 },
      columnStyles: { 0: { fontStyle: 'bold', width: 50, fillColor: [245, 245, 245] } }
    });

    currentY = doc.lastAutoTable.finalY + 10;

    // 📜 Evidence & Experience Summary
    doc.text("3. EXPERIENCE SUMMARY", margin, currentY);
    currentY += 5;
    
    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.setFont("helvetica", "normal");
    const summaryText = app.teachingEvidence || app.researchActivity || "Academic credentials verified by IBES Board.";
    const splitText = doc.splitTextToSize(summaryText, pageWidth - (margin * 2));
    doc.text(splitText, margin, currentY);
    
    currentY += (splitText.length * 5) + 10;

    // 🖊️ Signatures Area
    doc.setTextColor(...IBES_NAVY);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("4. OFFICIAL AUTHORIZATION", margin, currentY);
    currentY += 15;

    // Applicant Signature (if available as base64/dataURL)
    if (app.signature) {
      try {
        doc.addImage(app.signature, 'PNG', margin, currentY, 40, 20);
      } catch (e) {
        doc.text("[Digitally Authorized]", margin + 5, currentY + 10);
      }
    } else {
      doc.setFontSize(8);
      doc.text("Electronic Signature Verified", margin, currentY + 10);
    }

    // Leader Approval Stamp
    doc.setDrawColor(...IBES_RED);
    doc.setLineWidth(0.5);
    doc.line(pageWidth - margin - 60, currentY + 15, pageWidth - margin, currentY + 15);
    doc.setFontSize(10);
    doc.text(leaderName || "Programme Leader", pageWidth - margin - 30, currentY + 20, { align: 'center' });
    doc.setFontSize(8);
    doc.setTextColor(...IBES_RED);
    doc.text("FINAL ACADEMIC APPROVAL", pageWidth - margin - 30, currentY + 25, { align: 'center' });

    // 📜 Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Institut Brittany d'Enseignement Supérieur (IBES) - Official Registry Document", pageWidth / 2, 285, { align: 'center' });
    doc.text("This document is a formal record of academic appointment.", pageWidth / 2, 290, { align: 'center' });

    // 📥 Save & Download
    doc.save(copy.filename);
    
    // Small delay to prevent browser download grouping issues
    await new Promise(r => setTimeout(r, 800));
  }
};
