# Open questions, risks, assumptions

> Section 15 of [PLAN.md](PLAN.md) plus questions raised during implementation. Add new questions here instead of inventing decisions; mark interim choices "⚠ assumption".

## 15. Риски и открытые вопросы (⚠ проверить)

1. Качество Whisper на русском/румынском и смешанной речи.
2. Точность указания в Figma/canvas-приложениях (запасной вариант: текстовые шаги).
3. `setContentProtection` на разных версиях Windows; встроенный loopback Electron.
4. **Принятие продукта Paddle** (категория «запись звонков/ИИ-подсказки») — выяснить рано.
5. Стоимость проверки безопасности Google для Gmail; условия бесплатных тарифов Gemini/Groq; нет ли ограничений для продакшена.
6. Допущения экономики (карточки/час, токены, конверсия триала, стоимость агентов) — замерить.
7. Налоги: выбор режима с бухгалтером; проект реформы (дивиденды 7%); учёт выручки через MoR; порог НДС; курс MDL/USD приблизительный.
8. Право: согласие участников на запись, GDPR-подобные требования, политика конфиденциальности.
9. Качество Flash-Lite для карточек; при провале — вернуться к средней модели (себестоимость ↑ ~$0.09/ч).
10. Конкуренты быстро добавляют соседние функции (брифы у Granola, оверлей у Cluely); отличаться связкой «звонки + ваши материалы + курсор».
11. Почтовый сервис для писем за 7 дней до удаления (нужен бесплатный уровень).

### Допущения, добавленные при составлении (не обсуждались — можно менять)

Часы не переносятся; часы из пакета действуют 3 месяца; горячая клавиша по умолчанию `Ctrl+Alt+Space`; пороги addressed 0.75/0.85/0.9; VAD-пауза 400 мс; начальная индексация почты за ограниченный период; индекс интеграций локальный; Markdown+JSON для экспорта; режим «Eco» с локальным STT как опция.



## Raised during P0 (⚠ assumptions made by Claude Code, please confirm or change)

1. ⚠ Package manager: **pnpm** workspaces (Node >= 22). Electron 38 + electron-vite 4 + React 19.
2. ⚠ Repo/package naming: GitHub repo is `AudioPhantom`; packages are scoped `@audiophantom/*`.
3. ⚠ License: none chosen yet (private project). If we fork Clicky code (MIT) its notice must be kept (PLAN 1.2).
4. ⚠ Docs language: hand-written docs in `docs/` stay in Russian (extracted from PLAN.md); `TARIFFS.md` and `FEATURES_INFO.md` are generated in English from the i18n source strings.
5. ⚠ The (i) popover UI component (PLAN 4.4 rules 2-4: click/tap/focus, `aria-describedby`, Esc to close) is not built in P0; it lands with the first screen that lists features (plan picker in P6 / landing). The data and tests (rule 5) are in place.
6. Owner actions not doable from the sandbox (PLAN P0): create accounts for Groq, Gemini, Supabase Free and a Google Cloud test project, then fill a local `.env` from `.env.example`.
7. Not yet verified on a real Windows machine: `pnpm dev` (Electron binary was not downloaded in the sandbox; build, typecheck and tests pass).
