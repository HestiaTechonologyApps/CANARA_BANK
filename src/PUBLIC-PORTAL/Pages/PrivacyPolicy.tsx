import React from "react";
import { Container, Card } from "react-bootstrap";
import "../Style/PrivacyPolicy.css";

const PrivacyPolicy: React.FC = () => {
    return (
        <>
            {/* Hero Section */}
            <section className="policy-hero">
                <Container>
                    <div className="policy-badge text-center text-warning">Your Privacy Matters</div>
                    <h1 className="policy-title text-center">Privacy Policy</h1>
                    <p className="policy-subtitle text-center">
                        We are committed to protecting your personal information and your right to privacy.
                    </p>
                </Container>
            </section>

            {/* Breadcrumb */}
            {/* <section className="policy-breadcrumb">
                <Container>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item active>Privacy Policy</Breadcrumb.Item>
                    </Breadcrumb>
                </Container>
            </section> */}

            {/* Content Section */}
            <Container className="policy-content">
                <Card className="policy-card">
                    <Card.Body>
                        {/* <div className="policy-updated">
                            Last updated: December 2025
                        </div> */}
                        <h5 className="policy-heading">1. Privacy Policy for Canara Bank Employees' Union Golden Jubilee Family Welfare Scheme</h5>
                        <p className="policy-text">
                            At Canara Bank Employees' Union Golden Jubilee Family Welfare Scheme, accessible from https://www.cbeugjfws.co.in/, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Canara Bank Employees' Union Golden Jubilee Family Welfare Scheme and how we use it.
                        </p>
                        <p className="policy-text">
                            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
                        </p>
                        <p className="policy-text">
                            This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in Canara Bank Employees' Union Golden Jubilee Family Welfare Scheme. This policy is not applicable to any information collected offline or via channels other than this website.
                        </p>

                        <h5 className="policy-heading">2.Consent</h5>
                        <p className="policy-text">
                            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
                        </p>

                        <h5 className="policy-heading">3.Information we collect</h5>
                        <p className="policy-text">
                            The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.

                            If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.

                            When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.
                        </p>

                        <h5 className="policy-heading">4. How we use your information</h5>
                        <p className="policy-text">
                            We use the information we collect in various ways, including to:
                        </p>
                        <ul className="policy-list">
                            <li>Provide, operate, and maintain our website</li>
                            <li>Improve, personalize, and expand our website</li>
                            <li>Understand and analyze how you use our website</li>
                            <li>Develop new products, services, features, and functionality</li>
                            <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
                            <li>Send you emails</li>
                            <li>Find and prevent fraud</li>
                        </ul>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default PrivacyPolicy;
