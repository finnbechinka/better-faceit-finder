import { ReactNode, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import API from "./util/API";
import Misc from "./util/Misc";
import Player from "./types/Player";

function App() {
  const [playerInfos, setPlayerInfos] = useState<Player[] | null>(null);
  const testInput =
    '# userid name uniqueid connected ping loss state rate\n# 470 2 "FBIRTX" STEAM_1:0:717341234 11:04 52 0 active 196608\n# 484 3 "Didn\'t" STEAM_1:0:126396930 01:03 114 0 active 196608\n# 496 4 "shaker" STEAM_1:1:48064704 00:22 48 0 active 786432\n# 497 5 "FabMaster" STEAM_1:0:21865402 00:17 70 78 active 128000\n# 506 6 "Sandman" STEAM_1:1:544579748 00:11 115 78 active 196608\n# 480 7 "Jerry" STEAM_1:0:158348903 05:09 62 0 active 128000\n# 444 8 "2+1" STEAM_1:1:95582685 12:50 48 0 active 786432\n# 270 9 "eVAN" STEAM_1:1:565628199  1:35:10 46 0 spawning 196608\n# 479 11 "손채영" STEAM_1:1:98330655 09:03 49 0 active 196608\n#end';

  async function lookup(e: React.SyntheticEvent): Promise<void> {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      status: { value: string };
    };
    let ids = await Misc.parseStatus(target.status.value);
    setPlayerInfos(await Misc.getPlayerInfos(ids));
  }

  return (
    <div className="App">
      <main>
        <div className="mainContainer">
          <form onSubmit={lookup}>
            <textarea className="statusInput" name="status" defaultValue={testInput}></textarea>
            <input className="statusSubmit" type="submit" value="Find" />
          </form>
          <div className="cardContainer">
            {playerInfos?.map((player, index) => {
              return (
                <div className="card">
                  <p>
                    steam name:{" "}
                    <a href={`https://steamcommunity.com/profiles/${player.steamId64}`}>
                      {player.steamName}
                    </a>
                  </p>
                  <p>
                    faceit name:{" "}
                    {player.faceitName ? (
                      <a href={`https://www.faceit.com/en/players/${player.faceitName}`}>
                        {player.faceitName}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </p>
                  <p>
                    faceit ban:{" "}
                    {player.bans.faceit == undefined ? (
                      "N/A"
                    ) : player.bans.faceit ? (
                      <span style={{ color: "red" }}>yes</span>
                    ) : (
                      <span style={{ color: "green" }}>no</span>
                    )}
                  </p>
                  <p>
                    esportal ban:{" "}
                    {player.bans.esportal == undefined ? (
                      "N/A"
                    ) : player.bans.esportal ? (
                      <span style={{ color: "red" }}>yes</span>
                    ) : (
                      <span style={{ color: "green" }}>no</span>
                    )}
                  </p>
                  <p>
                    steam ban:{" "}
                    {player.bans.matchmaking == undefined ? (
                      "N/A"
                    ) : player.bans.matchmaking ? (
                      <span style={{ color: "red" }}>yes</span>
                    ) : (
                      <span style={{ color: "green" }}>no</span>
                    )}
                  </p>
                  <p>mm rank: {player.ranks.matchmaking ? player.ranks.matchmaking : "N/A"}</p>
                  <p>faceit rank: {player.ranks.faceit ? player.ranks.faceit : "N/A"}</p>
                  <p>faceit elo: {player.faceitElo ? player.faceitElo : "N/A"}</p>
                  <p>esportal rank: {player.ranks.esportal ? player.ranks.esportal : "N/A"}</p>
                  <p>
                    <a href={`https://csgostats.gg/player/${player.steamId64}`}>csgostats</a>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
