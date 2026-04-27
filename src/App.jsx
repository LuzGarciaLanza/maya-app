import { useState, useRef, useEffect } from "react";

// ─── SYSTEM PROMPT (abbreviated — same deep knowledge as V5) ───────────────
const SYSTEM_PROMPT = `You are MAYA — the ultimate insider guide for the Riviera Maya, Mexico. Created by a local expert with 25 years living in Playa del Carmen as a destination rep, licensed realtor, and interior design professional.

PERSONALITY: Warm, honest, outgoing, practical. Speak like a trusted LOCAL FRIEND. Give real, specific, verified advice. Warn about scams and pitfalls. Never sound like a brochure.

LANGUAGE RULE: ALWAYS respond in the SAME language the user writes in (English, French, or Spanish). Never switch unless asked.

DEALS: When asked about deals or discounts, direct users to the 🎫 Deals section in the menu.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🐾 PETS & DOGS — COMPLETE GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Playa del Carmen is genuinely pet-friendly — especially for dogs. More than half of Playa households have at least one pet, and the city is actively expanding pet-friendly spaces.

BEACHES WITH DOGS:
- Playa 72 (Colosio area): The ONLY official dog beach in Playa del Carmen. Also called "La Playa de los Perros" or "Dog Beach." Great for early morning walks when sand is cool. No exclusive pet zone — be respectful, keep dogs hydrated, bring bags for waste.
- Main Playa del Carmen beach: Dogs are officially prohibited. Police on ATVs enforce this. If caught you'll be asked to leave and may face fines. Some people sneak out before 9am on Colosio beach — your risk.
- Cozumel: Tortugas Beach Club and La Monina Restaurant & Beach Club welcome leashed pets in outdoor areas. Small pets can take the ferry to Cozumel if leashed and calm.
- Tulum: Mía Beach Club is pet-friendly for small dogs on leash.

PET-FRIENDLY RESTAURANTS & CAFÉS (verified):
- Mi Dogo Café: Specifically dog-friendly, cozy with great food and drinks.
- Choux Choux: French-inspired bakery, open-air, welcomes pets.
- Ressio Café: Relaxed downtown café, pets welcome.
- Bajo Café: Open almost all day, breakfast to dinner, pets welcome.
- Crisol: Fresh food, relaxed setting, pets welcome.
- La Cueva del Chango: Famous breakfast spot, outdoor jungle setting — dogs have been welcome on the patio.
- Lara & Luca: Outdoor terrace, pet-friendly.
- La Vagabunda: Casual dinner option, outdoor seating, welcomes pets.
- Zitla: Outdoor seating, pets welcome.
- 5th Avenue restaurants with OUTDOOR street seating: Generally accept dogs, especially small dogs on leash. Inside seating: usually no.

DOG PARKS (unleash your dog):
- Parque de los Perros: 38th Avenue & 60th Street — gated, favorite local dog park. Great to meet other dog owners.
- Dog park on Street 38 by Magic Express Hotel (across the highway): Official fenced park.
- Other parks: Real Ibiza, Parque Cebiam, downtown on Street 24 between 10th and 20th Ave.
- Law: You cannot walk more than 3 dogs without formal training credentials!

STROLLING WITH DOGS:
- 5th Avenue: Walking with leashed dogs is common and generally accepted. Going INTO shops and restaurants is another matter.
- Open-air malls: Quinta Alegría, Calle Corazón, and Paseo del Carmen allow you to walk through with pets — not all shops will let you enter though.
- Any street in Playa is suitable for walking — just keep your dog leashed.

VETERINARIANS (English-speaking):
- Sanimal: Well-known, English-speaking staff, carries basic pet supplies (food, treatments). Highly recommended by expats.
- Playa Pet Hospital: Good option for more serious cases.
- Clinivet: Specialized care.
- Zooper Mascotas: Pet supply store with vet services.
- Local law: Sterilization campaigns happen regularly — often free or low-cost.

DOGGY DAYCARE & BOARDING:
- Animal House: Doggie daycare and boarding, large play areas, grooming, vet services.
- Useful if you're going on tours, cenotes, ruins, or excursions where dogs can't come.

PET SUPPLIES:
- Sanimal vet carries basics.
- Mundo Animal in Centro Maya mall (need a taxi — about 50 pesos from downtown).
- Walmart and Chedraui carry standard pet food brands.

TRAVELING TO MEXICO WITH PETS:
- Bring vaccination certificate (rabies at minimum — ideally all vaccines).
- Health certificate from a licensed vet signed within 10 days of travel.
- No quarantine required for dogs and cats.
- Airlines allow pets in cabin (usually under 8kg/carrier combined) or cargo.
- Inform your airline well in advance — pet spots are limited.
- Mexico does NOT require specific breeds to be banned (unlike some countries).
- Bring enough medication or prescription food for the whole trip — some brands not available here.

AIRBNB WITH PETS:
- Many listings say "no pets" but owners will make exceptions if you ask politely before booking.
- Always declare you have a pet — never hide it. It damages trust and you could lose your deposit.
- Look for private homes over apartment complexes — condo rules are often stricter.
- Note: Small dogs (under 10kg) are easier to accommodate everywhere.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏨 WHERE TO STAY — COMPLETE GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is THE most asked question in every travel forum. Here's the honest breakdown:

OPTION 1 — DOWNTOWN PLAYA (Centro / 5th Avenue area)
BEST FOR: People who want to explore, eat out, walk everywhere, experience real Playa.
PROS: Walking distance to restaurants, bars, 5th Ave shopping, tours, colectivos, ferry. Most social vibe. You feel the city.
CONS: Some streets can be noisy (especially near clubs). Beach right downtown can have more sargassum. More touristy.
STAY HERE IF: You want to experience Playa del Carmen, not just a resort. You plan to explore.
NEIGHBORHOOD TIP: Streets 34-38 area (north end of downtown) is quieter with good restaurants and a local vibe. Streets 10-20 are more central and touristy.

OPTION 2 — PLAYACAR (gated community, south of downtown)
BEST FOR: Families, couples wanting quiet, all-inclusive lovers.
PROS: Very safe gated community. Golf course. All-inclusive resorts right on beautiful beach (Phase 2 beach tends to get less sargassum — hotels clean it constantly). Walkable to downtown (20-30 min walk along beach or 5th Ave, or short taxi).
CONS: More expensive. Less "local" feel. Phase 1 closest to downtown but beach slightly less maintained. Phase 2 has better beach but further from downtown.
PHASE 1 vs PHASE 2: Phase 1 = luxury homes and small boutique hotels, closest to center. Phase 2 = all-inclusive resorts, golf course, aviary park. Phase 2 beach is wider and gets less seaweed because hotels clean continuously.
ALL-INCLUSIVE OPTIONS: Riu Palace, Sandos Playacar, Playacar Palace. Good quality and walkable to downtown.

OPTION 3 — ALL-INCLUSIVE vs AIRBNB/HOTEL
ALL-INCLUSIVE MAKES SENSE WHEN:
- You have kids who eat constantly and you don't want to plan every meal.
- You drink a lot and want unlimited beverages without thinking about cost.
- You want zero decision fatigue — everything paid upfront.
- You're staying at a resort with a beautiful beach (Playacar resorts).
CONS of all-inclusive: You miss the incredible restaurants of Playa. You're trapped in a buffet bubble. You often don't experience the real local side.

AIRBNB/INDEPENDENT HOTEL MAKES SENSE WHEN:
- You want to explore and eat at local restaurants.
- You're staying more than 5-7 days.
- You travel with a pet.
- You want to cook some meals (Walmart/Chedraui are great).
- You want more space (separate bedrooms, full kitchen).
REAL COST COMPARISON: A good Airbnb near downtown can cost $80-150/night. Add food ($30-50/person/day eating out), and it's often comparable to a mid-range all-inclusive. But the EXPERIENCE is completely different.

OPTION 4 — NORTH OF DOWNTOWN (Colosio area)
More residential, less tourist infrastructure. Some all-inclusive resorts on the beach (Paradisus). Public beach access points.Good for budget travelers or long-stay visitors.

HOTEL NEIGHBORHOODS:
- Calle 10-20: Heart of the action, most central, some noise.
- Calle 34-38: Sweet spot — quieter, still walkable, great restaurants, local vibe. Recommended for most travelers.
- North of Calle 46: Gets rougher — not recommended for most tourists.
- Playacar Phase 1: Near ferry dock, walkable, quieter.
- Playacar Phase 2: Farthest from center but best all-inclusive beach.

SARGASSUM AND WHERE YOU STAY:
Playacar Phase 2 beach gets less seaweed than downtown Playa beach. If beach quality is your #1 priority, Playacar Phase 2 resorts or heading to Akumal/Xpu-Ha are better choices.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫 LOCAL RULES — WHAT NOT TO DO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Things that are ILLEGAL or will get you in trouble — that most tourists don't know:

ALCOHOL RULES:
- Walking with open alcohol on the street is ILLEGAL in Quintana Roo. Yes, even on 5th Avenue with a beer in your hand. Police may give a warning, fine, or confiscate the drink. Enforcement is stricter in 2026 than before.
- Minimum drinking age: 18 years. This is enforced.
- Ley Seca (Dry Law): On election days, stores cannot sell alcohol for 24-48 hours. Bars and restaurants for tourists are usually exempt but check local news before election dates.
- Alcohol hours in stores: Sundays alcohol sales in stores end at 5pm. Hours vary by day and store — OXXO can be unpredictable. Plan ahead.
- Beach drinking: Technically illegal in Quintana Roo but police are more relaxed about it as long as you're not causing problems and are buying from a beach concession.
- NEVER drink and drive. Police checkpoints exist, especially at night on Highway 307. Even one drink can get you in serious trouble.

BIKING RULES:
- Bikes are STRICTLY PROHIBITED on 5th Avenue. No exceptions. Police will take your bike — they cut locks and load bikes on trucks regularly.
- Bike lanes exist on 10th Avenue — use these instead.
- A public bike-share program exists in Playa. Great for getting around, just stay off 5th Ave.
- Night driving: Roads have speed bumps (topes) that can be invisible at night — they'll destroy your rental car if you hit them fast.

VAPING (2026):
- Federally banned in public spaces since January 16, 2026. Actively enforced on 5th Avenue.
- Don't vape outdoors in any public space. Real risk of police action.

POLICE FINES:
- Traffic tickets are NEVER paid on the street. Any officer asking for cash on the street is asking for a bribe.
- If stopped, politely ask for the ticket to be written up and offer to pay it at the police station. The fine will usually be less than the bribe and you avoid feeding corruption.
- If a police officer stops you and asks for cash: stay calm, be polite, ask for badge number, ask for written ticket. They usually back down.

DOGS ON BEACH:
- All main beaches in Playa are off-limits to dogs. Police on ATVs patrol and enforce this. Fines and possible confiscation of pet.
- Only Playa 72 (Dog Beach in Colosio) is officially pet-friendly.

GLASS ON BEACH:
- Glass bottles are prohibited on the beach. If broken, extremely dangerous for bare feet.
- Bring cans or cups instead.

SMOKING:
- Smoking is banned on the beach and in many public spaces.
- Designated smoking areas exist but are not always obvious.
- Don't smoke in restaurants (indoor or outdoor areas).

DRUGS:
- All drug-related activities are illegal and dangerous. Every street dealer is connected to organized crime.
- Buying drugs as a tourist puts you in direct contact with cartel operations — not worth it under any circumstances.
- If offered drugs, decline firmly and walk away.

STRAWS:
- Many beach restaurants no longer provide plastic straws due to environmental regulations. Bring your own reusable straw if you need one.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛍️ SHOPPING — COMPLETE GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT TO BUY (good value, authentic):
- Talavera pottery: Hand-painted Mexican ceramics. Beautiful and genuine. Check it's actually from Puebla (where it's made) — some shops sell cheaper imitations from China.
- Silver jewelry: Buy ONLY from shops with certificates and fixed prices. Much "silver" on 5th Ave is alpaca metal (white metal alloy) that will tarnish. Ask for 925 sterling silver certificate.
- Vanilla extract: Mexican vanilla is excellent and much cheaper than abroad. Look for "pure vanilla extract" — not imitation.
- Mezcal: Buy from La Europea (where restaurants buy their liquor) for authentic artisanal brands. Much better than the tourist-facing bottles.
- Hot sauce: Excellent Mexican hot sauce brands at Walmart or Chedraui at local prices.
- Hammocks: Yucatan specialty. Buy directly from vendors in markets (not on 5th Ave) for better prices. Matrimonial (double) size is most popular.
- Local chocolate: Genuine Mexican chocolate brands from local stores.
- Coffee: Mexican coffee from Chiapas is world-class. Good souvenir that's easy to pack.

WHERE TO SHOP:
- 5th Avenue: Great for browsing and atmosphere but NOT for price. Everything is marked up for tourists. Negotiate on larger purchases.
- Mercado Municipal: Most authentic and affordable. Fresh food, crafts, household items. Where locals shop.
- Calle Corazón mall: Open-air mall on 5th Ave. Mix of local and international brands.
- Paseo del Carmen mall: Near the ferry dock. Good selection.
- Quinta Alegría: Shopping center on 5th Ave, mid-range brands.
- Walmart / Chedraui / La Comer: For everyday items, food, and groceries. Much cheaper than tourist shops. Great for local food products to take home.
- Centro Maya mall: Larger mall with Costco-style options (need taxi to get there).

SCAMS TO AVOID WHEN SHOPPING:
- "Closing down" signs: Many shops on 5th Ave have had "Final Liquidation Sale" or "Closing Down" signs for YEARS. Nothing is on sale. It's a display trick to get you in the door.
- "This is handmade in Mexico": Much merchandise is mass-produced in China. Look for actual handmade markings, ask where it's from specifically.
- Fake silver: Always ask for 925 sterling certificate before buying.
- The "I remember you" scam: A vendor approaches saying "I'm your waiter from [restaurant name]!" They're not. It's a sales technique to build false rapport. Smile and keep walking.
- Inflated prices: In markets, always look at 2-3 stalls before buying. Prices for the same item can vary 50-100%.

BARGAINING:
- Expected and normal at market stalls and with street vendors.
- Not appropriate in fixed-price shops.
- Start at about 50-60% of asking price, meet in the middle.
- Be friendly — it's a social transaction, not a battle.
- If a vendor accepts your first offer immediately, you offered too much.
- It's okay to say no and walk away — sometimes they call you back with a better price.

DUTY-FREE:
- Mexico allows you to bring back $300-800 USD worth of goods (varies by country). Know your limits before shopping.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚲 GETTING AROUND PLAYA — COMPLETE GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Playa del Carmen is very walkable in the tourist zone. But knowing your options saves time and money.

WALKING:
- The tourist zone (beach to highway, ferry dock to CTM Ave) is very walkable.
- From the ferry dock (south end of 5th Ave) to CTM Ave (north end): about 25-30 minute walk.
- From 5th Ave to the beach: 1-2 minute walk from anywhere in the tourist zone.
- Comfortable walking shoes are important — 5th Ave is cobblestone.
- Best time to walk: before 11am or after 5pm. Midday heat is brutal.

BIKING:
PUBLIC BIKE SYSTEM — BICIPLAYA:
- App name: BICIPLAYA (download on App Store or Google Play — search "Biciplaya")
- Website: biciplaya.com
- How it works: Download app → register → go to nearest bike station → scan QR code on bike with your phone → bike unlocks automatically via Bluetooth.
- 500 bikes available across 44 stations around Playa.
- Hours: 6am to 11pm daily.
- Prices: 1 day ~98 pesos, 3 days ~196 pesos, 7 days ~328 pesos, annual membership ~420 pesos.
- Each ride: 30 minutes included. After 30 min, dock the bike at any station and start a new ride. Designed for transportation, not leisure.
- Payment: Credit or debit card in the app. Also recharge cards available at stations.
- Tip: Some stations have digital "totems" with iPads if you don't want to use the app.
- WARNING: If you end your ride outside a station, you get fined. Always dock at an official station.
- Stations are marked on the map inside the app.

BUYING A BIKE:
- New bike at Walmart or Chedraui: Basic bikes from ~1,500-3,000 pesos. Good quality for everyday riding. 
- Used bikes: Facebook Marketplace Playa del Carmen — great deals, many expats sell bikes when they leave. Search "bicicleta Playa del Carmen" — often 500-1,500 pesos for a solid used bike.
- Tip: Always use a good U-lock — bike theft is very common in Playa. A cheap cable lock will last about one day.
- Bike repair shops: Several along 10th Avenue and near the market area.

BIKE ROUTES:
- 10th Avenue: Has dedicated bike lanes — use these.
- 30th Avenue: Also good for biking.
- NEVER on 5th Avenue — police will take your bike, cut the lock, load it on a truck. No exceptions.
- Great for: morning rides before the heat, getting to colectivo stops, exploring local neighborhoods west of the highway.

COLECTIVOS (within Playa):
- The vans that run along 30th Avenue within Playa cost about 10-12 pesos — a bargain.
- Also use them to get to/from the colectivo hub near Chedraui.

TAXIS WITHIN PLAYA:
- Short rides within Centro: 50-80 pesos.
- No meters — ALWAYS agree price before getting in.
- From 5th Ave to the ADO bus station: ~50 pesos.
- From 5th Ave to the ferry dock (if you're north): 40-60 pesos.
- Official taxis are WHITE with a teal/turquoise stripe. Look for this.
- Unofficial taxis: avoid. No accountability if something goes wrong.

InDrive / DiDi (within Playa):
- Price shown in app before you confirm. Much more transparent than taxis.
- Works great in Playa for medium distances.

GOLF CARTS:
- Not common within Playa del Carmen (unlike Holbox or Cozumel where they're everywhere).
- Some boutique resorts have them for on-property use.

SCOOTERS / MOPEDS:
- Available for rental in Playa. Fun but requires experience.
- Traffic can be chaotic — not recommended for first-time visitors.
- Always wear a helmet — required by law and smart regardless.
- Be very aware of topes (speed bumps) — they appear without warning.

RENTING A CAR IN PLAYA:
- Great if you're planning to explore ruins, cenotes, and beaches independently.
- ONLY rent from international agencies (Hertz, Alamo, National, Enterprise) — never tiny local agencies to save money.
- ALWAYS buy full insurance — no exceptions. Local policies have many exclusions.
- Toll roads (cuotas) require CASH PESOS — keep coins and small bills ready.
- Gas stations: pay inside at the cashier in CASH before pumping. Never give your card to the attendant.
- Night driving: avoid if possible. Topes (speed bumps) are invisible at night and can seriously damage your car.
- Police checkpoints: Have your rental contract and license visible. Be polite. Don't offer money.

GETTING FROM PLAYA TO OTHER DESTINATIONS:
- Cancun Airport: ADO bus (~200 pesos, 1 hr) from ADO station. Most economical.
- Tulum: Colectivo from Chedraui hub (~50 pesos, 1 hr). Or ADO bus.
- Cozumel: Ferry from the dock near Parque Fundadores (~200 pesos, 45 min). Ultramar or Winjet ferries.
- Bacalar: ADO bus from Playa station (~250-300 pesos, 4 hrs).
- Chichen Itza: Day trip tour from 5th Ave agencies, ADO bus to Valladolid, or rent a car.
- Holbox: ADO bus to Chiquilá + 25-min ferry. Or organized day trip from Playa.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ALL PREVIOUS SECTIONS REMAIN UNCHANGED]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 MONEY & ATMs | 🛡️ SAFETY | 🌿 SARGASSUM | 🏖️ BEACHES
🐢 AKUMAL | 💧 CENOTES | 🏛️ RUINS | 🚂 TREN MAYA
🌮 FOOD | 🚐 TRANSPORT | 🦈 WHALE SHARKS | 🤿 DIVING
🏥 HEALTH | 🏡 LIVING HERE | 🌊 BACALAR | 🎶 NIGHTLIFE
☀️ WEATHER | ⚠️ TIMESHARES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Keep all responses warm, specific, and practical. Use occasional emojis. Mention real prices. Warn honestly about risks. Never sound like a travel brochure. Always offer to help with more detail.`;

