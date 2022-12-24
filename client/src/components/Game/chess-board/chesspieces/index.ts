import { ReactComponent as BLACK_PAWN } from "../../../../assets/chesspieces/black_pawn.svg";
import { ReactComponent as WHITE_PAWN } from "../../../../assets/chesspieces/white_pawn.svg";
import { ReactComponent as BLACK_ROOK } from "../../../../assets/chesspieces/black_rook.svg";
import { ReactComponent as WHITE_ROOK } from "../../../../assets/chesspieces/white_rook.svg";
import { ReactComponent as WHITE_QUEEN } from "../../../../assets/chesspieces/white_queen.svg";
import { ReactComponent as BLACK_QUEEN } from "../../../../assets/chesspieces/black_queen.svg";
import { ReactComponent as WHITE_KNIGHT } from "../../../../assets/chesspieces/white_knight.svg";
import { ReactComponent as BLACK_KNIGHT } from "../../../../assets/chesspieces/black_knight.svg";
import { ReactComponent as BLACK_BISHOP } from "../../../../assets/chesspieces/black_bishop.svg";
import { ReactComponent as WHITE_BISHOP } from "../../../../assets/chesspieces/white_bishop.svg";
import { ReactComponent as WHITE_KING } from "../../../../assets/chesspieces/white_king.svg";
import { ReactComponent as BLACK_KING } from "../../../../assets/chesspieces/black_king.svg";
import { Colors, ChessPieces } from "chess-easy";

const all_pieces = {
  [`${Colors.BLACK}_${ChessPieces.PAWN}`]: BLACK_PAWN,
  [`${Colors.WHITE}_${ChessPieces.PAWN}`]: WHITE_PAWN,
  [`${Colors.BLACK}_${ChessPieces.ROOK}`]: BLACK_ROOK,
  [`${Colors.WHITE}_${ChessPieces.ROOK}`]: WHITE_ROOK,
  [`${Colors.WHITE}_${ChessPieces.QUEEN}`]: WHITE_QUEEN,
  [`${Colors.BLACK}_${ChessPieces.QUEEN}`]: BLACK_QUEEN,
  [`${Colors.WHITE}_${ChessPieces.KNIGHT}`]: WHITE_KNIGHT,
  [`${Colors.BLACK}_${ChessPieces.KNIGHT}`]: BLACK_KNIGHT,
  [`${Colors.BLACK}_${ChessPieces.BISHOP}`]: BLACK_BISHOP,
  [`${Colors.WHITE}_${ChessPieces.BISHOP}`]: WHITE_BISHOP,
  [`${Colors.WHITE}_${ChessPieces.KING}`]: WHITE_KING,
  [`${Colors.BLACK}_${ChessPieces.KING}`]: BLACK_KING,
};

export default all_pieces;
