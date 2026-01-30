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
                const activeConfig = data.find(
                    (item: PublicPage) => item.isActive === true
                );
                setConfig(activeConfig || null);
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
                    <div className="policy-badge text-center text-warning"> {config?.privacyHeroBadge}</div>
                    <h1 className="policy-title text-center">{config?.privacyHeroTitle}</h1>
                    <p className="policy-subtitle text-center">
                        {config?.privacyHeroSubTitle}</p>
                </Container>
            </section>
            {/* Content Section */}
            <Container className="policy-content">
                <Card className="policy-card">
                    <Card.Body>
                        <h5 className="policy-heading">{config?.privacyHeading1}</h5>
                        <p className="policy-text"> {config?.privacyPara1}</p>
                        <p className="policy-text"> {config?.privacyPara2}</p>
                        <p className="policy-text"> {config?.privacyParagraph3} </p>
                        <h5 className="policy-heading">{config?.privacyHeading2}</h5>
                        <p className="policy-text"> {config?.privacyPara3}</p>
                        <h5 className="policy-heading"> {config?.privacyHeading3}</h5>
                        <p className="policy-text">
                            {config?.privacyHeading3Para1}
                            {/*==== New field needed =======*/} </p>
                        <h5 className="policy-heading">{config?.privacyHeading4} </h5>
                        <p className="policy-text"> {config?.privacySubHeading4} </p>
                        <ul className="policy-list">
                            {config?.privacyLine1 && <li>{config.privacyLine1}</li>}
                            {config?.privacyLine2 && <li>{config.privacyLine2}</li>}
                            {config?.privacyLine3 && <li>{config.privacyLine3}</li>}
                            {config?.privacyLine4 && <li>{config.privacyLine4}</li>}
                            {config?.privacyLine5 && <li>{config.privacyLine5}</li>}
                            {config?.privacyLine6 && <li>{config.privacyLine6}</li>}
                            {config?.privacyLine7 && <li>{config.privacyLine7}</li>}
                        </ul>
                        <h5 className="policy-heading">{config?.privacyHeading5} </h5>
                        <p className="policy-text"> {config?.privacyHeading5Para1} </p>
                        <h5 className="policy-heading">{config?.privacyHeading6} </h5>
                        <p className="policy-text"> {config?.privacyHeading6Para1} </p>
                        <h5 className="policy-heading">{config?.privacyHeading7} </h5>
                        <p className="policy-text"> {config?.privacyHeading7Para1} </p>
                        <h5 className="policy-heading">{config?.privacyHeading8} </h5>
                        <p className="policy-text"> {config?.privacySubHeading8} </p>
                        <ul className="policy-list">
                            {config?.privacyLine1 && <li>{config.privacyHeading8Para1}</li>}
                            {config?.privacyLine2 && <li>{config.privacyHeading8Para2}</li>}
                            {config?.privacyLine3 && <li>{config.privacyHeading8Para3}</li>}
                            {config?.privacyLine4 && <li>{config.privacyHeading8Para4}</li>}
                        </ul>
                        <h5 className="policy-heading">{config?.privacyHeading9} </h5>
                        <p className="policy-text"> {config?.privacySubHeading9} </p>
                        <ul className="policy-list">
                            {config?.privacyLine1 && <li>{config.privacyHeading9Para1}</li>}
                            {config?.privacyLine2 && <li>{config.privacyHeading9Para2}</li>}
                            {config?.privacyLine3 && <li>{config.privacyHeading9Para3}</li>}
                            {config?.privacyLine4 && <li>{config.privacyHeading9Para4}</li>}
                            {config?.privacyLine4 && <li>{config.privacyHeading9Para5}</li>}
                            {config?.privacyLine4 && <li>{config.privacyHeading9Para6}</li>}
                            {config?.privacyLine4 && <li>{config.privacyHeading9Para7}</li>}
                        </ul>
                        <h5 className="policy-heading">{config?.privacyHeading10} </h5>
                        <ul className="policy-list">
                            {config?.privacyLine1 && <li>{config.privacyHeading10Para1}</li>}
                            {config?.privacyLine2 && <li>{config.privacyHeading10Para2}</li>}
                        </ul>
                        <h5 className="policy-heading">{config?.privacyHeading11} </h5>
                        <ul className="policy-list">
                            {config?.privacyLine1 && <li>{config.privacyHeading11Para1}</li>}
                            {config?.privacyLine2 && <li>{config.privacyHeading11Para2}</li>}
                        </ul>
                        <h5 className="policy-heading">{config?.privacyHeading12} </h5>
                        <p className="policy-text"> {config?.privacyHeading12Para1} </p>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default PrivacyPolicy;
