import { DOMAIN_SERVER, PORT_SERVER } from '@env';

export default async function request(token, patchObj, endpoint, type) {
	let url =
		'http://' + DOMAIN_SERVER + ':' + PORT_SERVER + '/' + endpoint + '/';

	let data = {
		method: type,
		headers: {
			Authorization: 'Bearer ' + token,
			'Content-Type': 'application/json',
		},
	};

	if (patchObj) {
		let body = JSON.stringify(patchObj);
		data = { ...data, body: body };
	}

	console.log('Entered Request');
	console.log(endpoint + ' ' + type);
	console.log(patchObj);
	try {
		let response = await fetch(url, data);

		if (response.status === 200) {
			console.log('Status 200');
			let json = await response.json();
			//console.log(json);
			return json;
		} else if (response.status === 400) {
			console.log(response.status);
			return false;
		} else if (response.status === 403) {
			console.log(response.status);
			return 403;
		} else if (response.status === 500) {
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
