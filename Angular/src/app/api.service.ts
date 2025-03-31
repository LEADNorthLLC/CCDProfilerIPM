//api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' 
})
export class ApiService {
  private helloUrl = '/csp/LeadNorth/api/hello';
  private reportsUrl = '/csp/LeadNorth/api/index/getDistinctProfileIDs';
  private importUrl = '/csp/LeadNorth/api/dataImporter/processImport';
  private distinctReportProfileIDsUrl = '/csp/LeadNorth/api/reports/getDistinctReportProfileIDs';
  private generateExcelReportUrl = '/csp/LeadNorth/api/reports/generateExcelReport';
  private qsUrl = '/csp/LeadNorth/api/reports/QS';
  private xsltContentUrl = '/csp/LeadNorth/api/settings/GetXSLTContent';
  private saveXSLTContentUrl = '/csp/LeadNorth/api/settings/SaveXSLTContent';
  private applyXSLTUrl = '/csp/LeadNorth/api/settings/ApplyXSLTToCCD';
  private deleteDataByProfileUrl = '/csp/LeadNorth/api/settings/DeleteDataByProfile';
  private deleteAllDataUrl = '/csp/LeadNorth/api/settings/DeleteAllData';
  private populateProfileIDsUrl = '/csp/LeadNorth/api/settings/PopulateProfileIDs';

  constructor(private http: HttpClient) {}

  getHello(): Observable<string> {
    return this.http.get(this.helloUrl, { responseType: 'text' });
  }

  getDistinctProfileIDs(): Observable<string> {
    return this.http.get(this.reportsUrl, { responseType: 'text' });
  }

  processImport(importData: any): Observable<any> {  
    return this.http.post(this.importUrl, importData);
  }

  getDistinctReportProfileIDs(): Observable<string> {
    return this.http.get(this.distinctReportProfileIDsUrl, { responseType: 'text' });
  }

  generateExcelReport(profileID: string): Observable<string> {
    return this.http.post(this.generateExcelReportUrl, { profileID }, { responseType: 'text' });
  }

getQS(reportType: string, profileID: string): Observable<string> {
  return this.http.post(this.qsUrl, { reportType, profileID }, { responseType: 'text' });
}
  getXSLTContent(xsltBlock: string): Observable<string> {
    return this.http.post(this.xsltContentUrl, { xsltBlock }, { responseType: 'text' });
  }

  saveXSLTContent(xsltBlock: string, xpathContent: string): Observable<string> {
    return this.http.post(this.saveXSLTContentUrl, { xsltBlock, xpathContent }, { responseType: 'text' });
  }

  applyXSLT(ccdFilePath: string, xsltBlock: string): Observable<string> {
    return this.http.post(this.applyXSLTUrl, { ccdFilePath, xsltBlock }, { responseType: 'text' });
  }

  deleteDataByProfile(profileID: string): Observable<string> {
    return this.http.post(this.deleteDataByProfileUrl, { profileID }, { responseType: 'text' });
  }

  deleteAllData(): Observable<string> {
    return this.http.post(this.deleteAllDataUrl, {}, { responseType: 'text' });
  }

  populateProfileIDs(): Observable<string> {
    return this.http.get(this.populateProfileIDsUrl, { responseType: 'text' });
  }
}
