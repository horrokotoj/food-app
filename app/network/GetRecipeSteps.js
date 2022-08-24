import { DOMAIN_SERVER, PORT_SERVER } from '@env';

export default async function GetRecipeSteps(token, ingredientId) {
  let endpoint =
    'http://' +
    DOMAIN_SERVER +
    ':' +
    PORT_SERVER +
    '/recipesteps/' +
    ingredientId;
  console.log('Entered GetRecipeSteps');

  try {
    let response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    if (response.status == 200) {
      console.log('Status 200');
      let json = await response.json();
      console.log(json);
      return json;
    } else if (response.status === 403) {
      console.log('Status 403');
      return response.status;
    } else if (response.status === 500) {
      console.log('Status 500');
      return response.status;
    } else {
      console.log(response.status);
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
}
