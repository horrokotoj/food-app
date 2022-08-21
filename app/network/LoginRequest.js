import { DOMAIN_AUTH, PORT_AUTH } from '@env';

export default async function LoginRequest(username, password) {
	let endpoint = 'http://' + DOMAIN_AUTH + ':' + PORT_AUTH + '/login/';

	console.log('Entered LoginRequest');
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
		if (response.status === 200) {
			console.log('Status 200');
			let json = await response.json();
			console.log(json);
			return json;
		} else if (response.status == 401) {
			console.log('Status 401');
			alert('Username and password does not match a valid user');
			return null;
		} else {
			console.log(response.status);
			console.log('here');
			return null;
		}
	} catch (e) {
		console.log(e);
		return null;
	}
}
