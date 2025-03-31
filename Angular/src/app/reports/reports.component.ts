import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ReportsComponent implements OnInit, AfterViewInit, OnDestroy {
  profileIDs: string[] = [];
  selectedProfileID: string = '';
  reportSections: { [key: string]: SafeHtml } = {};
  sectionVisibility: { [key: string]: boolean } = {};

sectionsMapping: { key: string; display: string }[] = [
  { key: 'advanceDirective', display: 'Advance Directive' },
  { key: 'allergy', display: 'Allergy' },
  { key: 'diagnosis', display: 'Diagnosis' },
  { key: 'encompassingEncounter', display: 'Encompassing Encounter' },
  { key: 'encounters', display: 'Encounters' },
  { key: 'familyHistory', display: 'Family History' },
  { key: 'functionalStatus', display: 'Functional Status' },
  { key: 'goals', display: 'Goals' },
  { key: 'implants', display: 'Implants' },
  { key: 'immunizations', display: 'Immunizations' },
  { key: 'medications', display: 'Medications' },
  { key: 'patient', display: 'Patient' },
  { key: 'payer', display: 'Payer' },
  { key: 'planOfCare', display: 'Plan Of Care' },
  { key: 'problems', display: 'Problems' },
  { key: 'procedures', display: 'Procedures' },
  { key: 'results', display: 'Results' },
  { key: 'socialHistory', display: 'Social History' },
  { key: 'vitalSigns', display: 'Vital Signs' }
];


  private collapsibleEventHandler!: (event: MouseEvent) => void;

  constructor(
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) {
    this.sectionsMapping.forEach(item => {
      this.sectionVisibility[item.key] = false;
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedProfileID = params['profileID'] || '';
      if (this.selectedProfileID) {
        this.loadReportData();
      }
    });
    this.loadProfileIDs();
  }

  ngAfterViewInit(): void {
    this.collapsibleEventHandler = this.onDocumentClick.bind(this);
    document.addEventListener('click', this.collapsibleEventHandler);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.collapsibleEventHandler);
  }

  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target && target.classList.contains('collapsible')) {
      const content = target.nextElementSibling as HTMLElement;
      if (content) {
        const isAlreadyActive = target.classList.contains('active');
        target.classList.toggle('active', !isAlreadyActive);
        content.style.display = isAlreadyActive ? 'none' : 'block';
      }
    }
  }

  loadProfileIDs(): void {
    this.apiService.getDistinctReportProfileIDs().subscribe(response => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(response, 'text/html');
      const options = doc.querySelectorAll('option');
      this.profileIDs = Array.from(options).map(option => option.value);
      if (this.profileIDs.length > 0 && !this.selectedProfileID) {
        this.selectedProfileID = this.profileIDs[0];
        this.loadReportData();
      }
    });
  }

  loadReportData(): void {
    if (!this.selectedProfileID) { return; }
    this.sectionsMapping.forEach(item => {
      this.apiService.getQS(item.key, this.selectedProfileID).subscribe(response => {
        let cleanedResponse = response.replace(/onclick="[^"]*"/g, '');
        cleanedResponse = cleanedResponse.replace(/style="display:\s*none;?"/gi, '');
        this.reportSections[item.key] = this.sanitizer.bypassSecurityTrustHtml(cleanedResponse);
      });
    });
  }

  toggleSection(sectionKey: string): void {
    this.sectionVisibility[sectionKey] = !this.sectionVisibility[sectionKey];
  }

  exportReport(): void {
    if (!this.selectedProfileID) {
      alert('No profile selected for export.');
      return;
    }
    
    this.apiService.generateExcelReport(this.selectedProfileID).subscribe((response: string) => {
      const blob = new Blob([response], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Report_${this.selectedProfileID}.xls`;
      
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      }, 100);
    });
  }
}
