// ── Primitives ──────────────────────────────────────────

export interface DashboardOverview {
  totalMembers: number;
  totalMembersGrowth: number;
  activeContributions: number;
  activeContributionsGrowth: number;
  totalClaims: number;
  totalClaimsGrowth: number;
  collectionLakhs: number;
  collectionGrowth: number;
}

export interface MonthlyContributionVsClaims {
  month: string;
  contributions: number;
  claims: number;
}

export interface ClaimTypeDistribution {
  deathClaims: number;
  medicalClaims: number;
  refundClaims: number;
  others: number;
}

export interface StateWiseMembership {
  stateName: string;
  memberCount: number;
}

export interface TopPerformingState {
  abbreviation: string;
  stateName: string;
  performancePercent: number;
}

export type RecentActivityType = "claim" | "member";

export interface RecentActivity {
  title: string;
  description: string;
  timeAgo: string;
  type: RecentActivityType;
}

export interface MonthlyFinancialComparison {
  month: string;
  income: number;
  expense: number;
}

export interface ContributionTrend {
  month: string;
  amount: number;
}

// ── Combined (GET_ALL response) ──────────────────────────

export interface DashboardData {
  overview: DashboardOverview;
  monthlyContributionVsClaims: MonthlyContributionVsClaims[];
  claimTypeDistribution: ClaimTypeDistribution;
  stateWiseMembership: StateWiseMembership[];
  topPerformingStates: TopPerformingState[];
  recentActivities: RecentActivity[];
  monthlyFinancialComparison: MonthlyFinancialComparison[];
  contributionTrends: ContributionTrend[];
}

// ── Per-endpoint response wrappers ───────────────────────
// Matches your API pattern: { value: T }

export interface ApiResponse<T> {
  value: T;
}

export type OverviewResponse                  = ApiResponse<DashboardOverview>;
export type MonthlyContributionResponse       = ApiResponse<MonthlyContributionVsClaims[]>;
export type ClaimTypeResponse                 = ApiResponse<ClaimTypeDistribution>;
export type StateWiseMembershipResponse       = ApiResponse<StateWiseMembership[]>;
export type TopPerformingStatesResponse       = ApiResponse<TopPerformingState[]>;
export type RecentActivitiesResponse          = ApiResponse<RecentActivity[]>;
export type MonthlyFinancialResponse          = ApiResponse<MonthlyFinancialComparison[]>;
export type ContributionTrendsResponse        = ApiResponse<ContributionTrend[]>;
export type DashboardAllResponse              = ApiResponse<DashboardData>;