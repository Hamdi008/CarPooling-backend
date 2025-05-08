const client = require('../config/twilioClient');
const { redisClient } = require('../config/redisClient');

// Send PIN
exports.sendVerificationPin = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) return res.status(400).json({ message: "Phone number is required" });

  const pin = Math.floor(100000 + Math.random() * 900000); // 6-digit

  try {
    // Send SMS
    await client.messages.create({
      body: `Your verification PIN is ${pin}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    // Store in Redis for 5 minutes
    await redisClient.set(`pin:${phoneNumber}`, pin, { EX: 300 });

    res.json({ message: 'PIN sent' });
  } catch (err) {
    console.error("Failed to send SMS:", err);
    res.status(500).json({ message: 'Failed to send PIN' });
  }
};

// Verify PIN
exports.verifyPin = async (req, res) => {
  const { phoneNumber, pin } = req.body;

  if (!phoneNumber || !pin) return res.status(400).json({ message: "Phone number and PIN required" });

  try {
    const storedPin = await redisClient.get(`pin:${phoneNumber}`);

    if (storedPin === pin) {
      await redisClient.del(`pin:${phoneNumber}`); // Optional: remove PIN
      return res.json({ message: 'Verification successful' });
    }

    res.status(400).json({ message: 'Invalid or expired PIN' });
  } catch (err) {
    console.error('PIN verification failed:', err);
    res.status(500).json({ message: 'Verification error' });
  }
};
