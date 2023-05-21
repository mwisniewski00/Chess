import "./EditDescriptionModal.scss";
import { Dialog, DialogContent } from "@mui/material";
import { TextareaInput } from "components/shared/textarea-input/TextareaInput";
import { Form, Formik } from "formik";
import DescriptionIcon from "@mui/icons-material/Description";
import IUser from "models/IUser";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import editUserSchema from "../../validation-schema/validation";

export const EditDescriptionModal = ({ isOpen, setIsOpen, userData }) => {
  const axiosPrivate = useAxiosPrivate();

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (user: IUser) => {
    await axiosPrivate.put("/users/profile", user).then(() => {
      handleClose();
    });
  };

  return (
    <Dialog
      PaperProps={{
        style: {
          backgroundColor: "rgb(25, 25, 25)",
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
