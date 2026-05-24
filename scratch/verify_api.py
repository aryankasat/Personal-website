import json
import urllib.request
import urllib.error
import sys

BASE_URL = "http://localhost:8000/api"

endpoints = [
    ("/profile", "GET", None),
    ("/about", "GET", None),
    ("/education", "GET", None),
    ("/experience", "GET", None),
    ("/projects", "GET", None),
    ("/projects?category=agents", "GET", None),
    ("/skills", "GET", None),
    ("/publications", "GET", None),
    ("/certifications", "GET", None),
    ("/blogs", "GET", None),
    ("/blogs/1", "GET", None),
    ("/system-designs", "GET", None),
    ("/system-designs/1", "GET", None),
    ("/contact", "POST", {
        "name": "Validation Test",
        "email": "test@example.com",
        "subject": "Testing endpoint",
        "message": "This is a validation test message sent by verify_api.py."
    })
]

def verify_all():
    print("=" * 60)
    print(" Aryan Kasat Portfolio API Verification")
    print("=" * 60)
    
    all_success = True
    
    for endpoint, method, payload in endpoints:
        url = f"{BASE_URL}{endpoint}"
        print(f"Testing [{method}] {url}...", end="")
        
        req = urllib.request.Request(url, method=method)
        if payload:
            data = json.dumps(payload).encode("utf-8")
            req.add_header("Content-Type", "application/json")
            req.data = data
            
        try:
            with urllib.request.urlopen(req, timeout=5) as response:
                status = response.status
                body = response.read().decode("utf-8")
                
                # Check status
                if status != 200:
                    print(f" [FAIL] - Status: {status}")
                    all_success = False
                    continue
                    
                # Validate JSON format
                try:
                    data = json.loads(body)
                    print(f" [OK] - JSON verified (keys: {list(data.keys()) if isinstance(data, dict) else len(data)})")
                except json.JSONDecodeError:
                    print(" [FAIL] - Response is not valid JSON")
                    all_success = False
                    
        except urllib.error.HTTPError as e:
            print(f" [FAIL] - HTTP Error: {e.code} - {e.reason}")
            all_success = False
        except urllib.error.URLError as e:
            print(f" [FAIL] - Server unreachable: {e.reason}")
            all_success = False
        except Exception as e:
            print(f" [FAIL] - Error: {str(e)}")
            all_success = False
            
    print("=" * 60)
    if all_success:
        print(" SUCCESS: All API endpoints verified successfully!")
        sys.exit(0)
    else:
        print(" FAILURE: Some endpoints returned errors. Check logs.")
        sys.exit(1)

if __name__ == "__main__":
    verify_all()
