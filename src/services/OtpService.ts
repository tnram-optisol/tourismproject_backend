import { OTP, OTP_DATA } from "../constants/db.constants";

export class OtpService {
  createNewOTP = async (email: string, otp: number, expiresIn: number) => {
    const newOtpData = OTP;
    newOtpData.email = email;
    newOtpData.expiresIn = expiresIn;
    newOtpData.otp = otp;
    const response = await OTP_DATA.save(newOtpData);
    return response;
  };

  findOtp = async (otp: number) => {
    const date = new Date();
    const currentTime = date.getTime();
    const response = await OTP_DATA.findOneBy({
      otp: otp,
    });
    if (response) {
      if (response.expiresIn > currentTime) {
        return response;
      }
    }
    return null;
  };

  clearOtpData = async (email: string) => {
    const response = await OTP_DATA.findOneBy({
      email: email,
    });
    if (response) {
      const deleteOtp = await OTP_DATA.remove(response);
      return deleteOtp;
    }
  };
}
