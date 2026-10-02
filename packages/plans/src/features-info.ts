/**
 * Text behind the (i) icon of every feature (docs/PLAN.md section 5, translated to English
 * as the source i18n strings). Every feature in plans.ts MUST have an entry here, including
 * features a plan does not include: the explanation tells users what the feature is for and
 * where it is available. Enforced by features-info.test.ts.
 *
 * i18n key convention: `feature.<id>.info`. ru/ro are empty for now and fall back to en.
 */
import type { FeatureId } from './plans.js';

export type Locale = 'en' | 'ru' | 'ro';
export const DEFAULT_LOCALE: Locale = 'en';

export const FEATURES_INFO_EN: Record<FeatureId, string> = {
  live_hours:
    'Time the assistant is switched on and actively listening to your call, searching your materials and preparing hints. It counts listening time, not the length of any recorded files. Limit: Solo 30 h, Pro 100 h, Max and Ultra 150 h per month. "Premium hours" (Max and Ultra, 30 h inside the limit) use low-latency streaming recognition. If you run out of hours you can buy a 15-hour pack for $10 or move to a higher plan. Continuous listening (when the assistant shows nothing) also counts toward your hours; pausing stops the counter.',
  devices:
    'How many computers can be connected to your account at the same time (1 / 3 / 5 / 5). Call history, summaries and settings sync between them. The index of your documents and email is built on each computer separately and stored locally.',
  continuous_listening:
    'The assistant listens to the call continuously but steps in by levels: 1) a quiet card in the panel (no sound, no cursor) when a question was heard and something relevant was found in your materials; 2) a whisper in a pause, a short hint (3-5 words) in your headphones, only when the other person has stopped talking and the question is almost certainly addressed to you; 3) the on-screen cursor, when the question contains an action ("show", "open", "change") and you confirmed. Modes: Quiet (cards only), Normal (whisper at high confidence, cursor after confirmation), Active (whisper and cursor automatically at moderate confidence). A false trigger on level 1 costs you one line in the panel. Whispering is enabled only when headphones are connected.',
  call_cursor:
    'When something needs to be shown on screen, the cursor leads you through steps 1→2→3 while the panel shows detailed text. A screenshot is taken only at the moment it is needed (never continuously). You can start it by voice ("yes, I\'ll show it" - the assistant hears your microphone specifically), with a hotkey, or by clicking the card in the panel. The "help with the last thing" hotkey acts on the last 30 seconds of the conversation, so you don\'t need to repeat the question. You do the clicking yourself. The cursor and the panel do not appear in your screen share to call participants (depends on the Windows version). No limit on any plan.',
  local_docs_search:
    'You choose folders (PDF, DOCX, XLSX, MD, TXT). The assistant indexes them on your computer, and the files are not sent to the cloud. The hint card names the file and page (for example "Logistics_Q2, p. 4"). Search is hybrid: by meaning and by exact words, numbers and file names.',
  glossary:
    'When an unfamiliar abbreviation or term comes up in the conversation, the assistant quietly shows a short explanation in the panel (no voice). It takes your documents into account so the explanation fits your industry.',
  app_prompt_sets:
    'Ready-made settings for popular programs (Figma, Excel, Jira and others) that tell the model how the interface is organized and what elements are called, so the cursor points more precisely. New programs are added over time. In programs that draw their interface on a canvas (for example inside Figma) pointing accuracy may be lower; the assistant then shows text steps and highlights the surrounding panels.',
  app_memory:
    'For each program the assistant keeps short text notes: what you call things, the structure of your file, what you have already asked. The panel shows a "Context: Figma, notes: 4" badge; click it to read, edit or delete the notes. Notes are written only when you used a hint or the cursor. Screenshots are not saved. The assistant does not see the contents of your programs on its own; it remembers only what it learned from your questions and the screenshots you allowed.',
  integrations:
    'Connections to your email (Gmail, Outlook), calendar, Slack, Google Drive, Notion and Jira. Read-only access, used for search. Materials are indexed in advance on your computer, so hints arrive quickly. Solo gets one integration, Pro gets all of them, Max and Ultra get all plus your own MCP connectors. Personal Telegram and WhatsApp chats are not supported.',
  post_call_summary:
    'After every call, automatically: a short summary, decisions made, open questions, promises and links to the files mentioned. The "don\'t save this call" button deletes everything at once. Audio is never stored.',
  summary_retention:
    'Summaries (and, on Pro, Max and Ultra, the full transcript) are stored in the cloud for 30 days (Solo), 90 days (Pro) or 12 months (Max and Ultra) and are available from any of your devices. Seven days before deletion you get an email with a download link. Open promises in the tracker are not deleted with the summary until you close them. You can download everything at any time.',
  export:
    'Export your summaries, transcripts and promises to files (Markdown and JSON; PDF later). Useful if you want to keep materials longer than your plan retains them.',
  promise_tracker:
    'Finds phrases like "I\'ll send it tomorrow" or "I\'ll check and get back to you" in the conversation: who promised what and by when. Solo: promises are visible inside the call summary. Pro and above: a separate list with export to tasks (for example Notion, Jira). Open promises are not deleted by the retention period until you close them.',
  precall_brief:
    'Five to ten minutes before a meeting (the time comes from your calendar) a card appears in the panel: who is attending; recent emails and chats with them; documents related to the meeting topic; open promises from previous calls; a short summary of the previous meeting. The relevant materials are also preloaded into a fast cache so hints arrive faster during the call. Requires a connected calendar (Google Calendar or Outlook). Not included in Solo.',
  full_transcript:
    'The full text of a call (separating "you" from the other participants) is stored in the cloud and searchable ("what did George promise about the mockup?"). Stored as long as summaries are on your plan. Audio is never stored. Not included in Solo.',
  premium_stt:
    'Low-latency streaming speech recognition for your most critical calls: 30 hours per month inside your limit (Max and Ultra). The rest of the time standard recognition is used (hints arrive slightly later).',
  assistant_mode:
    'Ask anything about your screen and work, by voice (outside calls) or by text. If the answer can be given as text it appears in the panel; if something needs to be shown, the cursor leads you through the steps while the panel holds the detailed text. During a call the question is typed quietly (a hotkey opens an input line) so your colleagues cannot hear you. Limit: 1,500 requests per month. Ultra only.',
  step_verification:
    'After each of your clicks the assistant checks the screen: did the expected thing happen, and if not, it re-plans. The "Wrong one?" button on a hint corrects the pointing; corrections are saved in the per-app notes. Ultra only.',
  do_for_you:
    'Three degrees of intervention: show; highlight an area with an arrow; do it for you. The third degree performs clicks and typing only with your confirmation of every action, can always be interrupted with Esc, and never performs payments, data deletion or password entry. Ultra only.',
  background_agents:
    'Hand off a task and keep working: "while I\'m on the call, prepare a draft reply and tasks for the promises". The agent researches the topic, goes through mail, calendar and notes, and prepares drafts. Anything that goes outside (emails, messages) is sent only after you confirm. Limit: 75 tasks per month. Ultra only.',
  workflow_recording:
    'Turn recording on and perform a sequence of actions in a program: the assistant turns it into a step-by-step instruction ("how I made the report") and can later show it with the cursor. Text steps are stored, not video. Ultra only.',
  learning_mode:
    'Want to learn a new program? The assistant builds a learning plan, shows the steps with the cursor and checks your understanding with mini-quizzes. Ultra only.',
  knowledge_packs:
    'Shared sets of instructions and documents ("how we write up a bug"). Created by an Ultra owner; colleagues on any paid plan can read them. There are no team seats or administration in the first version. Creating packs is Ultra only.',
  extra_hours_pack:
    '15 hours of live help for $10, for when the monthly limit has run out and moving to a higher plan is not what you want. Available on every plan.',
  trial:
    '3 hours of live help within 7 days, with Pro features. A bank card is required; after the trial, the subscription starts on the plan you chose. You can cancel at any time before you are charged.',
  annual_billing:
    'Pay for 10 months instead of 12 (two months free): Solo $150, Pro $240, Max $450, Ultra $790 per year.',
  privacy_controls:
    'A "don\'t save this call" button (nothing reaches the cloud); "delete all my data"; an option to notify participants that the call is being recorded; audio is never saved; your data is not used to train models; a list of windows (bank, password manager) that the assistant never captures.',
};

/** Locale tables. ru/ro intentionally empty until translated; lookups fall back to en. */
const LOCALES: Record<Locale, Partial<Record<FeatureId, string>>> = {
  en: FEATURES_INFO_EN,
  ru: {},
  ro: {},
};

export function featureInfoKey(id: FeatureId): string {
  return `feature.${id}.info`;
}

export function getFeatureInfo(id: FeatureId, locale: Locale = DEFAULT_LOCALE): string {
  return LOCALES[locale][id] ?? FEATURES_INFO_EN[id];
}
