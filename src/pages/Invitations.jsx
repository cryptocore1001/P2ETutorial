import React from 'react'
import { InvitationList, Header } from '../components'
<<<<<<< HEAD
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
=======
import { useGlobalState } from '../store'

const Invitations = () => {
  const [invitations] = useGlobalState('invitations')
>>>>>>> 2806dc2bd0bd541e183c02a0bcf10305f9ee020f

  return (
    <div>
      <Header />
      <InvitationList invitations={invitations} />
    </div>
  );
}

export default Invitations
