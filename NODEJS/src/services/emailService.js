require('dotenv').config();
import nodemailer from "nodemailer";

// Send a simple email
const sendSimpleEmail = async (dataSend) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use STARTTLS
            auth: {
                user: process.env.EMAIL_APP,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false, // Bypass TLS certificate errors
            },
                logger: true,
                debug: true,
        });

        const info = await transporter.sendMail({
            from: `"Davux 👻" <vhieu5431@gmail.com>`,
            to: dataSend.receiverEmail,
            subject: "Thông tin đặt lịch khám bệnh ✔",
            html: getBodyHTMLEmail(dataSend),
        });

        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};


// Generate HTML body for email
const getBodyHTMLEmail = (dataSend) => {
    if (dataSend.language === "vi") {
        return `
            <h3>Xin chào ${dataSend.patientName}!</h3>
            <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên website HealthyCare.</p>
            <p>Thông tin đặt lịch khám bệnh:</p>
            <div><b>Thời gian: ${dataSend.time}</b></div>
            <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
            <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để hoàn tất thủ tục đặt lịch khám bệnh.</p>
            <div><a href="${dataSend.redirectLink}" target="_blank">Click here!</a></div>
            <div>Xin chân thành cảm ơn!</div>
        `;
    } else if (dataSend.language === "en") {
        return `
            <h3>Hello ${dataSend.patientName}!</h3>
            <p>You received this email because you booked an online medical appointment on the HealthyCare website.</p>
            <p>Information for scheduling medical examination:</p>
            <div><b>Time: ${dataSend.time}</b></div>
            <div><b>Doctor: ${dataSend.doctorName}</b></div>
            <p>If the above information is true, please click on the link below to complete the medical examination appointment procedure.</p>
            <div><a href="${dataSend.redirectLink}" target="_blank">Click here!</a></div>
            <div>Sincerely thank!</div>
        `;
    }
    return "";
};

// Send email with attachment
const sendAttachment = async (dataSend) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use STARTTLS
            auth: {
                user: process.env.EMAIL_APP,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false, // Bypass TLS certificate errors
            },
                logger: true,
                debug: true,
        });

        const fileName = `remedy-${dataSend.patientId}-${Date.now()}.jpg`;
        const contentImg = dataSend.imageBase64.split("base64,")[1];

        const info = await transporter.sendMail({
            from: `"Davux 👻" <vhieu5431@gmail.com>`,
            to: dataSend.email,
            subject: "Kết quả đặt lịch khám bệnh ✔",
            html: getBodyHTMLEmailRemedy(dataSend),
            attachments: [
                {
                    filename: fileName,
                    content: contentImg,
                    encoding: "base64",
                },
            ],
        });

        console.log("Message sent with attachment: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email with attachment:", error);
        throw error;
    }
};


// Generate HTML body for email with attachment
const getBodyHTMLEmailRemedy = (dataSend) => {
    if (dataSend.language === "vi") {
        return `
            <h3>Xin chào ${dataSend.patientName}!</h3>
            <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên website Healthy Care thành công.</p>
            <p>Thông tin khám bệnh/hóa đơn được gửi trong file đính kèm.</p>
            <div>Xin chân thành cảm ơn!</div>
        `;
    } else if (dataSend.language === "en") {
        return `
            <h3>Hello ${dataSend.patientName}!</h3>
            <p>You are receiving this email because you have successfully booked an online medical appointment on the Healthy Care website.</p>
            <p>Medical examination/invoice information is sent in the attached file.</p>
            <div>Sincerely thank!</div>
        `;
    }
    return "";
};

module.exports = {
    sendSimpleEmail,
    getBodyHTMLEmail,
    sendAttachment,
    getBodyHTMLEmailRemedy,
};
