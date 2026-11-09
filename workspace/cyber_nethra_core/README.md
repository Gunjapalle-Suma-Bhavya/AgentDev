# Cyber Nethra Core Platform
**AI-Based Autonomous Cybercrime Reporting & Evidence Forensics Framework**

## Overview
Cyber Nethra is a multi-role cybercrime incident reporting, triage, and forensic analysis portal designed for Citizens, Cyber Police Investigators, and Digital Forensic Experts.

## Features
- **Role-Based Access Control (RBAC)**: Enforces role isolation between Citizens, Cyber Police, and Forensic Analysts.
- **Incident Management**: Generates cryptographic Case Reference IDs for tracking complaints.
- **Deepfake & Media Evidence Triage**: Performs automated metadata extraction and forensic integrity checks.
- **REST API Endpoints**: Modular asynchronous service layer built on FastAPI.

## Architectural Structure
```
cyber_nethra_core/
├── main.py                 # FastAPI Application Gateway & Routes
├── rbac_auth.py            # JWT Authentication & RBAC Middleware
├── complaint_manager.py    # Complaint intake & Reference ID generation
├── forensic_analyzer.py    # Media hash & integrity analysis engine
├── test_complaint.py       # Automated unit test suite
├── requirements.txt        # Runtime dependencies
└── README.md               # System documentation
```

## Running the Application
```bash
python main.py
```
API Documentation will be accessible at: `http://localhost:8080/docs`
