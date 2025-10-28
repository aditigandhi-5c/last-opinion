#!/usr/bin/env python3
"""
Test script for Razorpay integration
"""
import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

# Test configuration
BASE_URL = "http://localhost:8000"
TEST_CASE_ID = 1  # Replace with an actual case ID from your database

def test_create_order():
    """Test creating a Razorpay order"""
    print("🧪 Testing Razorpay Order Creation...")
    
    # You'll need to get a valid JWT token first
    # This is just a test structure
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_JWT_TOKEN_HERE"  # Replace with actual token
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/payments/create-order",
            params={"case_id": TEST_CASE_ID},
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Order created successfully!")
            print(f"   Order ID: {data.get('order_id')}")
            print(f"   Amount: {data.get('amount')}")
            print(f"   Key ID: {data.get('key_id')}")
            return data
        else:
            print(f"❌ Failed to create order: {response.status_code}")
            print(f"   Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def test_webhook_endpoint():
    """Test webhook endpoint accessibility"""
    print("\n🧪 Testing Webhook Endpoint...")
    
    try:
        # Test if webhook endpoint is accessible
        response = requests.post(f"{BASE_URL}/payments/webhook")
        
        if response.status_code == 400:  # Expected - missing signature
            print("✅ Webhook endpoint is accessible")
        else:
            print(f"⚠️  Unexpected response: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def check_environment():
    """Check if Razorpay environment variables are set"""
    print("\n🧪 Checking Environment Variables...")
    
    key_id = os.getenv("RAZORPAY_KEY_ID")
    key_secret = os.getenv("RAZORPAY_KEY_SECRET")
    webhook_secret = os.getenv("RAZORPAY_WEBHOOK_SECRET")
    
    if key_id and key_id != "your-razorpay-key-id":
        print("✅ RAZORPAY_KEY_ID is set")
    else:
        print("❌ RAZORPAY_KEY_ID is not set or using placeholder")
    
    if key_secret and key_secret != "your-razorpay-key-secret":
        print("✅ RAZORPAY_KEY_SECRET is set")
    else:
        print("❌ RAZORPAY_KEY_SECRET is not set or using placeholder")
    
    if webhook_secret and webhook_secret != "your_webhook_secret_here":
        print("✅ RAZORPAY_WEBHOOK_SECRET is set")
    else:
        print("❌ RAZORPAY_WEBHOOK_SECRET is not set or using placeholder")

if __name__ == "__main__":
    print("🚀 Razorpay Integration Test")
    print("=" * 50)
    
    check_environment()
    test_webhook_endpoint()
    
    print("\n📝 Next Steps:")
    print("1. Update your .env file with actual Razorpay credentials")
    print("2. Get a valid JWT token for testing")
    print("3. Replace TEST_CASE_ID with an actual case ID")
    print("4. Run the test again")
    print("\n🔗 API Endpoints Available:")
    print(f"   POST {BASE_URL}/payments/create-order?case_id=<case_id>")
    print(f"   POST {BASE_URL}/payments/webhook")
    print(f"   POST {BASE_URL}/payments/verify")
    print(f"   GET  {BASE_URL}/payments/status/<payment_id>")

