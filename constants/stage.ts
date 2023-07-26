

export enum StageType {
  WhitelistPhase,
  Presale,
  PublicSale,
  EndSale,
}

export const StagesInfo = {
  [StageType.WhitelistPhase]: {
    name: 'Whitelist Phase',
    desc: 'Be active. Show support. Get whitelist.'
  },
  [StageType.Presale]: {
    name: "Presale",
    desc: 'Be proud. Get on board.9/18/2023 10:30 (OTC+0)'
  },
  [StageType.PublicSale]: {
    name: 'Public Sale',
    desc: 'Be quick. Set sail.9/18/2023 10:30 (OTC+0)'
  },
  [StageType.EndSale]: {
    name: 'Public sale end',
    desc: "Be visionary. Show love. Get wild."
  }
}