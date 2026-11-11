/* Ajustes específicos cuando Raíz corre dentro del APK de Android/Capacitor. */
(function () {
  const cap = window.Capacitor;
  if (!cap) return;

  const App = cap.Plugins && cap.Plugins.App;
  if (!App || typeof App.addListener !== 'function') return;

  App.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back();
    } else if (typeof App.exitApp === 'function') {
      App.exitApp();
    }
  });
})();
