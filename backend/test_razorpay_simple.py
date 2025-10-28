#!/usr/bin/env python3
"""
Simple Razorpay integration test
"""
import os
import razorpay
from dotenv import load_dotenv

load_dotenv()

def test_razorpay_connection():
    """Test Razorpay client connection"""
    print("🧪 Testing Razorpay Connection...")
    
    key_id = os.getenv("RAZORPAY_KEY_ID")
    key_secret = os.getenv("RAZORPAY_KEY_SECRET")
    
    print(f"Key ID: {key_id}")
    print(f"Key Secret: {key_secret[:10]}..." if key_secret else "Not set")
    
    if not key_id or not key_secret:
        print("❌ Razorpay credentials not found")
        return False
    
    try:
        # Initialize Razorpay client
        client = razorpay.Client(auth=(key_id, key_secret))
        
        # Test connection by fetching account details
        account = client.account.fetch()
        print("✅ Razorpay connection successful!")
        print(f"   Account ID: {account.get('id', 'N/A')}")
        print(f"   Account Name: {account.get('name', 'N/A')}")
        print(f"   Account Type: {account.get('type', 'N/A')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Razorpay connection failed: {str(e)}")
        return False

def test_create_order():
    """Test creating a Razorpay order"""
    print("\n🧪 Testing Order Creation...")
    
    key_id = os.getenv("RAZORPAY_KEY_ID")
    key_secret = os.getenv("RAZORPAY_KEY_SECRET")
    
    try:
        client = razorpay.Client(auth=(key_id, key_secret))
        
        # Create test order
        order_data = {
            "amount": 300000,  # ₹3,000 in paise
            "currency": "INR",
            "receipt": "test_order_123",
            "notes": {
                "test": "true"
            }
        }
        
        order = client.order.create(data=order_data)
        print("✅ Order created successfully!")
        print(f"   Order ID: {order['id']}")
        print(f"   Amount: ₹{order['amount']/100}")
        print(f"   Currency: {order['currency']}")
        print(f"   Status: {order['status']}")
        
        return order
        
    except Exception as e:
        print(f"❌ Order creation failed: {str(e)}")
        return None

if __name__ == "__main__":
    print("🚀 Razorpay Integration Test")
    print("=" * 50)
    
    # Test connection
    if test_razorpay_connection():
        # Test order creation
        test_create_order()
    
    print("\n✅ Razorpay integration is working!")
    print("\n📋 Next Steps:")
    print("1. Configure webhook in Razorpay Dashboard")
    print("2. Set webhook URL: https://api.lastopinion.in/payments/webhook")
    print("3. Add events: payment.captured, payment.failed")
    print("4. Update RAZORPAY_WEBHOOK_SECRET in .env with the generated secret")

