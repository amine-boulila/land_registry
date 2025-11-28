export default function Features() {
  const features = [
    {
      title: "Immutable Record",
      description: "Once a land is registered, its history is permanently recorded on the blockchain. No more lost documents or fraud."
    },
    {
      title: "Instant Transfer",
      description: "Transfer ownership in seconds, not months. Smart contracts handle the logic securely and automatically."
    },
    {
      title: "Transparent History",
      description: "View the complete ownership history of any property. Verify authenticity with a single click."
    }
  ];

  return (
    <section id="features" style={{ padding: '100px 0' }}>
      <div className="container">
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '64px' }}>Why Web3?</h2>
        <div className="grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="glass-panel" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#7b3fe4' }}>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
