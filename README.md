# GigShield 🛵
### AI-powered income protection for Q-Commerce delivery partners

**Guidewire DEVTrails 2026** | Team: Code Giants

---

## What are we building?

Zepto and Blinkit delivery partners do 10-minute deliveries, rain or shine — except when it's actually raining, or there's a flood alert, or AQI hits 450, or there's a sudden bandh. On those days, they just don't earn. No deliveries = no money. And there's nothing they can do about it.

We're building **GigShield** — a platform that automatically detects these disruptions and pays the worker for the income they lost, without them having to file a single claim or call anyone.

That's it. That's the idea.

---

## Why Q-Commerce specifically?

We picked Zepto/Blinkit partners over food delivery for a specific reason — the 10-minute delivery model means these workers operate in **very tight geographic zones**. A flood warning in their specific zone matters. A flood warning in another part of the city doesn't. This makes hyper-local trigger logic actually meaningful for this persona, compared to food delivery partners who travel further and are more spread out.

Also, Q-Commerce is still relatively new in India and growing fast, which means this worker segment is large, underinsured, and mostly ignored.

---

## The worker we're designing for

Let's call him **Arjun** — 23 years old, does Blinkit deliveries in Bangalore's Whitefield zone. Works about 10 hours a day, earns around ₹700–900 on a good day. He's been doing this for 8 months and has no savings cushion. When it rains heavily, he can lose an entire day's income — roughly ₹800 — and nobody compensates him for that.

Arjun pays ₹50 a week for GigShield's standard plan. On a day with a Red Alert rainfall in his zone, the system automatically detects the disruption, validates that Arjun was active (checked in for his shift), and transfers ₹400 directly to his UPI within minutes. He didn't open an app. He didn't call anyone.

That's the experience we're designing for.

**Key traits of this persona:**
- Mobile-first. Uses WhatsApp more than email.
- Doesn't have time or energy to deal with forms or claim processes.
- Week-to-week finances — a monthly premium model won't work for him.
- Operates in a fixed delivery zone (~3-5 km radius).

---

## How the app works (workflow)

```
Worker signs up → fills basic info, links UPI, selects weekly plan
        ↓
System creates their risk profile → based on delivery zone + historical disruption data for that area
        ↓
Policy activates for that week → premium deducted
        ↓
Background monitoring runs → weather APIs, AQI feeds, civic alert checks every 15-20 mins
        ↓
Disruption threshold crossed → system checks if worker was active in that zone
        ↓
Fraud check passes → claim auto-approved
        ↓
Payout sent to UPI → worker gets notified via app + SMS
```

No manual filing. No waiting. That's the whole point.

---

## Weekly premium model

Gig workers don't think in months. They think in weeks. So we price weekly.

We have three tiers:

| Plan | Weekly Premium | Max Payout/Week | Coverage |
|------|---------------|-----------------|----------|
| Basic | ₹35 | ₹500 | Up to 4 hrs of lost income |
| Standard | ₹50 | ₹900 | Up to 8 hrs |
| Premium | ₹80 | ₹1,500 | Up to 14 hrs |

**How is the premium calculated?**

The base rate starts at ₹50 (standard plan). Then we adjust it based on two things:

1. **Zone risk** — Some zones flood every monsoon. Some don't. A worker in a historically disruption-prone zone pays slightly more (up to ~40% higher). A worker in a safer zone pays slightly less (up to ~20% lower). We figure this out from historical weather + disruption data for that pin code.

2. **ML prediction for the coming week** — Our model looks at the weather forecast and seasonal patterns and adjusts the premium slightly for the upcoming week. If a heavy rain week is predicted, the premium shifts up marginally (capped so it stays affordable).

Payout is simple: we look at the worker's average daily earnings, divide by their active hours, multiply by how many hours the disruption lasted. Capped at the plan maximum.

---

## Disruption triggers

We cover two types of disruptions — environmental and social. Here's what we're tracking:

