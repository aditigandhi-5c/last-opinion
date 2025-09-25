from fastapi import APIRouter
from app.utils.fivec_network_api import fivec_api

router = APIRouter(tags=["testing"])

@router.get("/fivec-study/{study_uid}")
def test_get_study_by_uid(study_uid: str):
    """Test 5C Network get study by UID"""
    result = fivec_api.get_study_by_uid(study_uid)
    return {"test": "get_study_by_uid", "result": result}

@router.get("/fivec-reports/{study_id}")
def test_get_completed_reports(study_id: str):
    """Test 5C Network get completed reports"""
    result = fivec_api.get_completed_reports(study_id)
    return {"test": "get_completed_reports", "result": result}

@router.get("/fivec-report-details")
def test_get_report_details(report_ids: str, rad_id: int, send_pdf_url: bool = True):
    """Test 5C Network get report details"""
    report_id_list = [int(id.strip()) for id in report_ids.split(',')]
    result = fivec_api.get_report_details(report_id_list, rad_id, send_pdf_url)
    return {"test": "get_report_details", "result": result}

@router.get("/fivec-pdf-url/{report_id}/{rad_id}")
def test_get_report_pdf_url(report_id: int, rad_id: int):
    """Test 5C Network get PDF URL"""
    pdf_url = fivec_api.get_report_pdf_url(report_id, rad_id)
    return {"test": "get_report_pdf_url", "pdf_url": pdf_url}
