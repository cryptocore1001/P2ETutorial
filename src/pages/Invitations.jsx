import React from 'react'
import { InvitationList, Header } from '../components'
import { useGlobalState } from '../store'

const Invitations = () => {
  const [invitations] = useGlobalState('invitations')

  return (
    <div>
      <Header />
      <InvitationList invitations={invitations} />
    </div>
  )
}

export default Invitations
