import React from "react";
import { Container, Card } from "react-bootstrap";
import "../Style/Rules.css";
import { PublicService } from "../../Services/PublicService";

const Rules: React.FC = () => {
  const rules = PublicService.rules
  return (
    <div className="rules-wrapper">

      {/* HEADER SECTION */}
      <div className="rules-header text-center py-4">
        <h2 className="rules-title mt-2">
          {/* <i className="bi bi-journal-bookmark-fill me-2"></i> */}
          {rules.header.title}
        </h2>
        <p className="rules-subtitle">
          {rules.header.subtitle}
        </p>
      </div>

      {/* CONTENT */}
      <Container className="py-5">

        {/* PREAMBLE CARD */}
        <Card className="rules-card p-4 mb-4">
          <h5 className="section-title">{rules.preamble.title}</h5>

          <p>
            {rules.preamble.paragraphs.paragraph1}
          </p>

          <p>{rules.preamble.paragraphs.paragraph2}</p>

          <p>
            {rules.preamble.paragraphs.paragraph3}
          </p>

          <p>
            {rules.preamble.paragraphs.paragraph4}
          </p>

          <p>
            {rules.preamble.paragraphs.paragraph5}
          </p>

          <p>
            {rules.preamble.paragraphs.paragraph6}
          </p>
        </Card>

        {/* MAIN SECTIONS */}

        <Card className="rules-card p-4 mb-4">
          <h5 className="section-title">1. Name of the Scheme</h5>
          <p>
            Name of the fund shall be <strong>“Canara Bank Employees’ Union Golden Jubilee Family Welfare Scheme
              - a unit of Canara Bank Employees Union”</strong>, which in the following Rules and Regulations,
            is referred to as the “Scheme”.
          </p>
        </Card>

        <Card className="rules-card p-4 mb-4">
          <h5 className="section-title">2. Objects</h5>
          <ul>
            <li>To provide financial assistance to the family/dependents of deceased members in times of distress.</li>
            <li>To raise/acquire money by subscription or donations.</li>
            <li>To provide financial aid or loans to members.</li>
            <li>To adopt measures for the welfare of members as needed.</li>
          </ul>
        </Card>

        <Card className="rules-card p-4 mb-4">
          <h5 className="section-title">3. Management</h5>
          <p>
            Scheme will be under the direct control of Canara Bank Employees’ Union (Regd.) having its central
            office at Chennai and managed by a Committee nominated by the Central Committee (CC) of the Union.
          </p>
        </Card>

        <Card className="rules-card p-4 mb-4">
          <h5 className="section-title">4. Managing Committee</h5>
          <ul>
            <li>President – General Secretary of Union (Ex Officio)</li>
            <li>Secretary – Nominated by CC</li>
            <li>Treasurer – Nominated by CC</li>
            <li>Four other members – Nominated by CC</li>
          </ul>

          <p>
            The Committee shall meet once every six months or more if necessary. Decisions are taken by majority.
          </p>
        </Card>

        <Card className="rules-card p-4 mb-4">
          <h5 className="section-title">5. Quorum</h5>
          <p>The quorum for a meeting shall be four.</p>
        </Card>

        <Card className="rules-card p-4 mb-4">
          <h5 className="section-title">6. President</h5>
          <p>
            The President will preside over meetings and may take emergency measures subject to reporting to CC.
          </p>
        </Card>

        <Card className="rules-card p-4 mb-4">
          <h5 className="section-title">7. Secretary</h5>
          <p>
            Responsible for correspondence, meetings, minutes, supervision of affairs, and duties assigned by committee.
          </p>
        </Card>

        <Card className="rules-card p-4 mb-4">
          <h5 className="section-title">8. Treasurer</h5>
          <p>
            Maintains books, prepares annual balance sheet, and presents accounts for approval.
          </p>
        </Card>

        <Card className="rules-card p-4 mb-4">
          <h5 className="section-title">9. Administrative Office</h5>
          <p>
            Located at “Balakrishna Menon Smarakam”, Ambujavilasam Road, Thiruvananthapuram - 695001.
          </p>
        </Card>

        <Card className="rules-card p-4 mb-4">
          <h5 className="section-title">10. Funds</h5>
          <p>
            Administered by the Administrative Office under control of Managing Committee.
          </p>
        </Card>

        <Card className="rules-card p-4 mb-4">
          <h5 className="section-title">11. Accounts</h5>
          <p>Scheme shall have its own bank account with Canara Bank.</p>
        </Card>

        <Card className="rules-card p-4 mb-4">
          <h5 className="section-title">12. Membership</h5>
          <p>
            Membership open to employees of Canara Bank under age 58 who are Union members.
          </p>
        </Card>

        <Card className="rules-card p-4 mb-4">
          <h5 className="section-title">13. Subscription</h5>
          <p><strong>Rs. 50/month</strong> for old members; <strong>Rs. 100/month</strong> from 1 Jan 2007.</p>
        </Card>

        <Card className="rules-card p-4 mb-4">
          <h5 className="section-title">14. Cessation of Membership</h5>
          <ul>
            <li>Non-payment</li>
            <li>Resignation or expulsion</li>
            <li>Leaving service</li>
            <li>Completion of 15 years</li>
          </ul>
        </Card>

        <Card className="rules-card p-4 mb-4">
          <h5 className="section-title">15. Readmission</h5>
          <p>
            Members may be readmitted upon payment of arrears + interest + readmission fee.
          </p>
        </Card>

        <Card className="rules-card p-4 mb-4">
          <h5 className="section-title">16. Entitlement of Benefits</h5>
          <p>Lump sum relief varies between Rs. 30,000 to Rs. 50,000 depending on subscription.</p>
          <p>Monthly pension varies from Rs. 500 to Rs. 750 based on criteria.</p>
        </Card>

        <Card className="rules-card p-4 mb-4">
          <h5 className="section-title">17. Nomination</h5>
          <p>Each member nominates up to three beneficiaries in order of precedence.</p>
        </Card>

        <Card className="rules-card p-4 mb-4">
          <h5 className="section-title">18. Distribution of Benefits</h5>
          <p>Claims processed by Administrative Office after verification.</p>
        </Card>

        <Card className="rules-card p-4 mb-4">
          <h5 className="section-title">19. Representation</h5>
          <p>
            Secretary is authorized to file or face legal proceedings.
          </p>
        </Card>

        <Card className="rules-card p-4 mb-4">
          <h5 className="section-title">20. Place of Suing</h5>
          <p>Jurisdiction restricted to courts in Thiruvananthapuram.</p>
        </Card>

        <Card className="rules-card p-4 mb-4">
          <h5 className="section-title">21. Assets</h5>
          <p>All properties vest with the Scheme under the Managing Committee.</p>
        </Card>

        <Card className="rules-card p-4 mb-4">
          <h5 className="section-title">22. Accounts (Audit)</h5>
          <p>Accounts audited annually by Chartered Accountants.</p>
        </Card>

        <Card className="rules-card p-4 mb-4">
          <h5 className="section-title">23. Amendments</h5>
          <p>Rules may be amended only by the Central Committee of the Union.</p>
        </Card>

        <Card className="rules-card p-4 mb-5">
          <h5 className="section-title">24. Dissolution</h5>
          <p>
            Upon dissolution, funds are distributed proportionally to members.
          </p>
        </Card>

      </Container>
    </div>
  );
};

export default Rules;
