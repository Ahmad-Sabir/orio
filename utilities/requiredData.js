let countries = [
    {
      "country": {
        "name": "Afghanistan",
        "dial_code": "+93",
        "code": "AF"
      },
      "symbol": "Af",
      "name": "Afghan Afghani",
      "symbol_native": "؋",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "AFN",
      "name_plural": "Afghan Afghanis",
      "mask": "+93-##-###-####"
    },
    {
      "country": {
        "name": "Albania",
        "dial_code": "+355",
        "code": "AL"
      },
      "symbol": "ALL",
      "name": "Albanian Lek",
      "symbol_native": "Lek",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "ALL",
      "name_plural": "Albanian lekë",
      "mask": "+355(###)###-###"
    },
    {
      "country": {
        "name": "Algeria",
        "dial_code": "+213",
        "code": "DZ"
      },
      "symbol": "DA",
      "name": "Algerian Dinar",
      "symbol_native": "د.ج.‏",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "DZD",
      "name_plural": "Algerian dinars",
      "mask": "+213-##-###-####"
    },
    {
      "country": {
        "name": "Argentina",
        "dial_code": "+54",
        "code": "AR"
      },
      "symbol": "AR$",
      "name": "Argentine Peso",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "ARS",
      "name_plural": "Argentine pesos",
      "mask": "+54(###)###-####"
    },
    {
      "country": {
        "name": "Armenia",
        "dial_code": "+374",
        "code": "AM"
      },
      "symbol": "AMD",
      "name": "Armenian Dram",
      "symbol_native": "դր.",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "AMD",
      "name_plural": "Armenian drams",
      "mask": "+374-##-###-###"
    },
    {
      "country": {
        "name": "Australia",
        "dial_code": "+61",
        "code": "AU"
      },
      "symbol": "AU$",
      "name": "Australian Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "AUD",
      "name_plural": "Australian dollars",
      "mask": "+61-#-####-####"
    },
    {
      "country": {
        "name": "Azerbaijan",
        "dial_code": "+994",
        "code": "AZ"
      },
      "symbol": "man.",
      "name": "Azerbaijani Manat",
      "symbol_native": "ман.",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "AZN",
      "name_plural": "Azerbaijani manats",
      "mask": "+994-##-###-##-##"
    },
    {
      "country": {
        "name": "Bahrain",
        "dial_code": "+973",
        "code": "BH"
      },
      "symbol": "BD",
      "name": "Bahraini Dinar",
      "symbol_native": "د.ب.‏",
      "decimal_digits": 3,
      "rounding": 0,
      "code": "BHD",
      "name_plural": "Bahraini dinars",
      "mask": "+973-####-####"
    },
    {
      "country": {
        "name": "Bangladesh",
        "dial_code": "+880",
        "code": "BD"
      },
      "symbol": "Tk",
      "name": "Bangladeshi Taka",
      "symbol_native": "৳",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "BDT",
      "name_plural": "Bangladeshi takas",
      "mask": "+880-##-###-###"
    },
    {
      "country": {
        "name": "Belarus",
        "dial_code": "+375",
        "code": "BY"
      },
      "symbol": "BYR",
      "name": "Belarusian Ruble",
      "symbol_native": "BYR",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "BYR",
      "name_plural": "Belarusian rubles",
      "mask": "+375(##)###-##-##"
    },
    {
      "country": {
        "name": "Belize",
        "dial_code": "+501",
        "code": "BZ"
      },
      "symbol": "BZ$",
      "name": "Belize Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "BZD",
      "name_plural": "Belize dollars",
      "mask": "+501-###-####"
    },
    {
      "country": {
        "name": "Bolivia, Plurinational State of",
        "dial_code": "+591",
        "code": "BO"
      },
      "symbol": "Bs",
      "name": "Bolivian Boliviano",
      "symbol_native": "Bs",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "BOB",
      "name_plural": "Bolivian bolivianos",
      "mask": "+591-#-###-####"
    },
    {
      "country": {
        "name": "Bosnia and Herzegovina",
        "dial_code": "+387",
        "code": "BA"
      },
      "symbol": "KM",
      "name": "Bosnia-Herzegovina Convertible Mark",
      "symbol_native": "KM",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "BAM",
      "name_plural": "Bosnia-Herzegovina convertible marks",
      "mask": "+387-##-####"
    },
    {
      "country": {
        "name": "Botswana",
        "dial_code": "+267",
        "code": "BW"
      },
      "symbol": "BWP",
      "name": "Botswanan Pula",
      "symbol_native": "P",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "BWP",
      "name_plural": "Botswanan pulas",
      "mask": "+267-##-###-###"
    },
    {
      "country": {
        "name": "Brazil",
        "dial_code": "+55",
        "code": "BR"
      },
      "symbol": "R$",
      "name": "Brazilian Real",
      "symbol_native": "R$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "BRL",
      "name_plural": "Brazilian reals",
      "mask": "+55(##)9####-####"
    },
    {
      "country": {
        "name": "Brunei Darussalam",
        "dial_code": "+673",
        "code": "BN"
      },
      "symbol": "BN$",
      "name": "Brunei Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "BND",
      "name_plural": "Brunei dollars",
      "mask": "+673-###-####"
    },
    {
      "country": {
        "name": "Bulgaria",
        "dial_code": "+359",
        "code": "BG"
      },
      "symbol": "BGN",
      "name": "Bulgarian Lev",
      "symbol_native": "лв.",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "BGN",
      "name_plural": "Bulgarian leva",
      "mask": "+359(###)###-###"
    },
    {
      "country": {
        "name": "Burundi",
        "dial_code": "+257",
        "code": "BI"
      },
      "symbol": "FBu",
      "name": "Burundian Franc",
      "symbol_native": "FBu",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "BIF",
      "name_plural": "Burundian francs",
      "mask": "+257-##-##-####"
    },
    {
      "country": {
        "name": "Cambodia",
        "dial_code": "+855",
        "code": "KH"
      },
      "symbol": "KHR",
      "name": "Cambodian Riel",
      "symbol_native": "៛",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "KHR",
      "name_plural": "Cambodian riels",
      "mask": "+855-##-###-###"
    },
    {
      "country": {
        "name": "Canada",
        "dial_code": "+1",
        "code": "CA"
      },
      "symbol": "CA$",
      "name": "Canadian Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "CAD",
      "name_plural": "Canadian dollars",
      "mask": "+1(###)###-####"
    },
    {
      "country": {
        "name": "Cape Verde",
        "dial_code": "+238",
        "code": "CV"
      },
      "symbol": "CV$",
      "name": "Cape Verdean Escudo",
      "symbol_native": "CV$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "CVE",
      "name_plural": "Cape Verdean escudos",
      "mask": "+238(###)##-##"
    },
    {
      "country": {
        "name": "Chile",
        "dial_code": "+56",
        "code": "CL"
      },
      "symbol": "CL$",
      "name": "Chilean Peso",
      "symbol_native": "$",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "CLP",
      "name_plural": "Chilean pesos",
      "mask": "+56-#-####-####"
    },
    {
      "country": {
        "name": "China",
        "dial_code": "+86",
        "code": "CN"
      },
      "symbol": "CN¥",
      "name": "Chinese Yuan",
      "symbol_native": "CN¥",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "CNY",
      "name_plural": "Chinese yuan",
      "mask": "+86-##-#####-#####"
    },
    {
      "country": {
        "name": "Colombia",
        "dial_code": "+57",
        "code": "CO"
      },
      "symbol": "CO$",
      "name": "Colombian Peso",
      "symbol_native": "$",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "COP",
      "name_plural": "Colombian pesos",
      "mask": "+57(###)###-####"
    },
    {
      "country": {
        "name": "Comoros",
        "dial_code": "+269",
        "code": "KM"
      },
      "symbol": "CF",
      "name": "Comorian Franc",
      "symbol_native": "FC",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "KMF",
      "name_plural": "Comorian francs",
      "mask": "+269-##-#####"
    },
    {
      "country": {
        "name": "Congo, The Democratic Republic of the",
        "dial_code": "+243",
        "code": "CD"
      },
      "symbol": "CDF",
      "name": "Congolese Franc",
      "symbol_native": "FrCD",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "CDF",
      "name_plural": "Congolese francs",
      "mask": "+243(###)###-###"
    },
    {
      "country": {
        "name": "Costa Rica",
        "dial_code": "+506",
        "code": "CR"
      },
      "symbol": "₡",
      "name": "Costa Rican Colón",
      "symbol_native": "₡",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "CRC",
      "name_plural": "Costa Rican colóns",
      "mask": "+506-####-####"
    },
    {
      "country": {
        "name": "Croatia",
        "dial_code": "+385",
        "code": "HR"
      },
      "symbol": "kn",
      "name": "Croatian Kuna",
      "symbol_native": "kn",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "HRK",
      "name_plural": "Croatian kunas",
      "mask": "+385-##-###-###"
    },
    {
      "country": {
        "name": "Czech Republic",
        "dial_code": "+420",
        "code": "CZ"
      },
      "symbol": "Kč",
      "name": "Czech Republic Koruna",
      "symbol_native": "Kč",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "CZK",
      "name_plural": "Czech Republic korunas",
      "mask": "+420(###)###-###"
    },
    {
      "country": {
        "name": "Denmark",
        "dial_code": "+45",
        "code": "DK"
      },
      "symbol": "Dkr",
      "name": "Danish Krone",
      "symbol_native": "kr",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "DKK",
      "name_plural": "Danish kroner",
      "mask": "+45-##-##-##-##"
    },
    {
      "country": {
        "name": "Djibouti",
        "dial_code": "+253",
        "code": "DJ"
      },
      "symbol": "Fdj",
      "name": "Djiboutian Franc",
      "symbol_native": "Fdj",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "DJF",
      "name_plural": "Djiboutian francs",
      "mask": "+253-##-##-##-##"
    },
    {
      "country": {
        "name": "Dominican Republic",
        "dial_code": "+1 849",
        "code": "DO"
      },
      "symbol": "RD$",
      "name": "Dominican Peso",
      "symbol_native": "RD$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "DOP",
      "name_plural": "Dominican pesos",
      "mask": "+1(849)###-####"
    },
    {
      "country": {
        "name": "Egypt",
        "dial_code": "+20",
        "code": "EG"
      },
      "symbol": "EGP",
      "name": "Egyptian Pound",
      "symbol_native": "ج.م.‏",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "EGP",
      "name_plural": "Egyptian pounds",
      "mask": "+20(###)###-####"
    },
    {
      "country": {
        "name": "Eritrea",
        "dial_code": "+291",
        "code": "ER"
      },
      "symbol": "Nfk",
      "name": "Eritrean Nakfa",
      "symbol_native": "Nfk",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "ERN",
      "name_plural": "Eritrean nakfas",
      "mask": "+291-#-###-###"
    },
    {
      "country": {
        "name": "Estonia",
        "dial_code": "+372",
        "code": "EE"
      },
      "symbol": "Ekr",
      "name": "Estonian Kroon",
      "symbol_native": "kr",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "EEK",
      "name_plural": "Estonian kroons",
      "mask": "+372-###-####"
    },
    {
      "country": {
        "name": "Ethiopia",
        "dial_code": "+251",
        "code": "ET"
      },
      "symbol": "Br",
      "name": "Ethiopian Birr",
      "symbol_native": "Br",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "ETB",
      "name_plural": "Ethiopian birrs",
      "mask": "+251-##-###-####"
    },
    {
      "country": {
        "name": "Georgia",
        "dial_code": "+995",
        "code": "GE"
      },
      "symbol": "GEL",
      "name": "Georgian Lari",
      "symbol_native": "GEL",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "GEL",
      "name_plural": "Georgian laris",
      "mask": "+995(###)###-###"
    },
    {
      "country": {
        "name": "Ghana",
        "dial_code": "+233",
        "code": "GH"
      },
      "symbol": "GH₵",
      "name": "Ghanaian Cedi",
      "symbol_native": "GH₵",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "GHS",
      "name_plural": "Ghanaian cedis",
      "mask": "+233(###)###-###"
    },
    {
      "country": {
        "name": "Guatemala",
        "dial_code": "+502",
        "code": "GT"
      },
      "symbol": "GTQ",
      "name": "Guatemalan Quetzal",
      "symbol_native": "Q",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "GTQ",
      "name_plural": "Guatemalan quetzals",
      "mask": "+502-#-###-####"
    },
    {
      "country": {
        "name": "Guinea",
        "dial_code": "+224",
        "code": "GN"
      },
      "symbol": "FG",
      "name": "Guinean Franc",
      "symbol_native": "FG",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "GNF",
      "name_plural": "Guinean francs",
      "mask": "+224-##-###-###"
    },
    {
      "country": {
        "name": "Honduras",
        "dial_code": "+504",
        "code": "HN"
      },
      "symbol": "HNL",
      "name": "Honduran Lempira",
      "symbol_native": "L",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "HNL",
      "name_plural": "Honduran lempiras",
      "mask": "+504-####-####"
    },
    {
      "country": {
        "name": "Hong Kong",
        "dial_code": "+852",
        "code": "HK"
      },
      "symbol": "HK$",
      "name": "Hong Kong Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "HKD",
      "name_plural": "Hong Kong dollars",
      "mask": "+852-####-####"
    },
    {
      "country": {
        "name": "Hungary",
        "dial_code": "+36",
        "code": "HU"
      },
      "symbol": "Ft",
      "name": "Hungarian Forint",
      "symbol_native": "Ft",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "HUF",
      "name_plural": "Hungarian forints",
      "mask": "+36(###)###-###"
    },
    {
      "country": {
        "name": "Iceland",
        "dial_code": "+354",
        "code": "IS"
      },
      "symbol": "Ikr",
      "name": "Icelandic Króna",
      "symbol_native": "kr",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "ISK",
      "name_plural": "Icelandic krónur",
      "mask": "+354-###-####"
    },
    {
      "country": {
        "name": "India",
        "dial_code": "+91",
        "code": "IN"
      },
      "symbol": "Rs",
      "name": "Indian Rupee",
      "symbol_native": "টকা",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "INR",
      "name_plural": "Indian rupees",
      "mask": "+91(####)###-###"
    },
    {
      "country": {
        "name": "Indonesia",
        "dial_code": "+62",
        "code": "ID"
      },
      "symbol": "Rp",
      "name": "Indonesian Rupiah",
      "symbol_native": "Rp",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "IDR",
      "name_plural": "Indonesian rupiahs",
      "mask": "+62(8##)###-##-###"
    },
    {
      "country": {
        "name": "Iran, Islamic Republic of",
        "dial_code": "+98",
        "code": "IR"
      },
      "symbol": "IRR",
      "name": "Iranian Rial",
      "symbol_native": "﷼",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "IRR",
      "name_plural": "Iranian rials",
      "mask": "+98(###)###-####"
    },
    {
      "country": {
        "name": "Iraq",
        "dial_code": "+964",
        "code": "IQ"
      },
      "symbol": "IQD",
      "name": "Iraqi Dinar",
      "symbol_native": "د.ع.‏",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "IQD",
      "name_plural": "Iraqi dinars",
      "mask": "+964(###)###-####"
    },
    {
      "country": {
        "name": "Israel",
        "dial_code": "+972",
        "code": "IL"
      },
      "symbol": "₪",
      "name": "Israeli New Sheqel",
      "symbol_native": "₪",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "ILS",
      "name_plural": "Israeli new sheqels",
      "mask": "+972-#-###-####"
    },
    {
      "country": {
        "name": "Jamaica",
        "dial_code": "+1 876",
        "code": "JM"
      },
      "symbol": "J$",
      "name": "Jamaican Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "JMD",
      "name_plural": "Jamaican dollars",
      "mask": "+1(876)###-####"
    },
    {
      "country": {
        "name": "Japan",
        "dial_code": "+81",
        "code": "JP"
      },
      "symbol": "¥",
      "name": "Japanese Yen",
      "symbol_native": "￥",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "JPY",
      "name_plural": "Japanese yen",
      "mask": "+81(###)###-###"
    },
    {
      "country": {
        "name": "Jordan",
        "dial_code": "+962",
        "code": "JO"
      },
      "symbol": "JD",
      "name": "Jordanian Dinar",
      "symbol_native": "د.أ.‏",
      "decimal_digits": 3,
      "rounding": 0,
      "code": "JOD",
      "name_plural": "Jordanian dinars",
      "mask": "+962-#-####-####"
    },
    {
      "country": {
        "name": "Kazakhstan",
        "dial_code": "+7 7",
        "code": "KZ"
      },
      "symbol": "KZT",
      "name": "Kazakhstani Tenge",
      "symbol_native": "тңг.",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "KZT",
      "name_plural": "Kazakhstani tenges",
      "mask": "+7(7##)###-##-##"
    },
    {
      "country": {
        "name": "Kenya",
        "dial_code": "+254",
        "code": "KE"
      },
      "symbol": "Ksh",
      "name": "Kenyan Shilling",
      "symbol_native": "Ksh",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "KES",
      "name_plural": "Kenyan shillings",
      "mask": "+254-###-######"
    },
    {
      "country": {
        "name": "Korea, Republic of",
        "dial_code": "+82",
        "code": "KR"
      },
      "symbol": "₩",
      "name": "South Korean Won",
      "symbol_native": "₩",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "KRW",
      "name_plural": "South Korean won",
      "mask": "+82-##-###-####"
    },
    {
      "country": {
        "name": "Kuwait",
        "dial_code": "+965",
        "code": "KW"
      },
      "symbol": "KD",
      "name": "Kuwaiti Dinar",
      "symbol_native": "د.ك.‏",
      "decimal_digits": 3,
      "rounding": 0,
      "code": "KWD",
      "name_plural": "Kuwaiti dinars",
      "mask": "+965-####-####"
    },
    {
      "country": {
        "name": "Latvia",
        "dial_code": "+371",
        "code": "LV"
      },
      "symbol": "Ls",
      "name": "Latvian Lats",
      "symbol_native": "Ls",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "LVL",
      "name_plural": "Latvian lati",
      "mask": "+371-##-###-###"
    },
    {
      "country": {
        "name": "Lebanon",
        "dial_code": "+961",
        "code": "LB"
      },
      "symbol": "LB£",
      "name": "Lebanese Pound",
      "symbol_native": "ل.ل.‏",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "LBP",
      "name_plural": "Lebanese pounds",
      "mask": "+961-#-###-###"
    },
    {
      "country": {
        "name": "Libyan Arab Jamahiriya",
        "dial_code": "+218",
        "code": "LY"
      },
      "symbol": "LD",
      "name": "Libyan Dinar",
      "symbol_native": "د.ل.‏",
      "decimal_digits": 3,
      "rounding": 0,
      "code": "LYD",
      "name_plural": "Libyan dinars",
      "mask": "+218-21-###-####"
    },
    {
      "country": {
        "name": "Lithuania",
        "dial_code": "+370",
        "code": "LT"
      },
      "symbol": "Lt",
      "name": "Lithuanian Litas",
      "symbol_native": "Lt",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "LTL",
      "name_plural": "Lithuanian litai",
      "mask": "+370(###)##-###"
    },
    {
      "country": {
        "name": "Macao",
        "dial_code": "+853",
        "code": "MO"
      },
      "symbol": "MOP$",
      "name": "Macanese Pataca",
      "symbol_native": "MOP$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "MOP",
      "name_plural": "Macanese patacas",
      "mask": "+853-####-####"
    },
    {
      "country": {
        "name": "Macedonia, The Former Yugoslav Republic of",
        "dial_code": "+389",
        "code": "MK"
      },
      "symbol": "MKD",
      "name": "Macedonian Denar",
      "symbol_native": "MKD",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "MKD",
      "name_plural": "Macedonian denari",
      "mask": "+389-##-###-###"
    },
    {
      "country": {
        "name": "Madagascar",
        "dial_code": "+261",
        "code": "MG"
      },
      "symbol": "MGA",
      "name": "Malagasy Ariary",
      "symbol_native": "MGA",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "MGA",
      "name_plural": "Malagasy Ariaries",
      "mask": "+261-##-##-#####"
    },
    {
      "country": {
        "name": "Malaysia",
        "dial_code": "+60",
        "code": "MY"
      },
      "symbol": "RM",
      "name": "Malaysian Ringgit",
      "symbol_native": "RM",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "MYR",
      "name_plural": "Malaysian ringgits",
      "mask": "+60-#-###-###"
    },
    {
      "country": {
        "name": "Mauritius",
        "dial_code": "+230",
        "code": "MU"
      },
      "symbol": "MURs",
      "name": "Mauritian Rupee",
      "symbol_native": "MURs",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "MUR",
      "name_plural": "Mauritian rupees",
      "mask": "+230-###-####"
    },
    {
      "country": {
        "name": "Mexico",
        "dial_code": "+52",
        "code": "MX"
      },
      "symbol": "MX$",
      "name": "Mexican Peso",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "MXN",
      "name_plural": "Mexican pesos",
      "mask": "+52-##-##-####"
    },
    {
      "country": {
        "name": "Moldova, Republic of",
        "dial_code": "+373",
        "code": "MD"
      },
      "symbol": "MDL",
      "name": "Moldovan Leu",
      "symbol_native": "MDL",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "MDL",
      "name_plural": "Moldovan lei",
      "mask": "+373-####-####"
    },
    {
      "country": {
        "name": "Morocco",
        "dial_code": "+212",
        "code": "MA"
      },
      "symbol": "MAD",
      "name": "Moroccan Dirham",
      "symbol_native": "د.م.‏",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "MAD",
      "name_plural": "Moroccan dirhams",
      "mask": "+212-##-####-###"
    },
    {
      "country": {
        "name": "Mozambique",
        "dial_code": "+258",
        "code": "MZ"
      },
      "symbol": "MTn",
      "name": "Mozambican Metical",
      "symbol_native": "MTn",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "MZN",
      "name_plural": "Mozambican meticals",
      "mask": "+258-##-###-###"
    },
    {
      "country": {
        "name": "Myanmar",
        "dial_code": "+95",
        "code": "MM"
      },
      "symbol": "MMK",
      "name": "Myanma Kyat",
      "symbol_native": "K",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "MMK",
      "name_plural": "Myanma kyats",
      "mask": "+95-###-###"
    },
    {
      "country": {
        "name": "Namibia",
        "dial_code": "+264",
        "code": "NA"
      },
      "symbol": "N$",
      "name": "Namibian Dollar",
      "symbol_native": "N$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "NAD",
      "name_plural": "Namibian dollars",
      "mask": "+264-##-###-####"
    },
    {
      "country": {
        "name": "Nepal",
        "dial_code": "+977",
        "code": "NP"
      },
      "symbol": "NPRs",
      "name": "Nepalese Rupee",
      "symbol_native": "नेरू",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "NPR",
      "name_plural": "Nepalese rupees",
      "mask": "+977-##-###-###"
    },
    {
      "country": {
        "name": "New Zealand",
        "dial_code": "+64",
        "code": "NZ"
      },
      "symbol": "NZ$",
      "name": "New Zealand Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "NZD",
      "name_plural": "New Zealand dollars",
      "mask": "+64(###)###-####"
    },
    {
      "country": {
        "name": "Nicaragua",
        "dial_code": "+505",
        "code": "NI"
      },
      "symbol": "C$",
      "name": "Nicaraguan Córdoba",
      "symbol_native": "C$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "NIO",
      "name_plural": "Nicaraguan córdobas",
      "mask": "+505-####-####"
    },
    {
      "country": {
        "name": "Nigeria",
        "dial_code": "+234",
        "code": "NG"
      },
      "symbol": "₦",
      "name": "Nigerian Naira",
      "symbol_native": "₦",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "NGN",
      "name_plural": "Nigerian nairas",
      "mask": "+234(###)###-####"
    },
    {
      "country": {
        "name": "Norway",
        "dial_code": "+47",
        "code": "NO"
      },
      "symbol": "Nkr",
      "name": "Norwegian Krone",
      "symbol_native": "kr",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "NOK",
      "name_plural": "Norwegian kroner",
      "mask": "+47(###)##-###"
    },
    {
      "country": {
        "name": "Oman",
        "dial_code": "+968",
        "code": "OM"
      },
      "symbol": "OMR",
      "name": "Omani Rial",
      "symbol_native": "ر.ع.‏",
      "decimal_digits": 3,
      "rounding": 0,
      "code": "OMR",
      "name_plural": "Omani rials",
      "mask": "+968-##-###-###"
    },
    {
      "country": {
        "name": "Pakistan",
        "dial_code": "+92",
        "code": "PK"
      },
      "symbol": "PKRs",
      "name": "Pakistani Rupee",
      "symbol_native": "₨",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "PKR",
      "name_plural": "Pakistani rupees",
      "mask": "+92(###)###-####"
    },
    {
      "country": {
        "name": "Panama",
        "dial_code": "+507",
        "code": "PA"
      },
      "symbol": "B/.",
      "name": "Panamanian Balboa",
      "symbol_native": "B/.",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "PAB",
      "name_plural": "Panamanian balboas",
      "mask": "+507-###-####"
    },
    {
      "country": {
        "name": "Paraguay",
        "dial_code": "+595",
        "code": "PY"
      },
      "symbol": "₲",
      "name": "Paraguayan Guarani",
      "symbol_native": "₲",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "PYG",
      "name_plural": "Paraguayan guaranis",
      "mask": "+595(###)###-###"
    },
    {
      "country": {
        "name": "Peru",
        "dial_code": "+51",
        "code": "PE"
      },
      "symbol": "S/.",
      "name": "Peruvian Nuevo Sol",
      "symbol_native": "S/.",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "PEN",
      "name_plural": "Peruvian nuevos soles",
      "mask": "+51(###)###-###"
    },
    {
      "country": {
        "name": "Philippines",
        "dial_code": "+63",
        "code": "PH"
      },
      "symbol": "₱",
      "name": "Philippine Peso",
      "symbol_native": "₱",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "PHP",
      "name_plural": "Philippine pesos",
      "mask": "+63(###)###-####"
    },
    {
      "country": {
        "name": "Poland",
        "dial_code": "+48",
        "code": "PL"
      },
      "symbol": "zł",
      "name": "Polish Zloty",
      "symbol_native": "zł",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "PLN",
      "name_plural": "Polish zlotys",
      "mask": "+48(###)###-###"
    },
    {
      "country": {
        "name": "Qatar",
        "dial_code": "+974",
        "code": "QA"
      },
      "symbol": "QR",
      "name": "Qatari Rial",
      "symbol_native": "ر.ق.‏",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "QAR",
      "name_plural": "Qatari rials",
      "mask": "+974-####-####"
    },
    {
      "country": {
        "name": "Romania",
        "dial_code": "+40",
        "code": "RO"
      },
      "symbol": "RON",
      "name": "Romanian Leu",
      "symbol_native": "RON",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "RON",
      "name_plural": "Romanian lei",
      "mask": "+40-##-###-####"
    },
    {
      "country": {
        "name": "Russia",
        "dial_code": "+7",
        "code": "RU"
      },
      "symbol": "RUB",
      "name": "Russian Ruble",
      "symbol_native": "руб.",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "RUB",
      "name_plural": "Russian rubles",
      "mask": "+7(###)###-##-##"
    },
    {
      "country": {
        "name": "Rwanda",
        "dial_code": "+250",
        "code": "RW"
      },
      "symbol": "RWF",
      "name": "Rwandan Franc",
      "symbol_native": "FR",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "RWF",
      "name_plural": "Rwandan francs",
      "mask": "+250(###)###-###"
    },
    {
      "country": {
        "name": "Saudi Arabia",
        "dial_code": "+966",
        "code": "SA"
      },
      "symbol": "SR",
      "name": "Saudi Riyal",
      "symbol_native": "ر.س.‏",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "SAR",
      "name_plural": "Saudi riyals",
      "mask": "+966-#-###-####"
    },
    {
      "country": {
        "name": "Serbia",
        "dial_code": "+381",
        "code": "RS"
      },
      "symbol": "din.",
      "name": "Serbian Dinar",
      "symbol_native": "дин.",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "RSD",
      "name_plural": "Serbian dinars",
      "mask": "+381-##-###-####"
    },
    {
      "country": {
        "name": "Singapore",
        "dial_code": "+65",
        "code": "SG"
      },
      "symbol": "S$",
      "name": "Singapore Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "SGD",
      "name_plural": "Singapore dollars",
      "mask": "+65-####-####"
    },
    {
      "country": {
        "name": "Somalia",
        "dial_code": "+252",
        "code": "SO"
      },
      "symbol": "Ssh",
      "name": "Somali Shilling",
      "symbol_native": "Ssh",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "SOS",
      "name_plural": "Somali shillings",
      "mask": "+252-#-###-###"
    },
    {
      "country": {
        "name": "South Africa",
        "dial_code": "+27",
        "code": "ZA"
      },
      "symbol": "R",
      "name": "South African Rand",
      "symbol_native": "R",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "ZAR",
      "name_plural": "South African rand",
      "mask": "+27-##-###-####"
    },
    {
      "country": {
        "name": "Sri Lanka",
        "dial_code": "+94",
        "code": "LK"
      },
      "symbol": "SLRs",
      "name": "Sri Lankan Rupee",
      "symbol_native": "SL Re",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "LKR",
      "name_plural": "Sri Lankan rupees",
      "mask": "+94-##-###-####"
    },
    {
      "country": {
        "name": "Sudan",
        "dial_code": "+249",
        "code": "SD"
      },
      "symbol": "SDG",
      "name": "Sudanese Pound",
      "symbol_native": "SDG",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "SDG",
      "name_plural": "Sudanese pounds",
      "mask": "+249-##-###-####"
    },
    {
      "country": {
        "name": "Sweden",
        "dial_code": "+46",
        "code": "SE"
      },
      "symbol": "Skr",
      "name": "Swedish Krona",
      "symbol_native": "kr",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "SEK",
      "name_plural": "Swedish kronor",
      "mask": "+46-##-###-####"
    },
    {
      "country": {
        "name": "Switzerland",
        "dial_code": "+41",
        "code": "CH"
      },
      "symbol": "CHF",
      "name": "Swiss Franc",
      "symbol_native": "CHF",
      "decimal_digits": 2,
      "rounding": 0.05,
      "code": "CHF",
      "name_plural": "Swiss francs",
      "mask": "+41-##-###-####"
    },
    {
      "country": {
        "name": "Syrian Arab Republic",
        "dial_code": "+963",
        "code": "SY"
      },
      "symbol": "SY£",
      "name": "Syrian Pound",
      "symbol_native": "ل.س.‏",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "SYP",
      "name_plural": "Syrian pounds",
      "mask": "+963-##-####-###"
    },
    {
      "country": {
        "name": "Taiwan, Province of China",
        "dial_code": "+886",
        "code": "TW"
      },
      "symbol": "NT$",
      "name": "New Taiwan Dollar",
      "symbol_native": "NT$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "TWD",
      "name_plural": "New Taiwan dollars",
      "mask": "+886-####-####"
    },
    {
      "country": {
        "name": "Tanzania, United Republic of",
        "dial_code": "+255",
        "code": "TZ"
      },
      "symbol": "TSh",
      "name": "Tanzanian Shilling",
      "symbol_native": "TSh",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "TZS",
      "name_plural": "Tanzanian shillings",
      "mask": "+255-##-###-####"
    },
    {
      "country": {
        "name": "Thailand",
        "dial_code": "+66",
        "code": "TH"
      },
      "symbol": "฿",
      "name": "Thai Baht",
      "symbol_native": "฿",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "THB",
      "name_plural": "Thai baht",
      "mask": "+66-##-###-###"
    },
    {
      "country": {
        "name": "Tonga",
        "dial_code": "+676",
        "code": "TO"
      },
      "symbol": "T$",
      "name": "Tongan Paʻanga",
      "symbol_native": "T$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "TOP",
      "name_plural": "Tongan paʻanga",
      "mask": "+676-#####"
    },
    {
      "country": {
        "name": "Trinidad and Tobago",
        "dial_code": "+1 868",
        "code": "TT"
      },
      "symbol": "TT$",
      "name": "Trinidad and Tobago Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "TTD",
      "name_plural": "Trinidad and Tobago dollars",
      "mask": "+1(868)###-####"
    },
    {
      "country": {
        "name": "Tunisia",
        "dial_code": "+216",
        "code": "TN"
      },
      "symbol": "DT",
      "name": "Tunisian Dinar",
      "symbol_native": "د.ت.‏",
      "decimal_digits": 3,
      "rounding": 0,
      "code": "TND",
      "name_plural": "Tunisian dinars",
      "mask": "+216-##-###-###"
    },
    {
      "country": {
        "name": "Turkey",
        "dial_code": "+90",
        "code": "TR"
      },
      "symbol": "TL",
      "name": "Turkish Lira",
      "symbol_native": "TL",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "TRY",
      "name_plural": "Turkish Lira",
      "mask": "+90(###)###-####"
    },
    {
      "country": {
        "name": "Uganda",
        "dial_code": "+256",
        "code": "UG"
      },
      "symbol": "USh",
      "name": "Ugandan Shilling",
      "symbol_native": "USh",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "UGX",
      "name_plural": "Ugandan shillings",
      "mask": "+256(###)###-###"
    },
    {
      "country": {
        "name": "Ukraine",
        "dial_code": "+380",
        "code": "UA"
      },
      "symbol": "₴",
      "name": "Ukrainian Hryvnia",
      "symbol_native": "₴",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "UAH",
      "name_plural": "Ukrainian hryvnias",
      "mask": "+380(##)###-##-##"
    },
    {
      "country": {
        "name": "United Arab Emirates",
        "dial_code": "+971",
        "code": "AE"
      },
      "symbol": "AED",
      "name": "United Arab Emirates Dirham",
      "symbol_native": "د.إ.‏",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "AED",
      "name_plural": "UAE dirhams",
      "mask": "+971-#-###-####"
    },
    {
      "country": {
        "name": "United States",
        "dial_code": "+1",
        "code": "US"
      },
      "symbol": "$",
      "name": "US Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "USD",
      "name_plural": "US dollars",
      "mask": "+1(###)###-####"
    },
    {
      "country": {
        "name": "Uruguay",
        "dial_code": "+598",
        "code": "UY"
      },
      "symbol": "$U",
      "name": "Uruguayan Peso",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "UYU",
      "name_plural": "Uruguayan pesos",
      "mask": "+598-#-###-##-##"
    },
    {
      "country": {
        "name": "Uzbekistan",
        "dial_code": "+998",
        "code": "UZ"
      },
      "symbol": "UZS",
      "name": "Uzbekistan Som",
      "symbol_native": "UZS",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "UZS",
      "name_plural": "Uzbekistan som",
      "mask": "+998-##-###-####"
    },
    {
      "country": {
        "name": "Venezuela, Bolivarian Republic of",
        "dial_code": "+58",
        "code": "VE"
      },
      "symbol": "Bs.F.",
      "name": "Venezuelan Bolívar",
      "symbol_native": "Bs.F.",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "VEF",
      "name_plural": "Venezuelan bolívars",
      "mask": "+58(###)###-####"
    },
    {
      "country": {
        "name": "Viet Nam",
        "dial_code": "+84",
        "code": "VN"
      },
      "symbol": "₫",
      "name": "Vietnamese Dong",
      "symbol_native": "₫",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "VND",
      "name_plural": "Vietnamese dong",
      "mask": "+84(###)####-###"
    },
    {
      "country": {
        "name": "Yemen",
        "dial_code": "+967",
        "code": "YE"
      },
      "symbol": "YR",
      "name": "Yemeni Rial",
      "symbol_native": "ر.ي.‏",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "YER",
      "name_plural": "Yemeni rials",
      "mask": "+967-##-###-###"
    },
    {
      "country": {
        "name": "Zambia",
        "dial_code": "+260",
        "code": "ZM"
      },
      "symbol": "ZK",
      "name": "Zambian Kwacha",
      "symbol_native": "ZK",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "ZMK",
      "name_plural": "Zambian kwachas",
      "mask": "+260-##-###-####"
    }
  ];

module.exports = {
    countries
}