---
uid: ven-con-alex
title: Ven con Alex
sidebar_heading: One of those digital things
order: 0
featured: true
role: Product Designer (UX/UI) and design system owner
problem: Ven con Alex earns money only if a customer qualifies, signs, and keeps paying for two years. When a customer runs into personal or money trouble, the car payment is the first thing they stop paying. Retention, not acquisition, was the real risk.
results:
  - Live in production
  - Pre-approval, appointment and document funnel shipped
  - Customer portal for payments, documents, service and emergencies
  - Bilingual product in English and Mexican Spanish
meta_description: Car financing for immigrants without US credit history — from a pre-launch waitlist to a full acquisition funnel and a customer portal, live in production.
---

I designed the product for Ven con Alex, a car-financing company in San Antonio, Texas, that gets immigrants without US credit history into a car they own after two years. The work went from a pre-launch waitlist to a full funnel (pre-approval, appointment, documents) and a customer portal for payments, car documents, service and emergencies. It is live in production.

| Project | |
| --- | --- |
| Team | Founders, PM, engineering team, a second designer who joined in the final phase |
| Brand | Provided by another designer; I applied it to the product |
| Platform | Responsive web app (mobile-first), English and Mexican Spanish |
| Scope | Pre-launch site, Module 1 (acquisition), Module 2 (customer portal) |
| Out of scope | Internal admin for sales assistants (built separately by engineering) |

## The trigger

The brief arrived as a business request: "build something simple to capture customers, plus a CRM." The founders had run a car-rental business in Mexico City, sold it, and wanted to bring a financing model they had seen work in the US to Texas.

The model: Ven con Alex gives a pre-owned car with insurance included, the customer pays every two weeks, and after two years the car is theirs. No credit bureau check. Behind the product, sales assistants qualify each applicant and chase missing documents.

The initial plan was a 20-week roadmap of modules: lead capture with AI scoring, a customer web app, an employee admin, and later a chatbot and document processing.

## Reframing the problem

A lead form solves the business's first week, not its business. Ven con Alex earns money only if a customer qualifies, signs, and keeps paying for two years, so I reframed the problem around that whole relationship.

The founders told me something that changed the brief: when a customer runs into personal or money trouble, the car payment is the first thing they stop paying. Retention, not acquisition, was the real risk.

> **How might we** get people who expect to be rejected or taken advantage of through qualification quickly, and keep enough trust and convenience after the sale that they keep paying for two years?

That turned one problem into three product goals:

1. **Qualify fast without scaring people off.** Fewer questions up front, the rest after commitment.
2. **Earn trust from the first screen.** Close, human, never bureaucratic.
3. **Make owning the car easy after the sale.** Payments, documents, service and emergencies in one place, so a problem with the car doesn't become a missed payment.

## Discover: business reality vs. user reality

I had no direct access to end users, so I built the user picture from four sources and cross-checked the business's assumptions against them.

| Source | What I did | What it gave me |
| --- | --- | --- |
| Founder workshops | A structured question set across business, users, capture, scoring, internal UX, security and metrics | Goals, eligibility rules, how sales assistants work, what a "good lead" means |
| Benchmark and desk research | Reviewed financing and car-buying flows | Patterns for multi-step forms, document upload, payment tracking |
| AI-assisted research | Synthesized what is known about Hispanic immigrants' access to credit and car ownership in the US | Context the founders took for granted |
| Field observation | On trips to the US, studied TV ads and highway billboards aimed at this audience | How this audience is spoken to: tone, language mix, promises that land |

What the business brought: target users are Mexicans in the southern US, many without credit history, who need a car soon and have no patience for long forms.

What the user research added: this person is used to being looked down on, works long hours for little money, and expects fine print. They want someone close who understands them, not "someone in a suit."

**What I couldn't evaluate:** interviews or usability tests with real applicants. I treated the founders' knowledge as hypotheses, not facts, and designed the flows so they could be measured once live.

## Define: insights and the solution space

Four insights shaped where I chose to work:

| Insight | So the product had to… |
| --- | --- |
| They expect rejection and hidden catches | Say yes or no early, and turn a "no" into a conversation |
| Their life runs on the phone and WhatsApp | Be mobile-first, with WhatsApp as the human channel |
| Patience for forms is low, but commitment grows once there's a car in sight | Ask the minimum to pre-approve; ask for documents after the appointment is booked |
| The car is a means to work, and money is tight | Keep the car running and payments simple after the sale |

**Solution space I chose:** a responsive web app, not a native app. Nothing to install, and a link travels well over WhatsApp. I shipped it in three stages so the business could learn before building more:

1. **Pre-launch:** a "coming soon to San Antonio" page collecting early-bird emails.
2. **Module 1, acquisition:** landing, inventory, pre-approval, appointment booking, document upload.
3. **Module 2, ownership:** sign-up for pre-approved users, first payment, payment history, car documents, service, incidents, notifications, contract signing, support.

AI came in through WhatsApp. Pre-approval did a first qualification with simple questions and answers; then an AI agent built into WhatsApp picked up the conversation, answering questions, guiding the user and understanding their particular case, while another AI pre-qualified leads in the background. Scoring run by autonomous agents was left for a later stage.

## Develop: designing for this context

Midway, the founders reopened scope: debt and payment history, a car's ownership history, collection notices, home verifications. Each new request went through one question: does it help this specific person keep the car and keep paying? These are the decisions where the user's context changed the design.

