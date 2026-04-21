import { getCurrentUTCOffset } from '../utils/timezone';

export { getCurrentUTCOffset };

// ISO 3166-1 numeric code → IANA timezone identifier (primary/most-populous zone per country)
// Sorted by numeric ISO code ascending
export const countryIANATimezones: Record<number, string> = {
  4: 'Asia/Kabul',           // Afghanistan
  8: 'Europe/Tirane',        // Albania
  12: 'Africa/Algiers',      // Algeria
  24: 'Africa/Luanda',       // Angola
  31: 'Asia/Baku',           // Azerbaijan
  32: 'America/Argentina/Buenos_Aires', // Argentina
  36: 'Australia/Sydney',    // Australia
  40: 'Europe/Vienna',       // Austria
  44: 'America/Nassau',      // Bahamas
  50: 'Asia/Dhaka',          // Bangladesh
  51: 'Asia/Yerevan',        // Armenia
  56: 'Europe/Brussels',     // Belgium
  64: 'Asia/Thimphu',        // Bhutan
  68: 'America/La_Paz',      // Bolivia
  70: 'Europe/Sarajevo',     // Bosnia and Herzegovina
  72: 'Africa/Gaborone',     // Botswana
  76: 'America/Sao_Paulo',   // Brazil
  84: 'America/Belize',      // Belize
  90: 'Pacific/Guadalcanal', // Solomon Islands
  96: 'Asia/Brunei',         // Brunei
  100: 'Europe/Sofia',       // Bulgaria
  104: 'Asia/Yangon',        // Myanmar
  108: 'Africa/Bujumbura',   // Burundi
  112: 'Europe/Minsk',       // Belarus
  116: 'Asia/Phnom_Penh',    // Cambodia
  120: 'Africa/Douala',      // Cameroon
  124: 'America/Toronto',    // Canada
  140: 'Africa/Bangui',      // Central African Republic
  144: 'Asia/Colombo',       // Sri Lanka
  148: 'Africa/Ndjamena',    // Chad
  152: 'America/Santiago',   // Chile
  156: 'Asia/Shanghai',      // China
  158: 'Asia/Taipei',        // Taiwan
  170: 'America/Bogota',     // Colombia
  174: 'Indian/Comoro',      // Comoros
  178: 'Africa/Brazzaville', // Republic of the Congo
  180: 'Africa/Kinshasa',    // DR Congo
  188: 'America/Costa_Rica', // Costa Rica
  191: 'Europe/Zagreb',      // Croatia
  192: 'America/Havana',     // Cuba
  196: 'Asia/Nicosia',       // Cyprus
  203: 'Europe/Prague',      // Czech Republic
  204: 'Africa/Porto-Novo',  // Benin
  208: 'Europe/Copenhagen',  // Denmark
  214: 'America/Santo_Domingo', // Dominican Republic
  218: 'America/Guayaquil',  // Ecuador
  222: 'America/El_Salvador', // El Salvador
  226: 'Africa/Malabo',      // Equatorial Guinea
  231: 'Africa/Addis_Ababa', // Ethiopia
  232: 'Africa/Asmara',      // Eritrea
  233: 'Europe/Tallinn',     // Estonia
  238: 'Atlantic/Stanley',   // Falkland Islands
  242: 'Pacific/Fiji',       // Fiji
  246: 'Europe/Helsinki',    // Finland
  250: 'Europe/Paris',       // France
  262: 'Africa/Djibouti',    // Djibouti
  266: 'Africa/Libreville',  // Gabon
  268: 'Asia/Tbilisi',       // Georgia
  270: 'Africa/Banjul',      // Gambia
  275: 'Asia/Hebron',        // Palestine
  276: 'Europe/Berlin',      // Germany
  288: 'Africa/Accra',       // Ghana
  300: 'Europe/Athens',      // Greece
  304: 'America/Nuuk',       // Greenland
  320: 'America/Guatemala',  // Guatemala
  324: 'Africa/Conakry',     // Guinea
  328: 'America/Guyana',     // Guyana
  332: 'America/Port-au-Prince', // Haiti
  340: 'America/Tegucigalpa', // Honduras
  348: 'Europe/Budapest',    // Hungary
  352: 'Atlantic/Reykjavik', // Iceland
  356: 'Asia/Kolkata',       // India
  360: 'Asia/Jakarta',       // Indonesia
  364: 'Asia/Tehran',        // Iran
  368: 'Asia/Baghdad',       // Iraq
  372: 'Europe/Dublin',      // Ireland
  376: 'Asia/Jerusalem',     // Israel
  380: 'Europe/Rome',        // Italy
  384: 'Africa/Abidjan',     // Ivory Coast
  388: 'America/Jamaica',    // Jamaica
  392: 'Asia/Tokyo',         // Japan
  398: 'Asia/Almaty',        // Kazakhstan
  400: 'Asia/Amman',         // Jordan
  404: 'Africa/Nairobi',     // Kenya
  408: 'Asia/Pyongyang',     // North Korea
  410: 'Asia/Seoul',         // South Korea
  414: 'Asia/Kuwait',        // Kuwait
  417: 'Asia/Bishkek',       // Kyrgyzstan
  418: 'Asia/Vientiane',     // Laos
  422: 'Asia/Beirut',        // Lebanon
  426: 'Africa/Maseru',      // Lesotho
  428: 'Europe/Riga',        // Latvia
  430: 'Africa/Monrovia',    // Liberia
  434: 'Africa/Tripoli',     // Libya
  440: 'Europe/Vilnius',     // Lithuania
  442: 'Europe/Luxembourg',  // Luxembourg
  450: 'Indian/Antananarivo', // Madagascar
  454: 'Africa/Blantyre',    // Malawi
  458: 'Asia/Kuala_Lumpur',  // Malaysia
  466: 'Africa/Bamako',      // Mali
  478: 'Africa/Nouakchott',  // Mauritania
  484: 'America/Mexico_City', // Mexico
  496: 'Asia/Ulaanbaatar',   // Mongolia
  498: 'Europe/Chisinau',    // Moldova
  499: 'Europe/Podgorica',   // Montenegro
  504: 'Africa/Casablanca',  // Morocco
  508: 'Africa/Maputo',      // Mozambique
  512: 'Asia/Muscat',        // Oman
  516: 'Africa/Windhoek',    // Namibia
  524: 'Asia/Kathmandu',     // Nepal
  528: 'Europe/Amsterdam',   // Netherlands
  540: 'Pacific/Noumea',     // New Caledonia
  548: 'Pacific/Efate',      // Vanuatu
  554: 'Pacific/Auckland',   // New Zealand
  558: 'America/Managua',    // Nicaragua
  562: 'Africa/Niamey',      // Niger
  566: 'Africa/Lagos',       // Nigeria
  578: 'Europe/Oslo',        // Norway
  586: 'Asia/Karachi',       // Pakistan
  591: 'America/Panama',     // Panama
  598: 'Pacific/Port_Moresby', // Papua New Guinea
  600: 'America/Asuncion',   // Paraguay
  604: 'America/Lima',       // Peru
  608: 'Asia/Manila',        // Philippines
  616: 'Europe/Warsaw',      // Poland
  620: 'Europe/Lisbon',      // Portugal
  624: 'Africa/Bissau',      // Guinea-Bissau
  626: 'Asia/Dili',          // Timor-Leste
  630: 'America/Puerto_Rico', // Puerto Rico
  634: 'Asia/Qatar',         // Qatar
  642: 'Europe/Bucharest',   // Romania
  643: 'Europe/Moscow',      // Russia
  646: 'Africa/Kigali',      // Rwanda
  682: 'Asia/Riyadh',        // Saudi Arabia
  686: 'Africa/Dakar',       // Senegal
  688: 'Europe/Belgrade',    // Serbia
  694: 'Africa/Freetown',    // Sierra Leone
  703: 'Europe/Bratislava',  // Slovakia
  704: 'Asia/Ho_Chi_Minh',   // Vietnam
  705: 'Europe/Ljubljana',   // Slovenia
  706: 'Africa/Mogadishu',   // Somalia
  710: 'Africa/Johannesburg', // South Africa
  716: 'Africa/Harare',      // Zimbabwe
  724: 'Europe/Madrid',      // Spain
  728: 'Africa/Juba',        // South Sudan
  729: 'Africa/Khartoum',    // Sudan
  // 736 = old Sudan numeric code, not used in world-atlas (superseded by 729)
  732: 'Africa/El_Aaiun',    // Western Sahara
  740: 'America/Paramaribo', // Suriname
  748: 'Africa/Mbabane',     // Eswatini
  752: 'Europe/Stockholm',   // Sweden
  756: 'Europe/Zurich',      // Switzerland
  760: 'Asia/Damascus',      // Syria
  762: 'Asia/Dushanbe',      // Tajikistan
  764: 'Asia/Bangkok',       // Thailand
  768: 'Africa/Lome',        // Togo
  780: 'America/Port_of_Spain', // Trinidad and Tobago
  784: 'Asia/Dubai',         // UAE
  788: 'Africa/Tunis',       // Tunisia
  792: 'Europe/Istanbul',    // Turkey
  795: 'Asia/Ashgabat',      // Turkmenistan
  800: 'Africa/Kampala',     // Uganda
  804: 'Europe/Kyiv',        // Ukraine
  807: 'Europe/Skopje',      // North Macedonia
  818: 'Africa/Cairo',       // Egypt
  826: 'Europe/London',      // United Kingdom
  834: 'Africa/Dar_es_Salaam', // Tanzania
  840: 'America/New_York',   // United States
  854: 'Africa/Ouagadougou', // Burkina Faso
  858: 'America/Montevideo', // Uruguay
  860: 'Asia/Tashkent',      // Uzbekistan
  862: 'America/Caracas',    // Venezuela
  887: 'Asia/Aden',          // Yemen
  894: 'Africa/Lusaka',      // Zambia
};

// Pre-compute current (DST-aware) offsets for all countries once on load
export const countryCurrentOffsets: Record<number, number> = Object.fromEntries(
  Object.entries(countryIANATimezones).map(([id, tz]) => [
    Number(id),
    getCurrentUTCOffset(tz),
  ])
);
