import "./EditUserModal.scss";
import IUserModalProps from "../IUserModalProps"

export const EditUserModal: React.FC<IUserModalProps> = ({ isOpen, setIsOpen }) => {
 
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
        <h1>Edit User Modal</h1>
    </div>
  );
};

export default EditUserModal