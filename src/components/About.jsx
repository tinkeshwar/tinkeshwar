export default function About() {
  return (
    <section id="about">
      <h2>// About Me</h2>
      <div className="grid">
        <div data-augmented-ui="tl-2-clip-x tr-round br-scoop bl-clip-y both" className="aug-card">
          <h3 style={{ marginBottom: '1rem' }}>Core Strengths</h3>
          <div className="timeline-item">
            <h3>Cross-Domain Problem Solving</h3>
            <p>Seamlessly working across software, hardware, and automation</p>
          </div>
          <div className="timeline-item">
            <h3>System Architecture</h3>
            <p>Designing scalable, automated, interconnected workflows</p>
          </div>
          <div className="timeline-item">
            <h3>Rapid Iteration</h3>
            <p>Build, test, improve — fast feedback cycles over theory</p>
          </div>
          <div className="timeline-item">
            <h3>Real-World Constraints</h3>
            <p>Deep understanding of performance, power, and cost tradeoffs</p>
          </div>
        </div>

        <div data-augmented-ui="tr-2-clip-x tl-scoop bl-round br-clip-y both" className="aug-card aug-card-alt">
          <h3 style={{ marginBottom: '1rem' }}>Growth Vectors</h3>
          <div className="timeline-item">
            <h3>Advanced AI/ML</h3>
            <p>Beyond prompt-based automation into model training & deployment</p>
          </div>
          <div className="timeline-item">
            <h3>Distributed Systems</h3>
            <p>Scaling beyond single-node into distributed architectures</p>
          </div>
          <div className="timeline-item">
            <h3>UI/UX Polish</h3>
            <p>Elevating end-user experience in consumer-facing products</p>
          </div>
          <div className="timeline-item">
            <h3>Productization</h3>
            <p>Documentation, packaging, and shipping projects as products</p>
          </div>
        </div>
      </div>
    </section>
  )
}
