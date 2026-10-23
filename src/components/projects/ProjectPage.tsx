import CopyCommand from "./CopyCommand";

type Note = { title: string; body: string };
type Link = { label: string; url: string };

// The one layout every side-project page uses: same column, type and rhythm as
// the homepage, with the demo as the only thing that's allowed to be loud.
export default function ProjectPage({
  icon,
  name,
  tagline,
  demo,
  install,
  installNote,
  notes,
  links,
}: {
  icon: React.ReactNode;
  name: string;
  tagline: React.ReactNode;
  demo: React.ReactNode;
  install: string[];
  installNote?: string;
  notes: Note[];
  links: Link[];
}) {
  return (
    <div className="mx-auto max-w-[36rem] px-6 pb-24 pt-24 sm:pt-32">
      <header className="reveal">
        <div className="h-[56px] w-[56px] [&>svg]:h-full [&>svg]:w-full">{icon}</div>
        <h1 className="mt-5 text-[18px] font-semibold tracking-tight">{name}</h1>
        <p className="mt-0.5 text-[17px] leading-relaxed text-[var(--grey-1)]">{tagline}</p>
      </header>

      <div className="reveal mt-12" style={{ animationDelay: "0.1s" }}>
        {demo}
      </div>

      <Section label="Install" delay={0.2}>
        <CopyCommand lines={install} />
        {installNote && (
          <p className="mt-3 text-[14px] leading-relaxed text-[var(--grey-2)]">{installNote}</p>
        )}
      </Section>

      <Section label="Notes" delay={0.27}>
        {notes.map((note) => (
          <div
            key={note.title}
            className="border-t border-[var(--line)] py-4 last:border-b"
          >
            <h2 className="text-[16px] font-medium tracking-tight">{note.title}</h2>
            <p className="mt-1 text-[16px] leading-relaxed text-[var(--grey-1)]">{note.body}</p>
          </div>
        ))}
      </Section>

      <div className="reveal mt-16 flex flex-wrap gap-x-6 gap-y-2" style={{ animationDelay: "0.34s" }}>
        {links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            className="font-mono text-sm text-[var(--grey-1)] transition-colors hover:text-[var(--ink)]"
          >
            <span className="text-[12px] text-[var(--grey-2)]">↗ </span>
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function Section({
  label,
  delay,
  children,
}: {
  label: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <section className="reveal mt-14" style={{ animationDelay: `${delay}s` }}>
      <p className="mb-3 font-mono text-[13px] uppercase tracking-[0.1em] text-[var(--grey-2)]">
        {label}
      </p>
      {children}
    </section>
  );
}
