"""
AgentDev REST API Automated Verification Suite
Tests all endpoints against running server.
"""

import urllib.request
import json
import sys

BASE_URL = "http://localhost:8000"

def test_endpoint(path, expected_status=200):
    url = f"{BASE_URL}{path}"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=5) as response:
            status = response.getcode()
            content = response.read().decode("utf-8")
            data = json.loads(content)
            assert status == expected_status, f"Expected {expected_status}, got {status}"
            return True, data
    except Exception as e:
        return False, str(e)

def run_all_tests():
    endpoints = [
        ("/api/health", 200),
        ("/api/dashboard/stats", 200),
        ("/api/config", 200),
        ("/api/roles", 200),
        ("/api/projects", 200),
        ("/api/agent/activity", 200),
        ("/api/approvals", 200),
        ("/api/qa/reports", 200),
        ("/api/monitor/endpoints", 200),
        ("/api/monitor/requests", 200),
        ("/api/agents/network", 200),
        ("/api/agents/messages", 200),
        ("/api/analytics/cyber_nethra_core", 200),
        ("/api/templates", 200),
        ("/api/command/history", 200),
    ]

    print("=" * 60)
    print("RUNNING AGENTDEV BACKEND API VERIFICATION SUITE")
    print("=" * 60)

    passed = 0
    failed = 0

    for path, code in endpoints:
        ok, res = test_endpoint(path, code)
        if ok:
            passed += 1
            sample = str(res)[:60].replace("\n", "")
            print(f" PASS: {path:<30} Status: {code} | {sample}...")
        else:
            failed += 1
            print(f" FAIL: {path:<30} Error: {res}")

    print("=" * 60)
    print(f"RESULTS: {passed} PASSED, {failed} FAILED")
    print("=" * 60)

    return failed == 0

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
