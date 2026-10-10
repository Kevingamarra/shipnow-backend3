import nodemailer from "nodemailer";
import env from "../config/env.config.js";

const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: Number(env.MAIL_PORT),
  secure: false,
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS
  }
});

export const sendTicketEmail = async (
  to,
  event,
  reservationCode
) => {
  await transporter.sendMail({
    from: env.MAIL_FROM,
    to,
    subject: "Inscripción confirmada",
    html: `
      <h2>Inscripción confirmada</h2>

      <p>Tu inscripción fue registrada correctamente.</p>

      <p><strong>Evento:</strong> ${event.title}</p>

      <p><strong>Fecha:</strong> ${event.date}</p>

      <p><strong>Lugar:</strong> ${event.location}</p>

      <p><strong>Código de reserva:</strong> ${reservationCode}</p>
    `
  });
};
