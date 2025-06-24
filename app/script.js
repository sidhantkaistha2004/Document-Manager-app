// Document Manager JavaScript - Electron Version
const { ipcRenderer } = require('electron');

class DocumentManager {
    constructor() {
        this.documents = JSON.parse(localStorage.getItem('documents')) || [];
        this.currentTab = 'add';
        this.searchDebounceTimeout = null;
        this.selectedCategory = 'all';
        this.selectedSort = 'date-desc';
        this.selectedType = 'all';
        this.currentFileInfo = null; // To hold file info for the single-add form

        this.initializeElements();
        this.bindEvents();
        this.migrateDocuments();
        this.updateDocumentCount();
        this.renderDocuments();
        this.showTab('add');
    }

    migrateDocuments() {
        let migrationNeeded = false;
        this.documents.forEach(doc => {
            if (!doc.category || !doc.type || !doc.extension) {
                const fileExtension = this.getFileExtension(doc.path);
                const { category, type } = this.getFileCategoryAndType(fileExtension);
                doc.category = category;
                doc.type = type;
                doc.extension = fileExtension;
                migrationNeeded = true;
            }
        });

        if (migrationNeeded) {
            console.log('Migrated documents to include category and type information.');
            this.saveToLocalStorage();
        }
    }

    initializeElements() {
        // Main layout
        this.pageTitle = document.getElementById('pageTitle');
        this.pageDescription = document.getElementById('pageDescription');

        // Tabs
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');

        // Add Tab
        this.dropZone = document.getElementById('drop-zone');
        this.addForm = document.getElementById('add-form');
        this.docTitleInput = document.getElementById('doc-title');
        this.docPathInput = document.getElementById('doc-path');
        this.fileBrowseBtn = document.getElementById('file-browse-btn');
        this.selectedFileName = document.getElementById('selected-file-name');

        // Inventory Tab
        this.documentList = document.getElementById('documentList');
        this.inventoryCount = document.getElementById('inventoryCount');
        this.totalSize = document.getElementById('totalSize');
        this.categoryTabs = document.querySelectorAll('.category-tab');
        this.sortSelect = document.getElementById('sortSelect');
        this.typeFilter = document.getElementById('typeFilter');
        this.clearAllBtn = document.getElementById('clearAllBtn');

        // Search Tab
        this.searchInput = document.getElementById('searchInput');

        // Global
        this.documentCount = document.getElementById('documentCount');
        this.successModal = document.getElementById('successModal');
        this.successMessage = document.getElementById('successMessage');
        this.closeModal = document.querySelector('.close');
    }

