type FaceitSearch = {
  items: [
    {
      avatar: string;
      country: string;
      games: {
        name: string;
        skill_level: string;
      }[];
      nickname: string;
      player_id: string;
      status: string;
      verified: boolean;
    }?
  ];
};

export default FaceitSearch;
