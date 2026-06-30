"use client";

const BRAND_COLORS: Record<string, { body: string; accent: string }> = {
  Audi: { body: "#1a1a2e", accent: "#c0c0c0" },
  BMW: { body: "#003087", accent: "#c0c0c0" },
  "Citroën": { body: "#d32f2f", accent: "#ffd700" },
  Ford: { body: "#003478", accent: "#c0c0c0" },
  Honda: { body: "#cc0000", accent: "#c0c0c0" },
  Hyundai: { body: "#002c5f", accent: "#c0c0c0" },
  Kia: { body: "#bb162b", accent: "#c0c0c0" },
  "Land Rover": { body: "#005a2b", accent: "#c5a028" },
  Mazda: { body: "#910000", accent: "#c0c0c0" },
  "Mercedes-Benz": { body: "#1c1c1c", accent: "#c0c0c0" },
  Mini: { body: "#1b1b1b", accent: "#ffd700" },
  Nissan: { body: "#c3002f", accent: "#c0c0c0" },
  Peugeot: { body: "#001e6e", accent: "#c0c0c0" },
  Renault: { body: "#efdf00", accent: "#1a1a1a" },
  Seat: { body: "#cc0000", accent: "#1a1a1a" },
  Skoda: { body: "#4c9c2e", accent: "#1a1a1a" },
  Toyota: { body: "#eb0a1e", accent: "#1a1a1a" },
  Vauxhall: { body: "#d40000", accent: "#ffd700" },
  Volkswagen: { body: "#001e6e", accent: "#c0c0c0" },
  Volvo: { body: "#003057", accent: "#c0c0c0" },
};

const DEFAULT_COLOR = { body: "#2563eb", accent: "#c0c0c0" };

