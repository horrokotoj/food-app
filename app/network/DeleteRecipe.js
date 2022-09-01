import { DOMAIN_SERVER, PORT_SERVER } from '@env';

export default async function DeleteRecipe(token, patchObj) {
  console.log(DOMAIN_SERVER);
  console.log(PORT_SERVER);
  let endpoint = 'http://' + DOMAIN_SERVER + ':' + PORT_SERVER + '/recipe/';
  let body = JSON.stringify(patchObj);

  console.log('DeleteRecipe PatchRecipe');
  try {
    let response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: body,
    });
    if (response.status === 200) {
      return true;
    } else if (response.status === 400) {
      return false;
    } else {
      console.log(response);
      return false;
    }
  } catch (err) {
    console.log(err);
  }
}
