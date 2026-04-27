import React from "react";
import { Button } from "react-bootstrap";

interface Props {
  initialValues: any;
  setFormData: (data: any) => void;
  setErrors?: (errors: any) => void;
  onReset?: () => void;
}

const KiduReset: React.FC<Props> = ({ initialValues, setFormData, setErrors, onReset }) => {
  const handleReset = () => {
    setFormData(initialValues);
    if (setErrors) setErrors({});
    if (onReset) onReset(); 
  };

  return (
    <Button variant="outline-warning" onClick={handleReset}>
      Reset
    </Button>
  );
};

export default KiduReset;
