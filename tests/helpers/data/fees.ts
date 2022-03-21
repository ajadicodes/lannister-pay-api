export const correctSampleData = {
  payload: {
    FeeConfigurationSpec:
      // 'LNPY8222 NGN INTL CREDIT-CARD(MASTERCARD) : APPLY PERC 3.8\nLNPY8223 NGN LOCL CREDIT-CARD(GTBANK) : APPLY PERC 2.8\nLNPY8224 NGN LOCL CREDIT-CARD(530191******2903) : APPLY PERC 3.8\nLNPY8225 NGN LOCL USSD(MTN) : APPLY PERC 3.8\nLNPY8226 NGN LOCL USSD(08032211002) : APPLY PERC 3.8',
      'LNPY1221 NGN * *(*) : APPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\nLNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 50:1.4\nLNPY1224 NGN * BANK-ACCOUNT(*) : APPLY FLAT 100\nLNPY1225 NGN * USSD(MTN) : APPLY PERC 0.55',
  },
  expectedResponse: {
    code: 200,
    success: true,
    message: 'Successfully created fee configuration',
  },
};

export const badlyFormattedFeeConfigSpec = {
  payload: {
    FeeConfigurationSpec:
      'LNPY1221 NGN * *(*): APPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\nLNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 50:1.4\nLNPY1224 NGN * BANK-ACCOUNT(*) : APPLY FLAT 100\nLNPY1225 NGN * USSD(MTN) : APPLY PERC 0.55',
  },
  expectedResponse: {
    code: 400,
    success: false,
  },
};