// ─── PARTNER DEALS DATA ────────────────────────────────────────────────────
// Replace with real partners — each gets unique WhatsApp tracking link
const DEALS = [
  {
    id: "deal1",
    category: "🌮 Food",
    categoryEs: "🌮 Comida",
    categoryFr: "🌮 Nourriture",
    business: "El Fogon",
    description: { en: "The best tacos al pastor in Playa del Carmen", es: "Los mejores tacos al pastor de Playa del Carmen", fr: "Les meilleurs tacos al pastor de Playa del Carmen" },
    discount: { en: "10% off your total bill", es: "10% de descuento en tu cuenta", fr: "10% de réduction sur l'addition" },
    code: "MAYA-FOGON",
    value: { en: "Save ~$3-8 USD", es: "Ahorra ~$3-8 USD", fr: "Économise ~3-8 USD" },
    whatsapp: "529841234567", // Replace with real number
    preMessage: { en: "Hi! I'm coming from MAYA app with code MAYA-FOGON for my 10% discount 🌴", es: "¡Hola! Vengo de la app MAYA con el código MAYA-FOGON para mi 10% de descuento 🌴", fr: "Bonjour! Je viens de l'app MAYA avec le code MAYA-FOGON pour ma réduction de 10% 🌴" },
    color: "#E65100",
    colorLight: "#FFF3E0",
  },
  {
    id: "deal2",
    category: "🤿 Tours",
    categoryEs: "🤿 Tours",
    categoryFr: "🤿 Excursions",
    business: "[Tour Operator Name]",
    description: { en: "Cenote tour + snorkel — 2 cenotes in one day", es: "Tour de cenotes + snorkel — 2 cenotes en un día", fr: "Tour cénotes + snorkel — 2 cénotes en une journée" },
    discount: { en: "$10 USD off any cenote tour", es: "$10 USD de descuento en cualquier tour de cenotes", fr: "10 USD de réduction sur tout tour de cénotes" },
    code: "MAYA-TOUR1",
    value: { en: "Save $10 USD", es: "Ahorra $10 USD", fr: "Économise 10 USD" },
    whatsapp: "529841234568",
    preMessage: { en: "Hi! I found you through MAYA app. Code MAYA-TOUR1 for my $10 discount 🌴", es: "¡Hola! Los encontré a través de la app MAYA. Código MAYA-TOUR1 para mi descuento de $10 🌴", fr: "Bonjour! Je vous ai trouvé via l'app MAYA. Code MAYA-TOUR1 pour ma réduction de 10$ 🌴" },
    color: "#006064",
    colorLight: "#E0F7FA",
  },
  {
    id: "deal3",
    category: "🚐 Transport",
    categoryEs: "🚐 Transporte",
    categoryFr: "🚐 Transport",
    business: "[Transport Service]",
    description: { en: "Private transfer — Airport Cancun ↔ Playa del Carmen", es: "Traslado privado — Aeropuerto Cancún ↔ Playa del Carmen", fr: "Transfert privé — Aéroport Cancún ↔ Playa del Carmen" },
    discount: { en: "$10 USD off any private transfer", es: "$10 USD de descuento en traslado privado", fr: "10 USD de réduction sur tout transfert privé" },
    code: "MAYA-TRANSFER",
    value: { en: "Save $10 USD", es: "Ahorra $10 USD", fr: "Économise 10 USD" },
    whatsapp: "529841234569",
    preMessage: { en: "Hi! I'm booking a transfer through MAYA app. Code MAYA-TRANSFER for my discount 🌴", es: "¡Hola! Quiero reservar un traslado a través de la app MAYA. Código MAYA-TRANSFER 🌴", fr: "Bonjour! Je réserve un transfert via l'app MAYA. Code MAYA-TRANSFER 🌴" },
    color: "#1B5E20",
    colorLight: "#E8F5E9",
  },
  {
    id: "deal4",
    category: "🤿 Diving",
    categoryEs: "🤿 Buceo",
    categoryFr: "🤿 Plongée",
    business: "[Dive Shop Cozumel]",
    description: { en: "2-tank dive in Cozumel — world class reefs", es: "Buceo de 2 tanques en Cozumel — arrecifes de clase mundial", fr: "Plongée 2 bouteilles à Cozumel — récifs de classe mondiale" },
    discount: { en: "Free snorkel rental with any dive", es: "Snorkel gratis con cualquier buceo", fr: "Location de snorkel offerte avec toute plongée" },
    code: "MAYA-DIVE",
    value: { en: "Save ~$15 USD", es: "Ahorra ~$15 USD", fr: "Économise ~15 USD" },
    whatsapp: "529841234570",
    preMessage: { en: "Hi! I'm booking a dive through MAYA app. Code MAYA-DIVE for my free snorkel rental 🌴", es: "¡Hola! Quiero reservar un buceo a través de la app MAYA. Código MAYA-DIVE 🌴", fr: "Bonjour! Je réserve une plongée via l'app MAYA. Code MAYA-DIVE 🌴" },
    color: "#0097A7",
    colorLight: "#E0F7FA",
  },
  {
    id: "deal5",
    category: "🏖️ Beach Club",
    categoryEs: "🏖️ Beach Club",
    categoryFr: "🏖️ Beach Club",
    business: "[Beach Club Name]",
    description: { en: "Beach club day pass — sun beds, pool, beach access", es: "Día de beach club — camastros, alberca, acceso a playa", fr: "Pass journée beach club — transats, piscine, accès plage" },
    discount: { en: "1 free drink with any day pass", es: "1 bebida gratis con cualquier day pass", fr: "1 boisson offerte avec tout pass journée" },
    code: "MAYA-BEACH",
    value: { en: "Save ~$8-12 USD", es: "Ahorra ~$8-12 USD", fr: "Économise ~8-12 USD" },
    whatsapp: "529841234571",
    preMessage: { en: "Hi! I'm coming from MAYA app for a day pass. Code MAYA-BEACH for my free drink 🌴", es: "¡Hola! Vengo de la app MAYA para un day pass. Código MAYA-BEACH para mi bebida gratis 🌴", fr: "Bonjour! Je viens de l'app MAYA pour un pass journée. Code MAYA-BEACH 🌴" },
    color: "#AD1457",
    colorLight: "#FCE4EC",
  },
  {
    id: "deal6",
    category: "🦷 Dental",
    categoryEs: "🦷 Dental",
    categoryFr: "🦷 Dentaire",
    business: "[Dental Clinic]",
    description: { en: "Professional dental cleaning + checkup — quality at Mexican prices", es: "Limpieza dental + revisión — calidad a precios mexicanos", fr: "Nettoyage dentaire + bilan — qualité à prix mexicains" },
    discount: { en: "15% off any dental service", es: "15% de descuento en cualquier servicio dental", fr: "15% de réduction sur tout service dentaire" },
    code: "MAYA-DENTAL",
    value: { en: "Save $20-80 USD vs home prices", es: "Ahorra 60-80% vs precios en casa", fr: "Économise 60-80% vs les prix à la maison" },
    whatsapp: "529841234572",
    preMessage: { en: "Hi! I'd like to book an appointment through MAYA app. Code MAYA-DENTAL for my 15% discount 🌴", es: "¡Hola! Me gustaría agendar una cita a través de la app MAYA. Código MAYA-DENTAL 🌴", fr: "Bonjour! Je voudrais prendre RDV via l'app MAYA. Code MAYA-DENTAL 🌴" },
    color: "#4527A0",
    colorLight: "#EDE7F6",
  },
];

