import './Registration.scss';
import { RegistrationForm } from './form/RegistrationForm';

export const Registration: React.FC = () => {
        return <div className="registration">
            <div className="registration__top-section">
                <div className="registration__title">Join now!</div>
                <div className="registration__subtitle">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolores excepturi, exercitationem ipsum ipsa itaque, nisi quasi.</div>
            </div>
            <RegistrationForm />
        </div>;
}