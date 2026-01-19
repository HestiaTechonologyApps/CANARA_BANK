import React, { useEffect, useState } from "react";
import { Container, Card } from "react-bootstrap";
import "../Style/Rules.css";
import { PublicService } from "../../Services/PublicService";
import PublicPageConfigService from "../Services/Publicpage.services";
import type { PublicPageConfig } from "../Types/PublicPage.types";

interface RuleSection {
  number: number;
  title: string;
  content: string;
}

const Rules: React.FC = () => {
  const rules = PublicService.rules

  const [config, setConfig] = useState<PublicPageConfig | null>(null);
  const [sections, setSections] = useState<RuleSection[]>([]);

  useEffect(() => {
    const loadRulesConfig = async () => {
      try {
        const data = await PublicPageConfigService.getPublicPageConfig();
        const pageConfig = data[0]; // CMS returns single record
        setConfig(pageConfig);

        if (pageConfig?.rulesSectionsJson) {
          setSections(JSON.parse(pageConfig.rulesSectionsJson));
        }
      } catch (error) {
        console.error("Failed to load rules config:", error);
      }
    };

    loadRulesConfig();
  }, []);
  return (
    <div className="rules-wrapper">

      {/* HEADER SECTION */}
      <div className="rules-header text-center py-4">
        <h2 className="rules-title mt-2">
          {/* <i className="bi bi-journal-bookmark-fill me-2"></i> */}
          {/* {rules.header.title} */}
          {config?.rulesHeaderTitle || "Rules & Regulations"}
        </h2>
        <p className="rules-subtitle">
          {/* {rules.header.subtitle} */} {config?.rulesHeaderSubTitle ||
            "Complete guidelines for the Golden Jubilee Family Welfare Scheme"}
        </p>
      </div>

      {/* CONTENT */}
      <Container className="py-5">

        {/* PREAMBLE CARD */}
        <Card className="rules-card p-4 mb-4">
          <h5 className="section-title">
            {/* {rules.preamble.title} */} {config?.rulesPreambleTitle || "Preamble"}
          </h5>

          <p>{config?.rulesPreamblePara1}</p>
          <p>{config?.rulesPreamblePara2}</p>
          <p>{config?.rulesPreamblePara3}</p>
          <p>{config?.rulesPreamblePara4}</p>
          <p>{config?.rulesPreamblePara5}</p>
          {/* <p>{config?.rulesPreamblePara6}</p> */}
        </Card>

        {/* MAIN SECTIONS */}
        {/* MAIN RULE SECTIONS */}
        {sections.map((section) => {
          const parts = section.content.split("#");

          return (
            <Card className="rules-card p-4 mb-4" key={section.number}>
              <h5 className="section-title">
                {section.number}. {section.title}
              </h5>

              {parts.length === 1 ? (
                <p>{parts[0]}</p>
              ) : (
                <ul>
                  {parts.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </Card>
          );
        })}

      </Container>
    </div>
  );
};

export default Rules;