// SVG car paths per body type (side-view silhouettes)
function HatchbackSVG({ body, accent, window: win }: { body: string; accent: string; window: string }) {
  return (
    <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
      {/* Shadow */}
      <ellipse cx="250" cy="182" rx="190" ry="10" fill="rgba(0,0,0,0.25)" />
      {/* Body */}
      <path d="M60 140 Q65 100 100 90 L155 55 Q195 35 270 35 Q330 35 355 55 L410 90 Q440 100 445 140 Z" fill={body} />
      {/* Roof */}
      <path d="M155 55 Q195 35 270 35 Q330 35 355 55 L340 88 Q310 72 270 70 Q215 70 175 85 Z" fill={accent} opacity="0.15" />
      {/* Windows */}
      <path d="M165 58 Q200 40 265 40 L258 82 Q220 78 180 90 Z" fill={win} opacity="0.85" />
      <path d="M270 40 Q325 40 350 58 L335 88 Q310 80 262 82 Z" fill={win} opacity="0.85" />
      {/* Windscreen glare */}
      <path d="M185 45 L205 42 L200 68 L182 72 Z" fill="white" opacity="0.2" />
      {/* Wheel arches */}
      <circle cx="145" cy="148" r="38" fill="#1a1a1a" />
      <circle cx="145" cy="148" r="28" fill="#333" />
      <circle cx="145" cy="148" r="18" fill={accent} opacity="0.8" />
      <circle cx="145" cy="148" r="7" fill="#1a1a1a" />
      <circle cx="355" cy="148" r="38" fill="#1a1a1a" />
      <circle cx="355" cy="148" r="28" fill="#333" />
      <circle cx="355" cy="148" r="18" fill={accent} opacity="0.8" />
      <circle cx="355" cy="148" r="7" fill="#1a1a1a" />
      {/* Underbody */}
      <path d="M90 140 L105 155 L400 155 L415 140 Z" fill={body} opacity="0.6" />
      {/* Headlight */}
      <path d="M78 108 Q72 112 70 120 L95 118 Z" fill="#fffde0" opacity="0.9" />
      <path d="M70 120 L95 118 L95 128 L72 128 Z" fill="#fffde0" opacity="0.9" />
      {/* Taillight */}
      <path d="M420 108 Q428 112 430 120 L405 118 Z" fill="#ff3b3b" opacity="0.9" />
      <path d="M430 120 L405 118 L405 128 L428 128 Z" fill="#ff3b3b" opacity="0.9" />
      {/* Door line */}
      <path d="M220 90 L220 140" stroke={accent} strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
      {/* Door handles */}
      <rect x="192" y="115" width="18" height="5" rx="2.5" fill={accent} opacity="0.6" />
      <rect x="295" y="115" width="18" height="5" rx="2.5" fill={accent} opacity="0.6" />
      {/* Grille */}
      <path d="M68 122 L100 120 L100 132 L70 133 Z" fill="#1a1a1a" />
      <line x1="75" y1="122" x2="76" y2="132" stroke={accent} strokeWidth="1" opacity="0.4" />
      <line x1="84" y1="121" x2="85" y2="132" stroke={accent} strokeWidth="1" opacity="0.4" />
      <line x1="93" y1="121" x2="94" y2="132" stroke={accent} strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

function SUVSilhouette({ body, accent, window: win }: { body: string; accent: string; window: string }) {
  return (
    <svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
      <ellipse cx="270" cy="192" rx="210" ry="10" fill="rgba(0,0,0,0.25)" />
      {/* Body - tall and upright */}
      <path d="M55 150 Q60 100 95 85 L145 48 Q175 28 255 28 Q340 28 370 48 L420 85 Q455 100 460 150 Z" fill={body} />
      {/* Roof flat section */}
      <rect x="145" y="28" width="225" height="12" fill={body} />
      {/* Windows - large */}
      <path d="M152 50 Q178 32 252 32 L248 82 Q210 80 168 92 Z" fill={win} opacity="0.82" />
      <path d="M256 32 Q338 32 365 50 L348 90 Q310 82 250 82 Z" fill={win} opacity="0.82" />
      {/* Rear quarter window */}
      <path d="M352 90 L370 86 L375 110 L355 112 Z" fill={win} opacity="0.7" />
      {/* Windscreen glare */}
      <path d="M172 38 L196 34 L190 68 L170 74 Z" fill="white" opacity="0.18" />
      {/* Wheels - bigger */}
      <circle cx="148" cy="158" r="44" fill="#1a1a1a" />
      <circle cx="148" cy="158" r="32" fill="#2a2a2a" />
      <circle cx="148" cy="158" r="20" fill={accent} opacity="0.8" />
      <circle cx="148" cy="158" r="8" fill="#1a1a1a" />
      <circle cx="370" cy="158" r="44" fill="#1a1a1a" />
      <circle cx="370" cy="158" r="32" fill="#2a2a2a" />
      <circle cx="370" cy="158" r="20" fill={accent} opacity="0.8" />
      <circle cx="370" cy="158" r="8" fill="#1a1a1a" />
      {/* High ground clearance */}
      <path d="M88 150 L100 165 L415 165 L428 150 Z" fill={body} opacity="0.5" />
      {/* Roof rails */}
      <rect x="148" y="26" width="220" height="4" rx="2" fill={accent} opacity="0.5" />
      {/* Headlight */}
      <path d="M68 104 Q60 112 58 125 L92 122 Z" fill="#fffde0" opacity="0.9" />
      <path d="M58 125 L92 122 L92 135 L60 135 Z" fill="#fffde0" opacity="0.9" />
      {/* Taillight */}
      <path d="M448 104 Q456 112 458 125 L424 122 Z" fill="#ff3b3b" opacity="0.9" />
      <path d="M458 125 L424 122 L424 135 L456 135 Z" fill="#ff3b3b" opacity="0.9" />
      <path d="M66 130 L95 128 L95 140 L68 141 Z" fill="#1a1a1a" />
      {/* Door line */}
      <path d="M235 92 L235 150" stroke={accent} strokeWidth="1.5" opacity="0.25" strokeLinecap="round" />
      <rect x="200" y="118" width="20" height="6" rx="3" fill={accent} opacity="0.55" />
      <rect x="310" y="118" width="20" height="6" rx="3" fill={accent} opacity="0.55" />
    </svg>
  );
}

function SaloonSilhouette({ body, accent, window: win }: { body: string; accent: string; window: string }) {
  return (
    <svg viewBox="0 0 540 190" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
      <ellipse cx="270" cy="178" rx="205" ry="9" fill="rgba(0,0,0,0.22)" />
      {/* Long low body */}
      <path d="M50 138 Q55 98 95 88 L155 52 Q195 36 270 36 Q340 36 365 52 L415 88 Q450 98 458 138 Z" fill={body} />
      {/* Boot hump */}
      <path d="M365 52 L415 88 L420 125 L375 100 Z" fill={body} opacity="0.7" />
      {/* Windows */}
      <path d="M162 55 Q200 40 265 40 L258 80 Q220 76 178 88 Z" fill={win} opacity="0.83" />
      <path d="M268 40 Q328 40 358 55 L342 88 Q308 78 260 80 Z" fill={win} opacity="0.83" />
      {/* Rear quarter window (saloon) */}
      <path d="M344 88 L366 54 L380 82 L355 100 Z" fill={win} opacity="0.65" />
      <path d="M178 38 L200 35 L195 65 L176 72 Z" fill="white" opacity="0.18" />
      <circle cx="140" cy="146" r="40" fill="#1a1a1a" />
      <circle cx="140" cy="146" r="29" fill="#2a2a2a" />
      <circle cx="140" cy="146" r="18" fill={accent} opacity="0.8" />
      <circle cx="140" cy="146" r="7" fill="#1a1a1a" />
      <circle cx="368" cy="146" r="40" fill="#1a1a1a" />
      <circle cx="368" cy="146" r="29" fill="#2a2a2a" />
      <circle cx="368" cy="146" r="18" fill={accent} opacity="0.8" />
      <circle cx="368" cy="146" r="7" fill="#1a1a1a" />
      <path d="M82 138 L96 152 L412 152 L424 138 Z" fill={body} opacity="0.55" />
      <path d="M62 104 Q55 112 53 124 L88 121 Z" fill="#fffde0" opacity="0.9" />
      <path d="M53 124 L88 121 L88 132 L55 132 Z" fill="#fffde0" opacity="0.9" />
      <path d="M445 104 Q453 112 455 124 L420 121 Z" fill="#ff3b3b" opacity="0.9" />
      <path d="M455 124 L420 121 L420 132 L453 132 Z" fill="#ff3b3b" opacity="0.9" />
      <path d="M228 88 L228 138" stroke={accent} strokeWidth="1.5" opacity="0.25" strokeLinecap="round" />
      <rect x="195" y="112" width="20" height="5" rx="2.5" fill={accent} opacity="0.55" />
      <rect x="300" y="112" width="20" height="5" rx="2.5" fill={accent} opacity="0.55" />
    </svg>
  );
}

function CoupeSilhouette({ body, accent, window: win }: { body: string; accent: string; window: string }) {
  return (
    <svg viewBox="0 0 540 185" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
      <ellipse cx="270" cy="174" rx="200" ry="8" fill="rgba(0,0,0,0.22)" />
      {/* Very low, aggressive body */}
      <path d="M55 136 Q58 98 92 86 L148 46 Q188 28 270 26 Q345 26 375 50 L430 86 Q460 98 465 136 Z" fill={body} />
      {/* Aggressive roofline */}
      <path d="M148 46 Q188 28 270 26 Q345 26 375 50 L355 84 Q320 68 270 66 Q210 66 172 82 Z" fill={accent} opacity="0.1" />
      <path d="M160 48 Q200 33 266 30 L258 80 Q215 76 178 90 Z" fill={win} opacity="0.85" />
      <path d="M268 30 Q340 30 368 50 L348 86 Q315 76 260 80 Z" fill={win} opacity="0.85" />
      <path d="M182 36 L210 32 L205 66 L184 73 Z" fill="white" opacity="0.2" />
      <circle cx="142" cy="144" r="42" fill="#1a1a1a" />
      <circle cx="142" cy="144" r="30" fill="#2a2a2a" />
      <circle cx="142" cy="144" r="19" fill={accent} opacity="0.85" />
      <circle cx="142" cy="144" r="7" fill="#1a1a1a" />
      <circle cx="375" cy="144" r="42" fill="#1a1a1a" />
      <circle cx="375" cy="144" r="30" fill="#2a2a2a" />
      <circle cx="375" cy="144" r="19" fill={accent} opacity="0.85" />
      <circle cx="375" cy="144" r="7" fill="#1a1a1a" />
      {/* Low side skirts */}
      <path d="M85 136 L95 150 L418 150 L428 136 Z" fill={body} opacity="0.5" />
      <path d="M68 100 Q60 108 58 120 L90 117 Z" fill="#fffde0" opacity="0.9" />
      <path d="M58 120 L90 117 L90 128 L60 128 Z" fill="#fffde0" opacity="0.9" />
      {/* Dual taillights */}
      <path d="M452 98 Q460 106 462 118 L428 115 Z" fill="#ff3b3b" opacity="0.9" />
      <path d="M462 118 L428 115 L428 128 L460 128 Z" fill="#ff3b3b" opacity="0.9" />
      <path d="M452 126 L462 128 L460 140 L450 138 Z" fill="#ff8080" opacity="0.5" />
      <path d="M225 86 L225 136" stroke={accent} strokeWidth="1.5" opacity="0.2" strokeLinecap="round" />
      <rect x="198" y="110" width="20" height="5" rx="2.5" fill={accent} opacity="0.5" />
      {/* Spoiler */}
      <rect x="425" y="78" width="40" height="6" rx="3" fill={body} />
      <rect x="425" y="78" width="40" height="3" rx="1.5" fill={accent} opacity="0.4" />
    </svg>
  );
}

function EstateSilhouette({ body, accent, window: win }: { body: string; accent: string; window: string }) {
  return (
    <svg viewBox="0 0 560 190" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
      <ellipse cx="280" cy="178" rx="215" ry="9" fill="rgba(0,0,0,0.22)" />
      {/* Long estate body */}
      <path d="M55 138 Q60 100 95 88 L150 52 Q190 36 265 36 Q360 36 400 52 L450 88 Q475 100 478 138 Z" fill={body} />
      {/* Flat roofline to back */}
      <rect x="150" y="36" width="250" height="10" fill={body} />
      <path d="M158 54 Q194 40 263 40 L256 82 Q216 78 175 90 Z" fill={win} opacity="0.83" />
      <path d="M265 40 Q330 40 355 54 L338 88 Q304 80 258 82 Z" fill={win} opacity="0.83" />
      {/* Estate rear windows */}
      <path d="M340 88 L360 54 L400 54 L400 88 Z" fill={win} opacity="0.75" />
      <path d="M180 40 L200 37 L195 68 L177 75 Z" fill="white" opacity="0.18" />
      <circle cx="142" cy="146" r="40" fill="#1a1a1a" />
      <circle cx="142" cy="146" r="29" fill="#2a2a2a" />
      <circle cx="142" cy="146" r="18" fill={accent} opacity="0.8" />
      <circle cx="142" cy="146" r="7" fill="#1a1a1a" />
      <circle cx="388" cy="146" r="40" fill="#1a1a1a" />
      <circle cx="388" cy="146" r="29" fill="#2a2a2a" />
      <circle cx="388" cy="146" r="18" fill={accent} opacity="0.8" />
      <circle cx="388" cy="146" r="7" fill="#1a1a1a" />
      <path d="M85 138 L98 152 L432 152 L445 138 Z" fill={body} opacity="0.55" />
      <path d="M64 104 Q57 112 55 124 L88 121 Z" fill="#fffde0" opacity="0.9" />
      <path d="M55 124 L88 121 L88 132 L57 132 Z" fill="#fffde0" opacity="0.9" />
      <path d="M464 104 Q472 112 474 124 L440 121 Z" fill="#ff3b3b" opacity="0.9" />
      <path d="M474 124 L440 121 L440 132 L472 132 Z" fill="#ff3b3b" opacity="0.9" />
      <path d="M228 88 L228 138" stroke={accent} strokeWidth="1.5" opacity="0.22" strokeLinecap="round" />
      <path d="M336 88 L336 138" stroke={accent} strokeWidth="1.5" opacity="0.22" strokeLinecap="round" />
      <rect x="196" y="112" width="20" height="5" rx="2.5" fill={accent} opacity="0.55" />
      <rect x="295" y="112" width="20" height="5" rx="2.5" fill={accent} opacity="0.55" />
    </svg>
  );
}

function DefaultCarSilhouette({ body, accent, window: win }: { body: string; accent: string; window: string }) {
  return <HatchbackSVG body={body} accent={accent} window={win} />;
}

export default function CarSilhouette({
  make,
  bodyType,
  fuelType,
}: {
  make: string;
  bodyType: string;
  fuelType: string;
}) {
  const colors = BRAND_COLORS[make] || DEFAULT_COLOR;
  const isElectric = fuelType === "Electric";
  const body = isElectric ? "#1a6b3c" : colors.body;
  const accent = colors.accent;
  const win = "#a8d4f5";

  const props = { body, accent, window: win };

  switch (bodyType) {
    case "SUV": return <SUVSilhouette {...props} />;
    case "Saloon": return <SaloonSilhouette {...props} />;
    case "Coupe": return <CoupeSilhouette {...props} />;
    case "Convertible": return <CoupeSilhouette {...props} />;
    case "Estate": return <EstateSilhouette {...props} />;
    default: return <DefaultCarSilhouette {...props} />;
  }
}
