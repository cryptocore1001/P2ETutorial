import React, { useEffect, useState } from 'react'
import { InvitationList, Header } from '../components'
import { generateInvitations } from '../store/faker'
import { getInvitations } from "../services/blockchain"
import { useGlobalState } from '../store'


const Invitations = () => {
  const [invitations] = useGlobalState('invitations')

  const fetchInvitations = async () => {
    await getInvitations()
  }

  useEffect(() => {
    fetchInvitations()
  }, [])

  return (
    <div>
      <Header />
      {/* <InvitationList invitations={invitations} /> */}
    </div>
  );
}

export default Invitations
