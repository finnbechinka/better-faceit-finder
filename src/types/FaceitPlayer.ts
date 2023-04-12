type FaceitPlayer = {
  avatar: string;
  country: string;
  cover_featured_image: string;
  cover_image: string;
  faceit_url: string;
  friends_ids: string[];
  games: {
    [key: "csgo" | string]: {
      faceit_elo: number;
      game_player_id: string;
      game_player_name: string;
      game_profile_id: string;
      region: string;
      skill_level: number;
      skill_level_label: string;
    };
  };
  membership_type: string;
  memberships: string[];
  new_steam_id: string;
  nickname: string;
  platforms: {
    [key: "steam" | string]: string;
  };
  player_id: string;
  settings: {
    language: string;
  };
  steam_id_64: string;
  steam_nickname: string;
};

export default FaceitPlayer;
