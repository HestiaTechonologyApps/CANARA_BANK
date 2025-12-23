import type { Field } from "../../../../Components/KiduCreateModal";
import KiduCreateModal from "../../../../Components/KiduCreateModal";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import type { Category } from "../../../Types/Settings/Category.types";

interface CategoryCreateModalProps {
  show: boolean;
  handleClose: () => void;
  onAdded: (newCategory: Category) => void;
}

const CategoryCreateModal: React.FC<CategoryCreateModalProps> = ({
  show,
  handleClose,
  onAdded
}) => {
  const fields: Field[] = [
    {
      name: "name",
      label: "Category Name",
      type: "text",
      required: true,
      minLength: 2,
      maxLength: 100
    },
    {
      name: "abbreviation",
      label: "Abbreviation",
      type: "text",
      required: true,
      minLength: 1,
      maxLength: 10
    }
  ];

  return (
    <KiduCreateModal<Category>
      show={show}
      handleClose={handleClose}
      title="Add New Category"
      fields={fields}
      endpoint={API_ENDPOINTS.CATEGORY.CREATE}
      onCreated={onAdded}
    />
  );
};

export default CategoryCreateModal;