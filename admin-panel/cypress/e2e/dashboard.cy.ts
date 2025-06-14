describe('Dashboard E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display dashboard metrics', () => {
    cy.get('[data-testid="metric-card"]').should('have.length', 4);
    cy.get('[data-testid="total-posts"]').should('contain', '1,247');
    cy.get('[data-testid="active-accounts"]').should('contain', '23');
    cy.get('[data-testid="scheduled-posts"]').should('contain', '156');
    cy.get('[data-testid="engagement-rate"]').should('contain', '8.4%');
  });

  it('should show system health indicators', () => {
    cy.get('[data-testid="health-indicator"]').should('exist');
    cy.get('[data-testid="health-api"]').should('have.class', 'health-online');
    cy.get('[data-testid="health-database"]').should('have.class', 'health-online');
  });

  it('should display recent activity feed', () => {
    cy.get('[data-testid="activity-feed"]').should('exist');
    cy.get('[data-testid="activity-item"]').should('have.length.at.least', 1);
  });

  it('should navigate to different pages', () => {
    cy.get('[data-testid="nav-content"]').click();
    cy.url().should('include', '/content');
    
    cy.get('[data-testid="nav-scheduling"]').click();
    cy.url().should('include', '/scheduling');
    
    cy.get('[data-testid="nav-accounts"]').click();
    cy.url().should('include', '/accounts');
    
    cy.get('[data-testid="nav-analytics"]').click();
    cy.url().should('include', '/analytics');
  });

  it('should toggle sidebar', () => {
    cy.get('[data-testid="sidebar-toggle"]').click();
    cy.get('[data-testid="sidebar"]').should('have.class', 'collapsed');
    
    cy.get('[data-testid="sidebar-toggle"]').click();
    cy.get('[data-testid="sidebar"]').should('not.have.class', 'collapsed');
  });

  it('should refresh data when refresh button is clicked', () => {
    cy.intercept('GET', '/api/dashboard/metrics', { fixture: 'metrics.json' }).as('getMetrics');
    
    cy.get('[data-testid="refresh-button"]').click();
    cy.wait('@getMetrics');
    
    cy.get('[data-testid="last-updated"]').should('contain', 'Just now');
  });

  it('should handle API errors gracefully', () => {
    cy.intercept('GET', '/api/dashboard/metrics', { statusCode: 500 }).as('getMetricsError');
    
    cy.reload();
    cy.wait('@getMetricsError');
    
    cy.get('[data-testid="error-message"]').should('be.visible');
    cy.get('[data-testid="retry-button"]').should('be.visible');
  });

  it('should be responsive on mobile', () => {
    cy.viewport('iphone-x');
    
    cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
    cy.get('[data-testid="sidebar"]').should('not.be.visible');
    
    cy.get('[data-testid="mobile-menu-button"]').click();
    cy.get('[data-testid="mobile-sidebar"]').should('be.visible');
  });
}); 