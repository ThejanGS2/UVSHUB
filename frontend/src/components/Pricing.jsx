import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Pricing.css';

const Check = () => (
  <svg className="pcard__feat-icon pcard__feat-icon--ok" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
);
const Cross = () => (
  <svg className="pcard__feat-icon pcard__feat-icon--no" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

const plans = [
  {
    id: 'plan-free', tier: 'Node_01', monthly: 0, annual: 0,
    desc: 'Initial access. Explore free modules and establish a connection.',
    featured: false, ctaLabel: 'Initialize Free Access', ctaVar: 'outline',
    features: [
      { ok: true,  label: '60+ standard modules' },
      { ok: true,  label: 'Public network access' },
      { ok: false, label: 'Verified credentials', dim: true },
      { ok: false, label: 'Offline cache', dim: true },
      { ok: false, label: 'Priority routing', dim: true },
    ],
  },
  {
    id: 'plan-pro', tier: 'Pro_02', monthly: 29, annual: 19,
    desc: 'Full database access. Everything required for rapid skill acquisition.',
    featured: true, ctaLabel: 'Start 7-Day Trial', ctaVar: 'solid',
    features: [
      { ok: true, label: 'Full database (1,160+ modules)' },
      { ok: true, label: 'Secure network access' },
      { ok: true, label: 'Cryptographic certificates' },
      { ok: true, label: 'Full offline cache' },
      { ok: true, label: 'Priority data routing' },
    ],
  },
  {
    id: 'plan-team', tier: 'Team_03', monthly: 79, annual: 59,
    desc: 'For organizations. Admin telemetry and custom learning paths.',
    featured: false, ctaLabel: 'Contact Sales', ctaVar: 'outline',
    features: [
      { ok: true, label: 'Everything in Pro_02' },
      { ok: true, label: 'Team telemetry dashboard' },
      { ok: true, label: 'Custom pathway algorithms' },
      { ok: true, label: 'Dedicated routing node' },
      { ok: true, label: 'Live Q&A transmissions' },
    ],
  },
];

function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="pricing" id="pricing" aria-labelledby="pricing-heading">
      <div className="pricing__inner">
        <div className="pricing__header">
          <div className="tag" style={{ margin: '0 auto' }}>LICENSING</div>
          <h2 className="pricing__title" id="pricing-heading">
            Transparent access<br /><em>protocols.</em>
          </h2>
          <p className="pricing__sub">Start free. Upgrade bandwidth whenever. Cancel anytime.</p>
        </div>

        <div className="pricing__toggle">
          <div className="pricing__toggle-pill">
            <button
              id="toggle-monthly"
              className={`pricing__toggle-opt${!annual ? ' pricing__toggle-opt--active' : ''}`}
              onClick={() => setAnnual(false)}
            >Monthly</button>
            <button
              id="toggle-annual"
              className={`pricing__toggle-opt${annual ? ' pricing__toggle-opt--active' : ''}`}
              onClick={() => setAnnual(true)}
            >Annual</button>
          </div>
          {annual && <span className="pricing__save">SAVE 35%</span>}
        </div>

        <div className="pricing__grid">
          {plans.map(plan => {
            const price = annual ? plan.annual : plan.monthly;
            return (
              <div key={plan.id} id={plan.id} className={`pcard${plan.featured ? ' pcard--featured' : ''}`}>
                {plan.featured && <div className="pcard__banner">✦ OPTIMAL ROUTE</div>}
                <div className="pcard__body">
                  <div className="pcard__tier">{plan.tier}</div>
                  <div className="pcard__price">
                    {price > 0 && <span className="pcard__currency">$</span>}
                    <span className="pcard__amount">{price === 0 ? 'Free' : price}</span>
                    {price > 0 && <span className="pcard__period">/ MO</span>}
                  </div>
                  <div className="pcard__orig">
                    {annual && plan.monthly > 0 ? `$${plan.monthly}/mo billed monthly` : ' '}
                  </div>
                  <p className="pcard__desc">{plan.desc}</p>
                  <ul className="pcard__features">
                    {plan.features.map((f, i) => (
                      <li key={i} className={`pcard__feat${f.dim ? ' pcard__feat--dimmed' : ''}`}>
                        {f.ok ? <Check /> : <Cross />}
                        {f.label}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/register"
                    id={`${plan.id}-cta`}
                    className={`pcard__cta pcard__cta--${plan.ctaVar}`}
                  >
                    {plan.ctaLabel}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <p className="pricing__note">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          30-DAY MONEY-BACK GUARANTEE // NO CREDIT CARD REQUIRED FOR NODE_01
        </p>
      </div>
    </section>
  );
}

export default Pricing;