const categories = [
  { id: "money", emoji: "💰", en: "Money & ATMs", es: "Dinero & ATMs", fr: "Argent & ATMs" },
  { id: "safety", emoji: "🛡️", en: "Safety", es: "Seguridad", fr: "Sécurité" },
  { id: "sargassum", emoji: "🌿", en: "Sargassum", es: "Sargazo", fr: "Sargasses" },
  { id: "beaches", emoji: "🏖️", en: "Beaches", es: "Playas", fr: "Plages" },
  { id: "turtles", emoji: "🐢", en: "Akumal Turtles", es: "Tortugas", fr: "Tortues" },
  { id: "cenotes", emoji: "💧", en: "Cenotes", es: "Cenotes", fr: "Cénotes" },
  { id: "ruins", emoji: "🏛️", customIcon: "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", en: "Ruins", es: "Ruinas", fr: "Ruines" },
  { id: "trenmaya", emoji: "🚂", en: "Tren Maya", es: "Tren Maya", fr: "Tren Maya" },
  { id: "food", emoji: "🌮", en: "Food", es: "Comida", fr: "Nourriture" },
  { id: "transport", emoji: "🚐", en: "Transport", es: "Transporte", fr: "Transport" },
  { id: "whaleshark", emoji: "🦈", en: "Whale Sharks", es: "Tiburón Ballena", fr: "Requins Baleines" },
  { id: "diving", emoji: "🤿", en: "Diving", es: "Buceo", fr: "Plongée" },
  { id: "health", emoji: "🏥", en: "Health", es: "Salud", fr: "Santé" },
  { id: "living", emoji: "🏡", en: "Living Here", es: "Vivir aquí", fr: "S'installer" },
  { id: "bacalar", emoji: "🌊", en: "Bacalar", es: "Bacalar", fr: "Bacalar" },
  { id: "nightlife", emoji: "🎶", en: "Nightlife", es: "Vida nocturna", fr: "Nuit" },
  { id: "weather", emoji: "☀️", en: "Weather", es: "Clima", fr: "Météo" },
  { id: "timeshare", emoji: "⚠️", en: "Timeshare", es: "Timeshare", fr: "Timeshare" },
  { id: "deals", emoji: "🎫", en: "Deals & Discounts", es: "Descuentos", fr: "Bons Plans" },
  { id: "translate", emoji: "📷", en: "Translate Photo", es: "Traducir Foto", fr: "Traduire Photo" },
  { id: "pets", emoji: "🐾", en: "Pets & Dogs", es: "Mascotas", fr: "Animaux" },
  { id: "where_stay", emoji: "🏨", en: "Where to Stay", es: "Dónde Quedarse", fr: "Où Loger" },
  { id: "rules", emoji: "🚫", en: "Local Rules", es: "Reglas Locales", fr: "Règles Locales" },
  { id: "shopping", emoji: "🛍️", en: "Shopping", es: "Compras", fr: "Shopping" },
  { id: "mobility", emoji: "🚲", en: "Getting Around Playa", es: "Movilidad en Playa", fr: "Se Déplacer" },
];

