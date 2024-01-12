import UserStore from './UserStore';
import AppointmentStore from './AppointmentStore';
import NotificationStore from './NotificationStore';

class RootStore {
    userStore;
    appointmentStore;
    notificationStore;

    constructor() {
        this.userStore = new UserStore(this);
        this.appointmentStore = new AppointmentStore(this);
        this.notificationStore = new NotificationStore(this);
    }
}

export const rootStore = new RootStore();