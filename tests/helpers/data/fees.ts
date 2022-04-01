// export const feeSpecification = {
//   payload: {
//     FeeConfigurationSpec:
//       'LNPY1221 NGN * *(*) : APPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\nLNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 50:1.4\nLNPY1224 NGN * BANK-ACCOUNT(*) : APPLY FLAT 100\nLNPY1225 NGN * USSD(MTN) : APPLY PERC 0.55',
//   },
//   expectedResponse: {
//     code: 200,
//     success: true,
//     message: 'Successfully created fee configuration',
//   },
// };

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

export const feeSpecification = {
  payload: {
    FeeConfigurationSpec:
      'FWLNAA01 NGN * BANK-ACCOUNT(UBA) : APPLY FLAT_PERC 25:2\nFWLNAA02 NGN LOCL *(*) : APPLY FLAT_PERC 50:1.2\nFWLNAA08 NGN INTL DEBIT-CARD(539983) : APPLY PERC 5.5\nFWLNAA03 NGN * USSD(GLOBACOM) : APPLY FLAT 65\nFWLNAA09 NGN * USSD(MTN) : APPLY FLAT 35\nFWLNAA04 NGN * BANK-ACCOUNT(*) : APPLY FLAT 35\nFWLNAA06 NGN INTL CREDIT-CARD(*) : APPLY PERC 2.0\nFWLNAA01 NGN * *(*) : APPLY PERC 5\nFWLNAA10 NGN * BANK-ACCOUNT(FBN) : APPLY FLAT_PERC 15:1.5\nFWLNAA11 NGN * BANK-ACCOUNT(GTB) : APPLY FLAT_PERC 11:1\nFWLNAA07 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 2.5',
  },
  expectedResponse: {
    code: 200,
    success: true,
    message: 'Successfully created fee configuration',
  },
};
