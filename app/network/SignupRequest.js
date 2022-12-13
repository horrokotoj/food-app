import { DOMAIN_AUTH, PORT_AUTH } from '@env';

export default async function LoginRequest(username, email, password) {
	let endpoint = DOMAIN_AUTH + '/user/';
	console.log('Entered SignupRequest');
	console.log(endpoint);
	let body = JSON.stringify({
		username: username,
		email: email,
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
