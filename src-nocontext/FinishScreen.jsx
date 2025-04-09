function FinishScreen({ points, MaxPoints, highscore, dispatch }) {
  const percent = (points / MaxPoints) * 100;
  return (
    <>
      <p className="result">
        You scored <strong>{points}</strong> out of {MaxPoints} (
        {Math.ceil(percent)}%)
      </p>
      <p className="highscore">Highscore: {highscore} Points</p>
      <button className="btn btn" onClick={() => dispatch({ type: "restart" })}>
        Restart Quiz
      </button>
    </>
  );
}

export default FinishScreen;
