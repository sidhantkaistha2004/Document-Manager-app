# Document Manager

A modern, responsive web application for managing and organizing your documents. Built with HTML, CSS, and JavaScript, this application allows you to add documents with their names and file paths, store them in a searchable inventory, and quickly locate and open files.

## Features

### 📁 Document Management
- **Add Documents**: Upload files and assign custom names
- **Auto Path Detection**: Automatically captures file information when you select a file
- **Document Inventory**: View all your stored documents in a clean, organized list
- **Persistent Storage**: Documents are saved locally using browser localStorage

### 🔍 Search Functionality
- **Smart Search**: Search by document name or file name
- **Real-time Results**: Instant search results as you type
- **Clear Display**: Easy-to-read search results with document details

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Beautiful Interface**: Modern gradient design with smooth animations
- **Intuitive Navigation**: Easy-to-use interface with clear visual feedback
- **Success Notifications**: Modal notifications for successful operations

### ⚡ Quick Actions
- **One-Click Open**: Open documents directly from the inventory
- **Easy Deletion**: Remove individual documents or clear all at once
- **File Information**: View file details including name, path, and date added

## How to Use

### Adding a Document
1. **Enter Document Name**: Type a descriptive name for your document
2. **Choose File**: Click "Choose File" to select the document from your computer
3. **Auto-Fill**: The file path will be automatically detected and filled
4. **Submit**: Click "Add to Inventory" to save the document

### Searching Documents
1. **Search Box**: Type in the search box to find documents
2. **Search Options**: Search by document name or file name
3. **Results**: Matching documents will be displayed instantly
4. **Clear Search**: Leave the search box empty to see all documents

### Managing Documents
- **Open Document**: Click the external link icon to open a document
- **Delete Document**: Click the trash icon to remove a document
- **Clear All**: Use the "Clear All" button to remove all documents

## File Structure

```
Document Manager/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup and modern structure
- **CSS3**: Flexbox, Grid, animations, and responsive design
- **JavaScript (ES6+)**: Classes, modules, and modern JavaScript features
- **Local Storage**: Browser-based data persistence
- **Font Awesome**: Icons for better user experience

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Internet Explorer 11+

### Local Storage
Documents are stored in the browser's localStorage, which means:
- Data persists between browser sessions
- No server required
- Data is private to your browser
- Limited storage capacity (usually 5-10MB)

## Getting Started

1. **Download Files**: Save all files in the same directory
2. **Open Application**: Double-click `launch.bat` (assuming nodejs is already installed in your system) rest all the dependencies will automatically installed
3. **Start Using**: Begin adding and managing your documents

## Customization

### Adding Sample Data
To see the application in action with sample data, uncomment the last line in `script.js`:
```javascript
addSampleData();
```

### Styling
Modify `styles.css` to customize:
- Colors and gradients
- Fonts and typography
- Layout and spacing
- Animations and transitions

### Functionality
Extend `script.js` to add:
- File type filtering
- Document categories
- Export/import functionality
- Cloud storage integration

## Security Notes

- This application runs entirely in your browser
- No data is sent to external servers
- File paths are stored locally for reference
- For production use, consider implementing proper file handling and security measures

## Future Enhancements

- [ ] File type icons
- [ ] Document categories/tags
- [ ] Export/import document lists
- [ ] File preview functionality
- [ ] Drag and drop file upload
- [ ] Document sharing capabilities
- [ ] Cloud storage integration
- [ ] Advanced search filters

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have suggestions for improvements, please feel free to contribute or report them.

---

**Enjoy organizing your documents! 📚✨** 
