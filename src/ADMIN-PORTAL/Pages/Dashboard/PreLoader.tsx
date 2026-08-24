import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UnionLogo from "../../Assets/Images/logo.png"; 

const NAVY = "#0f2a55";
const AMBER = "#f59e0b";
const SLATE = "#64748b";

const Preloader: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/login");
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <Container
            fluid
            className="d-flex justify-content-center align-items-center min-vh-100"
            style={{
                background: `linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)`,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
        >
            <style>{`
                @keyframes preloaderSpin {
                    to { transform: rotate(360deg); }
                }
                @keyframes preloaderBar {
                    0%   { width: 0%; }
                    60%  { width: 75%; }
                    100% { width: 100%; }
                }
                @keyframes preloaderFade {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .preloader-ring {
                    animation: preloaderSpin 1.4s linear infinite;
                }
                .preloader-content {
                    animation: preloaderFade 0.5s ease both;
                }
                .preloader-bar-fill {
                    animation: preloaderBar 3s ease forwards;
                }
            `}</style>

            <Row className="text-center">
                <Col>
                    <div className="preloader-content">
                        {/* Logo with rotating ring */}
                        <div
                            className="mx-auto mb-4 position-relative d-flex align-items-center justify-content-center"
                            style={{ width: 128, height: 128 }}
                        >
                            <svg
                                className="preloader-ring position-absolute"
                                width="128"
                                height="128"
                                viewBox="0 0 128 128"
                                style={{ top: 0, left: 0 }}
                            >
                                <circle
                                    cx="64" cy="64" r="58"
                                    fill="none"
                                    stroke="#e2e8f0"
                                    strokeWidth="4"
                                />
                                <circle
                                    cx="64" cy="64" r="58"
                                    fill="none"
                                    stroke={AMBER}
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeDasharray="90 274"
                                />
                            </svg>
                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center bg-white"
                                style={{
                                    width: 96,
                                    height: 96,
                                    boxShadow: "0 4px 16px rgba(15,42,85,0.12)",
                                }}
                            >
                                <img
                                    src={UnionLogo}
                                    alt="Union Logo"
                                    style={{ width: 60, height: 60, objectFit: "contain" }}
                                />
                            </div>
                        </div>

                        <h4
                            className="fw-bold mb-1"
                            style={{ color: NAVY, letterSpacing: "-0.3px" }}
                        >
                            Welcome
                        </h4>
                        <p
                            className="mb-4"
                            style={{ color: SLATE, fontSize: 14, fontWeight: 500 }}
                        >
                            Preparing your dashboard, please wait
                        </p>

                        {/* Progress bar */}
                        <div
                            className="mx-auto"
                            style={{
                                width: 220,
                                height: 5,
                                borderRadius: 99,
                                background: "#e2e8f0",
                                overflow: "hidden",
                            }}
                        >
                            <div
                                className="preloader-bar-fill"
                                style={{
                                    height: "100%",
                                    borderRadius: 99,
                                    background: `linear-gradient(90deg, ${NAVY}, ${AMBER})`,
                                }}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Preloader;