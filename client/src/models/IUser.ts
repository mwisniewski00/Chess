interface IUser {
    username: string;
    email: string;
    description: string;
    avatarUrl: string;
    registrationDate: Date;
    lastLoginDate: Date
}

export default IUser;
