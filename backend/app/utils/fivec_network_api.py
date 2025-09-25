import requests
import os
from typing import Dict, List, Optional
import config

class FiveCNetworkAPI:
    def __init__(self):
        self.base_url = "https://api.5cnetwork.com"
        self.router_url = "https://router.5cn.co.in"
        self.calling_aet = "JEEVAN"  # Your calling AET
        
    def get_study_by_uid(self, study_uid: str) -> Dict:
        """Get study information by Study Instance UID"""
        try:
            url = f"{self.base_url}/study/uid/{study_uid}"
            response = requests.get(url)
            
            if response.status_code == 200:
                return {"success": True, "data": response.json()}
            else:
                return {"success": False, "error": f"HTTP {response.status_code}", "data": response.text}
                
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def upload_dicom(self, file_path: str, filename: str) -> Dict:
        """Upload DICOM file to 5C Network"""
        try:
            url = f"{self.router_url}/api/dicom/upload?callingAET={self.calling_aet}"
            
            with open(file_path, 'rb') as file:
                files = {'dicomFile': (filename, file, 'application/dicom')}
                response = requests.post(url, files=files)
            
            if response.status_code == 200:
                return {"success": True, "data": response.json()}
            else:
                return {"success": False, "error": f"HTTP {response.status_code}", "data": response.text}
                
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def get_completed_reports(self, study_id: str) -> Dict:
        """Get completed reports for a study"""
        try:
            url = f"{self.base_url}/report/client/completed/{study_id}"
            response = requests.get(url)
            
            if response.status_code == 200:
                return {"success": True, "data": response.json()}
            else:
                return {"success": False, "error": f"HTTP {response.status_code}", "data": response.text}
                
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def get_report_details(self, report_ids: List[int], rad_id: int, send_pdf_url: bool = True) -> Dict:
        """Get detailed report information with PDF URL"""
        try:
            url = f"{self.base_url}/report/details"
            
            # Build query parameters
            params = {
                "rad_id": rad_id,
                "send_pdf_url": send_pdf_url
            }
            
            # Add report_ids as array parameter
            for i, report_id in enumerate(report_ids):
                params[f"report_ids[{i}]"] = report_id
            
            response = requests.get(url, params=params)
            
            if response.status_code == 200:
                return {"success": True, "data": response.json()}
            else:
                return {"success": False, "error": f"HTTP {response.status_code}", "data": response.text}
                
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def get_report_pdf_url(self, report_id: int, rad_id: int) -> str:
        """Get PDF URL for a specific report"""
        try:
            result = self.get_report_details([report_id], rad_id, send_pdf_url=True)
            if result["success"] and "data" in result["data"]:
                return result["data"]["data"].get("pdf_url", "")
            return ""
        except Exception as e:
            print(f"Error getting PDF URL: {e}")
            return ""

# Global instance
fivec_api = FiveCNetworkAPI()