| Trigger | Data Source | Threshold | What it covers |
|---------|------------|-----------|----------------|
| Heavy rainfall | OpenWeatherMap (free tier) | > 35mm/hr OR IMD Red Alert for that zone | Full hourly income loss |
| Extreme heat | OpenWeatherMap (free tier) | Temp > 44°C (heat index) | 50% income (reduced but possible to work) |
| Severe AQI | OpenAQ / AQICN (free) | AQI > 400 with govt advisory | Full hourly income loss |
| Flood / waterlogging | IMD flood alerts | Flood warning active in worker's zone | Full coverage for zone-active hours |
| Curfew / Bandh | Civic alert APIs + delivery activity drop | Zone-wide delivery activity drops 80%+ AND a civic disruption alert exists | Full hourly income loss |

One thing we're careful about: a disruption has to actually affect the worker's specific zone, not just the city. We match the trigger against the worker's registered delivery zone coordinates.

---

## Web or mobile?

**We're going web (PWA — Progressive Web App).**

Here's our reasoning: a PWA works like an app on mobile but doesn't need a Play Store install. For workers on low-end Android phones, asking them to download something is friction we don't want. A PWA can be shared as a WhatsApp link, opens in the browser, and can be added to the home screen in one tap. It also lets us build faster since it's just React on the frontend.

We considered native Android but the overhead for a 6-week build didn't make sense for our team size.

---

## AI/ML plan

We're integrating AI in two places:

**1. Dynamic premium calculation**
We'll train a simple ML model (decision tree or light gradient boosting using scikit-learn in Python) that takes the worker's zone, historical disruption frequency for that zone, current season, and upcoming weather forecast — and outputs a weekly risk adjustment factor. This is what makes pricing smart instead of flat for everyone.

We'll use historical IMD weather data + OpenWeatherMap data to build and test this.

**2. Fraud detection**
The main fraud we're worried about: a worker faking their location to claim a payout during a disruption they weren't actually affected by.

We'll validate against:
- GPS location at shift check-in vs. the disrupted zone coordinates
- Whether the delivery platform shows active order completions during the "disruption window" — if you completed 3 deliveries during the flood, you weren't stranded
- GPS path behaviour — a real worker's location shows natural movement; a spoofed location tends to be suspiciously static or jumps impossibly between coordinates
- Duplicate claim detection — same worker, same event, same day

We'll implement this using Isolation Forest (scikit-learn) for anomaly detection, plus a rule-based layer on top for the obvious patterns.

---

## Tech stack

React.js (PWA), Tailwind CSS, Node.js, Express, PostgreSQL, Python, scikit-learn, pandas, Flask, OpenWeatherMap API, OpenAQ API, IMD RSS feeds, Razorpay test mode

---

## Development plan

**Phase 1 (Mar 4–20) — Ideation & Foundation** ← we are here  
- Persona definition, scenarios, workflow ✅  
- Premium model design + trigger logic ✅  
- GitHub repo setup ✅  
- 2-minute strategy video  

**Phase 2 (Mar 21 – Apr 4) — Build the core**  
- Worker registration + onboarding flow  
- Weekly policy creation  
- Dynamic premium calculation (ML model v1)  
- Claims management module  
- 3–5 live trigger integrations with real APIs  

**Phase 3 (Apr 5–17) — Polish and demo**  
- Fraud detection layer  
- Simulated UPI payout (Razorpay sandbox)  
- Worker dashboard + admin/insurer dashboard  
- 5-min demo video + final pitch deck  

---

## What we're doing differently

- **Zone-level triggers, not city-level.** A flood in Koramangala shouldn't trigger a payout for a worker operating in Hebbal. We match disruption data to the worker's actual registered delivery zone.

- **Zero-touch claims.** The worker never initiates anything. Disruption happens → system detects → payout sent. The goal is that the worker finds out about the claim when they get the UPI credit notification.

- **Focused scope.** Income loss only. No health, no vehicle, no accidents. Keeping it narrow makes it more trustworthy and easier to price correctly.

---

## Adversarial Defense & Anti-Spoofing Strategy

> **Market Crash scenario:** A coordinated ring of 500 delivery partners with fake GPS simultaneously claims payouts during a real disruption event, draining the platform's liquidity pool before the system catches on.

