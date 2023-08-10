import React, { useEffect, useState } from 'react'
import { InvitationList, Header } from '../components'
import { generateInvitations } from '../store/faker'

const Invitations = () => {
  const [invitations, setInvitations] = useState([])

  useEffect(() => {
    const invitationsData = generateInvitations(6)
    setInvitations(invitationsData)
  }, [])

  return (
    <div>
      <Header />
      <InvitationList invitations={invitations} />
    </div>
  )
}

export default Invitations
