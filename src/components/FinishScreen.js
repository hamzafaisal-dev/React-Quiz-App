import RestartButton from "./RestartButton";

function FinishScreen({ dispatch, answer, points, maxPoints, highScore }) {

    const percentage = (points / maxPoints) * 100;

    return (
        <>
            <p className="result">
                You scored <strong>{points}</strong> out of {maxPoints} {Math.ceil(percentage)}%
            </p>
            <p className="highscore">Highscore: {highScore} points</p>
            <RestartButton dispatch={dispatch} answer={answer} />
        </>
    )
}

export default FinishScreen
