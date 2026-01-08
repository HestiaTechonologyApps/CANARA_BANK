// src/PUBLIC-PORTAL/Pages/Unauthorized.tsx
import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { ShieldAlert, Home, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../Services/Auth.services';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    const dashboardRoute = AuthService.getDashboardRoute();
    navigate(dashboardRoute);
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/', { state: { showLogin: true } }); // Go to home and show login modal
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      <Container>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <Card className="shadow-lg">
            <Card.Body className="p-5 text-center">
              <div className="mb-4">
                <ShieldAlert
                  size={80}
                  style={{ color: '#dc3545' }}
                  className="mb-3"
                />
              </div>

              <h2 className="mb-3">Access Denied</h2>
              <p className="text-muted mb-4">
                Sorry, you don't have permission to access this page. This area
                is restricted to authorized users only.
              </p>

              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleGoToDashboard}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                  }}
                >
                  <Home size={18} className="me-2" />
                  Go to My Dashboard
                </Button>

                <Button
                  variant="outline-secondary"
                  size="lg"
                  onClick={handleLogout}
                >
                  <LogOut size={18} className="me-2" />
                  Logout
                </Button>
              </div>

              <p className="text-muted mt-4 mb-0" style={{ fontSize: '0.9rem' }}>
                If you believe this is an error, please contact support at{' '}
                <a href="tel:04442035575">044-42035575</a>
              </p>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default Unauthorized;