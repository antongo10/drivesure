"use client";

export interface CertificateData {
  policyNumber: string;
  holderName: string;
  vehicle: string;
  registration: string;
  coverType: string;
  startDate: string;
  endDate: string;
  drivers: string[];
  address: string;
}

export async function generateCertificatePDF(data: CertificateData): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const coverLabels: Record<string, string> = {
    "third-party": "Third Party Only",
    "third-party-fire-theft": "Third Party, Fire & Theft",
    comprehensive: "Comprehensive",
  };

  // Background
  doc.setFillColor(30, 58, 95);
  doc.rect(0, 0, 210, 40, "F");

  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("DRIVESURE", 15, 18);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Authorised and Regulated by the Financial Conduct Authority", 15, 27);
  doc.text("FCA Registration No. 123456", 15, 34);

  // Certificate title
  doc.setTextColor(30, 58, 95);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFICATE OF MOTOR INSURANCE", 105, 55, { align: "center" });

  // Divider
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.8);
  doc.line(15, 60, 195, 60);

  // Policy info box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 65, 180, 22, 3, 3, "F");
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("POLICY NUMBER", 20, 73);
  doc.text("VALID FROM", 85, 73);
  doc.text("VALID TO", 145, 73);
  doc.setTextColor(30, 58, 95);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(data.policyNumber, 20, 82);
  doc.setFontSize(11);
  doc.text(data.startDate, 85, 82);
  doc.text(data.endDate, 145, 82);

  // Sections
  const drawSection = (title: string, y: number) => {
    doc.setFillColor(37, 99, 235);
    doc.rect(15, y, 180, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(title, 18, y + 5);
  };

  const drawRow = (label: string, value: string, y: number) => {
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(label, 20, y);
    doc.setTextColor(30, 58, 95);
    doc.setFont("helvetica", "bold");
    doc.text(value, 90, y);
  };

  // Policyholder
  drawSection("POLICYHOLDER DETAILS", 95);
  drawRow("Name:", data.holderName, 108);
  drawRow("Address:", data.address, 116);

  // Vehicle
  drawSection("VEHICLE DETAILS", 127);
  drawRow("Vehicle:", data.vehicle, 140);
  drawRow("Registration Mark:", data.registration.toUpperCase(), 148);

  // Cover
  drawSection("INSURANCE DETAILS", 159);
  drawRow("Type of Cover:", coverLabels[data.coverType] || data.coverType, 172);
  drawRow("Permitted Drivers:", data.drivers[0] || "", 180);
  data.drivers.slice(1).forEach((d, i) => {
    doc.setTextColor(30, 58, 95);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(d, 90, 188 + i * 8);
  });

  const driversEndY = 180 + Math.max(data.drivers.length - 1, 0) * 8 + 15;

  // Use of vehicle
  drawSection("USE OF VEHICLE", driversEndY);
  doc.setTextColor(30, 58, 95);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Social, domestic and pleasure purposes. Commuting to a single place of work. Business use by the policyholder.",
    20,
    driversEndY + 12,
    { maxWidth: 170 }
  );

  // Footer
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 262, 210, 35, "F");
  doc.setDrawColor(226, 232, 240);
  doc.line(0, 262, 210, 262);
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    "This certificate is issued pursuant to Section 147 of the Road Traffic Act 1988 and must be kept safely.",
    105,
    270,
    { align: "center", maxWidth: 175 }
  );
  doc.text(
    "DriveSure Ltd | 1 Insurance Square, London, EC1A 1BB | 0800 123 4567 | hello@drivesure.co.uk",
    105,
    278,
    { align: "center" }
  );
  doc.text("Registered in England & Wales No. 12345678", 105, 286, { align: "center" });

  return doc.output("blob");
}
