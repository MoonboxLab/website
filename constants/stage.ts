
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


export const PresaleMintStartTime = "2023-07-31 16:50:00"
export const PresaleMintEndTime = "2023-07-31 16:51:00"

export const PublicMintStartTime = "2023-07-31 16:52:00"
export const PublicMintEndTime = "2023-08-30 16:53:00"
