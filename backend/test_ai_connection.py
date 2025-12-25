import urllib.request
import json

url = "http://localhost:8000/ai/chat"
payload = {
    "user_email": "test@test.com",
    "message": "Recommend a movie",
    "category": "general"
}
data = json.dumps(payload).encode('utf-8')
headers = {
    "Content-Type": "application/json"
}

try:
    req = urllib.request.Request(url, data=data, headers=headers, method='POST')
    print(f"Sending request to {url}...")
    with urllib.request.urlopen(req) as response:
        print(f"Status Code: {response.getcode()}")
        resp_body = response.read().decode('utf-8')
        print("Response JSON:")
        print(resp_body)
except Exception as e:
    print(f"Error: {e}")
    # Try to read error body if available
    if hasattr(e, 'read'):
         print(f"Error Body: {e.read().decode('utf-8')}")
