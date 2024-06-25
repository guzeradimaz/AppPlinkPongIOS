import UserAgent from 'react-native-user-agent';

export const user_agent_get = async () => {
  try {
    const data = UserAgent.getWebViewUserAgent();
    return data;
  } catch (e) {
    return null;
  }
};
