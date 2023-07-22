function RestartButton({ dispatch, answer }) {
    if (answer === null) {
        return (
            <div>
                <button className="btn btn-ui" onClick={() => dispatch({ type: 'reset' })}>
                    Restart
                </button>
            </div>
        )
    }
}

export default RestartButton
