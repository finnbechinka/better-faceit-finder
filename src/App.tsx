import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import API from "./util/API";
import Misc from "./util/Misc";

function App() {
  const testInput =
    '# userid name uniqueid connected ping loss state rate\n# 470 2 "FBIRTX" STEAM_1:0:717341234 11:04 52 0 active 196608\n# 484 3 "Didn\'t" STEAM_1:0:126396930 01:03 114 0 active 196608\n# 496 4 "olv" STEAM_1:1:5157474 00:22 48 0 active 786432\n# 497 5 "FabMaster" STEAM_1:0:21865402 00:17 70 78 active 128000\n# 506 6 "Sandman" STEAM_1:1:544579748 00:11 115 78 active 196608\n# 480 7 "Jerry" STEAM_1:0:158348903 05:09 62 0 active 128000\n# 444 8 "2+1" STEAM_1:1:95582685 12:50 48 0 active 786432\n# 270 9 "eVAN" STEAM_1:1:565628199  1:35:10 46 0 spawning 196608\n# 479 11 "손채영" STEAM_1:1:98330655 09:03 49 0 active 196608\n#end';

  async function lookup(e: React.SyntheticEvent): Promise<void> {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      status: { value: string };
    };
    let ids = await Misc.parseStatus(target.status.value);
    console.log(await Misc.getPlayerInfos(ids));
  }

  return (
    <div className="App">
      <div>
        <form onSubmit={lookup}>
          <textarea
            style={{ height: "200px", width: "600px" }}
            name="status"
            defaultValue={testInput}
          ></textarea>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
}

export default App;
