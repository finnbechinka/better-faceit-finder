import Player from "../types/Player";
import API from "./API";

function convertToSteam32ID(steamString: String): bigint {
  let array = steamString.split(":");
  let Y = BigInt(array[1]);
  let Z = BigInt(array[2]);
  return (Z << 1n) | Y;
}

function convertToSteam64ID(accountID: bigint): bigint {
  let Universe = 1n << 56n;
  let AccountType = 1n << 52n;
  let Instance = 1n << 32n;
  return Universe | AccountType | Instance | accountID;
}

function parseStatus(status: string): { name: string; steam64: bigint }[] {
  let ids: string[] = [];
  let names: string[] = [];
  let players: { name: string; steam64: bigint }[] = [];
  const lines = status.split("#");
  for (let line of lines) {
    const start = line.search(/STEAM_.+/);
    if (start == -1) {
      continue;
    }
    for (let i = start; i < line.length; i++) {
      if (line[i] == " ") {
        ids.push(line.slice(start, i));
        break;
      }
    }
    const name = line.split('"')[1];
    names.push(name);
  }
  let steam64Ids = [];
  for (let id of ids) {
    steam64Ids.push(convertToSteam64ID(convertToSteam32ID(id)));
  }

  for (let player in steam64Ids) {
    players.push({ name: names[player], steam64: steam64Ids[player] });
  }
  return players;
}

async function getPlayerInfos(
  parsedStatus: { name: string; steam64: bigint }[]
): Promise<Player[]> {
  return new Promise(async (resolve, reject) => {
    let players: Player[] = [];
    for (let ps of parsedStatus) {
      let player: Player = {
        steamName: ps.name,
        steamId64: ps.steam64.toString(),
        bans: {},
        ranks: {},
      };

      const leetify = await API.getLeetifyData(ps.steam64);
      if (leetify) {
        player.faceitName = leetify.faceitNickname;
        player.ranks = leetify.ranks;
        for (let ban of leetify.platformBans) {
          switch (ban) {
            case "matchmaking":
              player.bans.matchmaking = true;
              break;
            case "esportal":
              player.bans.esportal = true;
              break;
            case "faceit":
              player.bans.faceit = true;
              break;
          }
        }
      }

      const faceit = await API.getFaceitData(ps.steam64);
      if (faceit) {
        player.bans.faceit = faceit.banned;
        player.faceitName = faceit.faceitNickname;
        player.faceitElo = faceit.faceitElo;
        player.ranks.faceit = faceit.faceitLvl;
      }

      players.push(player);
    }
    resolve(players);
  });
}

export default { parseStatus, getPlayerInfos };
