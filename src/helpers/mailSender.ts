import nodemailer from 'nodemailer';


const mailSender = async (email:string, title: string , body:string) => {
    try {
        let transporter = nodemailer.createTransport({
            // user ethereal here for testing
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        let info = await transporter.sendMail({
            from: "www.OpenFeedback.com - Open Feedback",
            to: email,
            subject: title,
            html: body,
        });

        return info;

    } catch (error) {
        console.error("Error sending email", error);
    }
}

export { mailSender }