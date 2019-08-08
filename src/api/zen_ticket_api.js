export function getUser(client) {
    client.request({
        url: '/api/v2/users.json',
        httpCompleteResponse: true,
        type: 'GET'
    }).then((res) => {
        var responseJSON = {};
        if (res.status === 200 && res.responseJSON)
            responseJSON = res.responseJSON
        return responseJSON
    }, (err) => {
        console.error(err);
    })
}
export async function getGroup(client) {
    client.request({
        url: '/api/v2/groups.json',
        httpCompleteResponse: true,
        type: 'GET',
        dataType: 'json'
    }).then((res) => {
        var responseJSON = {};
        if (res.status === 200 && res.responseJSON)
            responseJSON = res.responseJSON
        return responseJSON
    }, (err) => {
        console.error(err);
    })
}

export async function createOrUpdateUser(client, data) {
    var origin = client._origin;


    client.request({
        url: '/api/v2/users/create_or_update.json',
        httpCompleteResponse: true,
        type: 'GET',

    })
}