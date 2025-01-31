const express = require('express');
const webPush = require('web-push');

// Create router
const router = express.Router();

// VAPID keys
const VAPID_PUBLIC_KEY = 'BFgSzKMBbhbKLiZY4P6aNW2KT4WzRlEjMRSjCtevphRIdjVZ-dZfQYXkSocNcN2U748asU1l6zAH8c97jSdKthY';
const VAPID_PRIVATE_KEY = 'DcZNY1BTXtcFjHGgur0kHN2UaemAC37lkpUlHHzNTVI';

webPush.setVapidDetails(
    'mailto:uspupils@gmail.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
);

// Store subscriptions (In production, use a database)
const subscriptions = [];

// Route to save subscription
router.post('/subscribe', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({ message: 'Subscription saved successfully!' });
});

// Route to send notifications
router.post('/send', async (req, res) => {
    const payload = JSON.stringify(req.body);

    const notificationPromises = subscriptions.map(sub =>
        webPush.sendNotification(sub, payload).catch(err => console.error(err))
    );

    try {
        await Promise.all(notificationPromises);
        res.status(200).json({ message: 'Notifications sent successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending notifications', error });
    }
});

module.exports = router;
