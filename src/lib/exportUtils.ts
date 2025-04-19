
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportColumn {
  header: string;
  key: string;
  width?: number;
}

export const exportToExcel = <T extends Record<string, any>>(
  data: T[],
  columns: ExportColumn[],
  fileName: string
) => {
  try {
    // Format data for Excel
    const excelData = data.map(item => {
      const row: Record<string, any> = {};
      columns.forEach(column => {
        const value = getNestedValue(item, column.key);
        row[column.header] = value;
      });
      return row;
    });

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    // Auto-size columns
    const colWidths = columns.map(col => ({ wch: col.width || 15 }));
    worksheet['!cols'] = colWidths;

    // Write to file and trigger download
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    throw error;
  }
};

export const exportToPdf = <T extends Record<string, any>>(
  data: T[],
  columns: ExportColumn[],
  title: string,
  fileName: string
) => {
  try {
    // Create PDF document in landscape orientation
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm'
    });
    
    // Add title
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

    // Format data for PDF
    const headers = columns.map(col => col.header);
    const rows = data.map(item => 
      columns.map(col => {
        const value = getNestedValue(item, col.key);
        return value !== null && value !== undefined ? String(value) : '';
      })
    );

    // Create table with smaller font size for better fit
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 30,
      styles: { 
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: { 
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 9
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 30, right: 10, bottom: 10, left: 10 },
      tableWidth: 'auto'
    });

    // Save PDF
    doc.save(`${fileName}.pdf`);
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    throw error;
  }
};

// Helper function to get nested object values using dot notation
function getNestedValue(obj: Record<string, any>, path: string): any {
  const keys = path.split('.');
  return keys.reduce((o, key) => {
    if (o && typeof o === 'object' && key in o) {
      return o[key];
    }
    return '';
  }, obj);
}
