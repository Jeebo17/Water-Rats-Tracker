// Lightweight Capacitor push bridge — import and call `initCapacitorPush()` from your app entry when running as a native app.

type AnyWindow = Window & { Capacitor?: any };

export async function initCapacitorPush() {
  const w = window as AnyWindow;
  if (!w.Capacitor) {
    // Not running inside Capacitor/native shell — nothing to do.
    return;
  }

  try {
    const Capacitor = w.Capacitor;
    // Prefer plugin access from the global bridge to avoid hard dependency in web builds
    const PushNotifications = Capacitor.Plugins?.PushNotifications;
    if (!PushNotifications) {
      console.warn('Capacitor PushNotifications plugin not available');
      return;
    }

    // Request permission and register
    const perm = await PushNotifications.requestPermissions();
    if (perm.receive === 'granted') {
      await PushNotifications.register();
    } else {
      console.warn('Push permission not granted', perm);
    }

    // Listeners
    PushNotifications.addListener('registration', (token: any) => {
      console.log('Push registration token:', token);
      // TODO: send this token to your server to target this device
    });

    PushNotifications.addListener('registrationError', (err: any) => {
      console.error('Push registration error', err);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification: any) => {
      console.log('Push received', notification);
      window.dispatchEvent(new CustomEvent('capacitor-push', { detail: notification }));
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action: any) => {
      console.log('Push action performed', action);
      window.dispatchEvent(new CustomEvent('capacitor-push-action', { detail: action }));
    });

  } catch (e) {
    console.warn('initCapacitorPush error', e);
  }
}
