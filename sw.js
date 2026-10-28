
self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {
      title: "Borby",
      body: event.data ? event.data.text() : "У тебя новое уведомление"
    };
  }

  const title = data.title || "Borby";
  const options = {
    body: data.body || "У тебя новое сообщение",
    icon: "/Borby/icon-192.png",
    badge: "/Borby/icon-192.png",
    data: {
      url: data.url || "/Borby/"
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const target = new URL(
    event.notification.data?.url || "/Borby/",
    self.location.origin
  ).href;

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then((windows) => {
      for (const windowClient of windows) {
        if (windowClient.url.startsWith(self.location.origin + "/Borby/")) {
          return windowClient.focus();
        }
      }

      return clients.openWindow(target);
    })
  );
});
