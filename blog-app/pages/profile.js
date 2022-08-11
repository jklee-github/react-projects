import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify'
import { useState, useEffect } from 'react'

function Profile() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const user = await Auth.currentAuthenticatedUser()
    setUser(user)
  }
  if (!user) return null
  return (
    <div>
      <h1 className='text-3xl font-semibold tracking-wide mt-6'>Profile</h1>
      <h1 className='font-mediem text-gray-500 my-2'>
        Username: {user.username}
      </h1>
      <p className='text-sm text-gray-500 mb-6'>
        email: {user.attributes.email}
      </p>
      <AmplifySignOut />
    </div>
  )
}
export default withAuthenticator(Profile)
