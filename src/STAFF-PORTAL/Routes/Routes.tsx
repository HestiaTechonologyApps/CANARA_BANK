import { Routes, Route } from "react-router-dom";
import StaffLayout from "../Layout/Layout";


const StaffRoutes = () => (
  <Routes>
    <Route path="/staff" element={<StaffLayout />}>
      {/* <Route path="profile" element={<Profile />} />
      <Route path="nominee" element={<UpdateNominee />} />
      <Route path="contribution" element={<DirectContribution />} />
      <Route path="settings" element={<AccountSettings />} />
      <Route path="history" element={<ContributionHistory />} /> */}
    </Route>
  </Routes>
);

export default StaffRoutes;
