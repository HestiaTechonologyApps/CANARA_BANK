import React, { useEffect, useState } from "react";
import { Container, Card } from "react-bootstrap";
import "../Style/PrivacyPolicy.css";
import PublicPageConfigService from "../Services/Publicpage.services";
import type { PublicPage } from "../../ADMIN-PORTAL/Types/CMS/PublicPage.types";

const PrivacyPolicy: React.FC = () => {

    const [config, setConfig] = useState<PublicPage | null>(null);
    useEffect(() => {
        const loadPrivacyConfig = async () => {
            try {
                const data = await PublicPageConfigService.getPublicPageConfig();
                setConfig(data[0]); // CMS returns single record in array
            } catch (error) {
                console.error("Failed to load privacy policy config:", error);
            }
        };
        loadPrivacyConfig();
    }, []);

    return (
        <>
            {/* Hero Section */}
            <section className="policy-hero">
                <Container>
                    <div className="policy-badge text-center text-warning"> {config?.privacyHeroBadge || "Your Privacy Matters"}</div>
                    <h1 className="policy-title text-center">{config?.privacyHeroTitle || "Privacy Policy"}</h1>
                    <p className="policy-subtitle text-center">
                        {config?.privacyHeroSubTitle || "We are committed to protecting your personal information and your right to privacy."}</p>
                </Container>
            </section>
            {/* Content Section */}
            <Container className="policy-content">
                <Card className="policy-card">
                    <Card.Body>
                        <h5 className="policy-heading">{config?.privacyHeading1 || " 1. Privacy Policy for Canara Bank Employees' Union Golden Jubilee Family Welfare Scheme"}</h5>
                        <p className="policy-text"> {config?.privacyPara1 || "At Canara Bank Employees' Union Golden Jubilee Family Welfare Scheme, accessible from https://www.cbeugjfws.co.in/, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Canara Bank Employees' Union Golden Jubilee Family Welfare Scheme and how we use it."}</p>
                        <p className="policy-text"> {config?.privacyPara2 || "If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us."}</p>
                        <p className="policy-text"> {config?.privacyParagraph3 || "This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in Canara Bank Employees' Union Golden Jubilee Family Welfare Scheme. This policy is not applicable to any information collected offline or via channels other than this website."} </p>
                        <h5 className="policy-heading">{config?.privacyHeading2 || "2.Consent"}</h5>
                        <p className="policy-text"> {config?.privacyPara3 || "By using our website, you hereby consent to our Privacy Policy and agree to its terms."}</p>
                        <h5 className="policy-heading"> {config?.privacyHeading3 || "3.Information we collect"}</h5>
                        <p className="policy-text">
                            The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
                            If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
                            When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number. {/*==== New field needed =======*/} </p>
                        <h5 className="policy-heading">4. How we use your information {/* ============New field needed============== */}</h5>
                        <p className="policy-text">  We use the information we collect in various ways, including to: {/* New field needed */}</p>
                        <ul className="policy-list">
                            {config?.privacyLine1 && <li>{config.privacyLine1 || "Provide, operate, and maintain our website"}</li>}
                            {config?.privacyLine2 && <li>{config.privacyLine2 || "Improve, personalize, and expand our website"}</li>}
                            {config?.privacyLine3 && <li>{config.privacyLine3 || "Understand and analyze how you use our website"}</li>}
                            {config?.privacyLine4 && <li>{config.privacyLine4 || "Develop new products, services, features, and functionality"}</li>}
                            {config?.privacyLine5 && <li>{config.privacyLine5 || "Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes---"}</li>}
                            {config?.privacyLine6 && <li>{config.privacyLine6 || "Send you emails"}</li>}
                            {/* {config?.privacyLine7 && <li>{config.privacyLine6 || "Find and prevent fraud"}</li>} ======new field need to be added======*/}
                            {/* ===================MORE FIELDS FROM API NEED TO BE ADDED=========== */}
                        </ul>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default PrivacyPolicy;
