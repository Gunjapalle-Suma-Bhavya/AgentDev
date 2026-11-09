# Task Breakdown & Implementation Roadmap
## Project: Cyber Nethra Core
**Author: Eve (Project Manager)**

### Milestones & Task Dependencies
1. **Task 1: Core Domain Entities & RBAC**
   - File: `rbac_auth.py`
   - Role: Define `UserRole` enum and bearer token verification.
2. **Task 2: Complaint Management Logic**
   - File: `complaint_manager.py`
   - Dependencies: `rbac_auth.py`
   - Role: Cryptographic reference ID generator and in-memory store.
3. **Task 3: Digital Forensic Analysis Engine**
   - File: `forensic_analyzer.py`
   - Role: SHA-256 integrity digest and deepfake heuristic scoring.
4. **Task 4: FastAPI REST Service Gateway**
   - File: `main.py`
   - Dependencies: Tasks 1, 2, 3
   - Role: Route definitions, schema validation, and health checks.
5. **Task 5: Automated Verification & Unit Tests**
   - File: `test_complaint.py`
   - Dependencies: Task 4
   - Role: PyTest test cases for complaint creation and hashing.
