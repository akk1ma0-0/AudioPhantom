import { t } from '../i18n';

export function App() {
  return (
    <main style={{ fontFamily: 'system-ui', padding: 12 }}>
      <h1 style={{ fontSize: 16 }}>{t('app.title')}</h1>
      <p>{t('panel.placeholder')}</p>
    </main>
  );
}
