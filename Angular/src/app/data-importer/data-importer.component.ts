import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { AlertBannerComponent, AlertMessage } from '../alert-banner/alert-banner.component';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-data-importer',
  standalone: true,
  imports: [CommonModule, FormsModule, AlertBannerComponent],
  templateUrl: './data-importer.component.html',
  styleUrls: ['./data-importer.component.css']
})
export class DataImporterComponent {
  importType: string = 'bulk';
  directoryPath: string = '';
  fileInput: FileList | null = null; 
  numDocuments: number = 0;
  filterDocuments: string = '';
  profileID: string = '';
  importResult: string = '';

  loading: boolean = false;
  
  currentAlert?: AlertMessage;

  constructor(private apiService: ApiService) {}

  updateImportType(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.importType = target.value;
  }

  onDirectorySelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.fileInput = target.files;
      let totalSize = 0;
      for (let i = 0; i < target.files.length; i++) {
        totalSize += target.files[i].size;
      }
      const maxSize = 500 * 1024 * 1024; // 500 MB
      if (totalSize > maxSize) {
        if (!confirm("Warning: The total size of the selected files exceeds 500 MB. This may take a long time and use significant resources. Continue?")) {
          this.fileInput = null;
          return;
        }
      }
      const firstFilePath = target.files[0].webkitRelativePath;
      this.directoryPath = firstFilePath.substring(0, firstFilePath.lastIndexOf('/'));
    }
  }

startImport(): void {
  if (!this.profileID || !/^[a-zA-Z0-9]+$/.test(this.profileID)) {
    alert('Profile name is required and should contain only letters and numbers.');
    return;
  }

  if (this.importType === 'database' && this.numDocuments > 500) {
    if (!confirm("Warning: You are about to import more than 500 CCD documents. This operation may take a long time and use significant resources. Do you wish to continue?")) {
      return;
    }
  }

  let importData: any = {
    profileID: this.profileID,
    importType: this.importType
  };

  if (this.importType === 'bulk') {
    if (!this.directoryPath) {
      alert('Please enter a directory path for bulk import.');
      return;
    }
    this.directoryPath = this.directoryPath.replace(/^"(.*)"$/, '$1');
    importData.directoryPath = this.directoryPath;
  } else if (this.importType === 'api') {
    if (!this.fileInput || this.fileInput.length === 0) {
      alert('Please select one or more files to upload.');
      return;
    }
    importData.files = Array.from(this.fileInput).map(file => file.name);
  } else if (this.importType === 'database') {
    if (this.numDocuments <= 0) {
      alert('You must enter a valid number of documents.');
      return;
    }
    importData.numDocuments = this.numDocuments;
    importData.filterDocuments = this.filterDocuments;
  }

  this.loading = true;
  this.importResult = '';

  this.apiService.processImport(importData)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response: any) => {
        this.showAlert('success', 'Import completed successfully.');
      },
      error: (error: any) => {
        console.error('Error during import:', error);
        var errMessage = error?.error || error.message || 'An error occurred during import.';
		errMessage = JSON.stringify(error.error);
        this.showAlert('error', `An error occurred during import: ${errMessage}`);
      }
    });
}


  showAlert(type: 'success' | 'warning' | 'error', message: string): void {
    this.currentAlert = { type, message };
    setTimeout(() => {
      this.currentAlert = undefined;
    }, 10000);
  }
}
