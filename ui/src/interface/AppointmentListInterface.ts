export default interface AppointmentListInterface {
  appointments: {
    id: number;
    roomId?: number,
    date: string;
    name: string;
    egn: string;
    details: string;
  }[];
}
