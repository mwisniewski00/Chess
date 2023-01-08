import "./EditDescriptionModal.scss";
import IUserModalProps from "../../../../../models/IUserModalProps";
import { Dialog, DialogContent } from "@mui/material";
import { TextareaInput } from "components/shared/textarea-input/TextareaInput";
import { Form, Formik } from "formik";
import DescriptionIcon from "@mui/icons-material/Description";
import IUser from "models/IUser";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import editUserSchema from "../../validation-schema/validation";

interface IUserModalEdit extends IUserModalProps {
  userData: IUser;
}

export const EditDescriptionModal: React.FC<IUserModalEdit> = ({
  isOpen,
  setIsOpen,
  userData,
}) => {
  const axiosPrivate = useAxiosPrivate();

  const handleClose = () => {
    setIsOpen(false);
    window.location.reload();
  };

  const handleSubmit = async (user: IUser) => {
    try {
      await axiosPrivate.put("/users/profile", user);
      handleClose();
    } catch (error) {
      console.error(error);
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
                  <TextareaInput
                    icon={DescriptionIcon}
                    name="description"
                    placeholder="Description"
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

export default EditDescriptionModal;
