import { CometChat } from '@cometchat-pro/chat'
import { setGlobalState } from '../store'

const COMETCHAT_CONSTANTS = {
  APP_ID: process.env.REACT_APP_COMET_CHAT_APP_ID,
  REGION: process.env.REACT_APP_COMET_CHAT_REGION,
  AUTH_KEY: process.env.REACT_APP_COMET_CHAT_AUTH_KEY,
}

const initCometChat = async () => {
  const appID = COMETCHAT_CONSTANTS.APP_ID
  const region = COMETCHAT_CONSTANTS.REGION

  const appSetting = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(region)
    .build()

  await CometChat.init(appID, appSetting)
    .then(() => console.log('Initialization completed successfully'))
    .catch((error) => console.log(error))
}

const loginWithCometChat = async (UID) => {
  const authKey = COMETCHAT_CONSTANTS.AUTH_KEY

  return new Promise(async (resolve, reject) => {
    await CometChat.login(UID, authKey)
      .then((user) => resolve(user))
      .catch((error) => reject(error))
  })
}

const signUpWithCometChat = async (UID) => {
  const authKey = COMETCHAT_CONSTANTS.AUTH_KEY
  const user = new CometChat.User(UID)

  user.setName(UID)
  return new Promise(async (resolve, reject) => {
    await CometChat.createUser(user, authKey)
      .then((user) => resolve(user))
      .catch((error) => reject(error))
  })
}

const logOutWithCometChat = async () => {
  return new Promise(async (resolve, reject) => {
    await CometChat.logout()
      .then(() => {
        setGlobalState('currentUser', null)
        resolve()
      })
      .catch(() => reject())
  })
}

const checkAuthState = async () => {
  return new Promise(async (resolve, reject) => {
    await CometChat.getLoggedinUser()
      .then((user) => {
        setGlobalState('currentUser', user)
        resolve(user)
      })
      .catch((error) => reject(error))
  })
}

const getMessages = async (UID) => {
  const limit = 30
  const messagesRequest = new CometChat.MessagesRequestBuilder()
    .setUID(UID)
    .setLimit(limit)
    .build()

  return new Promise(async (resolve, reject) => {
    await messagesRequest
      .fetchPrevious()
      .then((messages) => resolve(messages.filter((msg) => msg.type == 'text')))
      .catch((error) => reject(error))
  })
}

const getConversations = async () => {
  const limit = 30
  const conversationsRequest = new CometChat.ConversationsRequestBuilder()
    .setLimit(limit)
    .build()

  return new Promise(async (resolve, reject) => {
    await conversationsRequest
      .fetchNext()
      .then((conversations) => resolve(conversations))
      .catch((error) => reject(error))
  })
}

const sendMessage = async (receiverID, messageText) => {
  const receiverType = CometChat.RECEIVER_TYPE.USER
  const textMessage = new CometChat.TextMessage(
    receiverID,
    messageText,
    receiverType
  )
  return new Promise(async (resolve, reject) => {
    await CometChat.sendMessage(textMessage)
      .then((message) => resolve(message))
      .catch((error) => reject(error))
  })
}

const listenForMessage = async (listenerID) => {
  return new Promise(async (resolve, reject) => {
    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTextMessageReceived: (message) => resolve(message),
      })
    )
  })
}

export {
  initCometChat,
  loginWithCometChat,
  signUpWithCometChat,
  logOutWithCometChat,
  getMessages,
  sendMessage,
  checkAuthState,
  listenForMessage,
  getConversations,
}