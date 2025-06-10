const Subcribe = require("../Models/SubcribeModel");
const { transporter } = require("../utils/Nodemailer");

exports.createSubscription = async (req, res) => {
  console.log(req.body);
  const { subscribeEmail } = req.body;

  if (!subscribeEmail) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    // Save subscription to the database
    const newSubscription = new Subcribe({ subscribeEmail });
    await newSubscription.save();

    // Email content for the admin
    const mailOptions = {
      from: "goelmewewale@gmail.com",
      to: "goelmewewale@gmail.com",
      subject: "New Subscription Notification",
      html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <img src="https://res.cloudinary.com/dfet60ou1/image/upload/v1749555059/c968b8f6-0f81-4b71-afc8-77cbb3c3ff54_f3zekt.jpg" alt="Goel Mewe Wale Logo" style="width: 150px; margin-bottom: 20px;">
            <h2>New Subscription Received!</h2>
            <p>Dear Admin,</p>
            <p>A new user has subscribed to Goel Mewe Wale updates using the following email:</p>
            <p><strong>Email:</strong> ${subscribeEmail}</p>
            <p>Regards,</p>
            <p><strong>Goel Mewe Wale Team</strong></p>
          </div>
        `,
    };

    // Send email to admin
    await transporter.sendMail(mailOptions);

    // Respond to the user
    res.status(201).json({
      message: "Subscription created successfully. Admin has been notified.",
      data: newSubscription,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the subscription." });
  }
};
