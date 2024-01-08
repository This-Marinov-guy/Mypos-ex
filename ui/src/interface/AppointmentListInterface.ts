export default interface AppointmentListInterface {
  appointments: {
    id: number;
    date: string;
    name: string;
    egn: string;
    details: string;
  }[];
}
