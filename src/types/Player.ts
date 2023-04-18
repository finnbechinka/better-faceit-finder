type Player = {
  steamName: string;
  steamId64: string;
  bans: { matchmaking?: boolean; faceit?: boolean; esportal?: boolean };
  ranks: { matchmaking?: number; faceit?: number; esportal?: number };
  faceitName?: string;
  faceitElo?: number;
  faceitMatches?: number;
  steamPfpLink?: string;
};

export default Player;
