import React from 'react';
import jsPDF from 'jspdf';
import Button from '@mui/material/Button';
import logo from '../image/invoice image.png'; 
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';

const TenderPDF = ({ formData }) => {
  const generatePDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4'); // A4 size, portrait orientation

    // Define dimensions for A4
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Set new dimensions for the logo (adjust as needed)
    const logoWidth = pageWidth;  // 100% of the page width
    const logoHeight = pageHeight*12; // 100% of the page height

    // Center the image on the page
    const xPosition = (pageWidth - logoWidth) / 2; // Center horizontally
    const yPosition = (pageHeight - logoHeight) / 2; // Center vertically

    // Add image to the PDF (background)
    doc.addImage(logo, 'PNG', xPosition, yPosition, logoWidth, logoHeight, undefined, 'FAST');

    // Set font sizes and initial positioning
    const titleFontSize = 16;
    const fieldFontSize = 10;
    const valueFontSize = 10;
    const valueFontSize1 = 8;
    let yPositionText = 40; // Initial Y position for text

    // Title
    doc.setFontSize(titleFontSize);
    doc.setFont('helvetica', 'bold');
    doc.text('Tender Details', 10, yPositionText); // Title

    // Add horizontal line below the title
    doc.setLineWidth(0.5); // Set line width
    doc.line(10, yPositionText + 5, pageWidth - 10, yPositionText + 5); // Draw line

    // Add space between title and fields
    yPositionText += 15; // Increase space after title

    // Function to add fields and values
    const addFieldValue = (field, value, isTerms = false) => {
      if (isTerms) {

        yPositionText += 20;

        // Center the "Terms and Conditions" label
        const termsLabelX = (pageWidth - doc.getStringUnitWidth(field) * fieldFontSize / 2) / 2;
        doc.setFontSize(fieldFontSize);
        doc.setFont('helvetica', 'bold');
        doc.text(field, termsLabelX, yPositionText); // Field name


        // Add a small margin between the label and the terms list
        yPositionText += 10; // Move down slightly before printing the values

        // Split terms by line break and add each one below the other
        const termsArray = value ? value.toString().split('\n') : ['-']; // Default dash if empty

        termsArray.forEach((term) => {
          doc.setFontSize(valueFontSize1);
          doc.setFont('helvetica', 'normal');
          doc.text(term, 10, yPositionText); // Align left for each term

          yPositionText += 5; // Move down for the next line
        });

        yPositionText += 10; // Move down for the next field after terms
      } else {
        doc.setFontSize(fieldFontSize);
        doc.setFont('helvetica', 'bold');
        doc.text(`${field}:`, 10, yPositionText); // Field name

        doc.setFontSize(valueFontSize);
        doc.setFont('helvetica', 'normal');
        doc.text(value ? value.toString() : '-', 50, yPositionText); // Adding a dash if value is empty

        yPositionText += 10; // Move down for the next line
      }
    };







    // Add form data
    addFieldValue('Name', formData.Values.Name);
    addFieldValue('Tender Code Number', formData.Values.TenderCodenumber);
    addFieldValue('Quantity', formData.Values.Quantity);
    addFieldValue('Unit Price', formData.Values.UnitPrice);
    addFieldValue('Total Price', formData.Values.TotalPrice);
    addFieldValue('PO Number', formData.Values.PONumber);
    addFieldValue('PO Received Date', formData.Values.PORecivedDate);
    addFieldValue('Terms and Conditions', formData.Values.TermsAndConditions, true); 

    // Save the PDF
    doc.save('tender-details.pdf');
  };

  return (
    <Button
    style={{
      minWidth: '30px',
      minHeight: '30px',
      borderRadius: '50%',
      color: 'black',
      backgroundColor: 'rgb(255, 255, 255)',
      cursor: 'pointer', // Optional: to maintain the pointer cursor on hover
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.width = '30px';
      e.currentTarget.style.height = '30px';
      e.currentTarget.style.borderRadius = '50%';
      e.currentTarget.style.color = 'black';
      e.currentTarget.style.backgroundColor = 'rgb(222, 222, 222)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.width = '';
      e.currentTarget.style.height = '';
      e.currentTarget.style.borderRadius = '';
      e.currentTarget.style.color = '';
      e.currentTarget.style.backgroundColor = 'rgb(255, 255, 255)';
    }}
    onClick={generatePDF}
  >
      <PictureAsPdfOutlinedIcon 
        fontSize="small" 
        style={{
          minWidth: '30px',
          minHeight: '30px',
          borderRadius: '50%',
          color: 'black',
          padding: '5px', 
        }}
      />
    </Button>
  );
};

export default TenderPDF;
