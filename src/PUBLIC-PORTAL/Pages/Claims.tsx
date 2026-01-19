// src/Pages/Claims/Claims.tsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../Style/Claims.css";
import { PublicService } from "../../Services/PublicService";
import StateService from "../../ADMIN-PORTAL/Services/Settings/State.services";
import DesignationService from "../../ADMIN-PORTAL/Services/Settings/Designation.services";
import type { DeathClaim } from "../../ADMIN-PORTAL/Types/Claims/DeathClaims.type";
import type { State } from "../../ADMIN-PORTAL/Types/Settings/States.types";
import type { Designation } from "../../ADMIN-PORTAL/Types/Settings/Designation";
import DeathClaimService from "../../ADMIN-PORTAL/Services/Claims/DeathClaims.services";
import ClaimsTable from "../Components/Claims/KiduClaimsTable";

interface ClaimsTableRow {
  name: string;
  yearlyData: Record<string, number>;
  total: number;
}

const Claims: React.FC = () => {
  const claims = PublicService.claimsPage;
  const [stateWiseClaims, setStateWiseClaims] = useState<ClaimsTableRow[]>([]);
  const [designationWiseClaims, setDesignationWiseClaims] = useState<ClaimsTableRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Dummy years from 2003 to 2030
  const years = Array.from({ length: 28 }, (_, i) => (2003 + i).toString());

  useEffect(() => {
    loadClaimsData();
  }, []);

  const loadClaimsData = async () => {
    try {
      setLoading(true);
      const [deathClaims, states, designations] = await Promise.all([
        DeathClaimService.getAllDeathClaims(),
        StateService.getAllStates(),
        DesignationService.getAllDesignations(),
      ]);

      // Process state-wise claims
      const stateData = processStateWiseData(deathClaims, states);
      setStateWiseClaims(stateData);

      // Process designation-wise claims
      const designationData = processDesignationWiseData(deathClaims, designations);
      setDesignationWiseClaims(designationData);
    } catch (error) {
      console.error("Error loading claims data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processStateWiseData = (
    deathClaims: DeathClaim[],
    states: State[]
  ): ClaimsTableRow[] => {
    const stateMap = new Map<number, ClaimsTableRow>();

    // Initialize all states
    states.forEach((state) => {
      stateMap.set(state.stateId, {
        name: state.name,
        yearlyData: {},
        total: 0,
      });
    });

    // Aggregate claims by state and year
    deathClaims.forEach((claim) => {
      const state = stateMap.get(claim.stateId);
      if (state) {
        const year = claim.yearOF.toString();
        state.yearlyData[year] = (state.yearlyData[year] || 0) + 1;
        state.total += 1;
      }
    });

    return Array.from(stateMap.values()).filter((state) => state.total > 0);
  };

  const processDesignationWiseData = (
    deathClaims: DeathClaim[],
    designations: Designation[]
  ): ClaimsTableRow[] => {
    const designationMap = new Map<number, ClaimsTableRow>();

    // Initialize all designations
    designations.forEach((designation) => {
      designationMap.set(designation.designationId, {
        name: designation.name,
        yearlyData: {},
        total: 0,
      });
    });

    // Aggregate claims by designation and year
    deathClaims.forEach((claim) => {
      const designation = designationMap.get(claim.designationId);
      if (designation) {
        const year = claim.yearOF.toString();
        designation.yearlyData[year] = (designation.yearlyData[year] || 0) + 1;
        designation.total += 1;
      }
    });

    return Array.from(designationMap.values()).filter((des) => des.total > 0);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="claims-hero py-4">
        <Container>
          <h2 className="claims-title">{claims.hero.title}</h2>
          <p className="claims-subtitle">{claims.hero.subtitle}</p>
        </Container>
      </section>

      {/* Stats Cards */}
      <Container className="claims-stats">
        <Row className="g-4">
          {claims.stats.map((stat, index) => (
            <Col md={4} key={index}>
              <Card className="claims-stat-card">
                <div className="stat-icon">
                  {stat.icon === "check" && "✔"}
                  {stat.icon === "rupee" && "₹"}
                  {stat.icon === "users" && "👥"}
                </div>
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Tables */}
      <Container className="claims-tables">
        {loading ? (
          <div className="text-center py-5">Loading claims data...</div>
        ) : (
          <>
            <ClaimsTable
              title="CLAIMS - STATE WISE"
              data={stateWiseClaims}
              years={years}
            />
            <ClaimsTable
              title="CLAIMS - DESIGNATION WISE"
              data={designationWiseClaims}
              years={years}
            />
          </>
        )}
      </Container>
    </>
  );
};

export default Claims;