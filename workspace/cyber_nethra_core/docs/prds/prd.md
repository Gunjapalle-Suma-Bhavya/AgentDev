# Product Requirement Document (PRD)
## Project: Cyber Nethra Core
**Author: Alice (Product Manager)**

### 1. Project Goal
Develop an end-to-end cyber incident management and AI-assisted forensic intake system allowing citizens to report incidents and enabling investigators to track forensic evidence.

### 2. User Stories
- **Citizen**: As a citizen, I want to lodge a complaint with detailed categories and evidence attachments, and receive a case reference ID for tracking.
- **Cyber Police**: As a cyber investigator, I want to review submitted complaints and view preliminary forensic hashes to prioritize case files.
- **Forensic Expert**: As a forensic analyst, I want to inspect media authenticity scores and verify SHA-256 evidence integrity.

### 3. Functional Requirements
- **FR-1**: Unique Case Reference ID generation (`CN-YYYYMMDD-XXXXXX`).
- **FR-2**: Role-Based Access Control distinguishing Citizen, Police, and Forensic roles.
- **FR-3**: Cryptographic SHA-256 evidence hashing for chain of custody preservation.
- **FR-4**: RESTful API endpoints for complaint lifecycle operations.
