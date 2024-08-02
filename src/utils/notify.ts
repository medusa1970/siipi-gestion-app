import { Notify } from "quasar";
import NotificacionMP3 from "@/assets/mp3/notificacion.mp3";

const sonido = new Audio(NotificacionMP3);
// const playSonido = () => {
//   sonido.play();
//   setTimeout(() => {
//     sonido.pause();
//   }, 3000);
// };

export const NotifySucess = (message: string) =>
  Notify.create({ message, color: "positive", icon: "check" });

export const NotifyError = (message: string) =>
  Notify.create({ message, color: "negative", icon: "report_problem" });

export const NotifyWarning = (message: string) =>
  Notify.create({
    message,
    color: "orange",
    icon: "warning",
    position: "center",
    progress: true,
    timeout: 1500,
  });

export const NotifySucessCenter = (message: string) => {
  sonido.play();
  return Notify.create({
    message,
    color: "positive",
    icon: "check",
    position: "center",
    progress: true,
    timeout: 1000,
  });
};
