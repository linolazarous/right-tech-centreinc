const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert(require('./firebase-service-account.json')),
});

exports.sendNotification = async (userId, message) => {
    const user = await User.findById(userId);
    const token = user.fcmToken;
    await admin.messaging().send({
        token: token,
        notification: {
            title: 'Right Tech Centre',
            body: message,
        },
    });
};