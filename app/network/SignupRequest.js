export default async function LoginRequest(username, password) {
  let endpoint = 'http://localhost:4000/user/';
  console.log('Entered SignupRequest');
  let body = JSON.stringify({
    username: username,
    password: password,
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
    return response.status;
  } catch (e) {
    console.log(e);
    return false;
  }
}
