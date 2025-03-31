import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';

import { AlertBannerComponent, AlertMessage } from '../alert-banner/alert-banner.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, AlertBannerComponent]
})
export class SettingsComponent implements OnInit {
  @ViewChild('editableDiv') editableDiv!: ElementRef<HTMLDivElement>;

  xsltBlock: string = 'MetadataXSLT';
  xsltContent: string = '';
  sampleData: string = '';
  profileIDs: string[] = [];
  selectedProfileID: string = '';

  currentAlert?: AlertMessage;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProfileIDs();
    this.loadXSLTContent();
  }

  loadProfileIDs(): void {
    this.apiService.populateProfileIDs().subscribe(
      (response: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(response, 'text/html');
        const options = doc.querySelectorAll('option');
        this.profileIDs = Array.from(options).map(option => option.value);
        if (this.profileIDs.length > 0) {
          this.selectedProfileID = this.profileIDs[0];
        }
      },
      error => {
        console.error('Error loading profile IDs:', error);
        this.showAlert('error', 'Failed to load profile IDs.');
      }
    );
  }

  loadXSLTContent(): void {
    this.apiService.getXSLTContent(this.xsltBlock).subscribe(
      (response: string) => {
        this.xsltContent = response;
        if (this.editableDiv) {
          this.editableDiv.nativeElement.innerText = this.xsltContent;
        }
      },
      error => {
        console.error('Error loading XSLT content:', error);
        this.showAlert('error', 'Failed to load XSLT content.');
      }
    );
  }

  onEditableInput(event: Event): void {
    const target = event.target as HTMLDivElement;
    this.xsltContent = target.innerText;
  }

  saveXPaths(): void {
    if (confirm(`Overwrite XSLT content for block "${this.xsltBlock}"? This cannot be undone.`)) {
      this.apiService.saveXSLTContent(this.xsltBlock, this.xsltContent).subscribe(
        (response: string) => {
          this.showAlert('success', 'XSLT file saved successfully!');
        },
        error => {
          console.error('Error saving XSLT content:', error);
          this.showAlert('error', 'Error saving XSLT content.');
        }
      );
    } else {
      this.showAlert('warning', 'Save action canceled.');
    }
  }

applyXSLT(): void {
  this.apiService.applyXSLT(this.sampleData, this.xsltBlock).subscribe(
    (response: string) => {
      const outputElement = document.getElementById('transformedOutput');
      if (outputElement) {
        outputElement.innerText = response;
      }
    },
    error => {
      console.error('Error applying XSLT:', error);
      const outputElement = document.getElementById('transformedOutput');
      if (outputElement) {
        outputElement.innerText = "Error: Failed to load CCD file or apply XSLT.";
      }
    }
  );
}


  deleteProfileData(): void {
    if (!this.selectedProfileID) {
      this.showAlert('warning', 'Please select a Profile ID first.');
      return;
    }
    if (confirm(`Delete all data for Profile ID "${this.selectedProfileID}"? This cannot be undone.`)) {
      this.apiService.deleteDataByProfile(this.selectedProfileID).subscribe(
        (response: string) => {
          this.showAlert('success', response);
          this.loadProfileIDs();
        },
        error => {
          console.error('Error deleting profile data:', error);
          this.showAlert('error', 'Failed to delete profile data.');
        }
      );
    }
  }

  deleteAllData(): void {
    if (confirm('Are you sure you want to delete all data? This cannot be undone.')) {
      this.apiService.deleteAllData().subscribe(
        (response: string) => {
          this.showAlert('success', response);
          this.loadProfileIDs();
        },
        error => {
          console.error('Error deleting all data:', error);
          this.showAlert('error', 'Failed to delete all data.');
        }
      );
    }
  }

  showAlert(type: 'success' | 'warning' | 'error', message: string): void {
    this.currentAlert = { type, message };
    setTimeout(() => {
      this.currentAlert = undefined;
    }, 10000);
  }

  chatGPTNotImplemented(): void {
    alert('ChatGPT functionality not implemented yet.');
  }
}
