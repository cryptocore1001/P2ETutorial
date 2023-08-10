import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import InvitationsList from '../components/InvitationList'
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
      <InvitationsList invitations={invitations} />
    </div>
  )
}

export default Invitations
