# System Architecture & Design Specification
## Project: Cyber Nethra Core
**Author: Bob (System Architect)**

### 1. System Overview
The system follows a modular Clean Architecture separating the presentation gateway (FastAPI), domain services (ComplaintManager, ForensicAnalyzer), and security layer (RBAC).

### 2. Architecture Diagram (Mermaid)
```mermaid
graph TD
    User["Citizen / Police User"] -->|HTTP / JSON| Gateway["FastAPI Service (main.py)"]
    Gateway --> Auth["RBAC Auth Middleware (rbac_auth.py)"]
    Gateway --> CM["Complaint Manager (complaint_manager.py)"]
    Gateway --> FA["Forensic Analyzer (forensic_analyzer.py)"]
    CM --> Store[("In-Memory / SQLite Store")]
    FA --> Hash["SHA-256 Engine"]
```

### 3. Data Structures & Interfaces
- `IncidentReport`: Stores `reference_id`, `category`, `description`, `status`, and `timestamp`.
- `EvidenceMetadata`: Stores `filename`, `sha256_hash`, `deepfake_probability`, and `integrity_status`.
