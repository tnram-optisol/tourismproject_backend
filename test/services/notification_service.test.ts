import "mocha";
import * as express from "express";
import * as chai from "chai";
import * as sinon from "sinon";

import { NotificationService } from "../../src/services/notificationService";
import { ADMIN_NOTIFICATION_DATA } from "../../src/constants/db.constants";
import { assert } from "console";
import { expect } from "chai";

const myObj = new NotificationService();

describe("Notification Service - Test", () => {
  let email: string, otp: number, expiresIn: number;
  beforeEach(() => {
    email = "";
    otp = 0;
    expiresIn = 0;
  });
  afterEach(() => {
    sinon.restore();
  });
  it("Must get all Notifications data", (done) => {
    const spy = sinon.spy(ADMIN_NOTIFICATION_DATA, "find");
    myObj.getAllNotification();
    expect(spy.calledOnce).to.be.true;
    done();
  });
});
