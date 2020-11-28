const webPush = require('web-push');
const vapidKeys = {
  "publicKey": "BOh1Jbc3PhLm7dhST0Rnutad0hiFtnuaLCte9qD1KtgpZkuNS8N_WHUkQDTp31jm8kqgIBbRRH3fvVToD9ofAeA",
  "privateKey": "n39Cp4_N2QxYemz1b3gZdCPQ-r8GImHh6xONuqBLjAE"
};
 
webPush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

const pushSubscription = {
  "endpoint": "https://fcm.googleapis.com/fcm/send/dZqMzyxzeWU:APA91bExf7ecCnyLm-wgEy8fRuLa2j1Wc7plS13qwV4Z888gDGV3NzM-Oh-_g4wd0p-KIINFGLk9HAd6b866NqbbPf70OkcNG4l3IPnLleRzS9B7YnjwgUnRZHJtNQhHy0TtBazJK5fV",
  "keys": {
    "p256dh": "BEZInb3iSSIMLclDersXzYx0I/cfcxYKIyX99xlGjHgp22N5UNByoh/tpf0qYPomLen/oMfRJxTd6aLXZdlXB/Y=",
    "auth": "AmStd7o6BTw07/vpEheYbg=="
  }
};

const payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
const options = {
  gcmAPIKey: '85172471843',
  TTL: 60
};

webPush.sendNotification(
  pushSubscription,
  payload,
  options
);