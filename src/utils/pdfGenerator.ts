import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import { Platform } from 'react-native';

export interface PDFGenerationOptions {
  productName: string;
  productCode: string;
  labelImageUrl?: string;
  fileName?: string;
  labelType?: 'energy' | 'size-guide';
}

// Returns local PDF file URI in app sandbox
export const generateEnergyLabelPDF = async (options: PDFGenerationOptions): Promise<string> => {
  const { productName, productCode, labelImageUrl, fileName, labelType = 'energy' } = options;
  
  // Create a simple HTML template for the PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Energy Label - ${productName}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: white;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #D53439;
          padding-bottom: 15px;
        }
        .product-info {
          margin-bottom: 30px;
        }
        .product-name {
          font-size: 18px;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
        }
        .product-code {
          font-size: 14px;
          color: #666;
        }
        .label-container {
          text-align: center;
          margin: 30px 0;
        }
        .energy-label {
          max-width: 300px;
          max-height: 400px;
          border: 2px solid #1E90FF;
          border-radius: 8px;
          padding: 10px;
          display: inline-block;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
          padding-top: 15px;
        }
        .lassa-logo {
          max-width: 150px;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="https://b2bcis.brisa-online.com/b2b/medias/lassa-logo-mini.png" alt="Lassa Logo" class="lassa-logo">
        <h1>${labelType === 'energy' ? 'Energy Label' : 'Size Guide'}</h1>
      </div>
      
      <div class="product-info">
        <div class="product-name">${productName}</div>
        <div class="product-code">Product Code: ${productCode}</div>
      </div>
      
      <div class="label-container">
        ${labelImageUrl 
          ? `<img src="${labelImageUrl}" alt="${labelType === 'energy' ? 'Energy Label' : 'Size Guide'}" class="energy-label">`
          : labelType === 'energy' 
            ? `<div class="energy-label">
                <div style="background: linear-gradient(to bottom, #39B54A, #7AC943, #D9E021, #FBB03B, #F7931E, #F15A24, #C1272D); height: 300px; border-radius: 6px; display: flex; flex-direction: column; justify-content: space-around; padding: 10px;">
                  <div style="text-align: center; color: white; font-weight: bold; font-size: 16px;">ENERGY LABEL</div>
                  <div style="display: flex; justify-content: space-around; color: white; font-weight: bold;">
                    <span>A</span><span>B</span><span>C</span><span>D</span><span>E</span><span>F</span><span>G</span>
                  </div>
                  <div style="text-align: center; color: white; font-size: 12px;">Fuel Efficiency Rating</div>
                </div>
              </div>`
            : `<div class="energy-label">
                <div style="background: #f8f8f8; height: 300px; border-radius: 6px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px; border: 2px solid #1E90FF;">
                  <div style="text-align: center; color: #333; font-weight: bold; font-size: 18px;">SIZE GUIDE</div>
                  <div style="text-align: center; color: #666; font-size: 14px; margin-top: 10px;">Size chart for ${productName}</div>
                </div>
              </div>`
        }
      </div>
      
      <div class="footer">
        <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        <p>Lassa B2B Platform</p>
      </div>
    </body>
    </html>
  `;

  // Generate a unique filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const defaultFileName = `energy-label-${productCode}-${timestamp}.pdf`;
  const finalFileName = fileName || defaultFileName;

  try {
    // Create a real PDF file using Expo Print
    const { uri: tmpPdfUri } = await Print.printToFileAsync({ html: htmlContent });
    const dest = `${FileSystem.documentDirectory}${finalFileName}`;
    await FileSystem.copyAsync({ from: tmpPdfUri, to: dest });
    return dest;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

// Saves the generated PDF to a user-visible location and returns final saved URI
export const downloadEnergyLabelPDF = async (options: PDFGenerationOptions): Promise<string> => {
  try {
    const pdfUri = await generateEnergyLabelPDF(options);

    if (Platform.OS === 'android') {
      // Ask user to pick a directory (e.g., Downloads) and save there using SAF
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        // If user denies, keep file in app documents
        return pdfUri;
      }
      const dirUri = permissions.directoryUri;
      const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
        dirUri,
        (options.fileName || pdfUri.split('/').pop() || 'file.pdf').replace(/\.html$/i, '.pdf'),
        'application/pdf'
      );
      // Read the PDF as base64 and write into SAF file
      const base64 = await FileSystem.readAsStringAsync(pdfUri, { encoding: FileSystem.EncodingType.Base64 });
      await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
      return fileUri;
    }

    // iOS/web: keep in app documents and return path; user can access via Files app under app container
    return pdfUri;
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error('Failed to download PDF');
  }
};

// Alternative approach using a web service for PDF generation
export const generatePDFViaWebService = async (options: PDFGenerationOptions): Promise<string> => {
  // This would typically call a backend service that converts HTML to PDF
  // For now, we'll return a placeholder
  const { productName, productCode } = options;
  
  // In a real implementation, you would:
  // 1. Send the HTML content to your backend service
  // 2. The backend would use a library like Puppeteer or jsPDF to generate PDF
  // 3. Return the PDF file URL or base64 data
  
  console.log(`Would generate PDF for ${productName} (${productCode})`);
  
  // Placeholder return
  return `https://your-backend-service.com/generate-pdf?product=${encodeURIComponent(productName)}&code=${encodeURIComponent(productCode)}`;
};
