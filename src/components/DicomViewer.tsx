import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { FileText, Download, Eye, RefreshCw } from 'lucide-react';

interface Report {
  id: number;
  report_id: number;
  rad_id: number;
  report_status: string;
  pdf_url?: string;
  study_id: string;
  study_iuid: string;
  generated_at: string;
}

interface DicomViewerProps {
  caseId: number;
  studyId?: string;
  studyIuid?: string;
}

const DicomViewer: React.FC<DicomViewerProps> = ({ caseId, studyId, studyIuid }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    if (!studyId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.getCompletedReports(studyId);
      if (result.success) {
        setReports(result.data || []);
      } else {
        setError(result.error || 'Failed to fetch reports');
      }
    } catch (err) {
      setError('Failed to fetch reports');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const getReportPdfUrl = async (reportId: number, radId: number) => {
    try {
      const result = await api.getReportPdfUrl(reportId, radId);
      return result.pdf_url;
    } catch (err) {
      console.error('Error getting PDF URL:', err);
      return null;
    }
  };

  const handleViewReport = async (report: Report) => {
    if (report.pdf_url) {
      window.open(report.pdf_url, '_blank');
    } else {
      const pdfUrl = await getReportPdfUrl(report.report_id, report.rad_id);
      if (pdfUrl) {
        window.open(pdfUrl, '_blank');
      } else {
        alert('PDF URL not available');
      }
    }
  };

  const handleDownloadReport = async (report: Report) => {
    try {
      const pdfUrl = report.pdf_url || await getReportPdfUrl(report.report_id, report.rad_id);
      if (pdfUrl) {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `report_${report.report_id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('PDF URL not available');
      }
    } catch (err) {
      console.error('Error downloading report:', err);
      alert('Failed to download report');
    }
  };

  const syncReports = async () => {
    setLoading(true);
    try {
      const result = await api.syncReportsWithFiveC(caseId);
      if (result.success) {
        await fetchReports(); // Refresh reports after sync
      } else {
        setError('Failed to sync reports');
      }
    } catch (err) {
      setError('Failed to sync reports');
      console.error('Error syncing reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studyId) {
      fetchReports();
    }
  }, [studyId]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            DICOM Reports
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={syncReports}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Sync
            </Button>
          </div>
        </div>
        {studyId && (
          <div className="text-sm text-muted-foreground">
            Study ID: {studyId}
            {studyIuid && <span className="ml-4">Study UID: {studyIuid}</span>}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}
        
        {loading && (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading reports...</span>
          </div>
        )}
        
        {!loading && reports.length === 0 && !error && (
          <div className="text-center py-8 text-muted-foreground">
            No reports available yet. Reports will appear here once they are completed by our radiologists.
          </div>
        )}
        
        {!loading && reports.length > 0 && (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-medium">Report #{report.report_id}</div>
                    <div className="text-sm text-muted-foreground">
                      Radiologist ID: {report.rad_id}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Generated: {new Date(report.generated_at).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge
                    variant={report.report_status === 'completed' ? 'default' : 'secondary'}
                  >
                    {report.report_status}
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewReport(report)}
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadReport(report)}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DicomViewer;