| Context | Decision |
| --- | --- |
| Expects to be turned away | Pre-approval in two short steps (basics, down-payment range) with an answer on the spot |
| A "no" confirms their fear | The rejection screen explains why (ZIP code not covered yet, under 21) and offers "Get in touch via WhatsApp" |
| Commitment grows once a visit is booked | Documents are asked for *after* the appointment: "Do you have 2 more minutes?" |
| Phone is the computer, WhatsApp is the inbox | Appointment confirmation and reminders arrive on WhatsApp; ID and proof of address are photographed with the phone |
| Phone number is more stable than email | Sign-up and login use the phone number from pre-approval |
| Budget is per paycheck, not total price | Cars show the "Drive Out" down payment first, not the sticker price |
| Many pay in cash or by bank deposit | "Make a payment": transfer or deposit, then photograph the receipt; status shows "being processed" |
| Paperwork is where they get caught out | "Your glove box in hand": insurance, plates, contract and warranty, with "Update needed" flags |
| A broken car means no work, then no payment | Services split into preventive and corrective; if the car doesn't run, towing options are suggested |
| An accident is a moment of panic | A short incident form, then a reminder to call the insurer |
| Bilingual, Mexican Spanish at home | Full English and Mexican Spanish versions with a language switch |
| Wants a person, not an institution | Copy speaks as Alex ("Tell Alex a little about yourself"), a video of Alex on the landing, first names everywhere |
| Many don't qualify alone for lack of documents, but a relative or friend does | A co-signer with a Texas ID is accepted, and the WhatsApp agent explores each case: who presents the documents and which payment plan fits |

## Deliver: prototype, system and handoff

I built a design system and a single handoff file organized the way engineering would build: by module, then by breakpoint (mobile, tablet, desktop), with every flow laid out left to right including empty, error and edge states.

- **Design system:** components and patterns shared by the landing, the funnel and the portal, so the second designer could join late and follow the same rules.
- **Edge states as first-class screens:** "pre-approved but no appointment", "appointment but no car chosen", "registered but no active plan". Each has its own home screen.
- **Annotations in the file** for behavior developers can't see in a static screen (for example: once a user is pre-approved, "Get pre-approved" becomes "Buy" and jumps straight to document upload).
- **Device checks:** the appointment confirmation was explored on small screens (iPhone SE, iPhone 13 mini) because the target audience often uses older or smaller phones.

**Validation.** There was no formal user testing before launch. What I would set up for a project like this, and recommend as the next step:

1. Five remote think-aloud sessions in Spanish with people who fit the profile, on the pre-approval and first-payment flows.
2. A quick concept test of the rejection screen: does it feel like a closed door or a next step?
3. Funnel analytics from day one, so the first weeks in production work as the test.

## Outcome and how to measure it

The product is live: the acquisition funnel and the customer portal are in production. No metrics have been collected yet, so this is how I'd prove the problem changed, tied to the three goals.

| Goal | Metric | What it proves |
| --- | --- | --- |
| Qualify fast | Pre-approval completion rate and median time to complete | The short flow doesn't scare people off |
| Qualify fast | Share of pre-approved users who upload documents after booking | Deferring documents works |
| Earn trust | Rejected users who tap WhatsApp | A "no" stays a conversation |
| Earn trust | Appointment show-up rate | The WhatsApp confirmation builds commitment |
| Easy ownership | On-time payment rate in the first 6 months | The portal supports the 2-year relationship |
| Easy ownership | Service and incident requests handled in the portal vs. by phone | Car problems don't turn into missed payments |

The founders' own early metrics were leads per week, leads contacted and leads converted; the table extends that into the post-sale relationship.

## Collaboration

I worked with the founders on what to build, with the PM on when, and with engineering on how. This is who was involved at each stage, and where I'd bring them in earlier next time.

| Stage | Who | What we decided together | Ideally |
| --- | --- | --- | --- |
| Discover | Founders | Business model, eligibility rules, who the customer is | Add 3 to 5 calls with real customers from the founders' network |
| Define | Founders, PM | Module split and release order, what moved to later | Engineering and design together on how the AI agents would score, and how to measure them |
| Develop | PM, engineering | Platform patterns, what the admin needs from each screen | A shared review each sprint with the team building the admin |
| Deliver | Engineering, second designer | Handoff, edge states, design system rules | QA sessions on real devices before each release |
| After launch | Founders, PM | — | A metrics review 30 days after launch |

## Reflection

The biggest lever was reframing the brief from capturing leads to keeping a two-year relationship. It is why the portal exists at all.

What I'd do differently:

- **Talk to users before the first screen,** even informally. Every user insight here came secondhand.
- **Measure from day one.** Before launch, agree on what to count: how many people start pre-approval, how many finish it, and how many pay on time. Without those numbers, I can't show with data that the design worked.
- **Design the AI agents' panel.** The platform was going to be run by people and by AI agents. I would have liked to help design the panel for setting each agent's instructions and measuring how well they performed: whether they qualified leads correctly, asked the right questions, and steered conversations toward useful information. What the customer sees depends on what happens on that side.

The project came before the AI boom, but we were already weighing it. Many ideas were left for later with the groundwork in place: personalized payment plans, a relative presenting the documents, and agents that follow each case.