const firstQ = {
  money: { en: "What's the best ATM in Playa del Carmen?", es: "¿Cuál es el mejor cajero en Playa?", fr: "Quel est le meilleur ATM à Playa?" },
  safety: { en: "Is Playa del Carmen safe for tourists?", es: "¿Es seguro Playa del Carmen?", fr: "Playa del Carmen est-elle sûre?" },
  sargassum: { en: "How bad is the sargassum right now?", es: "¿Qué tan malo está el sargazo ahora?", fr: "Les sargasses sont-elles mauvaises?" },
  beaches: { en: "What are the best beaches near Playa?", es: "¿Cuáles son las mejores playas?", fr: "Quelles sont les meilleures plages?" },
  turtles: { en: "How do I swim with turtles in Akumal?", es: "¿Cómo nado con las tortugas en Akumal?", fr: "Comment nager avec les tortues?" },
  cenotes: { en: "What are the best cenotes near Playa?", es: "¿Cuáles son los mejores cenotes?", fr: "Quels sont les meilleurs cénotes?" },
  ruins: { en: "Tulum ruins or Chichen Itza?", es: "¿Tulum o Chichén Itzá?", fr: "Tulum ou Chichen Itza?" },
  trenmaya: { en: "How does the Tren Maya work for tourists?", es: "¿Cómo funciona el Tren Maya?", fr: "Comment fonctionne le Tren Maya?" },
  food: { en: "Where do locals eat in Playa del Carmen?", es: "¿Dónde comen los locales en Playa?", fr: "Où mangent les locaux à Playa?" },
  transport: { en: "What's a colectivo and how do I use one?", es: "¿Qué es un colectivo y cómo usarlo?", fr: "C'est quoi un colectivo?" },
  whaleshark: { en: "How do I swim with whale sharks?", es: "¿Cómo nado con tiburones ballena?", fr: "Comment nager avec les requins baleines?" },
  diving: { en: "Is Cozumel good for beginner divers?", es: "¿Cozumel es bueno para principiantes?", fr: "Cozumel est-il bon pour les débutants?" },
  health: { en: "Is the water safe to drink?", es: "¿Se puede tomar el agua del grifo?", fr: "L'eau du robinet est-elle potable?" },
  living: { en: "How much does it cost to live in Playa?", es: "¿Cuánto cuesta vivir en Playa?", fr: "Combien coûte vivre à Playa?" },
  bacalar: { en: "Is Bacalar worth visiting?", es: "¿Vale la pena visitar Bacalar?", fr: "Vaut-il la peine de visiter Bacalar?" },
  nightlife: { en: "What's the nightlife like in Playa?", es: "¿Cómo es la vida nocturna?", fr: "Comment est la vie nocturne?" },
  weather: { en: "When is the best time to visit?", es: "¿Cuál es la mejor época?", fr: "Quelle est la meilleure période?" },
  timeshare: { en: "Is the free tour offer a timeshare scam?", es: "¿El tour gratis es estafa?", fr: "L'offre de tour gratuit est-elle une arnaque?" },
  pets: { en: "Can I bring my dog to restaurants and beaches in Playa?", es: "¿Puedo llevar mi perro a restaurantes y playas en Playa?", fr: "Puis-je emmener mon chien dans les restaurants et plages?" },
  where_stay: { en: "Should I stay downtown or in Playacar?", es: "¿Centro de Playa o Playacar, cuál me recomiendas?", fr: "Vaut-il mieux loger dans le centre ou à Playacar?" },
  rules: { en: "What local rules should I know as a tourist?", es: "¿Qué reglas locales debo saber como turista?", fr: "Quelles règles locales dois-je connaître en tant que touriste?" },
  shopping: { en: "What should I buy in Playa del Carmen and where?", es: "¿Qué debo comprar en Playa y dónde?", fr: "Que dois-je acheter à Playa del Carmen et où?" },
  mobility: { en: "What's the best way to get around Playa del Carmen?", es: "¿Cuál es la mejor forma de moverse en Playa?", fr: "Comment se déplacer dans Playa del Carmen?" },
};

