import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useCallback, useEffect, useState } from "react";
import Ranking from "./Ranking";

export interface RankingUser {
  _id: string;
  username: string;
  rating: number;
  avatarUrl?: string;
}

interface RankingServerResponse {
  data: {
    users: RankingUser[];
    currentUser: CurrentUserRankingData;
  };
}

export interface CurrentUserRankingData {
  avatarUrl?: string;
  position: number;
  username: string;
}

export default function RankingContainer() {
  const axios = useAxiosPrivate();
  const [topUsers, setTopUsers] = useState<RankingUser[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUserRankingData>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    const rankingResult = (await axios.get(
      "/users/ranking",
    )) as RankingServerResponse;
    setTopUsers(rankingResult.data.users);
    setCurrentUser(rankingResult.data.currentUser);
    setIsLoading(false);
  }, [axios]);

  useEffect(() => void fetchUsers(), [axios, fetchUsers]);

  return (
    <Ranking
      topUsers={topUsers}
      currentUser={currentUser as CurrentUserRankingData}
      isLoading={isLoading}
    />
  );
}
