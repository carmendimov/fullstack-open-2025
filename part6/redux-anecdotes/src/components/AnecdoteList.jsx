import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { displayNotification } from '../reducers/notificationReducer'

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
    dispatch(voteAnecdote(id))
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
