// import React, { useState } from "react"; 
// import type { Field } from "../../Components/KiduCreate"; 
// import type { Circle } from "../../Types/Settings/Circle.types"; 
// import CircleService from "../../Services/Settings/Circle.services"; 
// import KiduCreate from "../../Components/KiduCreate"; 
// import type { State } from "../../Types/Settings/States.types"; 
// import StatePopup from "../Settings/State/StatePopup"; 
 
// const CircleCreate: React.FC = () => { 
//   const [showStatePopup, setShowStatePopup] = useState(false); 
//   const [selectedState, setSelectedState] = useState<State | null>(null);
//   const [dateFrom, setDateFrom] = useState<string>("");
 
// const handleReset = () => {
//     setSelectedState(null);
//     setDateFrom("");
//   };

//   const fields: Field[] = [ 
//     { name: "circleCode", rules: { type: "number", label: "Circle Code", required: true, colWidth: 4 } }, 
//     { name: "name", rules: { type: "text", label: "Circle Name", required: true, minLength: 2, maxLength: 100, colWidth: 4, pattern: /^[a-zA-Z\s\-\/]+$/ } }, 
//     { name: "abbreviation", rules: { type: "text", label: "Abbreviation", required: true, minLength: 1, maxLength: 100, colWidth: 4, pattern: /^[a-zA-Z\s\-\/]+$/ } }, 
//     { name: "stateId", rules: { type: "popup", label: "State", required: true, colWidth: 4 } }, 
//    // { name: "dateFrom", rules: { type: "date", label: "Date From", required: true, colWidth: 4 } }, 
//    // { name: "dateTo", rules: { type: "date", label: "Date To", required: true, colWidth: 4, min: dateFrom || undefined } }, 
//     { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 12 } }, 
//   ]; 
 
//   const handleSubmit = async (formData: Record<string, any>) => { 
//     if (!/^[a-zA-Z\s\-\/]+$/.test(formData.name.trim())) { 
//       throw new Error("Circle Name must contain only letters, hyphens or slashes"); 
//     } 

//     if (!/^[a-zA-Z\s\-\/]+$/.test(formData.abbreviation.trim())) { 
//       throw new Error("Abbreviation must contain only letters, hyphens or slashes"); 
//     } 

//     if (!selectedState) { 
//       throw new Error("Please select a state"); 
//     } 

//     if (formData.dateFrom && formData.dateTo && new Date(formData.dateTo) < new Date(formData.dateFrom)) {
//       throw new Error("Date To cannot be before Date From");
//     }
 
//     const payload: Omit<Circle, "circleId" | "auditLogs"> = { 
//       circleCode: Number(formData.circleCode), 
//       name: formData.name.trim(), 
//       abbreviation: formData.abbreviation.trim(), 
//       stateId: selectedState.stateId, 
//       stateName: selectedState.name, 
//       dateFrom: formData.dateFrom, 
//       dateFromString: "", 
//       dateTo: formData.dateTo, 
//       dateToString: "", 
//       isActive: Boolean(formData.isActive), 
//     }; 
 
//     await CircleService.createCircle(payload); 
//   }; 
 
//   const popupHandlers = { 
//     stateId: { 
//       value: selectedState?.name || "", 
//       actualValue: selectedState?.stateId, 
//       onOpen: () => setShowStatePopup(true), 
//     }, 
//   };

//   const fieldChangeHandlers = {
//     dateFrom: (value: string) => setDateFrom(value),
//   };
 
//   return ( 
//     <> 
//       <KiduCreate 
//         title="Create Circle" 
//         fields={fields} 
//         onSubmit={handleSubmit} 
//         submitButtonText="Create Circle" 
//         showResetButton 
//         successMessage="Circle created successfully!" 
//         errorMessage="Failed to create circle.Please try again." 
//         navigateOnSuccess="/dashboard/settings/circle-list" 
//         popupHandlers={popupHandlers}
//         fieldChangeHandlers={fieldChangeHandlers}
//         themeColor="#1B3763" 
//         onReset={handleReset}
//       /> 
//       <StatePopup 
//         show={showStatePopup} 
//         handleClose={() => setShowStatePopup(false)} 
//         onSelect={setSelectedState} 
//       /> 
//     </> 
//   ); 
// }; 
 
// export default CircleCreate;
import React, { useState } from "react"; 
import type { Field } from "../../Components/KiduCreate"; 
import type { Circle } from "../../Types/Settings/Circle.types"; 
import CircleService from "../../Services/Settings/Circle.services"; 
import KiduCreate from "../../Components/KiduCreate"; 
import type { State } from "../../Types/Settings/States.types"; 
import StatePopup from "../Settings/State/StatePopup"; 
 
const CircleCreate: React.FC = () => { 
  const [showStatePopup, setShowStatePopup] = useState(false); 
  const [selectedState, setSelectedState] = useState<State | null>(null);
 
const handleReset = () => {
    setSelectedState(null);
  };

  const fields: Field[] = [ 
    { name: "circleCode", rules: { type: "number", label: "Circle Code", required: true, colWidth: 4 } }, 
    { name: "name", rules: { type: "text", label: "Circle Name", required: true, minLength: 2, maxLength: 100, colWidth: 4, pattern: /^[a-zA-Z\s\-\/]+$/ } }, 
    { name: "abbreviation", rules: { type: "text", label: "Abbreviation", required: true, minLength: 1, maxLength: 100, colWidth: 4, pattern: /^[a-zA-Z\s\-\/]+$/ } }, 
    { name: "stateId", rules: { type: "popup", label: "State", required: true, colWidth: 4 } }, 
    { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 12 } }, 
  ]; 
 
  const handleSubmit = async (formData: Record<string, any>) => { 
    if (!/^[a-zA-Z\s\-\/]+$/.test(formData.name.trim())) { 
      throw new Error("Circle Name must contain only letters, hyphens or slashes"); 
    } 

    if (!/^[a-zA-Z\s\-\/]+$/.test(formData.abbreviation.trim())) { 
      throw new Error("Abbreviation must contain only letters, hyphens or slashes"); 
    } 

    if (!selectedState) { 
      throw new Error("Please select a state"); 
    } 
 
    const payload: Omit<Circle, "circleId" | "auditLogs"> = { 
      circleCode: Number(formData.circleCode), 
      name: formData.name.trim(), 
      abbreviation: formData.abbreviation.trim(), 
      stateId: selectedState.stateId, 
      stateName: selectedState.name, 
      isActive: Boolean(formData.isActive), 
    }; 
 
    await CircleService.createCircle(payload); 
  }; 
 
  const popupHandlers = { 
    stateId: { 
      value: selectedState?.name || "", 
      actualValue: selectedState?.stateId, 
      onOpen: () => setShowStatePopup(true), 
    }, 
  };
 
  return ( 
    <> 
      <KiduCreate 
        title="Create Circle" 
        fields={fields} 
        onSubmit={handleSubmit} 
        submitButtonText="Create Circle" 
        showResetButton 
        successMessage="Circle created successfully!" 
        errorMessage="Failed to create circle.Please try again." 
        navigateOnSuccess="/dashboard/settings/circle-list" 
        popupHandlers={popupHandlers}
        themeColor="#1B3763" 
        onReset={handleReset}
      /> 
      <StatePopup 
        show={showStatePopup} 
        handleClose={() => setShowStatePopup(false)} 
        onSelect={setSelectedState} 
      /> 
    </> 
  ); 
}; 
 
export default CircleCreate;