import RevealOnScroll from "@/components/motion/RevealOnScroll";
import { homeContent } from "@/content/home";

const C = "center" as const;

export default function TeamSection() {
  return (
    <section
      style={{
        backgroundColor: "var(--color-black)",
        paddingTop: "5rem",
        paddingBottom: "5rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
      }}
    >
      <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
        {/* Heading */}
        <RevealOnScroll className="text-center">
          <h2
            style={{
              textAlign: C,
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              color: "#fff",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "-0.02em",
              marginBottom: "0.75rem",
            }}
          >
            {homeContent.team.headline}
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1} className="text-center">
          <p
            style={{
              textAlign: C,
              color: "var(--color-muted)",
              fontSize: "1rem",
              lineHeight: 1.7,
              maxWidth: "36rem",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "4rem",
            }}
          >
            {homeContent.team.subheadline}
          </p>
        </RevealOnScroll>

        {/* Team grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {homeContent.team.members.map((member, index) => (
            <RevealOnScroll key={index} delay={index * 0.12} className="text-center">
              <div style={{ textAlign: C }}>
                {/* Monogram avatar — no photos, per brand rule */}
                <div
                  style={{
                    width: "96px",
                    height: "96px",
                    borderRadius: "50%",
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 900,
                      fontSize: "1.25rem",
                      color: "var(--color-orange)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {"monogram" in member ? member.monogram : ""}
                  </span>
                </div>

                {/* Name */}
                <p
                  style={{
                    textAlign: C,
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    color: "#fff",
                    fontSize: "1.05rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  {member.name}
                </p>

                {/* Role */}
                <p
                  style={{
                    textAlign: C,
                    color: "var(--color-orange)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                    marginBottom: "0.75rem",
                  }}
                >
                  {member.role}
                </p>

                {/* Bio */}
                <p
                  style={{
                    textAlign: C,
                    color: "var(--color-muted)",
                    fontSize: "0.875rem",
                    lineHeight: 1.65,
                  }}
                >
                  {member.bio}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
