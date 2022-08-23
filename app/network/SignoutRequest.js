import { DOMAIN_AUTH, PORT_AUTH } from '@env';

export default async function SignoutRequest(token) {
  let endpoint = 'http://' + DOMAIN_AUTH + ':' + PORT_AUTH + '/logout/';
  console.log('Entered SignoutRequest');
  try {
    let response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    if (response.status == 200) {
      return response.status;
    } else {
      console.log(response.status);
      return response.status;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
}
