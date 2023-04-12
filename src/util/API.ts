import FaceitSearch from "../types/FaceitSearch";
import FaceitPlayer from "../types/FaceitPlayer";

type LeetifyData = {
  ranks: { faceit?: number; matchmaking: number; esportal?: number };
  platformBans: ("matchmaking" | "esportal" | "faceit")[];
  faceitNickname?: string;
  esportalNickname?: string;
  steamAvatarUrl?: string;
};

type FaceitData = {
  faceitNickname: string;
  faceitLvl: number;
  faceitElo: number;
  avatar: string;
  banner: string;
  banned: boolean;
};

async function getLeetifyData(steam64: bigint): Promise<LeetifyData | null> {
  const leetify_access_token = import.meta.env.VITE_LEETIFY_API_KEY;
  const lvid = import.meta.env.VITE_LEETIFY_LVID;

  const leetify_post_options = {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      Authorization: `Bearer ${leetify_access_token}`,
      lvid: lvid,
      "Content-Type": "application/json",
    },
    body: "",
  };
  const leetify_get_options = {
    method: "GET",
    headers: {
      Accept: "application/json, text/plain, */*",
      Authorization: `Bearer ${leetify_access_token}`,
      lvid: lvid,
    },
  };

  try {
    let steam_64_id = steam64;
    let leetify_user_id;
    let data;

    if (steam_64_id) {
      const res_alternative = await fetch(
        `https://api.leetify.com/api/mini-profiles/${steam_64_id}`,
        leetify_get_options
      );

      if (res_alternative.ok) {
        const res_alternative_body = await res_alternative.json();
        data = res_alternative_body;
        let leetify_rating = (res_alternative_body.ratings.leetify * 100).toFixed(2);
      }

      // let options = leetify_post_options;
      // options.body = `{"query":"${steam_64_id}"}`;

      // const res_search = await fetch(
      //   "https://api.leetify.com/api/search/users",
      //   leetify_post_options
      // );

      // if (res_search.ok) {
      //   const res_search_body = await res_search.json();
      //   if (res_search_body.length > 0) {
      //     leetify_user_id = res_search_body[0].userId;
      //   }
      // }

      // if (leetify_user_id) {
      //   const res_general_data = await fetch(
      //     `https://api.leetify.com/api/general-data?side=null&roundEconomyType=null&spectatingId=${leetify_user_id}`,
      //     leetify_get_options
      //   );
      //   let leetify_rating;
      //   let hltv_rating;
      //   if (res_general_data.ok) {
      //     const res_general_data_body = await res_general_data.json();
      //     leetify_rating = (
      //       res_general_data_body.generalData.current.gamesTotals.leetifyRating * 100
      //     ).toFixed(2);
      //     hltv_rating = res_general_data_body.generalData.current.gamesTotals.hltvRating;
      //     data = res_general_data_body;
      //   }
      // } else {
      //   const res_alternative = await fetch(
      //     `https://api.leetify.com/api/mini-profiles/${steam_64_id}`,
      //     leetify_get_options
      //   );

      //   if (res_alternative.ok) {
      //     const res_alternative_body = await res_alternative.json();
      //     data = res_alternative_body;
      //     let leetify_rating = (res_alternative_body.ratings.leetify * 100).toFixed(2);
      //   }
      // }
    }
    return data ? data : null;
  } catch (error) {
    console.error(`ERROR : ${error}`);
  }
  return null;
}

async function getFaceitData(steam64: bigint): Promise<FaceitData | null> {
  const faceit_api_key = import.meta.env.VITE_FACEIT_API_KEY;
  const res = await fetch(
    `https://open.faceit.com/data/v4/players?game=csgo&game_player_id=${steam64}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${faceit_api_key}`,
      },
      method: "GET",
    }
  );
  if (res.ok) {
    const body: FaceitPlayer = await res.json();
    const searchRes = await fetch(
      `https://open.faceit.com/data/v4/search/players?nickname=${body.nickname}&game=csgo&offset=0&limit=1`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${faceit_api_key}`,
        },
        method: "GET",
      }
    );

    if (searchRes.ok) {
      const searchBody: FaceitSearch = await searchRes.json();
      if (searchBody.items[0]) {
        if (body.player_id == searchBody.items[0].player_id) {
          return {
            faceitNickname: body.nickname,
            faceitLvl: body.games.csgo.skill_level,
            faceitElo: body.games.csgo.faceit_elo,
            avatar: body.avatar,
            banner: body.cover_image,
            banned: searchBody.items[0].status == "banned",
          };
        }
      }
    }
  }
  return null;
}

export default { getLeetifyData, getFaceitData };
