class FenValidator {
  private static validateGameRow = (row: string) => {
    const hasMultiDigitNumbers = /\d{2}/.test(row);
    const symbols = row.split("");
    const areAllSymbolsValid = symbols.every(symbol =>
      /[pkqbnrPKQBNR]|[1-8]/.test(symbol),
    );
    const sumOfFields = symbols.reduce((acc, curr) => {
      const parsed = parseInt(curr, 10);
      return Number.isInteger(parsed) ? acc + parsed : acc + 1;
    }, 0);

    const isSumOfFieldsCorrect = sumOfFields === 8;
    return !hasMultiDigitNumbers && areAllSymbolsValid && isSumOfFieldsCorrect;
  };

  private static validateGameState = (gameState: string) => {
    const rows = gameState.split("/");
    if (rows.length !== 8) return false;
    return rows.every(FenValidator.validateGameRow);
  };

  private static validateMovesNext = (movesNext: string) => {
    return /^(w|b)$/.test(movesNext);
  };

  private static validateCastlingAvaliability = (
    castlingAvailability: string,
  ) => {
    return /^(q|KQ?k?q?|kq?|Qk?q?)$|^-$/.test(castlingAvailability);
  };

  private static validateEnPassantPossibility = (
    enPassantPossibility: string,
  ) => {
    return /^([a-h][36])$|^-$/.test(enPassantPossibility);
  };

  private static validateHalfMoveClock = (halfMoveClock: string) => {
    return /^([0-9]|[1-9][0-9])$/.test(halfMoveClock);
  };

  private static validateFullMoveCounter = (fullMoveCounter: string) => {
    return /^([1-9][0-9]?)$/.test(fullMoveCounter);
  };

  public static validateFen(fen: string) {
    const fenArray = fen.split(" ");
    if (fenArray.length !== 6) return false;
    const [
      gameState,
      movesNext,
      castlingAvailability,
      enPassantPossibility,
      halfMoveClock,
      fullMoveCounter,
    ] = fenArray;

    return (
      this.validateGameState(gameState) &&
      this.validateMovesNext(movesNext) &&
      this.validateCastlingAvaliability(castlingAvailability) &&
      this.validateEnPassantPossibility(enPassantPossibility) &&
      this.validateHalfMoveClock(halfMoveClock) &&
      this.validateFullMoveCounter(fullMoveCounter)
    );
  }
}

export default FenValidator;
