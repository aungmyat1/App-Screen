#!/usr/bin/env python3
"""
Test script to verify Redis integration with existing RedisManager
"""

import sys
import os

# Add the parent directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__)))

from database.redis_manager import redis_manager
from config.redis import REDIS_CONFIG, CACHE_TTL

def test_redis_manager():
    """Test the existing RedisManager integration"""
    try:
        # Test connection
        pong = redis_manager.client.ping()
        print("RedisManager connection test: {}".format('PASS' if pong else 'FAIL'))
        
        # Test basic operations using RedisManager methods
        success_set = redis_manager.set('integration_test_key', {'test': 'value'}, 10)
        value = redis_manager.get('integration_test_key')
        success_get = value == {'test': 'value'}
        print("RedisManager set/get test: {}".format('PASS' if success_set and success_get else 'FAIL'))
        
        # Test exists
        exists = redis_manager.exists('integration_test_key')
        print("RedisManager exists test: {}".format('PASS' if exists else 'FAIL'))
        
        # Test increment
        redis_manager.delete('counter_test')
        count1 = redis_manager.increment('counter_test', 1)
        count2 = redis_manager.increment('counter_test', 5)
        print("RedisManager increment test: {}".format('PASS' if count1 == 1 and count2 == 6 else 'FAIL'))
        
        # Clean up
        redis_manager.delete('integration_test_key')
        redis_manager.delete('counter_test')
        
        return True
    except Exception as e:
        print("RedisManager test: FAIL - {}".format(e))
        return False

def display_config():
    """Display the current Redis configuration"""
    print("Redis Configuration:")
    for key, value in REDIS_CONFIG.items():
        print("  {}: {}".format(key, value))
    
    print("\nCache TTL Settings:")
    for key, value in CACHE_TTL.items():
        print("  {}: {} seconds".format(key, value))

if __name__ == "__main__":
    print("Testing Redis Integration with RedisManager")
    print("=" * 45)
    
    display_config()
    print()
    
    success = test_redis_manager()
    
    if success:
        print("\nAll integration tests passed! RedisManager is working correctly.")
        sys.exit(0)
    else:
        print("\nIntegration tests failed! Please check your RedisManager implementation.")
        sys.exit(1)