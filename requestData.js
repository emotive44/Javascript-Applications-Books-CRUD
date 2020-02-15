const username = 'marko1';
const password = 'marko';
const appKey = 'kid_r1gAtu4XI';
const appSecret = 'eb8e7909d68846d2af8fd8f8b73a4f68';
const baseUrl = 'https://baas.kinvey.com';
function makeHeaders(httpMethod, data) {
    const headers = {
        method: httpMethod,
        headers: {
            'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
            'Content-Type': 'application/json',
        }
    };
    if (httpMethod === 'POST' || httpMethod === 'PUT') {
        headers.body = JSON.stringify(data);
    }
    return headers;
}
function createPromise(kinveyModule, endPoint, headers) {
    const url = `${baseUrl}/${kinveyModule}/${appKey}/${endPoint}`;
    return fetch(url, headers)
        .then(x => x.json());
}
function get(kinveyModule, endPoint) {
    const headers = makeHeaders('GET');
    return createPromise(kinveyModule, endPoint, headers);
}
function post(kinveyModule, endPoint, data) {
    const headers = makeHeaders('POST', data);
    return createPromise(kinveyModule, endPoint, headers);
}
function put(kinveyModule, endPoint, data) {
    const headers = makeHeaders('PUT', data);
    return createPromise(kinveyModule, endPoint, headers);
}
function deleted(kinveyModule, endPoint) {
    const headers = makeHeaders('DELETE');
    return createPromise(kinveyModule, endPoint, headers);
}

export { get, post, put, deleted }
