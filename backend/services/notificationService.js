const { sendEmail } = require('./emailService');

const notifyRanger = async (ranger, alert) => {
  if (ranger.email) {
    await sendEmail(
      ranger.email,
      `New Alert: ${alert.title}`,
      `<p>Zone: ${alert.zone}</p><p>Severity: ${alert.severity}</p><p>Please respond immediately.</p>`
    );
  }
  console.log(`Notified ranger ${ranger.name} about alert ${alert._id}`);
};

module.exports = { notifyRanger };
