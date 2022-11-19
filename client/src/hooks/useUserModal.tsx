import UserModalContext from "context/UserModalProvider";
import { useContext } from "react";

const useUserModal = () => {
  return useContext(UserModalContext);
};

export default useUserModal;