This is the hardest fraud problem we have to solve — because during a genuine flood or Red Alert, there *are* hundreds of real workers who deserve to be paid. The fraud ring hides inside that legitimate crowd. Simple GPS verification alone doesn't work because a spoofed coordinate can look identical to a real one.

Here's how we think about catching them.

---

### What gives a fraud ring away that a genuine worker wouldn't trigger

**1. Claim velocity spike**
During a normal disruption event, claims come in gradually as workers check in and the system detects them one by one. A coordinated ring submits claims in a tight burst — hundreds of requests within the same 2-3 minute window. Genuine workers don't all check in at the exact same second. We flag any zone where claim submissions spike more than 4x the historical average rate within a 5-minute window and hold those for secondary validation.

**2. GPS behaviour is static or teleporting**
A real delivery worker sitting out a storm is still moving slightly — walking to shelter, shifting position, checking their phone. Their GPS pings show small natural drift within a few hundred metres. A spoofed coordinate is either perfectly static (same lat/lng for 45 minutes, which never happens with a real phone) or it jumps between locations impossibly fast — like moving 8km in 30 seconds. We log GPS pings every 10 minutes during a disruption window and flag anyone whose coordinates show zero drift or physically impossible movement.

**3. Account clustering signals**
A fraud ring doesn't operate in isolation. We look for:
- Multiple accounts registered from the same device (same device fingerprint)
- Multiple accounts with payouts routing to the same UPI ID or the same bank account
- Accounts created in a batch — 50 new registrations in the same zone within the same week, all claiming in the same event
Any cluster of 3+ accounts sharing device, UPI, or registration timing gets escalated immediately.

**4. Platform activity contradiction**
This is the cleanest signal. If a worker's delivery platform data shows they completed orders during the disruption window, they were physically working — not stranded. We cross-reference claim windows against platform activity. A real stranded worker has zero order completions. A fraudulent one might have forgotten to pause their platform availability, or the ring operator didn't account for this check.

**5. Historical trust score**
Workers who have been on the platform for more than 4 weeks, have consistent GPS patterns across previous shifts, and have never had a flagged claim get a higher trust score. New accounts with no history claiming a large-payout event in their first week get held for manual review — not rejected, just slowed down.

---

### How we avoid punishing honest workers

The risk of an aggressive fraud system is that it blocks a genuinely stranded worker from getting paid. That's a worse outcome than a few fraudulent payouts getting through.

Our approach is **tiered response, not binary block:**

| Risk Level | What triggers it | What happens |
|---|---|---|
| Low | Normal claim, trusted worker, GPS looks fine | Auto-approved, payout sent immediately |
| Medium | New account, OR minor GPS anomaly, OR slightly elevated claim velocity | Payout held for 2 hours, secondary checks run, auto-released if checks pass |
| High | Static GPS + new account + no platform history | Manual review queue, worker notified with reason, resolved within 24 hrs |
| Fraud ring flag | Device/UPI clustering + velocity spike | All linked accounts frozen, investigation triggered, no payouts until resolved |

We never silently reject. If a worker's payout is held, they get a notification explaining why and an estimated resolution time. A genuinely stranded worker who gets a 2-hour delay is frustrated but compensated. A fraudster who gets caught in the cluster detection doesn't get paid at all.

---

### What we can't catch (and why we're honest about it)

A very sophisticated single actor who has a real account with genuine history, uses a real physical phone with natural GPS movement, but is simply not in the disrupted zone — we can't reliably catch that with our current architecture. Platform activity cross-referencing helps, but if that data isn't available in real time, we have a gap. We're flagging this as a known limitation and plan to address it in Phase 3 with a more robust behavioural baseline model.

---

## Team

| Name | Role |
|------|------|
| U. Mokesh Sai | Backend + APIs |
| V. Kowshik Krishna Phanindra | Frontend (React) |
| M.S.V. Abhiram | ML model + fraud detection |
| R. Manoj | Research + business model |
| K. Ganesh | UI/UX |
