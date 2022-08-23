import { DOMAIN_AUTH, PORT_AUTH } from '@env';

export default async function RefreshToken(refreshToken) {
  let endpoint = 'http://' + DOMAIN_AUTH + ':' + PORT_AUTH + '/token/';

  console.log('Entered RefreshToken');
  console.log(refreshToken);
  let body = JSON.stringify({
    token: refreshToken,
  });
  console.log(body);
  try {
    let response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
    });
    if (response.status == 200) {
      let json = await response.json();
      console.log(json);
      return json;
    } else {
      console.log(response.status);
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
}
