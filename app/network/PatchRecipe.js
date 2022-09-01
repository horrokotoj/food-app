import { DOMAIN_SERVER, PORT_SERVER } from '@env';

export default async function PatchRecipe(token, patchObj) {
  let endpoint = 'http://' + DOMAIN_SERVER + ':' + PORT_SERVER + '/recipe/';
  let body = JSON.stringify(patchObj);

  console.log('Entered PatchRecipe');
  try {
    let response = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (response.status === 200) {
      console.log(response.status);
      return true;
    } else if (response.status === 400) {
      console.log(response.status);
      return false;
    } else {
      console.log(response);
      return false;
    }
  } catch (err) {
    console.log(err);
  }
}
