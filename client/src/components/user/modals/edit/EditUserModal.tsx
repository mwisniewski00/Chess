import "./EditUserModal.scss";
import IUserModalProps from "../IUserModalProps";
import { Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import { CustomInput } from "components/shared/custom-input/CustomInput";
import { Form, Formik } from "formik";
import axios from "api/axios";
import useAuth from "hooks/useAuth";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import DescriptionIcon from '@mui/icons-material/Description';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import IUser from "models/IUser";
import { Messages } from "components/user/registration/Registration";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import editUserSchema from "./validation-schema/validation";

export type Status = "idle" | "pending" | "resolved" | "rejected";

interface IUserModalEdit extends IUserModalProps {
  userData: IUser
}

export const EditUserModal: React.FC<IUserModalEdit> = ({
  isOpen,
  setIsOpen,
  userData
}) => {
  const axiosPrivate = useAxiosPrivate();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<Messages>({
    pending: "",
    resolved: "",
    rejected: "",
  });

  const handleClose = () => {
    setIsOpen(false);
    window.location.reload();
  };

  const handleSubmit = async (user: IUser) => {
    setMessage({ ...message, pending: "Please wait..." });
    setStatus("pending");
    try {
      const response = await axiosPrivate.put("/users/profile", user);
      setMessage({ ...message, resolved: "Registration successful!" });
      setStatus("resolved");
      handleClose();
    } catch (error) {
      console.error(error);
      setMessage({ ...message, rejected: "Something went wrong..." });
      setStatus("rejected");
    }
  };

  return (
    <Dialog
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          padding: 0,
          margin: 0,
        },
      }}
      className="dialog"
      open={isOpen}
      onClose={handleClose}
    >
      <DialogContent className="dialog-content">
        <div>
          <Formik
            initialValues={userData}
            onSubmit={(user: IUser) => handleSubmit(user)}
            validationSchema={editUserSchema}
          >
            {formik => (
              <Form className="form">
                <div className="inputs">
                  <CustomInput
                    icon={PersonIcon}
                    type="text"
                    name="username"
                    placeholder="Username"
                  />
                  <CustomInput
                    icon={DescriptionIcon}
                    type="text"
                    name="description"
                    placeholder="Description"
                  />
                  <CustomInput
                    icon={InsertPhotoIcon}
                    type="url"
                    name="avatarUrl"
                    placeholder="Avatar URL"
                  />
                </div>
                <button
                  disabled={
                    !(formik.isValid && formik.dirty) || formik.isSubmitting
                  }
                  type="submit"
                >
                  Edit
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
