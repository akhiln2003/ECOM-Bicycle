const assert = require('assert');

// Mock Razorpay instance
const razorpayMock = {
  orders: {
    create: (options, callback) => {
      // Simulate Razorpay API behavior
      if (typeof options.amount !== 'number' || !Number.isInteger(options.amount)) {
        return callback({
          error: {
            code: 'BAD_REQUEST_ERROR',
            description: 'The amount must be an integer.',
          },
        });
      }
      // Simulate successful order creation
      return callback(null, {
        id: 'order_mock_id',
        entity: 'order',
        amount: options.amount,
        currency: options.currency,
        receipt: options.receipt,
        status: 'created',
      });
    },
  },
};

// Mock the checkout controller with the mocked Razorpay instance
const checkoutControllerMock = {
  placeOrder: (subTotal) => {
    const options = {
      amount: Math.round(subTotal * 100), // Apply the fix
      currency: 'INR',
      receipt: 'mock_receipt_id',
    };

    return new Promise((resolve, reject) => {
      razorpayMock.orders.create(options, (error, order) => {
        if (error) {
          return reject(error);
        }
        resolve(order);
      });
    });
  },

  paymentCountinue: (totalAmount) => {
    const options = {
      amount: Math.round(totalAmount * 100), // Apply the fix
      currency: 'INR',
      receipt: 'mock_receipt_id',
    };

    return new Promise((resolve, reject) => {
      razorpayMock.orders.create(options, (error, order) => {
        if (error) {
          return reject(error);
        }
        resolve(order);
      });
    });
  },
};

// Test cases for placeOrder function
try {
  // Test with a floating-point amount
  checkoutControllerMock.placeOrder(120.77)
    .then(order => {
      assert.strictEqual(order.amount, 12077, 'Test Case 1 Failed: Amount should be converted to integer');
      console.log('Test Case 1 Passed: placeOrder with float amount');
    })
    .catch(error => {
      assert.fail('Test Case 1 Failed: Should not throw an error for a float amount');
    });

  // Test with an integer amount
  checkoutControllerMock.placeOrder(150)
    .then(order => {
      assert.strictEqual(order.amount, 15000, 'Test Case 2 Failed: Amount should be correctly converted to paise');
      console.log('Test Case 2 Passed: placeOrder with integer amount');
    })
    .catch(error => {
      assert.fail('Test Case 2 Failed: Should not throw an error for an integer amount');
    });

} catch (error) {
  console.error('Error in placeOrder test cases:', error);
}

// Test cases for paymentCountinue function
try {
  // Test with a floating-point amount
  checkoutControllerMock.paymentCountinue(99.99)
    .then(order => {
      assert.strictEqual(order.amount, 9999, 'Test Case 3 Failed: Amount should be converted to integer');
      console.log('Test Case 3 Passed: paymentCountinue with float amount');
    })
    .catch(error => {
      assert.fail('Test Case 3 Failed: Should not throw an error for a float amount');
    });

  // Test with an integer amount
  checkoutControllerMock.paymentCountinue(200)
    .then(order => {
      assert.strictEqual(order.amount, 20000, 'Test Case 4 Failed: Amount should be correctly converted to paise');
      console.log('Test Case 4 Passed: paymentCountinue with integer amount');
    })
    .catch(error => {
      assert.fail('Test Case 4 Failed: Should not throw an error for an integer amount');
    });

} catch (error) {
  console.error('Error in paymentCountinue test cases:', error);
}
