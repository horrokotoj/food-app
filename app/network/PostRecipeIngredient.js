import { DOMAIN_SERVER, PORT_SERVER } from '@env';

export default async function PostRecipeIngredient(token, patchObj) {
	let endpoint =
		'http://' + DOMAIN_SERVER + ':' + PORT_SERVER + '/recipeingredient/';
	let body = JSON.stringify(patchObj);

	console.log('Entered PostRecipeIngredient');
	try {
		let response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
			},
			body: body,
		});

		if (response.status === 200) {
			console.log(response.status);
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
