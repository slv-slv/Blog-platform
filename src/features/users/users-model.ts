import mongoose, { Schema } from 'mongoose';
import { CONFIRMATION_STATUS, ConfirmationInfo, PasswordRecoveryInfo, UserDbType } from './users-types.js';
import { SETTINGS } from '../../settings.js';

const confirmationInfoSchema = new Schema<ConfirmationInfo>({
  status: { type: String, enum: Object.values(CONFIRMATION_STATUS), required: true },
  code: { type: String, default: null },
  expiration: { type: String, default: null },
});

const passwordRecoveryInfoSchema = new Schema<PasswordRecoveryInfo>({
  code: { type: String, default: null },
  expiration: { type: String, default: null },
});

const userSchema = new Schema<UserDbType>(
  {
    login: { type: String, required: true },
    email: { type: String, required: true },
    hash: { type: String, required: true },
    createdAt: { type: String, required: true },
    confirmation: { type: confirmationInfoSchema, required: true },
    passwordRecovery: { type: passwordRecoveryInfoSchema, required: true },
  },
  { versionKey: false },
);

export const UserModel = mongoose.model(SETTINGS.DB_COLLECTIONS.USERS, userSchema);
