import { CurrentUserRankingData, RankingUser } from "./RankingContainer";
import {
  Avatar,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { Box, TableContainer } from "@mui/material";
import "./Ranking.scss";

interface RankingProps {
  topUsers: RankingUser[];
  currentUser: CurrentUserRankingData;
  isLoading: boolean;
}

const FALLBACK_AVATAR =
  "https://raw.githubusercontent.com/mwisniewski00/Chess/main/client/public/logo512.png";

export default function Ranking({
  topUsers,
  currentUser,
  isLoading,
}: RankingProps) {
  const getPosition = (index: number) => {
    if (index === 0) return 1;

    return topUsers[index].rating === topUsers[index - 1].rating
      ? getPosition(index - 1)
      : index + 1;
  };

  return (
    <main id="ranking_view">
      {isLoading ? (
        <CircularProgress color="secondary" />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              border: "2px solid rgb(226, 189, 161)",
              padding: "10px",
              borderRadius: "20px",
              width: "200px",
            }}
          >
            <Avatar
              alt="current_user_avatar"
              src={currentUser.avatarUrl || FALLBACK_AVATAR}
            />
            <div>
              Your position: <strong>{currentUser.position}</strong>
            </div>
          </Box>
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
            id="ranking_table"
          >
            <Table
              sx={{
                minWidth: 650,
                "& .MuiTableCell-root": { color: "rgb(207, 207, 207)" },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Position</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell align="right">Rating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topUsers.map((user, index) => (
                  <TableRow
                    key={user._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{getPosition(index)}</TableCell>
                    <TableCell>
                      <Chip
                        avatar={
                          <Avatar
                            alt={`${user.username}_avatar`}
                            src={user.avatarUrl || FALLBACK_AVATAR}
                          />
                        }
                        variant="outlined"
                        label={user.username}
                        sx={{
                          color: "inherit",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">{user.rating}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </main>
  );
}
