export const correctSampleData = {
  payload: {
    FeeConfigurationSpec:
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
