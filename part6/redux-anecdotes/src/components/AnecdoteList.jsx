import { useDispatch, useSelector } from 'react-redux'
import { displayNotification } from '../reducers/notificationReducer'
import { voteAnecdoteById } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    return [...anecdotes]
      .filter((anecdote) =>
        anecdote.content.toLowerCase().includes(filter.toLowerCase()),
      )
      .sort((a, b) => b.votes - a.votes)
  })

  const vote = (id) => {
    // console.log('vote', id)
    dispatch(voteAnecdoteById(id))
    // send notification of vote here
    dispatch(
      displayNotification(
        `You voted '${anecdotes.find((a) => a.id === id).content}'`,
      ),
    )
  }

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
