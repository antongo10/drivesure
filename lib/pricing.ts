export interface QuoteData {
  vehicle: {
    year: number;
    engineSize: string;
    fuelType: string;
    value: number;
    mileage: number;
  };
  drivers: Array<{
    dateOfBirth: string;
    licenceYears: number;
    ncbYears: number;
    claimsHistory: number;
    convictions: number;
    isMainDriver: boolean;
  }>;
  coverType: "third-party" | "third-party-fire-theft" | "comprehensive";
}

export function calculatePremium(data: QuoteData): {
  annual: number;
  monthly: number;
} {
  let base = 400;

  // Cover type multiplier
  const coverMultiplier = {
    "third-party": 1.0,
    "third-party-fire-theft": 1.15,
    comprehensive: 1.35,
  }[data.coverType];
  base *= coverMultiplier;

  // Vehicle age factor
  const age = new Date().getFullYear() - data.vehicle.year;
  if (age <= 2) base *= 1.3;
  else if (age <= 5) base *= 1.1;
  else if (age > 15) base *= 0.9;

  // Engine size
  const cc = parseInt(data.vehicle.engineSize);
  if (cc >= 3000) base *= 1.5;
  else if (cc >= 2000) base *= 1.25;
  else if (cc >= 1600) base *= 1.1;
  else if (cc <= 1000) base *= 0.9;

  // Vehicle value
  if (data.vehicle.value > 50000) base *= 1.4;
  else if (data.vehicle.value > 25000) base *= 1.2;
  else if (data.vehicle.value > 10000) base *= 1.05;

  // Mileage
  if (data.vehicle.mileage > 20000) base *= 1.15;
  else if (data.vehicle.mileage < 5000) base *= 0.9;

  // Fuel type
  if (data.vehicle.fuelType === "electric") base *= 0.9;

  // Main driver factors
  const mainDriver = data.drivers.find((d) => d.isMainDriver) || data.drivers[0];
  if (mainDriver) {
    const driverAge = new Date().getFullYear() - new Date(mainDriver.dateOfBirth).getFullYear();
    if (driverAge < 21) base *= 2.2;
    else if (driverAge < 25) base *= 1.7;
    else if (driverAge < 30) base *= 1.3;
    else if (driverAge > 70) base *= 1.4;
    else if (driverAge > 60) base *= 1.1;

    // NCB discount
    const ncbDiscount = Math.min(mainDriver.ncbYears * 0.1, 0.6);
    base *= 1 - ncbDiscount;

    // Licence years
    if (mainDriver.licenceYears < 1) base *= 1.5;
    else if (mainDriver.licenceYears < 2) base *= 1.3;
    else if (mainDriver.licenceYears < 3) base *= 1.15;

    // Claims
    base *= 1 + mainDriver.claimsHistory * 0.3;

    // Convictions
    base *= 1 + mainDriver.convictions * 0.5;
  }

  // Additional drivers (each adds a small cost)
  const additionalDrivers = data.drivers.filter((d) => !d.isMainDriver);
  base *= 1 + additionalDrivers.length * 0.05;

  const annual = Math.round(base * 100) / 100;
  const monthly = Math.round((annual / 12) * 1.05 * 100) / 100; // 5% installment fee

  return { annual, monthly };
}
