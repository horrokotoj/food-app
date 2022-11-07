import { DOMAIN_SERVER, PORT_SERVER } from '@env';

export default async function DeleteRecipeIngredient(token, patchObj) {
	let endpoint =
		'http://' + DOMAIN_SERVER + ':' + PORT_SERVER + '/recipeingredient/';
	let body = JSON.stringify(patchObj);

	console.log('Entered DeleteRecipeIngredient');
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
			console.log(response.status);
			return true;
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