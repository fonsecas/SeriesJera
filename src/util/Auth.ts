import { Facebook } from 'expo';

export default class AuthService {
  /**
   * Login with Facebook and Firebase
   *
   * Uses Expo Facebook API and authenticates the Facebook user in Firebase
   */
  public static async loginWithFacebook() {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(
      '2662826547095358',
      { permissions: ['public_profile'] },
    );

    if (type === 'success' && token) {
      console.log('acessou')
    }
  }

  
}