function openWhatsApp(phone, message) {
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
}

export default function App() {
  const [lang, setLang] = useState("en");
  const [screen, setScreen] = useState("landing"); // landing | chat | deals
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [expandedDeal, setExpandedDeal] = useState(null);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);

  const greeting = {
    en: "Hola! 🌴 I'm Maya — your Riviera Maya insider. Ask me anything, use 📷 to translate signs or menus, or check our 🎫 Deals section for exclusive discounts that pay for Maya with just one use!",
    es: "¡Hola! 🌴 Soy Maya — tu guía insider de la Riviera Maya. Pregúntame lo que quieras, usa 📷 para traducir carteles o menús, ¡o revisa nuestra sección de 🎫 Descuentos para ofertas exclusivas que pagan Maya con un solo uso!",
    fr: "Hola! 🌴 Je suis Maya — ton guide insider de la Riviera Maya. Pose-moi tes questions, utilise 📷 pour traduire des panneaux ou menus, ou consulte nos 🎫 Bons Plans pour des réductions qui remboursent Maya en une seule utilisation!"
  };

  const tText = {
    en: { start: "Ask Maya Free →", deals: "Deals & Discounts", back: "← Back", placeholder: "Ask anything...", dealsTitle: "Exclusive Local Deals", dealsSub: "One deal covers the cost of your Maya access", useCode: "Use this discount →", bookWhatsApp: "Book on WhatsApp", yourCode: "Your code:", saving: "You save:" },
    es: { start: "Pregunta a Maya →", deals: "Descuentos", back: "← Volver", placeholder: "Pregunta lo que quieras...", dealsTitle: "Descuentos Exclusivos Locales", dealsSub: "Un descuento cubre el costo de Maya", useCode: "Usar este descuento →", bookWhatsApp: "Reservar por WhatsApp", yourCode: "Tu código:", saving: "Ahorras:" },
    fr: { start: "Demande à Maya →", deals: "Bons Plans", back: "← Retour", placeholder: "Demande n'importe quoi...", dealsTitle: "Bons Plans Exclusifs", dealsSub: "Un bon plan couvre le coût de Maya", useCode: "Utiliser cette offre →", bookWhatsApp: "Réserver sur WhatsApp", yourCode: "Ton code:", saving: "Tu économises:" },
  }[lang];

  useEffect(() => {
    if (screen === "chat" && messages.length === 0) {
      setMessages([{ role: "assistant", content: greeting[lang] }]);
    }
  }, [screen, lang]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function sendToAPI(msgs) {
    setLoading(true);
    try {
      const apiMessages = msgs.map(m => {
        if (m.image) {
          return {
            role: m.role,
            content: [
              { type: "image", source: { type: "base64", media_type: m.imageType || "image/jpeg", data: m.image } },
              { type: "text", text: m.content || (lang === "es" ? "Por favor traduce y explica todo el texto en esta imagen." : lang === "fr" ? "Traduis et explique tout le texte visible dans cette image." : "Please translate and explain all the text you see in this image.") }
            ]
          };
        }
        return { role: m.role, content: m.content };
      });
      const res = await fetch("/.netlify/functions/claude", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
         
        },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1024, system: SYSTEM_PROMPT, messages: apiMessages }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, something went wrong!";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Oops! Try again 🙏" }]);
    } finally {
      setLoading(false);
      setImagePreview(null);
      setImageBase64(null);
    }
  }

  function startWithCategory(cat) {
    if (cat.id === "translate") { setScreen("chat"); setTimeout(() => fileRef.current?.click(), 300); return; }
    if (cat.id === "deals") { setScreen("deals"); return; }
    const q = firstQ[cat.id]?.[lang];
    if (!q) return;
    const greet = { role: "assistant", content: greeting[lang] };
    const user = { role: "user", content: q };
    setMessages([greet, user]);
    setScreen("chat");
    sendToAPI([greet, user]);
  }

  function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target.result;
      setImagePreview(result);
      setImageBase64({ data: result.split(",")[1], type: file.type || "image/jpeg" });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  async function sendMessage(text) {
    const txt = text || input.trim();
    if ((!txt && !imageBase64) || loading) return;
    setInput("");
    const newMsg = imageBase64
      ? { role: "user", content: txt || "", image: imageBase64.data, imageType: imageBase64.type, preview: imagePreview }
      : { role: "user", content: txt };
    const newMsgs = [...messages, newMsg];
    setMessages(newMsgs);
    await sendToAPI(newMsgs);
  }

  // ── DEALS SCREEN ──────────────────────────────────────────
  if (screen === "deals") return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#0a1628", fontFamily: "'Georgia', serif", color: "white", maxWidth: 700, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0a1628, #0d2137)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <button onClick={() => setScreen("landing")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 12, fontFamily: "Arial" }}>{tText.back}</button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ color: "#FFD54F", fontWeight: "bold", fontSize: 15, letterSpacing: 1 }}>🎫 {tText.dealsTitle}</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "Arial" }}>{tText.dealsSub}</div>
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {["en","es","fr"].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ background: lang===l ? "rgba(255,213,79,0.2)" : "transparent", border: `1px solid ${lang===l ? "rgba(255,213,79,0.5)" : "rgba(255,255,255,0.1)"}`, color: lang===l ? "#FFD54F" : "rgba(255,255,255,0.3)", padding: "2px 7px", borderRadius: 20, fontSize: 9, cursor: "pointer", fontFamily: "Arial" }}>{l.toUpperCase()}</button>
          ))}
        </div>
      </div>

      {/* Savings banner */}
      <div style={{ background: "linear-gradient(135deg, rgba(255,213,79,0.15), rgba(255,160,0,0.1))", borderBottom: "1px solid rgba(255,213,79,0.2)", padding: "10px 16px", textAlign: "center" }}>
        <span style={{ fontSize: 11, color: "#FFD54F", fontFamily: "Arial" }}>
          {{ en: "💡 Maya costs $9 USD • Use 1 deal = Maya pays for itself", es: "💡 Maya cuesta $9 USD • Usa 1 descuento = Maya se paga sola", fr: "💡 Maya coûte 9 USD • 1 bon plan = Maya se rembourse" }[lang]}
        </span>
      </div>

      {/* Deals list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px" }}>
        {DEALS.map(deal => (
          <div key={deal.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, marginBottom: 12, overflow: "hidden" }}>
            {/* Deal header */}
            <div style={{ padding: "14px 16px 10px", cursor: "pointer" }} onClick={() => setExpandedDeal(expandedDeal === deal.id ? null : deal.id)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ background: deal.color, borderRadius: 20, padding: "2px 10px", fontSize: 10, color: "white", fontFamily: "Arial" }}>
                      {lang === "es" ? deal.categoryEs : lang === "fr" ? deal.categoryFr : deal.category}
                    </span>
                  </div>
                  <div style={{ fontWeight: "bold", fontSize: 15, color: "white", marginBottom: 4 }}>{deal.business}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "Arial", lineHeight: 1.5 }}>{deal.description[lang]}</div>
                </div>
                {/* Savings badge */}
                <div style={{ background: "linear-gradient(135deg, rgba(255,213,79,0.2), rgba(255,160,0,0.15))", border: "1px solid rgba(255,213,79,0.3)", borderRadius: 10, padding: "6px 10px", textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 10, color: "#FFD54F", fontFamily: "Arial", marginBottom: 2 }}>{tText.saving}</div>
                  <div style={{ fontSize: 12, fontWeight: "bold", color: "#FFD54F", fontFamily: "Arial" }}>{deal.value[lang]}</div>
                </div>
              </div>

              {/* Discount highlight */}
              <div style={{ marginTop: 10, background: `${deal.color}22`, border: `1px solid ${deal.color}44`, borderRadius: 8, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 13, color: "white", fontFamily: "Arial", fontWeight: "bold" }}>🎁 {deal.discount[lang]}</div>
                <div style={{ fontSize: 11, color: deal.color === "#006064" ? "#80DEEA" : "#FFD54F", fontFamily: "Arial" }}>
                  {expandedDeal === deal.id ? "▲" : "▼"}
                </div>
              </div>
            </div>

            {/* Expanded content */}
            {expandedDeal === deal.id && (
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "14px 16px 16px", background: "rgba(0,0,0,0.2)" }}>
                {/* Code */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "Arial", marginBottom: 6 }}>{tText.yourCode}</div>
                  <div style={{ background: "rgba(255,255,255,0.07)", border: "2px dashed rgba(255,255,255,0.2)", borderRadius: 10, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "monospace", fontSize: 18, fontWeight: "bold", color: "#FFD54F", letterSpacing: 2 }}>{deal.code}</span>
                    <button onClick={() => {
                      navigator.clipboard?.writeText(deal.code);
                      alert(lang === "es" ? "¡Código copiado!" : lang === "fr" ? "Code copié!" : "Code copied!");
                    }} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "5px 12px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "Arial" }}>
                      {lang === "es" ? "Copiar" : lang === "fr" ? "Copier" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* How to use */}
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: "Arial", marginBottom: 14, lineHeight: 1.6 }}>
                  {{ en: "Show this code when you arrive, or tap the button below to WhatsApp them directly — the discount code is included automatically in your message.", es: "Muestra este código al llegar, o toca el botón para escribirles por WhatsApp — el código se incluye automáticamente en tu mensaje.", fr: "Montre ce code à l'arrivée, ou appuie sur le bouton pour leur écrire sur WhatsApp — le code est inclus automatiquement." }[lang]}
                </div>

                {/* WhatsApp CTA */}
                <button
                  onClick={() => openWhatsApp(deal.whatsapp, deal.preMessage[lang])}
                  style={{ width: "100%", background: "linear-gradient(135deg, #25D366, #128C7E)", border: "none", color: "white", padding: "13px 16px", borderRadius: 12, fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "Arial", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>💬</span>
                  {tText.bookWhatsApp}
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Coming soon */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 16, padding: "20px 16px", textAlign: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>✨</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "Arial" }}>
            {{ en: "More deals coming soon — restaurants, spas, whale shark tours, and more!", es: "¡Más descuentos próximamente — restaurantes, spas, tours de tiburón ballena y más!", fr: "Plus de bons plans bientôt — restaurants, spas, tours requins baleines et plus!" }[lang]}
          </div>
        </div>

        {/* Back to chat */}
        <button onClick={() => setScreen("chat")} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "12px", borderRadius: 12, fontSize: 13, cursor: "pointer", fontFamily: "Arial", marginBottom: 8 }}>
          🌴 {{ en: "Ask Maya a question", es: "Preguntarle algo a Maya", fr: "Poser une question à Maya" }[lang]}
        </button>
      </div>
      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}`}</style>
    </div>
  );

  // ── LANDING ──────────────────────────────────────────────
  if (screen === "landing") return (
    <div style={{ minHeight: "100vh", background: "#0a1628", fontFamily: "'Georgia', serif", color: "white", position: "relative", overflow: "hidden", paddingBottom: 60 }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at 30% 20%, rgba(0,150,136,0.18) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(0,172,193,0.12) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🌴</span>
          <span style={{ fontWeight: "bold", letterSpacing: 3, fontSize: 14, color: "#80DEEA" }}>MAYA</span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: "Arial", marginLeft: 4 }}>Riviera Maya</span>
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {["en","es","fr"].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ background: lang===l ? "rgba(0,172,193,0.2)" : "transparent", border: `1px solid ${lang===l ? "rgba(0,172,193,0.5)" : "rgba(255,255,255,0.12)"}`, color: lang===l ? "white" : "rgba(255,255,255,0.35)", padding: "3px 9px", borderRadius: 20, fontSize: 9, cursor: "pointer", fontFamily: "Arial", letterSpacing: 1 }}>{l.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 5, textAlign: "center", padding: "20px 20px 16px" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #00897B, #00ACC1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, margin: "0 auto 14px", boxShadow: "0 0 40px rgba(0,172,193,0.25)" }}>🌴</div>
        <h1 style={{ fontSize: "clamp(28px, 7vw, 48px)", fontWeight: "bold", background: "linear-gradient(135deg, #80DEEA, #26C6DA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: 6, marginBottom: 10 }}>MAYA</h1>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontFamily: "Arial", maxWidth: 360, margin: "0 auto 16px", lineHeight: 1.7 }}>
          {{ en: "Your insider guide to the Riviera Maya — beaches, food, safety, deals & more.", es: "Tu guía insider de la Riviera Maya — playas, comida, seguridad, descuentos y más.", fr: "Ton guide insider de la Riviera Maya — plages, nourriture, sécurité, bons plans et plus." }[lang]}
        </p>

        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 18, flexWrap: "wrap" }}>
          {[
            { en: "🇲🇽 EN·ES·FR", es: "🇲🇽 EN·ES·FR", fr: "🇲🇽 EN·ES·FR" },
            { en: "📷 Photo Translate", es: "📷 Traducir Fotos", fr: "📷 Traduire Photos" },
            { en: "🎫 Local Deals", es: "🎫 Descuentos", fr: "🎫 Bons Plans" },
            { en: "✅ Verified 2026", es: "✅ Verificado 2026", fr: "✅ Vérifié 2026" },
          ].map(b => (
            <span key={b[lang]} style={{ background: b[lang].includes("🎫") ? "rgba(255,213,79,0.12)" : b[lang].includes("📷") ? "rgba(0,172,193,0.12)" : "rgba(255,255,255,0.05)", border: `1px solid ${b[lang].includes("🎫") ? "rgba(255,213,79,0.3)" : b[lang].includes("📷") ? "rgba(0,172,193,0.3)" : "rgba(255,255,255,0.09)"}`, borderRadius: 20, padding: "4px 10px", fontSize: 10, color: b[lang].includes("🎫") ? "#FFD54F" : b[lang].includes("📷") ? "#80DEEA" : "rgba(255,255,255,0.5)", fontFamily: "Arial" }}>{b[lang]}</span>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setScreen("chat")} style={{ background: "linear-gradient(135deg, #00897B, #00ACC1)", border: "none", color: "white", padding: "13px 28px", borderRadius: 50, fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "Arial", boxShadow: "0 4px 20px rgba(0,172,193,0.3)" }}>
            {tText.start}
          </button>
          <button onClick={() => setScreen("deals")} style={{ background: "linear-gradient(135deg, rgba(255,213,79,0.2), rgba(255,160,0,0.15))", border: "1px solid rgba(255,213,79,0.4)", color: "#FFD54F", padding: "13px 28px", borderRadius: 50, fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "Arial" }}>
            🎫 {tText.deals}
          </button>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 5, padding: "0 12px" }}>
        <p style={{ textAlign: "center", fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 10, fontFamily: "Arial" }}>
          {{ en: "Browse by topic", es: "Explorar por tema", fr: "Parcourir par thème" }[lang]}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, maxWidth: 480, margin: "0 auto" }}>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => startWithCategory(cat)}
              style={{
                background: cat.id === "deals" ? "rgba(255,213,79,0.1)" : cat.id === "translate" ? "rgba(0,172,193,0.1)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${cat.id === "deals" ? "rgba(255,213,79,0.3)" : cat.id === "translate" ? "rgba(0,172,193,0.3)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 10, padding: "10px 4px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                cursor: "pointer", color: "white",
                gridColumn: (cat.id === "deals" || cat.id === "translate") ? "span 3" : "span 1",
              }}>
              {cat.customIcon
                ? <img src={`data:image/png;base64,${cat.customIcon}`} style={{width:26,height:26,objectFit:"cover",borderRadius:6}} alt="" />
                : <span style={{ fontSize: (cat.id === "deals" || cat.id === "translate") ? 20 : 18 }}>{cat.emoji}</span>}
              <span style={{ fontSize: (cat.id === "deals" || cat.id === "translate") ? 11 : 9, color: cat.id === "deals" ? "#FFD54F" : cat.id === "translate" ? "#80DEEA" : "rgba(255,255,255,0.55)", fontFamily: "Arial", textAlign: "center", lineHeight: 1.3, fontWeight: (cat.id === "deals" || cat.id === "translate") ? "bold" : "normal" }}>
                {cat.id === "deals"
                  ? { en: "🎫 Exclusive Deals — Restaurants, Tours, Transport & More", es: "🎫 Descuentos Exclusivos — Restaurantes, Tours, Transporte y Más", fr: "🎫 Bons Plans Exclusifs — Restaurants, Excursions, Transport et Plus" }[lang]
                  : cat.id === "translate"
                  ? { en: "📷 Translate Any Sign, Label or Menu Instantly", es: "📷 Traducir Cualquier Cartel, Etiqueta o Menú", fr: "📷 Traduire N'importe Quel Panneau ou Menu" }[lang]
                  : cat[lang]}
              </span>
            </button>
          ))}
        </div>
      </div>
      <p style={{ textAlign: "center", fontSize: 9, color: "rgba(255,255,255,0.12)", fontFamily: "Arial", marginTop: 24 }}>MAYA • Riviera Maya Insider Guide • 2026</p>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
    </div>
  );

  // ── CHAT ─────────────────────────────────────────────────
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#f0f4f8", fontFamily: "Arial, sans-serif", maxWidth: 700, margin: "0 auto" }}>
      <div style={{ background: "linear-gradient(135deg, #0a1628, #0d2137)", padding: "11px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => setScreen("landing")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 12, padding: 0 }}>{tText.back}</button>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 9, justifyContent: "center" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #00897B, #00ACC1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌴</div>
          <div>
            <div style={{ color: "white", fontWeight: "bold", fontSize: 13, letterSpacing: 2 }}>MAYA</div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 8 }}>Riviera Maya Insider • Verified 2026</div>
          </div>
        </div>
        <button onClick={() => setScreen("deals")} style={{ background: "rgba(255,213,79,0.15)", border: "1px solid rgba(255,213,79,0.3)", color: "#FFD54F", padding: "4px 10px", borderRadius: 20, fontSize: 10, cursor: "pointer", fontFamily: "Arial" }}>
          🎫 {tText.deals}
        </button>
      </div>

      <div style={{ display: "flex", gap: 5, padding: "7px 8px", overflowX: "auto", background: "white", borderBottom: "1px solid #e8ecf0", scrollbarWidth: "none" }}>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => {
            if (cat.id === "translate") { fileRef.current?.click(); return; }
            if (cat.id === "deals") { setScreen("deals"); return; }
            const q = firstQ[cat.id]?.[lang];
            if (!q) return;
            const newMsgs = [...messages, { role: "user", content: q }];
            setMessages(newMsgs);
            sendToAPI(newMsgs);
          }}
            style={{
              background: cat.id === "deals" ? "rgba(255,213,79,0.1)" : "#f0fafb",
              border: `1px solid ${cat.id === "deals" ? "rgba(255,213,79,0.4)" : "#b2ebf2"}`,
              borderRadius: 20, padding: "4px 9px",
              fontSize: 10, color: cat.id === "deals" ? "#E65100" : "#00838F",
              cursor: "pointer", whiteSpace: "nowrap",
              fontWeight: cat.id === "deals" ? "bold" : "normal"
            }}>
            {cat.customIcon
              ? <><img src={`data:image/png;base64,${cat.customIcon}`} style={{width:14,height:14,objectFit:"cover",borderRadius:3,verticalAlign:"middle",marginRight:3}} alt=""/>{cat[lang]}</>
              : <>{cat.emoji} {cat[lang]}</>}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 10px 6px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 10, alignItems: "flex-end", gap: 6 }}>
            {m.role === "assistant" && <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #00897B, #00ACC1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>🌴</div>}
            <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: 6, alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
              {m.preview && <div style={{ borderRadius: 12, overflow: "hidden", maxWidth: 200, border: "2px solid rgba(0,172,193,0.4)" }}><img src={m.preview} alt="" style={{ width: "100%", display: "block" }} /></div>}
              {(m.content || m.role === "assistant") && (
                <div style={{ padding: "9px 13px", borderRadius: m.role === "user" ? "16px 16px 3px 16px" : "16px 16px 16px 3px", background: m.role === "user" ? "linear-gradient(135deg, #00897B, #00ACC1)" : "white", color: m.role === "user" ? "white" : "#1a2332", fontSize: 13, lineHeight: 1.65, boxShadow: "0 1px 5px rgba(0,0,0,0.07)", whiteSpace: "pre-wrap" }}>
                  {m.content}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #00897B, #00ACC1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🌴</div>
            <div style={{ background: "white", borderRadius: "16px 16px 16px 3px", padding: "11px 14px", boxShadow: "0 1px 5px rgba(0,0,0,0.07)" }}>
              <div style={{ display: "flex", gap: 4 }}>{[0,1,2].map(n => <div key={n} style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ACC1", animation: `bounce 1.2s ${n*0.2}s infinite` }} />)}</div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {imagePreview && (
        <div style={{ background: "white", borderTop: "1px solid #e0f7fa", padding: "8px 12px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img src={imagePreview} alt="" style={{ width: 52, height: 52, borderRadius: 8, objectFit: "cover", border: "2px solid #00ACC1" }} />
            <button onClick={() => { setImagePreview(null); setImageBase64(null); }} style={{ position: "absolute", top: -6, right: -6, background: "#ff5252", border: "none", borderRadius: "50%", width: 17, height: 17, color: "white", cursor: "pointer", fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>
          <p style={{ fontSize: 11, color: "#00838F", fontFamily: "Arial" }}>
            {{ en: "Photo ready — tap ➤ to translate", es: "Foto lista — toca ➤ para traducir", fr: "Photo prête — appuie sur ➤ pour traduire" }[lang]}
          </p>
        </div>
      )}

      <div style={{ padding: "9px 10px", background: "white", borderTop: imagePreview ? "none" : "1px solid #e8ecf0", display: "flex", gap: 7, alignItems: "center" }}>
        <button onClick={() => fileRef.current?.click()} style={{ background: "linear-gradient(135deg, #00897B, #00ACC1)", border: "none", borderRadius: "50%", width: 42, height: 42, cursor: "pointer", color: "white", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>📷</button>
        <input type="file" ref={fileRef} onChange={handleImageSelect} accept="image/*" capture="environment" style={{ display: "none" }} />
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder={imageBase64 ? { en: "Add a note (optional)...", es: "Agrega una nota...", fr: "Ajoute une note..." }[lang] : tText.placeholder}
          style={{ flex: 1, padding: "9px 14px", borderRadius: 22, border: "1.5px solid #b2ebf2", fontSize: 13, outline: "none", fontFamily: "Arial", background: "#f8fffe" }} />
        <button onClick={() => sendMessage()} disabled={loading || (!input.trim() && !imageBase64)}
          style={{ background: (loading || (!input.trim() && !imageBase64)) ? "#b2dfdb" : "linear-gradient(135deg, #00897B, #00ACC1)", border: "none", borderRadius: "50%", width: 42, height: 42, cursor: (loading || (!input.trim() && !imageBase64)) ? "default" : "pointer", color: "white", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>➤</button>
      </div>
      <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}} *{box-sizing:border-box} ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.1);border-radius:2px}`}</style>
    </div>
  );
}
