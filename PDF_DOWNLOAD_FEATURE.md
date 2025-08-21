# PDF Download Feature for Product Labels

## Overview
This feature allows users to download product labels (energy labels and size guides) as PDF files from the product detail page.

## Features Implemented

### 1. Energy Label PDF Download
- **Location**: Product Detail Page → Product Details Tab → Energy Label Section
- **Functionality**: Converts energy label images to PDF format
- **Access Points**:
  - Main energy label section with "PDF İndir" button
  - Energy label modal with "PDF Olarak İndir" button

### 2. Size Guide PDF Download
- **Location**: Product Detail Page → Product Details Tab → Size Guide Section (for promotional materials)
- **Functionality**: Converts size guide images to PDF format
- **Access Points**:
  - Main size guide section with "PDF İndir" button
  - Size guide modal with "PDF Olarak İndir" button

## Technical Implementation

### Files Modified/Created

#### New Files:
- `src/utils/pdfGenerator.ts` - PDF generation utility

#### Modified Files:
- `src/screens/ProductDetailScreen.tsx` - Added download buttons and functionality

### Dependencies Used
- `expo-file-system` - For file operations
- `expo-sharing` - For sharing/downloading files
- `@expo/vector-icons` - For download icons

### PDF Generation Process

1. **HTML Template Creation**: Generates an HTML document with:
   - Lassa logo and branding
   - Product information (name, code)
   - Label image or fallback representation
   - Timestamp and footer

2. **File Generation**: Creates an HTML file that can be:
   - Opened in a browser for PDF conversion
   - Shared via the device's sharing functionality

3. **User Experience**: 
   - Shows loading state during generation
   - Provides success/error feedback
   - Integrates with device's native sharing

## Usage

### For Energy Labels:
1. Navigate to a product detail page
2. Go to "Product Details" tab
3. Find the energy label section
4. Click "PDF İndir" button
5. Choose how to save/share the PDF

### For Size Guides:
1. Navigate to a promotional material product detail page
2. Go to "Product Details" tab
3. Find the size guide section
4. Click "PDF İndir" button
5. Choose how to save/share the PDF

## Future Enhancements

### Backend Integration
For production use, consider implementing:
- Backend PDF generation service using libraries like Puppeteer or jsPDF
- Proper PDF format instead of HTML files
- Cloud storage for generated PDFs

### Additional Features
- Batch download for multiple products
- Custom PDF templates
- PDF preview before download
- Email integration for PDF sharing

## Error Handling

The implementation includes:
- Input validation for product information
- File system error handling
- Sharing availability checks
- User-friendly error messages

## Browser Compatibility

The generated HTML files are compatible with:
- Modern web browsers
- Mobile browsers
- PDF conversion tools

## Notes

- Current implementation generates HTML files that can be converted to PDF
- For true PDF generation, consider adding `react-native-html-to-pdf` or similar library
- The feature works offline once the HTML template is generated
- File sharing uses the device's native sharing functionality

