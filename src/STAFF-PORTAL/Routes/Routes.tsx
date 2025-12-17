import { Routes, Route } from "react-router-dom";
import StaffLayout from "../Layout/Layout";
import Profile from "../Pages/Profile";
import UpdateNominee from "../Pages/UpdateNominee";
import DirectContribution from "../Pages/DirectContribution";
import ShowContribution from "../Pages/ShowContribution";
import AccountSettings from "../Pages/AccountSetting";


const StaffRoutes = () => (
  <Routes>
    <Route path="/" element={<StaffLayout />}>
      <Route index element={<Profile />} />
      <Route path="nominee" element={<UpdateNominee />} />
      <Route path="contribution" element={<DirectContribution />} />
      <Route path="settings" element={<AccountSettings />} />
      <Route path="history" element={<ShowContribution />} />
    </Route>
  </Routes>
);

export default StaffRoutes;
