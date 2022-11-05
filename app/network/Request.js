import { DOMAIN_SERVER, PORT_SERVER } from '@env';

export default async function request(token, patchObj, endpoint, type) {
	let url =
		'http://' + DOMAIN_SERVER + ':' + PORT_SERVER + '/' + endpoint + '/';
	let body = JSON.stringify(patchObj);

	console.log('Entered Request');
	try {
		let response = await fetch(url, {
			method: type,
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
			},
			body: body,
		});

		if (response.status === 200) {
			console.log('Status 200');
			let json = await response.json();
			console.log(json);
			return json;
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
