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
The main fraud we're worried about: a worker claiming they were in a disrupted zone when they weren't.

We'll validate against:
- The worker's last known GPS location (from shift check-in)
- Whether platform delivery activity in that zone dropped during the disruption window
- Duplicate claim detection — same worker, same event, same day

We'll implement this as a basic anomaly detection layer using Isolation Forest (scikit-learn). Not a production-grade fraud system, but enough to catch obvious patterns.

---

## Tech stack

**Frontend:** React.js (PWA) + Tailwind CSS  
**Backend:** Node.js + Express  
**Database:** PostgreSQL  
**ML/AI:** Python (scikit-learn, pandas) — served via a simple Flask API  
**External APIs:** OpenWeatherMap (free tier), OpenAQ (free), IMD RSS feeds  
**Payments:** Razorpay test mode for simulated UPI payouts  
**Version control:** This GitHub repo

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

## Team

| Name | Role |
|------|------|
| U. Mokesh Sai | Backend + APIs |
| V. Kowshik Krishna Phanindra | Frontend (React) |
| M.S.V. Abhiram | ML model + fraud detection |
| R. Manoj | Research + business model |
| K. Ganesh | UI/UX |
