export default async function SignoutRequest(token) {
  let endpoint = 'http://localhost:3000/recipes/';
  console.log('Entered GetRecipes');
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
