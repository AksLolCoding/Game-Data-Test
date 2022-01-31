export async function post(path, data){
	//get the data from the api
	let resp = await fetch(path, {
		method: "POST",
		credentials: "include",
		body: data,
	});
	if (!resp.ok) return false;
	resp = await resp.json();
	return resp;
}

export async function get(path, data){
	//get the data from the api
	let resp = await fetch(path, {
		method: "GET",
		credentials: "include",
		body: data,
	});
	if (!resp.ok) return false;
	resp = await resp.json();
	return resp;
}