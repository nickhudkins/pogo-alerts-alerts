const MINUTES = 1000 * 60;
const HOURS = 60 * MINUTES;

/*
 * You may add accounts here. You can turn them on or off,
 * by setting watching to `true` or `false`. You can also
 * adjust what is considered "DOWN" by setting `timeoutMS`.
 * Adjust `alertIntervalMS` to adjust how often you are alerted
 * while the account is down.
 */
const accounts = [
  { accountName: 'PGANCOLoveland', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'pgancoboulder', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANCOLongmont', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANCOFortColli', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANCONorthglen', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANCOGolden', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANCODenverAD', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANDenverGreen', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANCOLakewood6', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANCOLakewoodS', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANCODenverLod', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANVACentralCh', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANVARVRoanoke', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANVARVSalem', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANVARVRoCo', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANVARVAFarmvi', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PoGoRVAFWE', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PoGoRVAGlenSide', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PoGoRVAMechanic', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PoGoRVACity', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANVARVAColoni', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PoGoRVACityPoin', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PoGoRVABranderm', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PoGoRVAChesterf', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PoGoHROceanview', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'pganvahryorktow', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANVAHRSuffolk', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANVAHRFrankli', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PoGoHRGreenbrie', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PoGoHROceanfron', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PoGoHRDTNorfolk', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PoGoHRGlouceste', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'pganvahrnn', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANVAHRHampton', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANVANRVChrist', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANVANRVBlacks', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANVANRVRadfor', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PoGoNoVaAlexand', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PoGoNoVaArlingt', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANVANoVaResto', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANVANoVASprin', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANVANovaSterl', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANVANoVACrysc', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PoGoDCDowntown', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'pganmdbmorenort', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'pganmdbmorecity', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANMDColumbia', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANMDMoCoRockv', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANMDMoCoWheat', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANMDMoCoNBeth', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES },
  { accountName: 'PGANMDMoCoGaith', watching: true, timeoutMS: 1.25 * HOURS, alertIntervalMS: 30 * MINUTES }
];

/*
 * We make sure that whatever is entered is transformed
 * to lowercase so that we can predictably find things
 * without needing IDs, since the accountName will function
 * as such here.
 */
module.exports = accounts.map((obj) => Object.assign({}, obj, { accountName: obj.accountName.toLowerCase() }))
