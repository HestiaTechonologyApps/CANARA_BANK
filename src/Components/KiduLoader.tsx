import React from "react";
import { Col, Container, Row } from "react-bootstrap";

interface LoaderProps {
    type?: string;
}

const KiduLoader: React.FC<LoaderProps> = () => {

    return (
        <Container
            fluid
            className="d-flex justify-content-center align-items-center min-vh-100 bg-light"
            style={{
                backgroundColor: "#f8f9fa",
                fontFamily: "Plus Jakarta Sans",
            }}
        >
            <Row className="text-center">
                <Col>
                    <div className="text-center py-2 committe-loader">
                        <div className="loader-icon mb-3">
                            <span className="pulse-icon">⏳</span>
                        </div>
                        <h5 className="mb-1">Loading</h5>
                        <p className="text-muted small">Please wait a moment…</p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default KiduLoader;
