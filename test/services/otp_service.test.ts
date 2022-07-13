import "mocha";
import * as express from "express";
import * as chai from "chai";
import * as sinon from "sinon";

import { OtpService } from "../../src/services/otpService";
import { OTP_DATA } from "../../src/constants/db.constants";
import { expect } from "chai";

const myObj = new OtpService();

describe("Otp Service - Test", () => {
  let email: string, otp: number, expiresIn: number;
  beforeEach(() => {
    email = "";
    otp = 0;
    expiresIn = 0;
  });
  afterEach(() => {
    sinon.restore();
  });
  it("Must successfully find Otp", (done) => {
    const stub = sinon.stub(OTP_DATA, "findOneBy").resolves(null);
    myObj
      .findOtp(otp)
      .then((res) => {
        expect(res).to.be.null;
        expect(stub.calledOnce).to.be.true;
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
  it("Must Clear Otp data", (done) => {
    const result = sinon.stub(OTP_DATA, "findOneBy").resolves({
      id: 0,
      email: "",
      otp: 0,
      expiresIn: 0,
    });
    const stub = sinon.stub(OTP_DATA, "remove").resolves({
      id: 0,
      email: "",
      otp: 0,
      expiresIn: 0,
    });
    myObj
      .clearOtpData(email)
      .then((res) => {
        expect(res).to.be.an("object");
        expect(stub.calledOnce).to.be.true;
        expect(stub.calledWith(res)).to.be.true;
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
