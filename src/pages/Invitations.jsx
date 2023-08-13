import { useEffect } from 'react'
import { getInvitations } from "../services/blockchain"
import { useGlobalState } from '../store'
import { InvitationList, Header } from '../components'
  
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
      <InvitationList invitations={invitations} />
    </div>
  );
}

export default Invitations
