import {
  ADMIN_NOTIFICATION,
  ADMIN_NOTIFICATION_DATA,
} from "../constants/db.constants";

export class NotificationService {
  createNewNotification = async (message: string, type: string) => {
    const newNotification = ADMIN_NOTIFICATION;
    newNotification.notification = message;
    newNotification.type = type;
    const result = await ADMIN_NOTIFICATION_DATA.save(newNotification);
    return result;
  };

  getAllNotification = async () => {
    const result = await ADMIN_NOTIFICATION_DATA.find();
    return result;
  };

  discardNotification = async (id: number) => {
    const notificationExist = await ADMIN_NOTIFICATION_DATA.findOneBy({
      id: id,
    });
    if (notificationExist) {
      const result = await ADMIN_NOTIFICATION_DATA.remove(notificationExist);
      return result;
    }
    return null;
  };
}
