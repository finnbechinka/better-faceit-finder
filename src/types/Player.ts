type Player = {
  steamName: string;
  steamId64: bigint;
  bans: { matchmaking: boolean; faceit: boolean; esportal: boolean };
  ranks: { matchmaking?: number; faceit?: number; esportal?: number };
  faceitName?: string;
  faceitElo?: number;
  faceitMatches?: number;
};

export default Player;