    bindEvents() {
        // --- Drag and Drop Events ---
        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.dropZone.classList.add('drag-over');
        });

        this.dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.dropZone.classList.remove('drag-over');
        });

        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.dropZone.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const paths = Array.from(files).map(f => f.path);
                ipcRenderer.invoke('process-dropped-paths', paths).then(fileInfos => {
                    this.processFiles(fileInfos);
                });
            }
        });

        this.dropZone.addEventListener('click', () => {
            ipcRenderer.invoke('show-multi-open-dialog').then(fileInfos => {
                this.processFiles(fileInfos);
            });
        });


        // --- Form and Button Events ---
        this.addForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.fileBrowseBtn.addEventListener('click', () => this.handleFileBrowse());
        
        this.searchInput.addEventListener('input', () => {
            clearTimeout(this.searchDebounceTimeout);
            this.searchDebounceTimeout = setTimeout(() => this.renderDocuments(), 300);
        });
        
        this.clearAllBtn.addEventListener('click', () => this.clearAllDocuments());
        this.closeModal.addEventListener('click', () => this.closeSuccessModal());
        window.addEventListener('click', (e) => {
            if (e.target === this.successModal) this.closeSuccessModal();
        });

        // --- Tab and Filter Events ---
        this.tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = e.target.closest('.tab-btn').getAttribute('data-tab');
                this.showTab(tabName);
            });
        });

        this.categoryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.selectedCategory = e.target.closest('.category-tab').getAttribute('data-category');
                this.updateCategoryTabs();
                this.renderDocuments();
            });
        });

        this.sortSelect.addEventListener('change', () => {
            this.selectedSort = this.sortSelect.value;
            this.renderDocuments();
        });

        this.typeFilter.addEventListener('change', () => {
            this.selectedType = this.typeFilter.value;
            this.renderDocuments();
        });
    }

    // --- Core Application Logic ---

    processFiles(fileInfos) {
        if (!fileInfos || fileInfos.length === 0) return;

        fileInfos.forEach(fileInfo => {
            const title = fileInfo.name.includes('.') 
                ? fileInfo.name.split('.').slice(0, -1).join('.') 
                : fileInfo.name;
            this.addDocument(title, fileInfo);
        });

        if (fileInfos.length > 1) {
            this.showSuccessModal(`${fileInfos.length} documents were added successfully!`);
        } else {
            this.showSuccessModal(`'${fileInfos[0].name}' was added successfully!`);
        }
    }

    addDocument(title, fileInfo) {
        if (!title || !fileInfo || !fileInfo.path) {
            this.showError('Invalid document data provided.');
            return;
        }

        const fileExtension = fileInfo.type || this.getFileExtension(fileInfo.path);
        const { category, type } = this.getFileCategoryAndType(fileExtension);
        
        const documentData = {
            id: Date.now() + Math.random(), // Add random to avoid collision with multiple files
            title: title,
            fileName: fileInfo.name,
            path: fileInfo.path,
            addedDate: new Date().toISOString(),
            size: fileInfo.size,
            type: type,
            category: category,
            extension: fileExtension,
        };

        this.documents.unshift(documentData);
        this.saveAndRender();
    }

    async handleFileBrowse() {
        try {
            const fileInfo = await ipcRenderer.invoke('select-file');
            if (fileInfo) {
                this.selectedFileName.textContent = fileInfo.name;
                this.docPathInput.value = fileInfo.path;
                this.currentFileInfo = fileInfo;
            }
        } catch (error) {
            console.error('Error selecting file:', error);
            this.showError('Error selecting file: ' + error.message);
        }
    }

    async handleFormSubmit(event) {
        event.preventDefault();
        const title = this.docTitleInput.value.trim();
        if (!title) {
            this.showError('Please enter a document title.');
            return;
        }
        if (!this.currentFileInfo) {
            this.showError('Please select a file using the "Browse" button.');
            return;
        }
        
        this.addDocument(title, this.currentFileInfo);
        this.showSuccessModal(`'${this.currentFileInfo.name}' was added with the title '${title}'.`);
        this.resetForm();
    }
    
    // --- Rendering and UI Updates ---
    
    saveAndRender() {
        this.saveToLocalStorage();
        this.updateDocumentCount();
        // Only re-render the list if the user is on the inventory or search tab
        if (this.currentTab === 'inventory' || this.currentTab === 'search') {
            this.renderDocuments();
        }
    }

    renderDocuments() {
        this.documentList.innerHTML = ''; // Clear current list
        
        const documentsToRender = this.searchDocuments(); // Get filtered and sorted documents

        if (documentsToRender.length === 0) {
            this.documentList.innerHTML = '<li class="document-item empty">No documents found. Try adjusting your filters or search terms.</li>';
            return;
        }

        documentsToRender.forEach(doc => {
            const docElement = document.createElement('li');
            docElement.className = 'document-item';
            docElement.setAttribute('data-id', doc.id);

            docElement.innerHTML = `
                <div class="doc-icon type-${doc.type || 'other'}">
                    <span>.${doc.extension || '???'}</span>
                </div>
                <div class="doc-details">
                    <strong class="doc-title">${this.escapeHtml(doc.title)}</strong>
                    <span class="doc-path">${this.escapeHtml(doc.path)}</span>
                    <div class="doc-meta">
                        <span>Size: ${this.formatFileSize(doc.size)}</span>
                        <span>Added: ${new Date(doc.addedDate).toLocaleDateString()}</span>
                        <span>Type: ${this.escapeHtml(doc.type)}</span>
                    </div>
                </div>
                <div class="doc-actions">
                    <button class="action-btn open-btn" title="Show in Folder">
                        <i class="fas fa-folder-open"></i>
                    </button>
                    <button class="action-btn delete-btn" title="Delete Entry">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    <button class="action-btn open-file-btn" title="Open File">
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                </div>
            `;

            docElement.querySelector('.open-file-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.openDocument(doc.id);
            });
            docElement.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteDocument(doc.id);
            });
            docElement.querySelector('.open-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                ipcRenderer.invoke('open-file-location', doc.path);
            });

            this.documentList.appendChild(docElement);
        });
    }

    searchDocuments() {
        const searchTerm = this.searchInput.value.toLowerCase();
        
        let filteredDocs = this.documents;

        // Filter by Category
        if (this.selectedCategory !== 'all') {
            filteredDocs = filteredDocs.filter(doc => doc.category === this.selectedCategory);
        }

        // Filter by Type
        if (this.selectedType !== 'all') {
            filteredDocs = filteredDocs.filter(doc => doc.type === this.selectedType);
        }
        
        // Filter by Search Term
        if (searchTerm) {
            filteredDocs = filteredDocs.filter(doc => 
                doc.title.toLowerCase().includes(searchTerm) ||
                doc.fileName.toLowerCase().includes(searchTerm)
            );
        }

        // Sort
        const [sortBy, sortOrder] = this.selectedSort.split('-');
        filteredDocs.sort((a, b) => {
            let valA, valB;
            switch(sortBy) {
                case 'date':
                    valA = new Date(a.addedDate);
                    valB = new Date(b.addedDate);
                    break;
                case 'size':
                    valA = a.size || 0;
                    valB = b.size || 0;
                    break;
                case 'title':
                    valA = a.title.toLowerCase();
                    valB = b.title.toLowerCase();
                    break;
                default:
                    return 0;
            }
            return sortOrder === 'asc' ? valA - valB : valB - valA;
        });

        return filteredDocs;
    }

    updateDocumentCount() {
        const docCount = this.documents.length;
        this.documentCount.textContent = docCount;
        this.inventoryCount.textContent = docCount;
        
        const totalBytes = this.documents.reduce((sum, doc) => sum + (doc.size || 0), 0);
        this.totalSize.textContent = this.formatFileSize(totalBytes);
    }
    
    async openDocument(id) {
        const doc = this.documents.find(d => d.id == id);
        if (doc) {
            try {
                const result = await ipcRenderer.invoke('open-file', doc.path);
                if (!result.success) {
                    this.showError(result.message);
                    // Optional: check if file still exists and offer to remove entry
                    const fileInfo = await ipcRenderer.invoke('get-file-info', doc.path);
                    if (!fileInfo.exists) {
                         if(confirm(`The file for "${doc.title}" was not found at the path:\n\n${doc.path}\n\nIt may have been moved or deleted. Would you like to remove this entry from the list?`)){
                            this.deleteDocument(id);
                         }
                    }
                }
            } catch (error) {
                this.showError(`Failed to open document: ${error.message}`);
            }
        }
    }

    deleteDocument(id) {
        if (confirm('Are you sure you want to delete this document entry? This will not delete the file itself.')) {
            this.documents = this.documents.filter(doc => doc.id != id);
            this.saveAndRender();
        }
    }

    clearAllDocuments() {
        if (confirm('Are you sure you want to delete all document entries? This cannot be undone.')) {
            this.documents = [];
            this.saveAndRender();
        }
    }

    // --- Tab Management ---
    showTab(tabName) {
        this.currentTab = tabName;
        
        this.tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
        });

        this.tabContents.forEach(content => {
            content.classList.toggle('active', content.id.toLowerCase() === tabName);
        });

        this.updatePageHeader(tabName);

        // Auto-focus on search input when switching to the search tab
        if (tabName === 'search') {
            setTimeout(() => this.searchInput.focus(), 50);
        }
        
        // Always refresh the inventory list when switching to it
        if (tabName === 'inventory') {
            this.renderDocuments();
        }
    }
    
    updatePageHeader(tabName) {
        const titles = {
            'add': 'Add New Document',
            'search': 'Search Documents',
            'inventory': 'Document Inventory'
        };
        const descriptions = {
            'add': 'Drag & drop files/folders, or add a single file with a custom title.',
            'search': 'Find documents quickly by title or filename.',
            'inventory': 'Browse, filter, and manage all your saved documents.'
        };
        this.pageTitle.textContent = titles[tabName];
        this.pageDescription.textContent = descriptions[tabName];
    }
    
    updateCategoryTabs() {
        this.categoryTabs.forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-category') === this.selectedCategory);
        });
    }

    // --- Utility and Helper Functions ---
    getFileExtension(filePath) {
        if (!filePath) return '';
        const fileName = filePath.split(/[\\/]/).pop();
        const parts = fileName.split('.');
        return parts.length > 1 ? parts.pop().toLowerCase() : '';
    }

    getFileCategoryAndType(ext) {
        if (['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'csv', 'txt', 'rtf', 'md'].includes(ext)) return { category: 'documents', type: ext };
        if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg', 'ico', 'tiff', 'tif'].includes(ext)) return { category: 'images', type: 'image' };
        if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', 'm4v', '3gp'].includes(ext)) return { category: 'videos', type: 'video' };
        if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'].includes(ext)) return { category: 'audio', type: 'audio' };
        if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext)) return { category: 'archives', type: 'archive' };
        if (['js', 'ts', 'html', 'css', 'py', 'java', 'cpp', 'c', 'php', 'json', 'xml'].includes(ext)) return { category: 'code', type: 'code' };
        return { category: 'others', type: 'other' };
    }

    saveToLocalStorage() {
        localStorage.setItem('documents', JSON.stringify(this.documents));
    }
    
    resetForm() {
        this.addForm.reset();
        this.selectedFileName.textContent = 'No file chosen...';
        this.docPathInput.value = '';
        this.currentFileInfo = null;
    }

    showSuccessModal(message) {
        this.successMessage.textContent = message;
        this.successModal.style.display = 'block';
    }

    closeSuccessModal() {
        this.successModal.style.display = 'none';
    }

    showError(message) {
        alert(`Error: ${message}`); // Simple alert for errors
    }

    escapeHtml(text) {
        if (text === null || typeof text === 'undefined') return '';
        return text.toString().replace(/[&<>"']/g, match => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[match]));
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Initialize the application once the DOM is fully loaded
window.addEventListener('DOMContentLoaded', () => {
    new DocumentManager();
});
