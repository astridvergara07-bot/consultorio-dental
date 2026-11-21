export function DefinicionesIconos() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <symbol id="ic-tooth" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.2c-2.7 0-4.6 1.9-4.6 4.6 0 1.4.4 2.3.9 3.4.6 1.3 1 2.6 1 5 0 1.8.6 3.3 1.4 3.3.9 0 1.1-1 1.3-2.6.1-1.1.3-2 1-2s.9.9 1 2c.2 1.6.4 2.6 1.3 2.6.8 0 1.4-1.5 1.4-3.3 0-2.4.4-3.7 1-5 .5-1.1.9-2 .9-3.4 0-2.7-1.9-4.6-4.6-4.6z" />
      </symbol>
      <symbol id="ic-calendar" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
        <path d="M8 3v4M16 3v4M3.5 10h17" strokeLinecap="round" />
      </symbol>
      <symbol id="ic-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.6" />
      </symbol>
      <symbol id="ic-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 3h3l1.5 4.5-2 1.7a12 12 0 006 6l1.7-2L21 14.5v3c0 1-.9 1.8-1.9 1.6C12 18 6 12 4.9 5.9 4.7 4.9 5.5 4 6.5 4z" />
      </symbol>
      <symbol id="ic-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" strokeLinecap="round" />
      </symbol>
      <symbol id="ic-whatsapp" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.86.5 3.6 1.44 5.1L2 22l5.1-1.44A9.95 9.95 0 0012.04 22c5.52 0 10-4.48 10-10s-4.48-10-10-10zm0 18.2c-1.6 0-3.1-.43-4.4-1.2l-.32-.18-3.02.85.85-2.95-.2-.33a8.2 8.2 0 1114.9-4.4 8.2 8.2 0 01-7.8 8.2zm4.5-6.1c-.25-.12-1.46-.72-1.68-.8-.22-.08-.38-.12-.55.12-.16.25-.63.8-.77.96-.14.16-.28.18-.52.06-.25-.12-1.05-.39-2-1.24-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.1-.5.12-.12.26-.3.4-.46.13-.15.17-.26.26-.43.08-.17.04-.3-.03-.42-.08-.12-.67-1.62-.92-2.22-.25-.6-.5-.5-.68-.5h-.58c-.19 0-.5.07-.75.33-.25.26-.98.96-.98 2.35s1 2.73 1.14 2.92c.14.19 1.9 2.9 4.6 3.95 2.7 1.05 2.7.7 3.2.66.5-.04 1.46-.6 1.66-1.18.2-.57.2-1.06.14-1.17-.06-.11-.23-.18-.48-.3z" />
      </symbol>
      <symbol id="ic-cap" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <path d="M12 4 2.5 8.5 12 13l9.5-4.5L12 4z" />
        <path d="M6.5 11v4.5c0 1.8 2.6 3.2 5.5 3.2s5.5-1.4 5.5-3.2V11" />
      </symbol>
      <symbol id="ic-star" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.5l2.9 6 6.6.8-4.8 4.5 1.3 6.5L12 16.9 5.9 20.3l1.3-6.5-4.8-4.5 6.6-.8L12 2.5z" />
      </symbol>
      <symbol id="ic-camera" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="7" width="18" height="13" rx="2.5" />
        <path d="M8 7l1.3-2.5h5.4L16 7" />
        <circle cx="12" cy="13.3" r="3.6" />
      </symbol>
    </svg>
  );
}

export function Icono({ id, className }: { id: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <use href={`#${id}`} />
    </svg>
  );
}
