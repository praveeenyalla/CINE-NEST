import requests
import sys

def seed_admin(email, password):
    url = "http://localhost:8000/admin/create"
    payload = {
        "email": email,
        "password": password
    }
    
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 201:
            print(f"Successfully created admin account: {email}")
        else:
            print(f"Failed to create admin: {response.json().get('detail', 'Unknown error')}")
    except Exception as e:
        print(f"Error: {str(e)}. Make sure the backend is running at http://localhost:8000")

if __name__ == "__main__":
    email = sys.argv[1] if len(sys.argv) > 1 else "admin@ott.com"
    password = sys.argv[2] if len(sys.argv) > 2 else "admin123"
    seed_admin(email, password)
