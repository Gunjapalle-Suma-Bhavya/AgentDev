import db

db.sync_workspace_projects()

# Add agent activities for cyber_nethra_core
task_id = "init-cn"
db.record_agent_activity(task_id, "Product Manager", "Alice", "WritePRD", "completed", "Analyzed requirements and produced PRD for Cyber Nethra Core.", 4.2)
db.record_agent_activity(task_id, "System Architect", "Bob", "WriteDesign", "completed", "Designed Clean Architecture and Mermaid data flow diagrams.", 5.8)
db.record_agent_activity(task_id, "Project Manager", "Eve", "WriteTasks", "completed", "Decomposed architecture into 5 implementation milestones.", 3.1)
db.record_agent_activity(task_id, "Software Engineer", "Alex", "WriteCode", "completed", "Generated modular Python source code files (main.py, rbac_auth.py, etc.).", 12.4)
db.record_agent_activity(task_id, "QA Engineer", "David", "WriteCodeReview", "completed", "Verified AST syntax, 0 syntax defects, generated test_complaint.py.", 3.9)

# Add an approval checkpoint
db.create_approval(
    task_id=task_id,
    project_name="cyber_nethra_core",
    stage="Architecture & PRD Verification",
    agent_name="Alice (PM) & Bob (Architect)",
    artifact_type="PRD & System Design",
    artifact_title="Cyber Nethra Core Architectural Sign-off",
    artifact_content="PRD, RBAC specifications, and Clean Architecture diagrams have been formulated. Please review and approve."
)

print("Demo data seeded successfully.")
