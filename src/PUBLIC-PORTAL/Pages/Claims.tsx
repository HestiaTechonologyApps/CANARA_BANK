// src/Pages/Claims/Claims.tsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../Style/Claims.css";
import StateService from "../../ADMIN-PORTAL/Services/Settings/State.services";
import DesignationService from "../../ADMIN-PORTAL/Services/Settings/Designation.services";
import type { DeathClaim } from "../../ADMIN-PORTAL/Types/Claims/DeathClaims.type";
import type { State } from "../../ADMIN-PORTAL/Types/Settings/States.types";
import type { Designation } from "../../ADMIN-PORTAL/Types/Settings/Designation.types";
import DeathClaimService from "../../ADMIN-PORTAL/Services/Claims/DeathClaims.services";
import ClaimsTable from "../Components/Claims/KiduClaimsTable";
import YearMasterService from "../../ADMIN-PORTAL/Services/Settings/YearMaster.services";
import type { YearMaster } from "../../ADMIN-PORTAL/Types/Settings/YearMaster.types";
import type { PublicPage } from "../../ADMIN-PORTAL/Types/CMS/PublicPage.types";
import PublicPageConfigService from "../Services/Publicpage.services";
import type { ClaimsSettledStats } from "../Types/ClaimSettled.types";
import ClaimsSettledService from "../Services/ClaimSettled.services";

interface ClaimsTableRow {
  name: string;
  yearlyData: Record<string, number>;
  total: number;
}

type ViewTab = "state" | "designation";

const Claims: React.FC = () => {
  const [stateWiseClaims, setStateWiseClaims] = useState<ClaimsTableRow[]>([]);
  const [designationWiseClaims, setDesignationWiseClaims] = useState<ClaimsTableRow[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<PublicPage | null>(null);
  const [claimsStats, setClaimsStats] = useState<ClaimsSettledStats | null>(null);
  const [activeTab, setActiveTab] = useState<ViewTab>("state");

  useEffect(() => {
    loadClaimsData();
  }, []);

  const loadClaimsData = async () => {
    try {
      setLoading(true);
      const [deathClaims, states, designations, yearMasters, publicPageConfigs] = await Promise.all([
        DeathClaimService.getAllDeathClaims(),
        StateService.getAllStates(),
        DesignationService.getAllDesignations(),
        YearMasterService.getAllYearMasters(),
        PublicPageConfigService.getPublicPageConfig(),
      ]);
      try {
        const claimsSettledStats = await ClaimsSettledService.getClaimsSettledStats();
        setClaimsStats(claimsSettledStats);
      } catch (statsError) {
        console.error("Error loading claims settled stats:", statsError);
      }

      const activeConfig = publicPageConfigs.find((item: PublicPage) => item.isActive === true);
      setConfig(activeConfig || null);

      const yearList = yearMasters.map((y: YearMaster) => y.yearName.toString()).sort();
      setYears(yearList);

      setStateWiseClaims(processStateWiseData(deathClaims, states));
      setDesignationWiseClaims(processDesignationWiseData(deathClaims, designations));
    } catch (error) {
      console.error("Error loading claims data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processStateWiseData = (deathClaims: DeathClaim[], states: State[]): ClaimsTableRow[] => {
    const stateMap = new Map<number, ClaimsTableRow>();
    states.forEach((state) => {
      stateMap.set(state.stateId, { name: state.name, yearlyData: {}, total: 0 });
    });
    deathClaims.forEach((claim) => {
      const state = stateMap.get(claim.stateId);
      if (state) {
        const year = claim.yearName.toString();
        state.yearlyData[year] = (state.yearlyData[year] || 0) + 1;
        state.total += 1;
      }
    });
    // Only show places that actually have a claim on record — nobody needs
    // to scroll past a long list of zeros to find the ones that matter.
    return Array.from(stateMap.values())
      .filter((state) => state.total > 0)
      .sort((a, b) => b.total - a.total);
  };

  const processDesignationWiseData = (deathClaims: DeathClaim[], designations: Designation[]): ClaimsTableRow[] => {
    const designationMap = new Map<number, ClaimsTableRow>();
    designations.forEach((designation) => {
      designationMap.set(designation.designationId, { name: designation.name, yearlyData: {}, total: 0 });
    });
    deathClaims.forEach((claim) => {
      const designation = designationMap.get(claim.designationId);
      if (designation) {
        const year = claim.yearName.toString();
        designation.yearlyData[year] = (designation.yearlyData[year] || 0) + 1;
        designation.total += 1;
      }
    });
    return Array.from(designationMap.values())
      .filter((des) => des.total > 0)
      .sort((a, b) => b.total - a.total);
  };

  const claims = config
    ? {
        stats: [
          {
            icon: "check",
            value: claimsStats?.totalClaimsSettled ?? config?.claimsStat1Value,
            label: config?.claimsStat1Label,
          },
          {
            icon: "rupee",
            value: claimsStats?.totalAmountDisbursed ?? config.claimsStat2Value,
            label: config.claimsStat2Label,
          },
          {
            icon: "users",
            value: claimsStats?.activeMembers ?? config?.claimsStat3Value,
            label: config?.claimsStat3Label,
          },
        ],
      }
    : null;

  const glyphFor = (icon: string) => {
    if (icon === "check") return "✓";
    if (icon === "rupee") return "₹";
    if (icon === "users") return "◈";
    return "•";
  };

  return (
    <div className="claims-page">
      {/* Compact header + stats in one short band */}
      <section className="claims-header">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={5}>
              <h1 className="claims-header-title">{config?.claimsHeroTitle || "Claims Register"}</h1>
              <p className="claims-header-subtitle">
                {config?.claimsHeroSubTitle || "A public record of claims settled for our members and their families."}
              </p>
            </Col>
            <Col lg={7}>
              <div className="claims-stats-row">
                {claims?.stats.map((stat, index) => (
                  <div className="claims-stat" key={index}>
                    <span className="claims-stat-glyph">{glyphFor(stat.icon)}</span>
                    <div>
                      <div className="claims-stat-value">{stat.value}</div>
                      <div className="claims-stat-label">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Tabs — one table on screen at a time */}
      <Container className="claims-body">
        <div className="claims-tabs" role="tablist" aria-label="Claims breakdown">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "state"}
            className={`claims-tab ${activeTab === "state" ? "is-active" : ""}`}
            onClick={() => setActiveTab("state")}
          >
            State Wise
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "designation"}
            className={`claims-tab ${activeTab === "designation" ? "is-active" : ""}`}
            onClick={() => setActiveTab("designation")}
          >
            Designation Wise
          </button>
        </div>

        {loading ? (
          <div className="claims-loader">
            <p>Loading claims data&hellip;</p>
          </div>
        ) : activeTab === "state" ? (
          <ClaimsTable title="Claims — State Wise" data={stateWiseClaims} years={years} />
        ) : (
          <ClaimsTable title="Claims — Designation Wise" data={designationWiseClaims} years={years} />
        )}
      </Container>
    </div>
  );
};

export default Claims;