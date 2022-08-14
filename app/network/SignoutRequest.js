export default async function SignoutRequest(token) {
  let endpoint = 'http://localhost:4000/logout/';
  console.log('Entered SignoutRequest');
  try {
    let response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: 'Token ' + token,
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
