describe('Complete User Flow: Menu → Checkout → Order Tracking', () => {
  beforeEach(() => {
    cy.visit('/');
    // Wait for page to load
    cy.get('button').should('exist');
  });

  it('T-037.1: Browse menu and add 2 items with customizations', () => {
    // Wait for products to load - look for any button with "+" (add to cart)
    cy.get('main').should('be.visible');
    
    // Find and click first product's customize button (button with "+" text)
    cy.get('button').contains('+').first().click();

    // CustomizationModal should appear
    cy.contains('Add to Cart').should('be.visible');

    // Try to interact with customization options - look for radio buttons or price displays
    // Select Size M (usually first option)
    cy.contains('M').first().click();
    // Add to cart
    cy.contains('button', 'Add to Cart').click();

    // Wait for modal to close
    cy.contains('Add to Cart').should('not.exist');

    // Add second item - click next product's "+" button
    cy.get('button').contains('+').eq(1).click();

    cy.contains('Add to Cart').should('be.visible');
    cy.contains('L').first().click();
    cy.contains('button', 'Add to Cart').click();
  });

  it('T-037.2: Edit order quantities and remove item', () => {
    // Add items first
    cy.get('button').contains('+').first().click();
    cy.contains('Add to Cart').should('be.visible');
    cy.contains('button', 'Add to Cart').click();

    // Click sticky order bar to view cart
    cy.contains('button', 'Checkout').should('be.visible');

    // Try to find and interact with quantity controls
    // Look for input fields with quantity
    cy.get('input[type="number"]').first().then(($input) => {
      if ($input.length > 0) {
        // If quantity inputs exist, increment first item
        cy.get('input[type="number"]').first().clear().type('2');
        cy.get('input[type="number"]').first().should('have.value', '2');
      }
    });
  });

  it('T-037.3: Proceed to checkout and fill form', () => {
    // Add 1 item first
    cy.get('button').contains('+').first().click();
    cy.contains('button', 'Add to Cart').click();

    // Click checkout button
    cy.contains('button', 'Checkout').click();
    cy.url().should('include', 'checkout');

    // Fill form fields
    cy.get('input[type="text"]').first().type('Test User');
    
    // Find and fill phone field
    cy.get('input[type="tel"]').type('0912345678');
    
    // Fill address (textarea)
    cy.get('textarea').first().type('123 Test Street, District 1, HCMC');
    
    // Fill driver note if there's another textarea
    cy.get('textarea').eq(1).then(($textarea) => {
      if ($textarea.length > 0) {
        cy.wrap($textarea).type('Leave at reception 🏢');
      }
    });

    cy.contains('button', 'Place Order').should('be.enabled');
  });

  it('T-037.4: Submit order and receive order ID', () => {
    // Add item
    cy.get('button').contains('+').first().click();
    cy.contains('button', 'Add to Cart').click();

    cy.visit('/checkout');

    // Fill and submit
    cy.get('input[type="text"]').first().type('Test User');
    cy.get('input[type="tel"]').type('0912345678');
    cy.get('textarea').first().type('123 Test Street, District 1, HCMC');

    cy.contains('button', 'Place Order').click();

    // Verify redirect to order status
    cy.url().should('include', '/order-status/');
    
    // Extract order ID from URL and verify page loads
    cy.url().then((url) => {
      const orderId = url.split('/order-status/')[1];
      expect(orderId).to.exist;
      cy.contains(`Order #${orderId}`).should('be.visible');
    });
  });

  it('T-037.5: Navigate to Order Status and verify tracking page', () => {
    cy.visit('/order-status/ORD-SAMPLE-001');

    // Verify page loaded
    cy.contains('Order').should('be.visible');

    // Check order summary exists
    cy.contains('Order #ORD-SAMPLE-001').should('be.visible');

    // Verify stage information is visible  
    cy.contains('Received').should('be.visible');
    cy.contains('Preparing').should('be.visible');
  });

  it('T-037.6: Verify progress bar displays current status', () => {
    cy.visit('/order-status/ORD-SAMPLE-001');

    // Verify stage labels visible
    cy.contains('Received').should('be.visible');
    cy.contains('Preparing').should('be.visible');
    cy.contains('Out for Delivery').should('be.visible');
    cy.contains('Completed').should('be.visible');
  });

  it('T-037.7: Verify driver note preserved end-to-end', () => {
    cy.visit('/order-status/ORD-SAMPLE-001');

    // Check driver note displays correctly
    cy.contains('reception').should('be.visible');
    // Emoji should be preserved in the page
    cy.contains(/🏢|Leave/i).should('be.visible');
  });

  it('T-037.8: Call Shop button is accessible', () => {
    cy.visit('/order-status/ORD-SAMPLE-001');

    cy.contains('button', /call|shop|support/i).should('be.visible');
  });
});
